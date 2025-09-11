// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCeg9lavfGMVJMftjrSqJXNlf7fwN73KQw",
  authDomain: "cashflowr-38c2b.firebaseapp.com",
  projectId: "cashflowr-38c2b",
  storageBucket: "cashflowr-38c2b.firebasestorage.app",
  messagingSenderId: "600857402028",
  appId: "1:600857402028:web:e5215ed231fd44292f1d09"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);