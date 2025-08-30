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
      updateTask: (state, action) => {
      return state.map((task) =>
        task.id === action.payload.id ? { ...task, ...action.payload } : task
      );
    },
     toggleSubTask: (state, action) => {
      const { taskId, subTaskId } = action.payload;
      const task = state.find((t) => t.id === taskId);
      if (task) {
        task.subTasks = task.subTasks.map((sub) =>
          sub.id === subTaskId ? { ...sub, completed: !sub.completed } : sub
        );
      }
    },
  },
});

export const { addTask, deleteTask, toggleComplete,updateTask,toggleSubTask } = taskSlice.actions;
export default taskSlice.reducer;
