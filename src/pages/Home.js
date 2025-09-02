import React from "react";
import { useNavigate } from "react-router-dom";
import TaskList from "../components/TaskList";
import Profile from "./Profile";

const HomePage = () => {
  const navigate = useNavigate();

 

  return (
    <div className="max-w-4xl mx-auto px-6">
       
      {/* Add Task Button */}
      <div className="flex justify-center mb-6">
       
         
      </div>

      {/* Task List */}
      <TaskList />
   
    </div>
  );
};

export default HomePage;
