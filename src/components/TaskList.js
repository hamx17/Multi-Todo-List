import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  deleteTaskThunk,
  toggleCompleteThunk,
  fetchTasksThunk,
} from "../store/features/tasks/thunkSlice";
import TaskModal from "./TaskModal";

const TaskList = () => {
  const { tasks, status } = useSelector((state) => state.tasks);
  const dispatch = useDispatch();
  const [filter, setFilter] = useState("ALL");
  const [selectedTask, setSelectedTask] = useState(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isSameLocalDate = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  };

  const filteredTasks = tasks.filter((task) => {
    const taskDate = new Date(task.date);
    taskDate.setHours(0, 0, 0, 0);

    switch (filter) {
      case "TODAY":
        return isSameLocalDate(task.date, today) && !task.completed;
      case "OVERDUE":
        return taskDate < today && !task.completed;
      case "UPCOMING":
        return taskDate > today && !task.completed;
      case "COMPLETED":
        return task.completed;
      default:
        return true;
    }
  });

  const deletehandle = (taskId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task? This action cannot be undone."
    );
    if (confirmDelete) {
      dispatch(deleteTaskThunk(taskId));
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mt-10 mb-6 text-center">Your Tasks</h2>

      {/* Tabs */}
      <div className="flex justify-center gap-3 flex-wrap mb-8">
        {["ALL", "TODAY", "OVERDUE", "UPCOMING", "COMPLETED"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 shadow-lg ${
              filter === tab
                ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-purple-500/50"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <p className="text-gray-400 text-center">No tasks available.</p>
      ) : (
        filteredTasks.map((task) => (
          <div
            key={task.id}
            className="bg-gray-800 bg-opacity-60 shadow-lg rounded-2xl p-5 mb-5 border border-gray-700 hover:border-indigo-500"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3
                  className={`text-lg font-bold ${
                    task.completed ? "line-through text-gray-500" : "text-white"
                  }`}
                >
                  {task.title}
                </h3>
                <p className="text-gray-300">{task.description}</p>
                <p className="text-indigo-400 text-sm">Due: {task.date}</p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => dispatch(toggleCompleteThunk(task.id))}
                  className="w-5 h-5 rounded cursor-pointer accent-green-500"
                />

                <button
                  onClick={() => setSelectedTask(task)}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-4 py-1 rounded-lg shadow-md"
                >
                  View
                </button>

                <button
                  onClick={() => deletehandle(task.id)}
                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-1 rounded-lg shadow-md"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Modal */}
      {selectedTask && (
        <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </div>
  );
};

export default TaskList;
