import { createSlice } from "@reduxjs/toolkit";
import { fetchTasks } from "./thunkSlice";

const initialState = {
  tasks: [],
  taskList:[],
  status: "idle",
  error: null,
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.tasks.push({ ...action.payload, completed: false, subTasks: [] });
    },

    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },

    toggleComplete: (state, action) => {
      const task = state.tasks.find((t) => t.id === action.payload);
      if (task) {
        task.completed = !task.completed;
      }
    },

    updateTask: (state, action) => {
      const index = state.tasks.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = { ...state.tasks[index], ...action.payload };
      }
    },

    toggleSubTask: (state, action) => {
      const { taskId, subTaskId } = action.payload;
      const task = state.tasks.find((t) => t.id === taskId);
      if (task && task.subTasks) {
        task.subTasks = task.subTasks.map((sub) =>
          sub.id === subTaskId
            ? { ...sub, completed: !sub.completed }
            : sub
        );
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.taskList = action.payload;
        console.log(state.taskList)
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const {
  addTask,
  deleteTask,
  toggleComplete,
  updateTask,
  toggleSubTask,
} = taskSlice.actions;

export default taskSlice.reducer;
