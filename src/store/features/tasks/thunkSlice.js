import { createAsyncThunk } from "@reduxjs/toolkit";

// ✅ Add Task Thunk
export const addTaskThunk = createAsyncThunk(
  "tasks/addTask",
  async (task, { getState }) => {
    const state = getState();
    const currentTasks = state.tasks.tasks;
    return [...currentTasks, { ...task, completed: false, subTasks: [] }];
  }
);

// ✅ Delete Task Thunk
export const deleteTaskThunk = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId, { getState }) => {
    const state = getState();
    const currentTasks = state.tasks.tasks;
    return currentTasks.filter((task) => task.id !== taskId);
  }
);

// ✅ Toggle Complete Thunk
export const toggleCompleteThunk = createAsyncThunk(
  "tasks/toggleComplete",
  async (taskId, { getState }) => {
    const state = getState();
    const currentTasks = state.tasks.tasks;

    return currentTasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
  }
);

// ✅ Update Task Thunk
export const updateTaskThunk = createAsyncThunk(
  "tasks/updateTask",
  async (updatedTask, { getState }) => {
    const state = getState();
    const currentTasks = state.tasks.tasks;

    return currentTasks.map((task) =>
      task.id === updatedTask.id ? { ...task, ...updatedTask } : task
    );
  }
);

export const toggleSubTaskThunk = createAsyncThunk(
  "tasks/toggleSubTask",
  async ({ taskId, subTaskId }, { getState }) => {
    const state = getState();
    const currentTasks = state.tasks.tasks;

    return currentTasks.map((task) => {
      if (task.id === taskId) {
        return {
          ...task,
          subTasks: task.subTasks.map((sub) =>
            sub.id === subTaskId
              ? { ...sub, completed: !sub.completed }
              : sub
          ),
        };
      }
      return task;
    });
  }
);
