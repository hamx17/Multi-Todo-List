import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
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
  const [signupLoading, setSignupLoading] = useState(false); // ✅ NEW STATE

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);

          let name = currentUser.displayName;
          if (!name && docSnap.exists()) {
            name = docSnap.data().name;
          } else if (!name) {
            name = currentUser.email;
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
        } catch (err) {
          console.error("Error fetching user data:", err);
          setUser(currentUser);
        }
      } else {
        setUser(null);
        localStorage.removeItem("user");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-lg font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <Router>
      {/* ✅ Navbar tab tak show NAHI hogi jab tak signup complete nahi hota */}
      {user && !signupLoading && <Navbar setUser={setUser} user={user} />}
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 text-gray-900">
        <Routes>
          <Route
            path="/"
            element={user ? <Navigate to="/home" /> : <SignIn setUser={setUser} />}
          />
          <Route path="/signup" element={<SignUp setSignupLoading={setSignupLoading} />} />
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
