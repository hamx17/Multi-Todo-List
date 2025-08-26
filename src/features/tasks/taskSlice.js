import { createSlice } from "@reduxjs/toolkit";

const taskSlice = createSlice({
  name: "tasks",
  initialState: [],
  reducers: {
    addTask: (state, action) => {
      state.push({ ...action.payload, completed: false });
    },
    deleteTask: (state, action) => {
      return state.filter((task) => task.id !== action.payload);
    },
    toggleComplete: (state, action) => {
      return state.map((task) =>
        task.id === action.payload ? { ...task, completed: !task.completed } : task
      );
    },
  },
});

export const { addTask, deleteTask, toggleComplete } = taskSlice.actions;
export default taskSlice.reducer;
