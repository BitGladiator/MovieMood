import React, { useEffect, useState } from "react";
import { auth, logout, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";
import { FaFilm, FaStar, FaSignOutAlt, FaEnvelope } from "react-icons/fa";
import { GiFilmSpool } from "react-icons/gi";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [diaryCount, setDiaryCount] = useState(0);
  const [watchLaterCount, setWatchLaterCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Enhanced user data handling with better fallbacks
        setUser({
          name: currentUser.displayName || currentUser.email.split('@')[0] || "Cinephile",
          email: currentUser.email,
          uid: currentUser.uid,
          avatar:
            currentUser.photoURL ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              currentUser.displayName || currentUser.email.split('@')[0] || "CF"
            )}&background=1a1a2e&color=fff&size=256`,
        });

        try {
          const [diarySnapshot, watchSnapshot] = await Promise.all([
            getDocs(query(collection(db, "diary"), where("uid", "==", currentUser.uid))),
            getDocs(query(collection(db, "watchLater"), where("uid", "==", currentUser.uid)))
          ]);
          
          setDiaryCount(diarySnapshot.size);
          setWatchLaterCount(watchSnapshot.size);
        } catch (error) {
          console.error("Error fetching counts:", error);
        }
      } else {
        navigate("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="relative mx-auto w-24 h-24 mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-xl opacity-20 animate-pulse"></div>
            <div className="relative flex items-center justify-center w-full h-full">
              <GiFilmSpool className="w-12 h-12 text-purple-400 animate-spin-slow" />
            </div>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 text-transparent bg-clip-text">
            Loading Your Cinematic Profile
          </h2>
          <p className="mt-2 text-gray-400">Preparing the red carpet...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white px-4 py-12 relative overflow-hidden">
      {/* Animated gradient background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[1200px] h-[1200px] bg-gradient-to-br from-purple-900/20 via-indigo-900/10 to-transparent blur-[150px] rounded-full -top-1/2 -left-1/4 animate-float-slow"></div>
        <div className="absolute w-[800px] h-[800px] bg-gradient-to-br from-amber-900/10 via-rose-900/10 to-transparent blur-[120px] rounded-full -bottom-1/4 -right-1/4 animate-float-reverse-slow"></div>
      </div>

      {/* Glowing particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0] }}
            transition={{
              duration: 3 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              boxShadow: `0 0 ${Math.random() * 10 + 5}px ${Math.random() * 5 + 2}px rgba(255, 255, 255, 0.5)`
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-2xl mx-auto relative z-10 bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 shadow-2xl shadow-purple-500/20 rounded-3xl p-8 sm:p-10 overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/10 rounded-full filter blur-xl"></div>
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-indigo-500/10 rounded-full filter blur-xl"></div>
        
        {/* Avatar with floating effect and halo */}
        <motion.div
          whileHover={{ y: -8 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="flex justify-center mb-8 relative"
        >
          <div className="absolute inset-0 mx-auto w-32 h-32 bg-purple-500/30 blur-2xl rounded-full animate-pulse"></div>
          <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300"></div>
          <img
            src={user.avatar}
            alt="avatar"
            className="w-28 h-28 rounded-full border-4 border-indigo-400/80 shadow-2xl shadow-purple-500/30 z-10 relative object-cover"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=1a1a2e&color=fff&size=256`;
            }}
          />
          <motion.div 
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-20 flex items-center gap-1"
            whileHover={{ scale: 1.05 }}
          >
            <FaStar className="text-amber-300" />
            <span>PREMIUM</span>
          </motion.div>
        </motion.div>

        {/* User Info with enhanced typography */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-10"
        >
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 text-transparent bg-clip-text mb-3">
            {user.name}
          </h2>
          <div className="flex items-center justify-center gap-2 bg-gray-800/50 rounded-full py-1.5 px-4 w-fit mx-auto border border-gray-700/50">
            <FaEnvelope className="text-gray-400 text-sm" />
            <p className="text-gray-400 text-sm">{user.email}</p>
          </div>
        </motion.div>

        {/* Stats with 3D card effect and animations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="relative p-6 rounded-2xl bg-gradient-to-br from-indigo-900/50 to-indigo-900/20 border border-indigo-500/30 backdrop-blur-sm shadow-lg overflow-hidden group"
          >
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-indigo-500/10 rounded-full filter blur-lg"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-indigo-600/30 rounded-lg backdrop-blur-sm">
                  <FaFilm className="text-indigo-300 text-xl" />
                </div>
                <h3 className="text-lg font-semibold text-indigo-100">Movie Diary</h3>
              </div>
              <motion.p 
                className="text-indigo-200 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Your cinematic journey
                <motion.span 
                  className="block text-4xl font-bold text-white mt-2"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {diaryCount}
                  <span className="text-xl font-normal text-indigo-300 ml-1.5">
                    {diaryCount === 1 ? "entry" : "entries"}
                  </span>
                </motion.span>
              </motion.p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="relative p-6 rounded-2xl bg-gradient-to-br from-amber-900/40 to-amber-900/20 border border-amber-500/30 backdrop-blur-sm shadow-lg overflow-hidden group"
          >
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-amber-500/10 rounded-full filter blur-lg"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-amber-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-amber-600/30 rounded-lg backdrop-blur-sm">
                  <FaStar className="text-amber-300 text-xl" />
                </div>
                <h3 className="text-lg font-semibold text-amber-100">Watchlist</h3>
              </div>
              <motion.p 
                className="text-amber-200 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                Future screenings
                <motion.span 
                  className="block text-4xl font-bold text-white mt-2"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {watchLaterCount}
                  <span className="text-xl font-normal text-amber-300 ml-1.5">
                    {watchLaterCount === 1 ? "movie" : "movies"}
                  </span>
                </motion.span>
              </motion.p>
            </div>
          </motion.div>
        </div>

        {/* Logout Button with premium effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
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
              <FaSignOutAlt className="w-4 h-4" />
              Logout
            </span>
            <span className="absolute inset-0 bg-gradient-to-br from-red-500 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Add these keyframes to your global CSS */}
      <style jsx global>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-30px) translateX(20px); }
        }
        @keyframes float-reverse-slow {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(30px) translateX(-20px); }
        }
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}