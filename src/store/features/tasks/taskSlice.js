import { createSlice } from "@reduxjs/toolkit";
import {
  fetchTasksThunk,
  addTaskThunk,
  deleteTaskThunk,
  updateTaskThunk,
  toggleSubTaskThunk,
  toggleCompleteThunk,
} from "./thunkSlice";

const initialState = {
  tasks: [],
  status: "idle",
  error: null,
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasksThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTasksThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tasks = action.payload;
      })
      .addCase(fetchTasksThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addTaskThunk.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(deleteTaskThunk.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(
          (task) => task.docId !== action.payload
        );
      })
      .addCase(toggleCompleteThunk.fulfilled, (state, action) => {
        const { taskId, completed } = action.payload;
        const task = state.tasks.find((t) => t.docId === taskId);
        if (task) {
          task.completed = completed;
        }
      })
      .addCase(updateTaskThunk.fulfilled, (state, action) => {
        state.tasks = state.tasks.map((task) =>
          task.docId === action.payload.docId ? action.payload : task
        );
      })
      .addCase(toggleSubTaskThunk.fulfilled, (state, action) => {
        state.tasks = state.tasks.map((task) =>
          task.docId === action.payload.docId ? action.payload : task
        );
      });
  },
});

export default taskSlice.reducer;
