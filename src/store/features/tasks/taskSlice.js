import { createSlice } from "@reduxjs/toolkit";
import {
  addTaskThunk,
  deleteTaskThunk,
  toggleCompleteThunk,
  updateTaskThunk,
  toggleSubTaskThunk,
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
      .addCase(addTaskThunk.fulfilled, (state, action) => {
        state.tasks = action.payload;
      })
      .addCase(deleteTaskThunk.fulfilled, (state, action) => {
        state.tasks = action.payload;
      })
      .addCase(toggleCompleteThunk.fulfilled, (state, action) => {
        state.tasks = action.payload;
      })
      .addCase(updateTaskThunk.fulfilled, (state, action) => {
        state.tasks = action.payload;
      })
      .addCase(toggleSubTaskThunk.fulfilled, (state, action) => {
        state.tasks = action.payload;
      });
  },
});

export default taskSlice.reducer;
