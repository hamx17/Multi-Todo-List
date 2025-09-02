import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  updateTaskThunk,
  toggleSubTaskThunk,
} from "../store/features/tasks/thunkSlice";

const TaskModal = ({ task, onClose }) => {
  const dispatch = useDispatch();
  const modalRef = useRef(null);
  const overlayRef = useRef(null);

  // Get latest task data from Redux
  const updatedTask = useSelector((state) =>
    state.tasks.tasks.find((t) => t.docId === task.docId)
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
    if (!editedTask.title.trim() || !editedTask.description.trim()) {
      toast.error("⚠️ Please fill in all fields before saving!", {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
      });
      return;
    }

    dispatch(updateTaskThunk({ docId: updatedTask.docId, ...editedTask }));
    toast.success("✅ Task updated successfully!", {
      position: "top-center",
      autoClose: 2000,
      theme: "colored",
    });

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
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-xl p-6 w-[500px] max-w-full relative border border-gray-200"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {isEditing ? "Edit Task" : `Task: ${updatedTask.title}`}
        </h2>

        {/* Title */}
        {isEditing ? (
          <input
            type="text"
            name="title"
            value={editedTask.title}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg bg-gray-100 text-gray-800 mb-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <h3 className="text-lg text-gray-800 font-semibold">
            {updatedTask.title}
          </h3>
        )}

        {/* Description */}
        <h1 className="text-gray-700 mt-3">Description:</h1>
        {isEditing ? (
          <textarea
            name="description"
            value={editedTask.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 rounded-lg bg-gray-100 text-gray-800 mb-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <p className="text-gray-600 mb-3">{updatedTask.description}</p>
        )}

        {/* Due Date */}
        {isEditing ? (
          <input
            type="date"
            name="date"
            value={editedTask.date}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg bg-gray-100 text-gray-800 mb-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <p className="text-blue-600 mb-4 font-medium">
            Due Date: {updatedTask.date}
          </p>
        )}

        {/* Subtasks */}
        {updatedTask.subTasks && updatedTask.subTasks.length > 0 ? (
          <>
            <h3 className="text-lg font-semibold text-blue-600 mb-2">
              Subtasks:
            </h3>
            <ul className="space-y-2">
              {updatedTask.subTasks.map((sub) => (
                <li
                  key={sub.id}
                  className="bg-gray-100 px-3 py-2 rounded-lg shadow-sm flex items-center justify-between border border-gray-300"
                >
                  <div>
                    <p
                      className={`text-gray-800 font-semibold ${
                        sub.completed ? "line-through text-gray-400" : ""
                      }`}
                    >
                      {sub.title}
                    </p>
                    <p className="text-gray-600 text-sm">{sub.description}</p>
                  </div>

                  <span
                    onClick={() =>
                      dispatch(
                        toggleSubTaskThunk({
                          taskId: updatedTask.docId,
                          subTaskId: sub.id,
                        })
                      )
                    }
                    className={`cursor-pointer px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
                      sub.completed
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-red-500 text-white hover:bg-red-600"
                    }`}
                  >
                    {sub.completed ? "Completed" : "Not Completed"}
                  </span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-gray-500 italic">No subtasks available.</p>
        )}

        {/* Buttons */}
        <div className="mt-6 flex justify-end space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
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
