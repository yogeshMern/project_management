import { configureStore } from "@reduxjs/toolkit";
import projectReducer from "./ProjectSlice";
import userReducer from "./UserSlice";
import taskReducer from "./TaskSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    projects: projectReducer,
    Tasks: taskReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
