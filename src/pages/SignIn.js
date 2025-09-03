import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function SignIn({ setUser }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      const user = userCredential.user;

      // Save user to localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          uid: user.uid,
          email: user.email,
          name: user.displayName,
        })
      );

      // Update app state
      setUser(user);

      // Success toast
      toast.success("Signed in successfully!");

      // Redirect to home
      setTimeout(() => navigate("/home"), 1500);
    } catch (error) {
      console.error("Firebase Auth Error:", error);

      // Check for specific Firebase Auth errors
      switch (error.code) {
        case "auth/invalid-email":
          toast.error(" Please enter a valid email.");
          break;
        case "auth/user-not-found":
          toast.error("❌ No account found with this email. Please sign up first.");
          break;
        case "auth/wrong-password":
          toast.error("❌ Incorrect password! Please try again.");
          break;
      
        default:
          toast.error("Invalid email and passwrod Please try again.");
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
   <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white border border-gray-200 p-8 sm:p-10 rounded-xl shadow-lg"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">
          Sign In to Your Account
        </h2>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full bg-white border border-gray-300 text-gray-800 px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <input
          type="password"
          placeholder="Enter your password"
          className="w-full bg-white border border-gray-300 text-gray-800 px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-6"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold shadow-md transition-all duration-300 ${
            loading
              ? "bg-gray-400 cursor-not-allowed text-gray-700"
              : "bg-indigo-500 hover:bg-indigo-600 text-white"
          }`}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-3 text-gray-400 text-sm">OR</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <p className="text-center text-gray-600 text-sm">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-indigo-500 font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}
