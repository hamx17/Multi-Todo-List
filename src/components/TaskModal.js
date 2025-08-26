import React from "react";

const TaskModal = ({ task, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="bg-gray-900 rounded-2xl shadow-lg p-6 w-[500px] max-w-full relative border border-gray-700">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-white mb-2"> TASK: {task.title}</h2>
       <h1>Description:</h1> <p className="text-gray-300 mb-3">{task.description}</p>
        <p className="text-indigo-400 mb-4">Due Date: {task.date}</p>

        {/* Subtasks */}
        {task.subTasks.length > 0 ? (
          <>
            <h3 className="text-lg font-semibold text-indigo-400 mb-2">
              Subtasks:
            </h3>
            <ul className="space-y-2">
              {task.subTasks.map((sub, index) => (
                <li
                  key={index}
                  className="bg-gray-800 px-3 py-2 rounded-lg shadow-sm"
                >
                  <p className="text-white font-semibold"> {sub.title}</p>
                  <p className="text-gray-400 text-sm">{sub.description}</p>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-gray-400 italic">No subtasks available.</p>
        )}
      </div>
    </div>
  );
};

export default TaskModal;
