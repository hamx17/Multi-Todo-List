import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route ,Navigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
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
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync Firebase auth state
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    const fetchUserName = async () => {
      if (currentUser) {
        let name = currentUser.displayName;

        if (!name) {
          // Firestore se fetch karlo
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            name = docSnap.data().name;
          } else {
            name = currentUser.email; // fallback
          }
        }

        setUser({ ...currentUser, displayName: name });

        localStorage.setItem(
          "user",
          JSON.stringify({
            uid: currentUser.uid,
            email: currentUser.email,
            name,
          })
        );
      } else {
        setUser(null);
        localStorage.removeItem("user");
      }
      setLoading(false); // ✅ loading false here
    };

    fetchUserName();
  });

  return () => unsubscribe();
}, []);

  if (loading) {
    return <div className="text-center mt-10 text-lg font-semibold">Loading...</div>;
  }

  return (
    <Router>
      {user && <Navbar setUser={setUser} user={user}/>}
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 text-gray-900">
        
        <Routes>
          <Route path="/"  element={user ? <Navigate to="/home" /> : <SignIn setUser={setUser} />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute user={user}>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add"
            element={
              <ProtectedRoute user={user}>
                <AddForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute user={user}>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      </div>
    </Router>
  );
};

export default App;
