import React, { useState } from "react";
import { auth, db, storage } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function SignUp({ setSignupLoading }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", contact: "" });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters long!");
      return;
    }

    try {
      setSignupLoading(true);
      setLoading(true);

      const { user } = await createUserWithEmailAndPassword(auth, form.email, form.password);

      let imageURL = "";
      if (image) {
        const imgRef = ref(storage, `profileImages/${user.uid}`);
        await uploadBytes(imgRef, image);
        imageURL = await getDownloadURL(imgRef);
      }

      await updateProfile(user, {
        displayName: form.name,
        photoURL: imageURL,
      });

      await setDoc(doc(db, "users", user.uid), {
        name: form.name,
        email: form.email,
        contact: form.contact,
        photoURL: imageURL,
      });

      toast.success("Account created successfully!");
      navigate("/home");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSignupLoading(false);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form
        onSubmit={handleSignUp}
        className="p-8 bg-white shadow-xl rounded-2xl w-[500px] md:w-[600px] lg:w-[650px] transition-all"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Create Your Account</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Full Name"
            className="border p-3 rounded-lg w-full"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Contact"
            className="border p-3 rounded-lg w-full"
            onChange={(e) => setForm({ ...form, contact: e.target.value })}
          />
        </div>

        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg w-full mt-4"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg w-full mt-4"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <input
          type="file"
          accept="image/*"
          className="mt-4 w-full"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-6 py-3 rounded-lg text-white text-lg font-semibold transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}
