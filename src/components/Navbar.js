
// src/components/Navbar.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { FaUserCircle } from "react-icons/fa";

const Navbar = ({ setUser, user }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSignOut = async () => {
    await auth.signOut();
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md px-6 py-3 flex items-center justify-between">
      {/* Left: App Heading */}
      <div
        className="font-bold text-xl cursor-pointer"
        onClick={() => navigate("/home")}
      >
      Multi Todo App
      </div>

      {/* Center: Home + Add Form */}
      <div className="flex gap-4 items-center">
        <Link
          to="/home"
          className="font-semibold hover:text-gray-200 transition-colors"
        >
          Home
        </Link>
        <button
          onClick={() => navigate("/add")}
          className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-gray-100 transition-colors"
        >
          Add Form
        </button>
      </div>

      {/* Right: User Name + Profile Icon */}
      <div className="relative flex items-center gap-2">
        {/* Show username */}
        <span className="font-medium">{user?.displayName }</span>

        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="text-3xl hover:text-gray-200 transition-colors"
        >
          <FaUserCircle />
        </button>

        {/* Dropdown */}
        {dropdownOpen && (
        <div className="absolute right-0 top-full mt-2 w-44 bg-white text-black rounded-lg shadow-lg z-50 border border-gray-200 overflow-hidden">


            <Link
              to="/profile"
              className="block w-full text-left px-4 py-2 border-b border-gray-200 hover:bg-blue-50 hover:text-blue-700 transition-colors font-medium"
              onClick={() => setDropdownOpen(false)}
            >
              Profile
            </Link>
            <button
              onClick={handleSignOut}
              className="w-full text-left px-4 py-2 font-medium text-red-600 hover:bg-red-600 hover:text-white transition-colors"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
