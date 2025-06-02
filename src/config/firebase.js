import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAa3qhOQW44zM09VqUlPNMsLZ-T4zbObfw",
  authDomain: "lecture-management-system.firebaseapp.com",
  projectId: "lecture-management-system",
  storageBucket: "lecture-management-system.appspot.com", // Fixed storage bucket URL
  messagingSenderId: "480666094685",
  appId: "1:480666094685:web:cd4ef49c7edff52b48d1b4",
  measurementId: "G-2W07T57CTM"
};

// Initialize Firebase app
console.log("Initializing Firebase app...");
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and Firestore
console.log("Initializing Firebase services...");
export const auth = getAuth(app);
export const db = getFirestore(app);

// Log initialization success
console.log("Firebase initialized successfully");

// Function to test Firebase Authentication
export const testFirebaseAuth = async () => {
  try {
    // Check if auth is properly initialized
    console.log("Testing Firebase Authentication...");
    console.log("Auth instance:", !!auth);
    console.log("Current user:", auth.currentUser);
    return !!auth;
  } catch (error) {
    console.error("Firebase Auth test failed:", error);
    return false;
  }
};

// Use this in development to help debug Firebase issues
if (process.env.NODE_ENV === 'development') {
  console.log("Firebase config loaded in development mode");
  console.log("Firebase project ID:", firebaseConfig.projectId);
}