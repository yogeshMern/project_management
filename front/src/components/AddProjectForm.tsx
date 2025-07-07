// import React, { useState } from "react";
// import { useAppDispatch } from "../hooks/TypedHooks";
// import { createProject } from "../redux/ProjectSlice";

// const STATUS_OPTIONS = [
//   { label: "To Do", value: "todo" },
//   { label: "In Progress", value: "in-progress" },
//   { label: "Done", value: "done" },
// ] as const;

// interface AddProjectFormProps {
//   onClose: () => void;
// }

// const AddProjectForm: React.FC<AddProjectFormProps> = ({ onClose }) => {
//   const dispatch = useAppDispatch();

//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     status: "todo" as "todo" | "in-progress" | "done",
//   });

//   const [error, setError] = useState<string | null>(null);

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

//     if (!formData.description.trim()) {
//       setError("Description is required");
//       return;
//     }

//     try {
//       const result = await dispatch(createProject(formData));

//       if (createProject.fulfilled.match(result)) {
//         alert("Project created!");
//         setFormData({
//           title: "",
//           description: "",
//           status: "todo",
//         });
//         onClose(); // Close the modal after successful submit
//       } else {
//         setError(result.payload || "Failed to create project");
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
//         Add New Project
//       </h2>

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
//           Create Project
//         </button>
//       </div>
//     </form>
//   );
// };

// export default AddProjectForm;

import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppDispatch } from "../hooks/TypedHooks";
import { createProject } from "../redux/ProjectSlice";
import { projectSchema } from "../validation/projectSchema";
import type { ProjectFormValues } from "../validation/projectSchema";

const STATUS_OPTIONS = [
  { label: "active", value: "active" },
  { label: "completed", value: "completed" },
] as const;

interface AddProjectFormProps {
  onClose: () => void;
}

const AddProjectForm: React.FC<AddProjectFormProps> = ({ onClose }) => {
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: yupResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "active",
    },
  });

  const onSubmit = async (data: ProjectFormValues) => {
    try {
      const result = await dispatch(createProject(data));

      if (createProject.fulfilled.match(result)) {
        alert("Project created!");
        reset(); // Clear the form
        onClose(); // Close modal or form
      } else {
        alert(result.payload || "Failed to create project");
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
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Add New Project
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
        <p className="text-red-600 text-sm mb-3">{errors.title.message}</p>
      )}

      {/* Description */}
      <label
        htmlFor="description"
        className="block mb-2 font-medium text-gray-700"
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
        <p className="text-red-600 text-sm mb-3">
          {errors.description.message}
        </p>
      )}

      {/* Status */}
      <label htmlFor="status" className="block mb-2 font-medium text-gray-700">
        Status
      </label>
      <select
        id="status"
        {...register("status")}
        className="w-full rounded border border-gray-300 px-3 py-2 mb-3 focus:outline-indigo-600 focus:ring-1 focus:ring-indigo-600"
      >
        {STATUS_OPTIONS.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      {errors.status && (
        <p className="text-red-600 text-sm mb-3">{errors.status.message}</p>
      )}

      {/* Buttons */}
      <div className="flex justify-between mt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border rounded hover:bg-gray-200 transition"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          Create Project
        </button>
      </div>
    </form>
  );
};

export default AddProjectForm;
