import { initializeApp } from "firebase/app";
import { updateProfile } from "firebase/auth"; 
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
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SERVER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const signup = async (username, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await updateProfile(user, {
      displayName: username,
    });
    await setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      username: username.toLowerCase(),
      email,
      name: username, 
      avatar: "",
      bio: "Hey! there I am using chat app",
      lastSeen: Date.now(),
    });
    await setDoc(doc(db, "chats", user.uid), { chatsData: [] });

    toast.success("Account created successfully!");
    return user; 
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
    return user; 
  } catch (error) {
    console.error("Login error:", error);
    throw error;
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
