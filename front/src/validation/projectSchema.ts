import * as yup from "yup";

export const projectSchema = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  status: yup
    .mixed<"active" | "completed">()
    .oneOf(["active", "completed"], "Invalid status")
    .required("Status is required"),
});

export type ProjectFormValues = yup.InferType<typeof projectSchema>;
