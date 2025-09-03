import React from "react";
import { useNavigate } from "react-router-dom";
import AddTask from "../components/TaskForm";

const AddTaskPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen">
      {/* Back Button slightly below top-left */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 bg-gray-200 hover:bg-gray-300 text-black px-6 py-2 rounded-br-lg shadow-sm transition-all duration-300"
      >
        ← Back
      </button>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto pt-20 px-6">
        <AddTask />
      </div>
    </div>
  );
};

export default AddTaskPage;
