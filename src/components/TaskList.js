import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteTask, toggleComplete } from "../Store/features/tasks/taskSlice";
import TaskModal from "./TaskModal"; // New Component

const TaskList = () => {
  const tasks = useSelector((state) => state.tasks);
  const dispatch = useDispatch();
  const [filter, setFilter] = useState("TODAY");
  const [selectedTask, setSelectedTask] = useState(null); // To store clicked task

  const today = new Date().toISOString().split("T")[0];

  const filteredTasks = tasks.filter((task) => {
    if (filter === "TODAY") return task.date === today && !task.completed;
    if (filter === "PENDING") return !task.completed;
    if (filter === "COMPLETED") return task.completed;
    return true;
  });

  return (
    <div>
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mt-10 mb-6 text-center"> Your Tasks</h2>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          {["TODAY", "PENDING", "COMPLETED"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 shadow-lg ${
                filter === tab
                  ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-purple-500/50"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {tab === "TODAY" && "Today"}
              {tab === "PENDING" && "Pending"}
              {tab === "COMPLETED" && "Completed"}
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
              className="bg-gray-800 bg-opacity-60 shadow-lg rounded-2xl p-5 mb-5 border border-gray-700 hover:border-indigo-500 "
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
                  {/* Complete Checkbox */}
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => dispatch(toggleComplete(task.id))}
                    className="w-5 h-5 rounded cursor-pointer accent-green-500"
                  />

                  {/* View Button */}
                  <button
                    onClick={() => setSelectedTask(task)}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-4 py-1 rounded-lg shadow-md"
                  >
                    View
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => dispatch(deleteTask(task.id))}
                    className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-1 rounded-lg shadow-md"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {task.subTasks.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-indigo-400 font-semibold mb-2">
                    Subtasks:
                  </h4>
                  <ul className="list-disc pl-6 space-y-1">
                    {task.subTasks.map((sub, i) => (
                      <li key={i}>
                        <p
                          className={`font-semibold ${
                            task.completed
                              ? "line-through text-gray-500"
                              : "text-white"
                          }`}
                        >
                          {sub.title}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {sub.description}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))
        )}

        {/* Modal */}
        {selectedTask && (
          <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />
        )}
      </div>
    </div>
  );
};

export default TaskList;
