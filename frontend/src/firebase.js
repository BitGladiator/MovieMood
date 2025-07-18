import { initializeApp } from "firebase/app";
import { updateProfile } from "firebase/auth"; // Add this import
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  getFirestore,
  setDoc,
  doc,
  collection,
  query,
  getDocs,
  where,
  addDoc,
} from "firebase/firestore";

import toast from "react-hot-toast";

// Firebase config from environment
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SERVER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Auth Helpers
const signup = async (username, email, password) => {
  try {
    // 1. Create user
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;

    // 2. Set displayName in Firebase Auth
    await updateProfile(user, {
      displayName: username,
    });

    // 3. Store additional data in Firestore
    await setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      username: username.toLowerCase(),
      email,
      name: username, // Set name here too
      avatar: "",
      bio: "Hey! there I am using chat app",
      lastSeen: Date.now(),
    });

    // 4. Create chats document
    await setDoc(doc(db, "chats", user.uid), { chatsData: [] });

    toast.success("Account created successfully!");
    return user; // Return user with updated profile
  } catch (error) {
    console.error(error);
    toast.error(error.code.split("/")[1].split("-").join(" "));
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    const user = res.user;
    return user; // Return the full user object (includes displayName)
  } catch (error) {
    console.error("Login error:", error);
    throw error; // Re-throw to handle in the UI
  }
};

const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error(error);
    toast.error(error.message);
  }
};

const resetPass = async (email) => {
  if (!email) return toast.error("Enter your email");
  try {
    const userRef = collection(db, "users");
    const q = query(userRef, where("email", "==", email));
    const snap = await getDocs(q);
    if (!snap.empty) {
      await sendPasswordResetEmail(auth, email);
      toast.success("Reset Email Sent");
    } else {
      toast.error("Email doesn't exist");
    }
  } catch (error) {
    console.error(error);
    toast.error(error.message);
  }
};

// Export necessary functions/utilities
export {
  app,
  auth,
  db,
  signup,
  
  logout,
  resetPass,
  addDoc,
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  toast,
};
