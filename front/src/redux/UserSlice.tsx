import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import Axios from "axios";

// Types
export interface User {
  id: number;
  name: string;
  email: string;
}

interface UserState {
  user: User | null;
  token: string;
  loading: boolean;
  error: string | null;
}

// Initial State
const initialState: UserState = {
  user: null,
  token: "",
  loading: false,
  error: null,
};

const API_URL = import.meta.env.VITE_API_URL;

// Async thunk: Login
export const login = createAsyncThunk<
  { user: User; token: string }, // Return type
  { email: string; password: string }, // Payload type
  { rejectValue: string } // Error type
>("user/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await Axios.post<{ user: User; token: string }>(
      `${API_URL}/user/login`,
      credentials,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    // console.log("Login response:", response.data);

    return response.data;
  } catch (error: any) {
    const message = error?.response?.data?.message || "Login failed";
    return rejectWithValue(message);
  }
});

// Async thunk: Register
export const register = createAsyncThunk<
  { user: User; token: string },
  { name: string; email: string; password: string },
  { rejectValue: string }
>("user/register", async (userData, { rejectWithValue }) => {
  try {
    const response = await Axios.post<{ user: User; token: string }>(
      `${API_URL}/user/register`,
      userData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    console.log("Register response:", response.data);

    return response.data;
  } catch (error: any) {
    const message = error?.response?.data?.message || "Registration failed";
    return rejectWithValue(message);
  }
});

// Slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<{ user: User; token: string }>) => {
          state.loading = false;
          state.user = action.payload.user;
          state.token = action.payload.token;
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Login failed";
      })

      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        register.fulfilled,
        (state, action: PayloadAction<{ user: User; token: string }>) => {
          state.loading = false;
          state.user = action.payload.user;
          state.token = action.payload.token;
        }
      )
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Registration failed";
      });
  },
});

export default userSlice.reducer;
