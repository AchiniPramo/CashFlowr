import {
  createUserWithEmailAndPassword,
  updatePassword as firebaseUpdatePassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { auth, db, storage } from "../firebase";
import { UserProfile } from "../types";

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserCustomCategories?: (
    userId: string,
    type: "expense" | "income",
    categories: string[]
  ) => Promise<void>;
  updateProfile?: (data: { displayName?: string }) => Promise<void>;
  uploadPhoto?: (fileURI: string) => Promise<string>;
  changePassword?: (newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: userData.name,
              photoURL: userData.photoURL || null,
              customCategories: userData.customCategories,
            });
          } else {
            // Fallback if user doc doesn't exist (e.g., new user just signed up)
            const newUser: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.email?.split("@")[0] || "User",
              photoURL: null,
              customCategories: { expense: [], income: [] },
            };
            await setDoc(userDocRef, newUser, { merge: true });
            setUser(newUser);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setUser(null); // Ensure user is null on error
        Alert.alert("Error", "Failed to load user profile. Please try again.");
      } finally {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error: any) {
      Alert.alert("Login Failed", error.message);
      throw error;
    }
  };

  const register = async (name: string, email: string, pass: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        pass
      );
      const firebaseUser = userCredential.user;
      await setDoc(doc(db, "users", firebaseUser.uid), {
        name: name,
        email: email,
        photoURL: null,
        customCategories: { expense: [], income: [] },
      });
    } catch (error: any) {
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email address is already in use.";
      } else if (error.code === "auth/weak-password") {
        errorMessage =
          "The password is too weak. Please use at least 6 characters.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address.";
      }
      Alert.alert("Registration Failed", errorMessage);
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const updateUserCustomCategories = async (
    userId: string,
    type: "expense" | "income",
    categories: string[]
  ) => {
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, { [`customCategories.${type}`]: categories });
    setUser((prev) =>
      prev
        ? {
            ...prev,
            customCategories: {
              ...(prev.customCategories || {}),
              [type]: categories,
            },
          }
        : prev
    );
  };

  const updateProfile = async (data: { displayName?: string }) => {
    if (!auth.currentUser) throw new Error("Not authenticated");
    const userDocRef = doc(db, "users", auth.currentUser.uid);
    if (data.displayName !== undefined) {
      const nameToSet: string | null = data.displayName ?? null;
      await updateDoc(userDocRef, { name: nameToSet });
      setUser((prev) => (prev ? { ...prev, name: nameToSet } : prev));
    }
  };

  const uploadPhoto = async (fileURI: string) => {
    if (!auth.currentUser) throw new Error("Not authenticated");
    try {
      // Read file as blob using fetch
      const response = await fetch(fileURI);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();
      const storagePath = `users/${auth.currentUser.uid}/avatar.jpg`;
      const r = storageRef(storage, storagePath);
      await uploadBytes(r, blob);
      const url = await getDownloadURL(r);
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userDocRef, { photoURL: url });
      // Update user state immediately
      setUser((prev) => {
        if (prev) {
          return { ...prev, photoURL: url };
        }
        return prev;
      });
      return url;
    } catch (error) {
      console.error("Error uploading photo:", error);
      throw error;
    }
  };

  const changePassword = async (newPassword: string) => {
    if (!auth.currentUser) throw new Error("Not authenticated");
    try {
      await firebaseUpdatePassword(auth.currentUser, newPassword);
    } catch (e) {
      throw e;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUserCustomCategories,
        updateProfile,
        uploadPhoto,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
