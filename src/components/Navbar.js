// src/components/Navbar.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";

const Navbar = ({setUser}) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await auth.signOut();
    localStorage.removeItem("user");
      setUser(null);
    navigate("/");
  };

  return (
    <nav className="bg-blue-600 text-white flex justify-between items-center px-6 py-3 shadow-md">
      {/* Left links */}
      <div className="flex gap-4 items-center">
        <Link to="/home" className="font-semibold hover:text-gray-200">
          Home
        </Link>
        <Link to="/profile" className="font-semibold hover:text-gray-200">
          Profile
        </Link>
      </div>

      {/* Right buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate("/add")}
          className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-gray-100"
        >
          Add Form
        </button>
        <button
          onClick={handleSignOut}
          className="bg-red-500 px-4 py-1 rounded hover:bg-red-600"
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
