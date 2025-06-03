import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCH_HB0pocuTOBLBEEHXDwtAtTCaKZG5Z0",
  authDomain: "visiting-7727b.firebaseapp.com",
  projectId: "visiting-7727b",
  storageBucket: "visiting-7727b.firebasestorage.app",
  messagingSenderId: "355201941654",
  appId: "1:355201941654:web:a5fb1e096705214b6fc2b7",
  measurementId: "G-HVHWN9WVBG"
};

console.log("Initializing Firebase app...");
export const app = initializeApp(firebaseConfig);

console.log("Initializing Firebase services...");
export const auth = getAuth(app);
export const db = getFirestore(app);

console.log("Firebase initialized successfully");

export const testFirebaseAuth = async () => {
  try {
    console.log("Testing Firebase Authentication...");
    console.log("Auth instance:", !!auth);
    console.log("Current user:", auth.currentUser);
    return !!auth;
  } catch (error) {
    console.error("Firebase Auth test failed:", error);
    return false;
  }
};

if (process.env.NODE_ENV === 'development') {
  console.log("Firebase config loaded in development mode");
  console.log("Firebase project ID:", firebaseConfig.projectId);
}