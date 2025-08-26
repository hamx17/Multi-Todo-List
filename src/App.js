import React from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

const App = () => {
  return (
      <div className="w-full bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900 text-white py-10 px-6">
           <h2 className="text-3xl font-bold mb-6 text-center"> TODO MULTY LIST</h2>
     
      <TaskForm />
      <TaskList />
    </div>
  );
};

export default App;
