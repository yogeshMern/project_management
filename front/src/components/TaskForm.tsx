// import React, { useState, useEffect } from "react";
// import { useAppDispatch } from "../hooks/TypedHooks";
// import { createTask, updateTask, type Task } from "../redux/TaskSlice";

// const STATUS_OPTIONS = [
//   { label: "To Do", value: "todo" },
//   { label: "In Progress", value: "in-progress" },
//   { label: "Done", value: "done" },
// ] as const;

// interface AddTaskFormProps {
//   projectId: string;
//   onClose: () => void;
//   initialData?: Task;
//   isEdit?: boolean;
// }

// const TaskForm: React.FC<AddTaskFormProps> = ({
//   projectId,
//   onClose,
//   initialData,
//   isEdit,
// }) => {
//   const dispatch = useAppDispatch();

//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     status: "todo" as "todo" | "in-progress" | "done",
//     dueDate: "",
//   });

//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (initialData) {
//       setFormData({
//         title: initialData.title,
//         description: initialData.description || "",
//         status: initialData.status,
//         dueDate: initialData.dueDate?.split("T")[0] || "",
//       });
//     }
//   }, [initialData]);

//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);

//     if (!formData.title.trim()) {
//       setError("Title is required");
//       return;
//     }

//     try {
//       if (isEdit && initialData) {
//         const result = await dispatch(
//           updateTask({
//             id: initialData.id,
//             title: formData.title,
//             description: formData.description,
//             status: formData.status,
//             dueDate: formData.dueDate || undefined,
//             project: initialData.project,
//           })
//         );

//         if (updateTask.fulfilled.match(result)) {
//           alert(result.payload.message || "Task updated!");
//           onClose();
//         } else {
//           setError(result.payload || "Failed to update task");
//         }
//       } else {
//         const result = await dispatch(
//           createTask({
//             title: formData.title,
//             description: formData.description,
//             status: formData.status,
//             dueDate: formData.dueDate || undefined,
//             project: projectId,
//           })
//         );

//         if (createTask.fulfilled.match(result)) {
//           alert(result.payload.message || "Task created!");
//           onClose();
//         } else {
//           setError(result.payload || "Failed to create task");
//         }
//       }
//     } catch {
//       setError("Unexpected error");
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="bg-white p-8 rounded shadow-md w-full max-w-md"
//     >
//       <h2 className="text-2xl font-semibold mb-6 text-center">
//         {isEdit ? "Edit Task" : "Add New Task"}
//       </h2>

//       {error && <div className="mb-4 text-red-600 text-center">{error}</div>}

//       {/* Title */}
//       <label htmlFor="title" className="block mb-2 font-medium text-gray-700">
//         Title
//       </label>
//       <input
//         id="title"
//         name="title"
//         type="text"
//         value={formData.title}
//         onChange={handleChange}
//         className="w-full rounded border border-gray-300 px-3 py-2 mb-4 focus:outline-indigo-600 focus:ring-1 focus:ring-indigo-600"
//         required
//       />

//       {/* Description */}
//       <label
//         htmlFor="description"
//         className="block mb-2 font-medium text-gray-700"
//       >
//         Description
//       </label>
//       <textarea
//         id="description"
//         name="description"
//         value={formData.description}
//         onChange={handleChange}
//         rows={4}
//         className="w-full rounded border border-gray-300 px-3 py-2 mb-4 focus:outline-indigo-600 focus:ring-1 focus:ring-indigo-600"
//       />

//       {/* Status */}
//       <label htmlFor="status" className="block mb-2 font-medium text-gray-700">
//         Status
//       </label>
//       <select
//         id="status"
//         name="status"
//         value={formData.status}
//         onChange={handleChange}
//         className="w-full rounded border border-gray-300 px-3 py-2 mb-4 focus:outline-indigo-600 focus:ring-1 focus:ring-indigo-600"
//         required
//       >
//         {STATUS_OPTIONS.map(({ label, value }) => (
//           <option key={value} value={value}>
//             {label}
//           </option>
//         ))}
//       </select>

//       {/* Due Date */}
//       <label htmlFor="dueDate" className="block mb-2 font-medium text-gray-700">
//         Due Date
//       </label>
//       <input
//         id="dueDate"
//         name="dueDate"
//         type="date"
//         value={formData.dueDate}
//         onChange={handleChange}
//         className="w-full rounded border border-gray-300 px-3 py-2 mb-6 focus:outline-indigo-600 focus:ring-1 focus:ring-indigo-600"
//       />

//       {/* Buttons */}
//       <div className="flex justify-between">
//         <button
//           type="button"
//           onClick={onClose}
//           className="px-4 py-2 border rounded hover:bg-gray-200"
//         >
//           Cancel
//         </button>
//         <button
//           type="submit"
//           className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
//         >
//           {isEdit ? "Update Task" : "Create Task"}
//         </button>
//       </div>
//     </form>
//   );
// };

// export default TaskForm;

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "../hooks/TypedHooks";
import { createTask, updateTask, type Task } from "../redux/TaskSlice";
import { yupResolver } from "@hookform/resolvers/yup";
import { taskSchema, type TaskFormValues } from "../validation/taskSchema";

const STATUS_OPTIONS = [
  { label: "To Do", value: "todo" },
  { label: "In Progress", value: "in-progress" },
  { label: "Done", value: "done" },
] as const;

interface AddTaskFormProps {
  projectId: string;
  onClose: () => void;
  initialData?: Task;
  isEdit?: boolean;
}

const TaskForm: React.FC<AddTaskFormProps> = ({
  projectId,
  onClose,
  initialData,
  isEdit,
}) => {
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: yupResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "todo",
      dueDate: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        description: initialData.description || "",
        status: initialData.status,
        dueDate: initialData.dueDate?.split("T")[0] || "",
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data: TaskFormValues) => {
    try {
      if (isEdit && initialData) {
        const result = await dispatch(
          updateTask({
            id: initialData.id,
            title: data.title,
            description: data.description,
            status: data.status,
            dueDate: data.dueDate || undefined,
            project: initialData.project,
          })
        );

        if (updateTask.fulfilled.match(result)) {
          alert(result.payload.message || "Task updated!");
          onClose();
        } else {
          alert(result.payload || "Failed to update task");
        }
      } else {
        const result = await dispatch(
          createTask({
            title: data.title,
            description: data.description,
            status: data.status,
            dueDate: data.dueDate || undefined,
            project: projectId,
          })
        );

        if (createTask.fulfilled.match(result)) {
          alert(result.payload.message || "Task created!");
          onClose();
        } else {
          alert(result.payload || "Failed to create task");
        }
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Unexpected error occurred.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-8 rounded shadow-md w-full max-w-md"
    >
      <h2 className="text-2xl font-semibold mb-6 text-center">
        {isEdit ? "Edit Task" : "Add New Task"}
      </h2>

      {/* Title */}
      <label htmlFor="title" className="block mb-2 font-medium text-gray-700">
        Title
      </label>
      <input
        id="title"
        {...register("title")}
        className="w-full rounded border border-gray-300 px-3 py-2 mb-1 focus:outline-indigo-600 focus:ring-1 focus:ring-indigo-600"
      />
      {errors.title && (
        <p className="text-sm text-red-500">{errors.title.message}</p>
      )}

      {/* Description */}
      <label
        htmlFor="description"
        className="block mb-2 font-medium text-gray-700 mt-4"
      >
        Description
      </label>
      <textarea
        id="description"
        {...register("description")}
        rows={4}
        className="w-full rounded border border-gray-300 px-3 py-2 mb-1 focus:outline-indigo-600 focus:ring-1 focus:ring-indigo-600"
      />
      {errors.description && (
        <p className="text-sm text-red-500">{errors.description.message}</p>
      )}

      {/* Status */}
      <label
        htmlFor="status"
        className="block mb-2 font-medium text-gray-700 mt-4"
      >
        Status
      </label>
      <select
        id="status"
        {...register("status")}
        className="w-full rounded border border-gray-300 px-3 py-2 mb-1 focus:outline-indigo-600 focus:ring-1 focus:ring-indigo-600"
      >
        {STATUS_OPTIONS.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      {errors.status && (
        <p className="text-sm text-red-500">{errors.status.message}</p>
      )}

      {/* Due Date */}
      <label
        htmlFor="dueDate"
        className="block mb-2 font-medium text-gray-700 mt-4"
      >
        Due Date
      </label>
      <input
        id="dueDate"
        type="date"
        {...register("dueDate")}
        className="w-full rounded border border-gray-300 px-3 py-2 mb-6 focus:outline-indigo-600 focus:ring-1 focus:ring-indigo-600"
      />
      {errors.dueDate && (
        <p className="text-sm text-red-500">{errors.dueDate.message}</p>
      )}

      {/* Buttons */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border rounded hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          {isEdit ? "Update Task" : "Create Task"}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
