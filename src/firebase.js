// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDdsJ-HumrJWy0zsKwxvYTRxAeRFzxtIMw",
  authDomain: "ilearn-81c68.firebaseapp.com",
  projectId: "ilearn-81c68",
  storageBucket: "ilearn-81c68.appspot.com", // Corrected line
  messagingSenderId: "254753715421",
  appId: "1:254753715421:web:3bb1aadb9ee8251bac1734",
  measurementId: "G-20DV4TBY81"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); // Use 'const' instead of 'export const'
const db = getFirestore(app); // Use 'const' instead of 'export const'
const storage = getStorage(app); // Correctly initialized storage

// Export all initialized Firebase services in a single export statement
export { auth, db, storage };
export default app;
