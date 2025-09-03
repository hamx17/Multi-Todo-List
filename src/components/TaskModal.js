import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { updateTaskThunk } from "../store/features/tasks/thunkSlice";

const TaskModal = ({ task, onClose }) => {
  const dispatch = useDispatch();
  const modalRef = useRef(null);
  const overlayRef = useRef(null);

  const updatedTask = useSelector((state) =>
    state.tasks.tasks.find((t) => t.docId === task.docId)
  );

  const [isEditing, setIsEditing] = useState(false);

  const [editedTask, setEditedTask] = useState({
    title: updatedTask?.title || "",
    description: updatedTask?.description || "",
    date: updatedTask?.date || "",
    subTasks: updatedTask?.subTasks?.map((st) => ({ ...st })) || [],
  });

  useEffect(() => {
    if (overlayRef.current) overlayRef.current.focus();
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    if (e.target.name === "title")
      setEditedTask({ ...editedTask, title: value.slice(0, 40) });
    if (e.target.name === "description")
      setEditedTask({ ...editedTask, description: value.slice(0, 100) });
    if (e.target.name === "date") setEditedTask({ ...editedTask, date: value });
  };

  const handleSubTaskChange = (index, field, value) => {
    const updatedSubTasks = [...editedTask.subTasks];
    updatedSubTasks[index][field] = value;
    setEditedTask({ ...editedTask, subTasks: updatedSubTasks });
  };

  // Toggle subtask completion only in edit mode
  const handleSubTaskToggle = (subId) => {
    if (!isEditing) return;
    const updatedSubTasks = editedTask.subTasks.map((st) =>
      st.id === subId ? { ...st, completed: !st.completed } : st
    );
    setEditedTask({ ...editedTask, subTasks: updatedSubTasks });
  };

  const handleSave = () => {
    if (
      !editedTask.title.trim() ||
      !editedTask.description.trim() ||
      editedTask.subTasks.some((st) => !st.title.trim() || !st.description.trim())
    ) {
      toast.error("⚠️ Please fill all fields before saving!", {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
      });
      return;
    }

    dispatch(updateTaskThunk({ docId: updatedTask.docId, ...editedTask }));
    toast.success("Task updated successfully!", {
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
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 p-4"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl relative border border-gray-200 flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-black hover:text-gray-700 text-xl"
        >
          ✕
        </button>

        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <h2 className="text-2xl font-bold text-black mb-2">
            {isEditing ? "Edit Task" : "Task Details"}
          </h2>

          {/* Task Fields */}
          <div>
            <label className="block font-semibold text-black mb-1">Title:</label>
            {isEditing ? (
              <input
                type="text"
                name="title"
                value={editedTask.title}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg bg-gray-100 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 break-words"
              />
            ) : (
              <p className="text-black font-semibold break-words">{updatedTask.title}</p>
            )}
          </div>

          <div>
            <label className="block font-semibold text-black mb-1">Description:</label>
            {isEditing ? (
              <textarea
                name="description"
                value={editedTask.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 rounded-lg bg-gray-100 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 break-words resize-none"
              />
            ) : (
              <p className="text-black break-words">{updatedTask.description}</p>
            )}
          </div>

          <div>
            <label className="block font-semibold text-black mb-1">Due Date:</label>
            {isEditing ? (
              <input
                type="date"
                name="date"
                value={editedTask.date}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg bg-gray-100 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-black font-medium">{updatedTask.date}</p>
            )}
          </div>

          {/* Subtasks */}
          <div>
            <h3 className="text-lg font-semibold text-black mb-2">Subtasks:</h3>
            {editedTask.subTasks && editedTask.subTasks.length > 0 ? (
              <ul className="space-y-4 max-h-60 overflow-y-auto">
                {editedTask.subTasks.map((sub, index) => (
                  <li
                    key={sub.id}
                    className="bg-gray-100 px-3 py-3 rounded-lg shadow-sm flex flex-col border border-gray-300 break-words"
                  >
                    <div className="mb-1">
                      <label className="block font-semibold text-black mb-1">Title:</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={sub.title}
                          onChange={(e) =>
                            handleSubTaskChange(index, "title", e.target.value.slice(0, 40))
                          }
                          className="w-full px-2 py-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p
                          className={`break-words ${
                            sub.completed ? "line-through text-gray-400" : ""
                          }`}
                        >
                          {sub.title}
                        </p>
                      )}
                    </div>

                    <div className="mb-2">
                      <label className="block font-semibold text-black mb-1">Description:</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={sub.description}
                          onChange={(e) =>
                            handleSubTaskChange(index, "description", e.target.value.slice(0, 100))
                          }
                          className="w-full px-2 py-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-sm break-words">{sub.description}</p>
                      )}
                    </div>

                    {/* Toggle completion */}
                    <span
                      onClick={() => handleSubTaskToggle(sub.id)}
                      className={`cursor-pointer px-3 py-1 rounded-lg text-sm font-semibold text-center transition-all ${
                        sub.completed
                          ? "bg-green-500 text-white hover:bg-green-600"
                          : "bg-red-500 text-white hover:bg-red-600"
                      }`}
                    >
                      {isEditing
                        ? sub.completed
                          ? "Subtask Completed"
                          : "Subtask Not Completed"
                        : sub.completed
                        ? "Subtask Completed"
                        : "Subtask Not Completed"}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="italic text-black">No subtasks available.</p>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="p-6 flex justify-end space-x-3 border-t border-gray-200">
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
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
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
