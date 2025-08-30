import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addTask } from "../Store/features/tasks/taskSlice";
import { nanoid } from "nanoid";

const AddTask = () => {
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [subTasks, setSubTasks] = useState([{  id: nanoid(), title: "", description: "" }]);

  // Add new empty subtask input fields
  const handleAddSubTask = () => {
    setSubTasks([...subTasks, {  id: nanoid(), title: "", description: "" }]);
  };
console.log(subTasks);
  // Update subtask values dynamically
  const handleSubTaskChange = (index, field, value) => {
    const updated = [...subTasks];
    updated[index][field] = value;
    setSubTasks(updated);
  };

  // Submit new task
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    dispatch(
      addTask({
          id: nanoid(), //nano id replaced
        title,
        description,
        date,
        completed: false,
        subTasks: subTasks.filter((st) => st.title.trim() !== ""),
      })
    );

    // Reset form fields
    setTitle("");
    setDescription("");
    setDate("");
    setSubTasks([{  id: nanoid(), title: "", description: "" }]);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 flex justify-center">
      <div className="w-full max-w-3xl bg-gray-800 bg-opacity-60 backdrop-blur-lg border border-gray-700 p-6 sm:p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-white">
          Add New Task
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* Description */}
          <textarea
            placeholder="Task Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[120px]"
          />

          {/* Date */}
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* Subtasks */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-indigo-400">Subtasks</h3>
            {subTasks.map((subTask,index ) => (
              <div key={index} className="flex flex-col sm:flex-row gap-3">
                
                <input
                  type="text"
                  placeholder="Subtask Title"
                  value={subTask.title}
                  onChange={(e) =>
                    handleSubTaskChange(index, "title", e.target.value)
                  }
                  className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  placeholder="Subtask Description"
                  value={subTask.description}
                  onChange={(e) =>
                    handleSubTaskChange(index, "description", e.target.value)
                  }
                  className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            ))}

      
            <button
              type="button"
              onClick={handleAddSubTask}
              className="w-full mt-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white py-2 rounded-lg font-medium transition-all duration-300"
            >
             Add Subtask
            </button>
          </div>

      
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white py-3 rounded-lg font-semibold transition-all duration-300"
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
