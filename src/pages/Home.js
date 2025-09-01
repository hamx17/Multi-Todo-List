import React from "react";
import { useNavigate } from "react-router-dom";
import TaskList from "../components/TaskList";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-6">
      {/* Add Task Button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => navigate("/add")}
          className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-6 py-2 rounded-lg shadow-md transition-all duration-300"
        >
          + Add Task
        </button>
      </div>

      {/* Task List */}
      <TaskList />
    </div>
  );
};

export default HomePage;
