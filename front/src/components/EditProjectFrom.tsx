// import React, { useState, useEffect } from "react";
// import { useAppDispatch } from "../hooks/TypedHooks";
// import { updateProject } from "../redux/ProjectSlice";

// const STATUS_OPTIONS = [
//   { label: "To Do", value: "todo" },
//   { label: "In Progress", value: "in-progress" },
//   { label: "Done", value: "done" },
// ] as const;

// interface EditProjectFormProps {
//   project: {
//     id: string;
//     title: string;
//     description: string;
//     status: "todo" | "in-progress" | "done";
//   };
//   onClose: () => void;
// }

// const EditProjectForm: React.FC<EditProjectFormProps> = ({
//   project,
//   onClose,
// }) => {
//   const dispatch = useAppDispatch();

//   const [formData, setFormData] = useState({
//     title: project.title,
//     description: project.description,
//     status: project.status,
//   });

//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     setFormData({
//       title: project.title,
//       description: project.description,
//       status: project.status,
//     });
//   }, [project]);

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

//     const updatePayload: any = { id: project.id };

//     if (formData.title !== project.title) updatePayload.title = formData.title;
//     if (formData.description !== project.description)
//       updatePayload.description = formData.description;
//     if (formData.status !== project.status)
//       updatePayload.status = formData.status;

//     if (Object.keys(updatePayload).length === 1) {
//       // Only contains `id`, no changes
//       setError("No changes made.");
//       return;
//     }

//     try {
//       const result = await dispatch(updateProject(updatePayload));
//       if (updateProject.fulfilled.match(result)) {
//         alert("Project updated!");
//         onClose();
//       } else {
//         setError(result.payload || "Failed to update project");
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
//       <h2 className="text-2xl font-semibold mb-6 text-center">Edit Project</h2>

//       {error && (
//         <div className="mb-4 text-red-600 font-medium text-center">{error}</div>
//       )}

//       <label className="block mb-2 font-medium text-gray-700" htmlFor="title">
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

//       <label
//         className="block mb-2 font-medium text-gray-700"
//         htmlFor="description"
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
//         required
//       />

//       <label className="block mb-2 font-medium text-gray-700" htmlFor="status">
//         Status
//       </label>
//       <select
//         id="status"
//         name="status"
//         value={formData.status}
//         onChange={handleChange}
//         className="w-full rounded border border-gray-300 px-3 py-2 mb-6 focus:outline-indigo-600 focus:ring-1 focus:ring-indigo-600"
//         required
//       >
//         {STATUS_OPTIONS.map(({ label, value }) => (
//           <option key={value} value={value}>
//             {label}
//           </option>
//         ))}
//       </select>

//       <div className="flex justify-between">
//         <button
//           type="button"
//           onClick={onClose}
//           className="px-4 py-2 border rounded hover:bg-gray-200 transition"
//         >
//           Cancel
//         </button>

//         <button
//           type="submit"
//           className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
//         >
//           Update Project
//         </button>
//       </div>
//     </form>
//   );
// };

// export default EditProjectForm;

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "../hooks/TypedHooks";
import { updateProject } from "../redux/ProjectSlice";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  projectSchema,
  type ProjectFormValues,
} from "../validation/projectSchema";

const STATUS_OPTIONS = [
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
] as const;

interface EditProjectFormProps {
  project: {
    id: string;
    title: string;
    description: string;
    status: "active" | "completed";
  };
  onClose: () => void;
}

const EditProjectForm: React.FC<EditProjectFormProps> = ({
  project,
  onClose,
}) => {
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: yupResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "active",
    },
  });

  useEffect(() => {
    reset({
      title: project.title,
      description: project.description,
      status: project.status,
    });
  }, [project, reset]);

  const onSubmit = async (data: ProjectFormValues) => {
    const updatePayload: any = { id: project.id };

    if (data.title !== project.title) updatePayload.title = data.title;
    if (data.description !== project.description)
      updatePayload.description = data.description;
    if (data.status !== project.status) updatePayload.status = data.status;

    if (Object.keys(updatePayload).length === 1) {
      alert("No changes made.");
      return;
    }

    try {
      const result = await dispatch(updateProject(updatePayload));
      if (updateProject.fulfilled.match(result)) {
        alert("Project updated!");
        onClose();
      } else {
        alert(result.payload || "Failed to update project");
      }
    } catch {
      alert("Unexpected error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-8 rounded shadow-md w-full max-w-md"
    >
      <h2 className="text-2xl font-semibold mb-6 text-center">Edit Project</h2>

      {/* Title */}
      <label htmlFor="title" className="block mb-2 font-medium text-gray-700">
        Title
      </label>
      <input
        id="title"
        {...register("title")}
        className="w-full rounded border border-gray-300 px-3 py-2 mb-1"
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
        className="w-full rounded border border-gray-300 px-3 py-2 mb-1"
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
        className="w-full rounded border border-gray-300 px-3 py-2 mb-1"
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

      {/* Buttons */}
      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border rounded hover:bg-gray-200 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          Update Project
        </button>
      </div>
    </form>
  );
};

export default EditProjectForm;
