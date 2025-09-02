import React, { useState, useEffect  } from "react";
import { useDispatch } from "react-redux";
import { nanoid } from "nanoid";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addTaskThunk } from "../store/features/tasks/thunkSlice";
import { auth } from "../firebase";
import {  useSelector } from "react-redux";


const AddTask = () => {
  
  
  const navigate = useNavigate();
   const dispatch = useDispatch();
  const { tasks, status } = useSelector((state) => state.tasks);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [subTasks, setSubTasks] = useState([
    { id: nanoid(), title: "", description: "", completed: false },
  ]);

   

  const handleAddSubTask = () => {
    const last = subTasks[subTasks.length - 1];
    if (last.title.trim() === "" || last.description.trim() === "") {
      toast.warning("⚠️ Fill current subtask before adding another one.", {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
      });
      return;
    }
    setSubTasks([
      ...subTasks,
      { id: nanoid(), title: "", description: "", completed: false },
    ]);
  };

  const handleSubTaskChange = (index, field, value) => {
    const updated = [...subTasks];
    updated[index][field] = value;
    setSubTasks(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      toast.error("⚠️ Please sign in first!");
      return;
    }

    const newTask = {
      id: nanoid(),
      userId: user.uid,
      title,
      description,
      date,
      completed: false,
      subTasks: subTasks
        .filter((st) => st.title.trim() !== "")
        .map((st) => ({ ...st, completed: false })),
    };

    try {
      await dispatch(addTaskThunk(newTask)).unwrap();

      toast.success("✅ Task added successfully!", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });

      setTitle("");
      setDescription("");
      setDate("");
      setSubTasks([{ id: nanoid(), title: "", description: "", completed: false }]);
      navigate("/home");
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("❌ Failed to add task");
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 flex justify-center">
      <div className="w-full max-w-3xl bg-gray-50 border border-gray-200 p-6 sm:p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-black">
          Add New Task
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-white border border-gray-300 text-black px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
            required
          />

          <textarea
            placeholder="Task Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-white border border-gray-300 text-black px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black min-h-[120px]"
            required
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="w-full bg-white border border-gray-300 text-black px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
            required
          />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Subtasks</h3>
            {subTasks.map((subTask, index) => (
              <div key={subTask.id} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Subtask Title"
                  value={subTask.title}
                  onChange={(e) =>
                    handleSubTaskChange(index, "title", e.target.value)
                  }
                  className="flex-1 bg-white border border-gray-300 text-black px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
                <input
                  type="text"
                  placeholder="Subtask Description"
                  value={subTask.description}
                  onChange={(e) =>
                    handleSubTaskChange(index, "description", e.target.value)
                  }
                  className="flex-1 bg-white border border-gray-300 text-black px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddSubTask}
              className="w-sm mt-2 bg-gray-200 hover:bg-gray-300 text-black py-2 rounded-lg font-medium shadow-sm transition"
            >
              + Add Subtask
            </button>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-lg font-semibold shadow-md transition-all duration-300"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTask;
