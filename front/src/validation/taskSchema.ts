import * as yup from "yup";

export const taskSchema = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string().optional(),
  status: yup
    .mixed<"todo" | "in-progress" | "done">()
    .oneOf(["todo", "in-progress", "done"])
    .required("Status is required"),
  dueDate: yup.string().optional(),
});

export type TaskFormValues = yup.InferType<typeof taskSchema>;
