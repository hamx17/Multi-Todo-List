// Import Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // ✅ Import storage

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAQQyZuG9Np0Jwisb1KqwuFkFEMu93AfkI",
  authDomain: "multi-todo-redux.firebaseapp.com",
  projectId: "multi-todo-redux",
 storageBucket: "multi-todo-redux.firebasestorage.app", // ✅ FIXED HERE
  messagingSenderId: "86200202731",
  appId: "1:86200202731:web:9693052bd0ad3b9370d5ae",
  measurementId: "G-EG5KFNFPLC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // ✅ Export storage
const analytics = getAnalytics(app);
