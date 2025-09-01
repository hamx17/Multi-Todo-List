import React from "react";
import { useNavigate } from "react-router-dom";
import AddTask from "../components/TaskForm";

const AddTaskPage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-6">
      <div className="flex justify-start mb-6">
        <button
          onClick={() => navigate("/")}
          className="bg-gray-200 hover:bg-gray-300 text-black px-6 py-2 rounded-lg shadow-sm transition-all duration-300"
        >
          ← Back
        </button>
      </div>
      <AddTask />
    </div>
  );
};

export default AddTaskPage;
