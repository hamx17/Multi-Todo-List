import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  fetchTasksThunk,
  deleteTaskThunk,
  toggleCompleteThunk,
} from "../store/features/tasks/thunkSlice";
import { auth } from "../firebase";
import TaskModal from "./TaskModal";

const TaskList = () => {
  const dispatch = useDispatch();
  const { tasks, status } = useSelector((state) => state.tasks);
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

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        dispatch(fetchTasksThunk());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

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

  const deleteHandle = (docId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      dispatch(deleteTaskThunk(docId));
      toast.success(" Task deleted successfully!", {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4">
      <h2 className="text-2xl font-bold mt-8 mb-6 text-gray-800 text-center">
        Your Todos
      </h2>

      {/* Filter Tabs */}
      <div className="flex justify-center gap-3 flex-wrap mb-6">
        {["ALL", "TODAY", "OVERDUE", "UPCOMING", "COMPLETED"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 shadow-sm ${
              filter === tab
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-blue-500 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {status === "loading" && (
        <p className="text-center text-gray-500">Loading tasks...</p>
      )}

      {/* Task List */}
      {filteredTasks.length === 0 && status !== "loading" ? (
        <p className="text-gray-500 text-center">No tasks available.</p>
      ) : (
        filteredTasks.map((task) => (
          <div
            key={task.docId}
            className="bg-gray-50 shadow-md rounded-xl p-5 mb-4 border border-gray-200 hover:shadow-lg transition"
          >
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              {/* Text Content */}
              <div className="flex-1 min-w-0">
                <h3
                  className={`text-lg font-semibold break-words ${
                    task.completed ? "line-through text-gray-400" : "text-black"
                  }`}
                >
                  {task.title}
                </h3>
                <p className="text-gray-600 break-words">{task.description}</p>
                <p className="text-gray-500 text-sm mt-1">Due: {task.date}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-start md:items-center gap-3 mt-2 md:mt-0 flex-shrink-0">
                {/* Mark Completed */}
               <input
  type="checkbox"
  checked={task.completed}
  onChange={() => {
    dispatch(
      toggleCompleteThunk({
        taskId: task.docId,
        completed: !task.completed,
      })
    );

    if (!task.completed) {
      // Task is now completed
      toast.success(" Task marked as completed!", {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
      });
    } else {
      // Task is now not completed
      toast.error(" Task marked as not completed!", {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
      });
    }
  }}
  className="w-5 h-5 rounded cursor-pointer accent-blue-600"
/>


                {/* View Task */}
                <button
                  onClick={() => setSelectedTask(task)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-lg shadow-sm transition"
                >
                  View
                </button>

                {/* Delete Task */}
                <button
                  onClick={() => deleteHandle(task.docId)}
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
