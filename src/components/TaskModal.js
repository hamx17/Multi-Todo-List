import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateTask, toggleSubTask } from "../store/features/tasks/taskSlice";

const TaskModal = ({ task, onClose }) => {
  const dispatch = useDispatch();
  const modalRef = useRef(null);
  const overlayRef = useRef(null);

  // ✅ Always fetch the latest updated task from Redux
  const updatedTask = useSelector((state) =>
    state.tasks.find((t) => t.id === task.id)
  );

  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({
    title: updatedTask?.title || "",
    description: updatedTask?.description || "",
    date: updatedTask?.date || "",
  });


  useEffect(() => {
    if (overlayRef.current) {
      overlayRef.current.focus();
    }
  }, []);

  const handleChange = (e) => {
    setEditedTask({ ...editedTask, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    dispatch(updateTask({ id: updatedTask.id, ...editedTask }));
    setIsEditing(false);
    onClose();
  };

  if (!updatedTask) return null;

  return (
    <div
      ref={overlayRef}
      tabIndex={0}  
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose(); 
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50"
    >
      <div
        ref={modalRef}
        className="bg-gray-900 rounded-2xl shadow-lg p-6 w-[500px] max-w-full relative border border-gray-700"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-white mb-4">
          {isEditing ? "Edit Task" : `TASK: ${updatedTask.title}`}
        </h2>

        {/* Title */}
        {isEditing ? (
          <input
            type="text"
            name="title"
            value={editedTask.title}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white mb-3 border border-gray-600"
          />
        ) : (
          <h3 className="text-lg text-white">{updatedTask.title}</h3>
        )}

        {/* Description */}
        <h1 className="text-gray-300">Description:</h1>
        {isEditing ? (
          <textarea
            name="description"
            value={editedTask.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white mb-3 border border-gray-600"
          />
        ) : (
          <p className="text-gray-300 mb-3">{updatedTask.description}</p>
        )}

        {/* Date */}
        {isEditing ? (
          <input
            type="date"
            name="date"
            value={editedTask.date}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white mb-4 border border-gray-600"
          />
        ) : (
          <p className="text-indigo-400 mb-4">Due Date: {updatedTask.date}</p>
        )}

        {/* Subtasks */}
        {updatedTask.subTasks.length > 0 ? (
          <>
            <h3 className="text-lg font-semibold text-indigo-400 mb-2">
              Subtasks:
            </h3>
            <ul className="space-y-2">
              {updatedTask.subTasks.map((sub) => (
                <li
                  key={sub.id}
                  className="bg-gray-800 px-3 py-2 rounded-lg shadow-sm flex items-center justify-between"
                >
                  <div>
                    <p
                      className={`text-white font-semibold ${
                        sub.completed ? "line-through text-gray-400" : ""
                      }`}
                    >
                      {sub.title}
                    </p>
                    <p className="text-gray-400 text-sm">{sub.description}</p>
                  </div>

             
                  <span
                    onClick={() =>
                      dispatch(
                        toggleSubTask({
                          taskId: updatedTask.id,
                          subTaskId: sub.id,
                        })
                      )
                    }
                    className={`cursor-pointer px-3 py-1 rounded-lg text-sm font-semibold ${
                      sub.completed
                        ? "bg-green-600 text-white"
                        : "bg-red-600 text-white"
                    }`}
                  >
                    {sub.completed ? "Completed" : "Not Completed"}
                  </span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-gray-400 italic">No subtasks available.</p>
        )}

        {/* Buttons */}
        <div className="mt-6 flex justify-end space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                Save
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
