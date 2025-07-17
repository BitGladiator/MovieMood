import React, { useEffect, useState } from "react";
import { auth, logout, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [diaryCount, setDiaryCount] = useState(0);
  const [watchLaterCount, setWatchLaterCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser({
          name: currentUser.displayName || "Movie Fan",
          email: currentUser.email,
          uid: currentUser.uid,
          avatar:
            currentUser.photoURL ||
            "https://img.icons8.com/fluency-systems-filled/96/user-male-circle.png",
        });

        const diaryQuery = query(
          collection(db, "diary"),
          where("uid", "==", currentUser.uid)
        );
        const diarySnapshot = await getDocs(diaryQuery);
        setDiaryCount(diarySnapshot.size);

        const watchQuery = query(
          collection(db, "watchLater"),
          where("uid", "==", currentUser.uid)
        );
        const watchSnapshot = await getDocs(watchQuery);
        setWatchLaterCount(watchSnapshot.size);
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xl font-semibold animate-pulse"
        >
          🚀 Summoning your sexy profile...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white px-4 py-12 relative overflow-hidden">
    {/* Animated gradient background elements */}
    <div className="absolute w-[800px] h-[800px] bg-purple-600 blur-[150px] opacity-10 rounded-full top-0 left-1/2 -translate-x-1/2 pointer-events-none animate-float"></div>
    <div className="absolute w-[600px] h-[600px] bg-indigo-600 blur-[120px] opacity-10 rounded-full bottom-20 right-20 pointer-events-none animate-float-reverse"></div>
    
    {/* Glowing particles */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div 
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full opacity-20"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `twinkle ${3 + Math.random() * 5}s infinite ${Math.random() * 2}s`
          }}
        />
      ))}
    </div>
  
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="max-w-2xl mx-auto relative z-10 bg-gradient-to-br from-gray-900 to-gray-800 backdrop-blur-2xl border border-gray-700/50 shadow-2xl shadow-purple-500/20 rounded-3xl p-8 sm:p-10 overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/10 rounded-full filter blur-xl"></div>
      <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-indigo-500/10 rounded-full filter blur-xl"></div>
      
      {/* Avatar with floating effect */}
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="flex justify-center mb-6 relative"
      >
        <div className="absolute inset-0 mx-auto w-32 h-32 bg-purple-500/30 blur-2xl rounded-full"></div>
        <img
          src={user.avatar}
          alt="avatar"
          className="w-28 h-28 rounded-full border-4 border-indigo-400/80 shadow-2xl shadow-purple-500/30 z-10 relative"
        />
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-20">
          PRO MEMBER
        </div>
      </motion.div>
  
      {/* User Info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-8"
      >
        <h2 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 text-transparent bg-clip-text mb-2">
          {user.name}
        </h2>
        <div className="flex items-center justify-center gap-2">
          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          <p className="text-gray-400 text-sm">{user.email}</p>
        </div>
      </motion.div>
  
      {/* Stats with 3D card effect */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <motion.div
          whileHover={{ y: -5, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="relative p-6 rounded-2xl bg-gradient-to-br from-indigo-900/50 to-indigo-900/20 border border-indigo-500/30 backdrop-blur-sm shadow-lg overflow-hidden"
        >
          <div className="absolute -top-10 -right-10 w-20 h-20 bg-indigo-500/10 rounded-full filter blur-lg"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600/30 rounded-lg">
                <span className="text-2xl">🎬</span>
              </div>
              <h3 className="text-lg font-semibold text-indigo-100">Movie Diary</h3>
            </div>
            <p className="mt-4 text-indigo-200 text-sm">
              You've logged
              <span className="block text-3xl font-bold text-white mt-1">
                {diaryCount}
                <span className="text-xl font-normal text-indigo-300 ml-1">
                  movie{diaryCount !== 1 && "s"}
                </span>
              </span>
            </p>
          </div>
        </motion.div>
  
        <motion.div
          whileHover={{ y: -5, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="relative p-6 rounded-2xl bg-gradient-to-br from-amber-900/40 to-amber-900/20 border border-amber-500/30 backdrop-blur-sm shadow-lg overflow-hidden"
        >
          <div className="absolute -top-10 -right-10 w-20 h-20 bg-amber-500/10 rounded-full filter blur-lg"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-600/30 rounded-lg">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="text-lg font-semibold text-amber-100">Watch Later</h3>
            </div>
            <p className="mt-4 text-amber-200 text-sm">
              You've saved
              <span className="block text-3xl font-bold text-white mt-1">
                {watchLaterCount}
                <span className="text-xl font-normal text-amber-300 ml-1">
                  movie{watchLaterCount !== 1 && "s"}
                </span>
              </span>
            </p>
          </div>
        </motion.div>
      </div>
  
      {/* Logout Button with premium effect */}
      <div className="text-center mt-12">
        <motion.button
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 25px rgba(239, 68, 68, 0.4)"
          }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="relative overflow-hidden bg-gradient-to-br from-red-600 to-rose-600 text-white px-8 py-3.5 rounded-full font-semibold shadow-xl hover:shadow-red-500/30 transition-all duration-300 group"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </span>
          <span className="absolute inset-0 bg-gradient-to-br from-red-500 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        </motion.button>
      </div>
    </motion.div>
  
    {/* Add these keyframes to your global CSS */}
    <style jsx global>{`
      @keyframes float {
        0%, 100% { transform: translateY(0) translateX(0); }
        50% { transform: translateY(-20px) translateX(10px); }
      }
      @keyframes float-reverse {
        0%, 100% { transform: translateY(0) translateX(0); }
        50% { transform: translateY(20px) translateX(-10px); }
      }
      @keyframes twinkle {
        0%, 100% { opacity: 0.2; }
        50% { opacity: 0.8; }
      }
    `}</style>
  </div>
  );
}
