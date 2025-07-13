import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Axios from "axios";

// Updated Project type
export interface Project {
  id: string;
  title: string;
  description: string;
  status?: "active" | "completed";
  user?: string;
}

interface ProjectState {
  projects: Project[];
  loading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  projects: [],
  loading: false,
  error: null,
};

interface UpdateProjectPayload {
  id: string;
  title?: string;
  description?: string;
  status?: "active" | "completed";
}

const API_URL = "http://localhost:8000/api/v1";

// Create Project
export const createProject = createAsyncThunk<
  { message: string; project: Project },
  { title: string; description: string; status: Project["status"] },
  { rejectValue: string }
>("projects/createProject", async (projectData, { rejectWithValue }) => {
  try {
    const token = sessionStorage.getItem("token");

    const response = await Axios.post<{ message: string; project: any }>(
      `${API_URL}/project/add`,
      projectData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );

    const normalized: Project = {
      ...response.data.project,
      id: response.data.project._id,
    };
    return { message: response.data.message, project: normalized };
  } catch (error: any) {
    const message =
      error?.response?.data?.message || error.message || "Creation failed";
    return rejectWithValue(message);
  }
});

// Fetch Projects
export const fetchProjects = createAsyncThunk<
  Project[],
  string | undefined,
  { rejectValue: string }
>("projects/fetchProjects", async (search, { rejectWithValue }) => {
  try {
    const token = sessionStorage.getItem("token");

    const res = await Axios.get<{ _id: string }[]>(`${API_URL}/projects`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
      params: search ? { search } : {},
    });

    return res.data.map(({ _id, ...rest }) => ({
      ...rest,
      id: _id,
    })) as Project[];
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch projects"
    );
  }
});

// Update Project
export const updateProject = createAsyncThunk<
  { message: string; project: Project },
  UpdateProjectPayload,
  { rejectValue: string }
>("projects/updateProject", async (payload, { rejectWithValue }) => {
  try {
    const token = sessionStorage.getItem("token");

    const updateBody: Record<string, any> = {};
    if (payload.title) updateBody.title = payload.title;
    if (payload.description) updateBody.description = payload.description;
    if (payload.status) updateBody.status = payload.status;

    const res = await Axios.put<{ message: string; project: any }>(
      `${API_URL}/project/edit/${payload.id}`,
      updateBody,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );

    const normalized: Project = {
      ...res.data.project,
      id: res.data.project._id,
    };

    return { message: res.data.message, project: normalized };
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message ?? "Failed to update project"
    );
  }
});

// Delete Project
export const deleteProject = createAsyncThunk<
  { message: string; id: string },
  string,
  { rejectValue: string }
>("projects/deleteProject", async (id, { rejectWithValue }) => {
  try {
    const token = sessionStorage.getItem("token");

    const res = await Axios.delete<{ message: string }>(
      `${API_URL}/project/remove/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );

    return { message: res.data.message, id };
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message ?? "Failed to delete project"
    );
  }
});

// Slice
const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchProjects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch projects";
      })

      // createProject
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.push(action.payload.project);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to create project";
      })

      // updateProject
      .addCase(updateProject.fulfilled, (state, action) => {
        const updated = action.payload.project;
        const index = state.projects.findIndex((p) => p.id === updated.id);
        if (index !== -1) {
          state.projects[index] = updated;
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to update project";
      })

      // deleteProject
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter(
          (p) => p.id !== action.payload.id
        );
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to delete project";
      });
  },
});

export default projectSlice.reducer;
