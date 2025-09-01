import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteTaskThunk,
  toggleCompleteThunk,
} from "../store/features/tasks/thunkSlice";
import TaskModal from "./TaskModal";

const TaskList = () => {
  const { tasks } = useSelector((state) => state.tasks);
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

  const deleteHandle = (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      dispatch(deleteTaskThunk(taskId));
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mt-8 mb-6 text-gray-800 text-center">
        Your Tasks
      </h2>

      {/* Filter Tabs */}
      <div className="flex justify-center gap-3 flex-wrap mb-6">
        {["ALL", "TODAY", "OVERDUE", "UPCOMING", "COMPLETED"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 shadow-sm ${
              filter === tab
                ? "bg-black text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <p className="text-gray-500 text-center">No tasks available.</p>
      ) : (
        filteredTasks.map((task) => (
          <div
            key={task.id}
            className="bg-gray-50 shadow-md rounded-xl p-5 mb-4 border border-gray-200 hover:shadow-lg transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3
                  className={`text-lg font-semibold ${
                    task.completed ? "line-through text-gray-400" : "text-black"
                  }`}
                >
                  {task.title}
                </h3>
                <p className="text-gray-600">{task.description}</p>
                <p className="text-gray-500 text-sm">Due: {task.date}</p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => dispatch(toggleCompleteThunk(task.id))}
                  className="w-5 h-5 rounded cursor-pointer accent-black"
                />

                <button
                  onClick={() => setSelectedTask(task)}
                  className="bg-black hover:bg-gray-800 text-white px-4 py-1 rounded-lg shadow-sm transition"
                >
                  View
                </button>

                <button
                  onClick={() => deleteHandle(task.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg shadow-sm transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Task Modal */}
      {selectedTask && (
        <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </div>
  );
};

export default TaskList;
