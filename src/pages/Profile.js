import React, { useEffect, useState } from "react";
import { auth, db, storage } from "../firebase";
import { updateEmail, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";

export default function Profile() {
  const [form, setForm] = useState({ name: "", email: "", contact: "", photoURL: "" });
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));

  useEffect(() => {
    if (!user || !user.uid) return;

    const fetchUserData = async () => {
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setForm({
            name: data.name || "",
            email: data.email || user.email,
            contact: data.contact || "",
            photoURL: data.photoURL || "",
          });
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUserData();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("User not logged in");

      let photoURL = form.photoURL;

      // If new image selected → upload new one
      if (image) {
        const imageRef = ref(storage, `profileImages/${currentUser.uid}-${Date.now()}`);
        await uploadBytes(imageRef, image);
        photoURL = await getDownloadURL(imageRef);
      }

      // Update email if changed
      if (form.email !== currentUser.email) {
        await updateEmail(currentUser, form.email);
      }

      // Update Firebase Auth profile
      await updateProfile(currentUser, {
        displayName: form.name,
        photoURL,
      });

      // Update Firestore
      const userRef = doc(db, "users", currentUser.uid);
      await setDoc(userRef, { ...form, photoURL }, { merge: true });

      // Save in localStorage
      const updatedUser = { uid: currentUser.uid, ...form, photoURL };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 text-lg">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-10 flex justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white border border-gray-200 p-6 sm:p-8 rounded-xl shadow-lg flex flex-col gap-4"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-center text-gray-800">
          User Profile
        </h2>

        {/* Profile Image */}
        <div className="flex flex-col items-center">
          <img
            src={form.photoURL || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-24 h-24 rounded-full border mb-3 object-cover"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full bg-white border border-gray-300 text-gray-800 px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder="Contact Number"
          className="w-full bg-white border border-gray-300 text-gray-800 px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={form.contact}
          onChange={(e) => setForm({ ...form, contact: e.target.value })}
          required
        />

        <input
          type="email"
          placeholder="Email Address"
          className="w-full bg-white border border-gray-300 text-gray-800 px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
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
          {loading ? "Updating Profile..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
}
