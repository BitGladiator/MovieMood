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
    navigate("/login");
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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white px-4 py-12 relative overflow-hidden">
      {/* Glowing light */}
      <div className="absolute w-96 h-96 bg-purple-500 blur-[150px] opacity-20 rounded-full top-20 left-1/2 -translate-x-1/2 pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-2xl mx-auto relative z-10 bg-white/5 backdrop-blur-lg border border-white/10 shadow-2xl rounded-3xl p-10"
      >
        {/* Avatar */}
        <motion.div
          whileHover={{ y: -4, scale: 1.05 }}
          className="flex justify-center mb-6"
        >
          <img
            src={user.avatar}
            alt="avatar"
            className="w-28 h-28 rounded-full border-4 border-indigo-500 shadow-lg"
          />
        </motion.div>

        {/* User Info */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-extrabold text-center text-indigo-200 mb-2"
        >
          {user.name}
        </motion.h2>
        <p className="text-center text-gray-400 text-sm">{user.email}</p>

        {/* Stats */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="p-6 rounded-xl bg-indigo-800/40 border border-indigo-400/20 backdrop-blur-xl shadow-xl"
          >
            <h3 className="text-lg font-semibold text-indigo-100">🎬 Diary</h3>
            <p className="mt-2 text-indigo-200 text-sm">
              You've logged{" "}
              <span className="text-white text-lg font-bold">
                {diaryCount}
              </span>{" "}
              movie{diaryCount !== 1 && "s"}.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="p-6 rounded-xl bg-yellow-800/30 border border-yellow-400/20 backdrop-blur-xl shadow-xl"
          >
            <h3 className="text-lg font-semibold text-yellow-100">⭐ Watch Later</h3>
            <p className="mt-2 text-yellow-200 text-sm">
              <span className="text-white text-lg font-bold">
                {watchLaterCount}
              </span>{" "}
              movie{watchLaterCount !== 1 && "s"} saved.
            </p>
          </motion.div>
        </div>

        {/* Logout Button */}
        <div className="text-center mt-10">
          <motion.button
            whileHover={{
              scale: 1.05,
              backgroundColor: "#ff4d4d",
              boxShadow: "0 0 20px rgba(255, 77, 77, 0.6)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 transition-all cursor-pointer text-white px-8 py-3 rounded-full font-semibold shadow-lg"
          >
             Logout
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
