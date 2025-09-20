// Import the functions you need from the SDKs you need
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCeg9lavfGMVJMftjrSqJXNlf7fwN73KQw",
  authDomain: "cashflowr-38c2b.firebaseapp.com",
  projectId: "cashflowr-38c2b",
  storageBucket: "cashflowr-38c2b.firebasestorage.app",
  messagingSenderId: "600857402028",
  appId: "1:600857402028:web:e5215ed231fd44292f1d09",
  // measurementId: "G-0B3YWRSNYE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

let authInstance;
try {
  // Dynamically require to avoid type/resolve issues if subpath is missing
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { getReactNativePersistence } = require('firebase/auth/react-native');
  authInstance = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  // Fallback to default auth without persistence if RN helpers are unavailable
  authInstance = getAuth(app);
}

export const auth = authInstance;
export const db = getFirestore(app);

