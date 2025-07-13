import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";

// Types
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  dueDate?: string;
  project: string;
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

const API_URL = "http://localhost:8000/api/v1";


export const fetchTasksByProject = createAsyncThunk<
  Task[],
  string,
  { rejectValue: string }
>("tasks/fetchByProject", async (projectId, { rejectWithValue }) => {
  try {
    // console.log("Fetching tasks for project:", projectId);
    const token = sessionStorage.getItem("token");

    const res = await axios.get<any[]>(`${API_URL}/tasks/${projectId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    // console.log("Tasks fetched:", res.data);

    return res.data.map((task) => ({
      ...task,
      id: task._id ?? task.id,
    }));
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message ?? "Failed to fetch tasks"
    );
  }
});


export const createTask = createAsyncThunk<
  { message: string; task: Task },
  Omit<Task, "id">,
  { rejectValue: string }
>("tasks/create", async (taskData, { rejectWithValue }) => {
  try {
    const token = sessionStorage.getItem("token");

    const res = await axios.post<{ message: string; task: any }>(
      `${API_URL}/task/add`,
      taskData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );

    const normalized = {
      ...res.data.task,
      id: res.data.task._id ?? res.data.task.id,
    };

    return { message: res.data.message, task: normalized };
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message ?? "Failed to create task"
    );
  }
});


export const updateTask = createAsyncThunk<
  { message: string; task: Task },
  Task,
  { rejectValue: string }
>("tasks/update", async (taskData, { rejectWithValue }) => {
  try {
    const token = sessionStorage.getItem("token");

    const res = await axios.put<{ message: string; task: any }>(
      `${API_URL}/task/edit/${taskData.id}`,
      taskData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );

    const normalized = {
      ...res.data.task,
      id: res.data.task._id ?? res.data.task.id,
    };

    return { message: res.data.message, task: normalized };
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message ?? "Failed to update task"
    );
  }
});


export const deleteTask = createAsyncThunk<
  { message: string; id: string },
  string,
  { rejectValue: string }
>("tasks/delete", async (taskId, { rejectWithValue }) => {
  try {
    const token = sessionStorage.getItem("token");

    const res = await axios.delete<{ message: string }>(
      `${API_URL}/task/remove/${taskId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );

    return { message: res.data.message, id: taskId };
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message ?? "Failed to delete task"
    );
  }
});


const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Tasks
      .addCase(fetchTasksByProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchTasksByProject.fulfilled,
        (state, action: PayloadAction<Task[]>) => {
          state.loading = false;
          state.tasks = action.payload;
        }
      )
      .addCase(fetchTasksByProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch tasks";
      })

      // Create Task
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createTask.fulfilled,
        (state, action: PayloadAction<{ message: string; task: Task }>) => {
          state.loading = false;
          state.tasks.push(action.payload.task);
        }
      )
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to create task";
      })

      // Update Task
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateTask.fulfilled,
        (state, action: PayloadAction<{ message: string; task: Task }>) => {
          state.loading = false;
          const updated = action.payload.task;
          const index = state.tasks.findIndex((t) => t.id === updated.id);
          if (index !== -1) {
            state.tasks[index] = updated;
          }
        }
      )
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to update task";
      })

      // Delete Task
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteTask.fulfilled,
        (state, action: PayloadAction<{ message: string; id: string }>) => {
          state.loading = false;
          state.tasks = state.tasks.filter(
            (task) => task.id !== action.payload.id
          );
        }
      )
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to delete task";
      });
  },
});

export default taskSlice.reducer;
