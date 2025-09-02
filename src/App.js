import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AddForm from "./pages/AddForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";



const App = () => {
   const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));

  // Listen for localStorage changes in other tabs
  useEffect(() => {
    const handleStorageChange = () => {
      setUser(JSON.parse(localStorage.getItem("user")));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);
  return (<>
  
    <Router>
       {user && <Navbar setUser={setUser} />}
         <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 text-gray-900">
        <h2 className="text-3xl font-bold text-center py-6 text-blue-700 drop-shadow-md">

          Multi Todo List
        </h2>
        <Routes>
          <Route path="/" element={<SignIn setUser={setUser} />} />
         
          <Route path="/signup" element={<SignUp/>}/>
              
                <Route path="/home" element={ <ProtectedRoute>
                <Home />
              </ProtectedRoute>}/>
            <Route path="/add" element={ <ProtectedRoute>
               <AddForm />
              </ProtectedRoute>} /> 
               <Route path="/profile" element={ <ProtectedRoute>
               <Profile />
              </ProtectedRoute>} /> 
           
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
    </Router></>
  );
};

export default App;
