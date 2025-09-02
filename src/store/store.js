import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "./features/tasks/taskSlice";
import authReducer from"./features/tasks/AuthSlice"

export const store = configureStore({
  reducer: {
    tasks: taskReducer,
     auth: authReducer,
  },
});

export default store;