// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAQQyZuG9Np0Jwisb1KqwuFkFEMu93AfkI",
  authDomain: "multi-todo-redux.firebaseapp.com",
  projectId: "multi-todo-redux",
  storageBucket: "multi-todo-redux.firebasestorage.app",
  messagingSenderId: "86200202731",
  appId: "1:86200202731:web:9693052bd0ad3b9370d5ae",
  measurementId: "G-EG5KFNFPLC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 
const analytics = getAnalytics(app);