// Import necessary Firebase functions
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Add this line

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC0tazlBiqlapQkVGpedHGLbTiWNRy3S9U",
  authDomain: "new-duke-brew.firebaseapp.com",
  projectId: "new-duke-brew",
  storageBucket: "new-duke-brew.appspot.com",
  messagingSenderId: "1094215046397",
  appId: "1:1094215046397:web:3763f80f8ae61650d41a94",
  measurementId: "G-11GM0MWTX7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // Add this line to initialize Firebase Storage
