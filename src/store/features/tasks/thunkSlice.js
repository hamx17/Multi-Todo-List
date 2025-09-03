import { createAsyncThunk } from "@reduxjs/toolkit";
import { db, auth } from "../../../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

// Fetch Tasks
export const fetchTasksThunk = createAsyncThunk("tasks/fetchTasks", async () => {
  const user = auth.currentUser;
  if (!user) return [];
  const tasksRef = collection(db, "tasks");
  const snapshot = await getDocs(tasksRef);
  const tasks = snapshot.docs
    .map((docSnap) => ({ docId: docSnap.id, ...docSnap.data() }))
    .filter((task) => task.userId === user.uid);
  return tasks;
});

// Add Task
export const addTaskThunk = createAsyncThunk("tasks/addTask", async (task) => {
  const docRef = await addDoc(collection(db, "tasks"), task);
  return { ...task, docId: docRef.id };
});

// Delete Task
export const deleteTaskThunk = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId, { rejectWithValue }) => {
    try {
      const ref = doc(db, "tasks", taskId);
      await deleteDoc(ref);
      return taskId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Toggle Complete
export const toggleCompleteThunk = createAsyncThunk(
  "tasks/toggleComplete",
  async ({ taskId, completed }, { rejectWithValue }) => {
    try {
      const taskRef = doc(db, "tasks", taskId);
      await updateDoc(taskRef, { completed });
      return { taskId, completed };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update Task
export const updateTaskThunk = createAsyncThunk(
  "tasks/updateTask",
  async (updatedTask, { getState }) => {
    const state = getState();
    const existingTask = state.tasks.tasks.find(
      (t) => t.docId === updatedTask.docId
    );

    if (!existingTask) return;

    const docRef = doc(db, "tasks", updatedTask.docId);

    // ✅ Update main task fields AND subtasks
    await updateDoc(docRef, {
      title: updatedTask.title,
      description: updatedTask.description,
      date: updatedTask.date,
      subTasks: updatedTask.subTasks,
    });

    // ✅ Return updated task including subtasks
    return {
      ...existingTask,
      title: updatedTask.title,
      description: updatedTask.description,
      date: updatedTask.date,
      subTasks: updatedTask.subTasks,
    };
  }
);

// Toggle Subtask
export const toggleSubTaskThunk = createAsyncThunk(
  "tasks/toggleSubTask",
  async ({ taskId, subTaskId }, { getState }) => {
    const state = getState();
    const task = state.tasks.tasks.find((t) => t.docId === taskId);

    if (!task) return;

    const updatedSubTasks = task.subTasks.map((sub) =>
      sub.id === subTaskId ? { ...sub, completed: !sub.completed } : sub
    );

    const updatedTask = { ...task, subTasks: updatedSubTasks };

    const docRef = doc(db, "tasks", taskId);
    await updateDoc(docRef, { subTasks: updatedSubTasks });

    return updatedTask;
  }
);
