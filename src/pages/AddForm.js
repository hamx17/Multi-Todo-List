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
          className="bg-gradient-to-r from-gray-500 to-gray-700 hover:from-gray-600 hover:to-gray-800 text-white px-6 py-2 rounded-lg shadow-md transition-all duration-300"
        >
          ← Back
        </button>
      </div>

    
      <AddTask />

    
    </div>
  );
};

export default AddTaskPage;
