import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AddForm from "./pages/AddForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <Router>
         <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 text-gray-900">
        <h2 className="text-3xl font-bold text-center py-6 text-blue-700 drop-shadow-md">

          Multi Todo List
        </h2>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddForm />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
    </Router>
  );
};

export default App;
