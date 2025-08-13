import React, { useEffect, useState } from "react";
import { auth, logout, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { FaFilm, FaStar, FaSignOutAlt, FaEnvelope, FaCrown } from "react-icons/fa";
import { GiFilmSpool, GiSparkles } from "react-icons/gi";
import { IoMdSettings } from "react-icons/io";
import { RiVipCrownFill } from "react-icons/ri";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [diaryCount, setDiaryCount] = useState(0);
  const [watchLaterCount, setWatchLaterCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser({
          name: currentUser.displayName || currentUser.email.split('@')[0] || "Cinephile",
          email: currentUser.email,
          uid: currentUser.uid,
          avatar:
            currentUser.photoURL ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              currentUser.displayName || currentUser.email.split('@')[0] || "CF"
            )}&background=1a1a2e&color=fff&size=256`,
          joinDate: new Date(currentUser.metadata.creationTime).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          premium: true // Assuming premium status
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
          <div className="relative mx-auto w-32 h-32 mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-xl opacity-30 animate-pulse"></div>
            <div className="relative flex items-center justify-center w-full h-full">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-t-2 border-b-2 border-purple-500/30"
              ></motion.div>
              <GiFilmSpool className="w-16 h-16 text-purple-400" />
            </div>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 text-transparent bg-clip-text">
            Loading Your Profile
          </h2>
          <p className="mt-3 text-gray-400 max-w-md mx-auto">
            Preparing an exclusive cinematic experience just for you...
          </p>
          <motion.div 
            className="mt-6 h-1.5 bg-gray-800 rounded-full overflow-hidden max-w-xs mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            ></motion.div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white relative overflow-hidden">
      {/* Luxury background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Animated gradient mesh */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className="absolute w-[1500px] h-[1500px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/30 via-transparent to-transparent -top-1/2 -left-1/2 animate-float-slow"></div>
          <div className="absolute w-[1200px] h-[1200px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/20 via-transparent to-transparent -bottom-1/3 -right-1/3 animate-float-reverse-slow"></div>
        </div>

        {/* Floating particles */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            initial={{
              opacity: 0,
              scale: 0.5,
              x: Math.random() * 100,
              y: Math.random() * 100
            }}
            animate={{
              opacity: [0, 0.8, 0],
              scale: [0.5, 1.2, 0.5],
              x: Math.random() * 100,
              y: Math.random() * 100
            }}
            transition={{
              duration: 10 + Math.random() * 20,
              repeat: Infinity,
              repeatType: "reverse",
              delay: Math.random() * 5
            }}
            style={{
              width: `${Math.random() * 5 + 2}px`,
              height: `${Math.random() * 5 + 2}px`,
              background: `rgba(255, 255, 255, ${Math.random() * 0.5})`,
              boxShadow: `0 0 ${Math.random() * 15 + 5}px ${Math.random() * 5 + 2}px rgba(255, 255, 255, 0.5)`
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Profile header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-col items-center mb-12"
        >
          {/* Avatar with floating effect and halo */}
          <motion.div
            whileHover={{ y: -8 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative mb-6 group"
          >
            <div className="absolute inset-0 mx-auto w-40 h-40 bg-gradient-to-r from-purple-600 to-pink-600 blur-2xl rounded-full opacity-30 animate-pulse"></div>
            <div className="relative z-10">
              <img
                src={user.avatar}
                alt="avatar"
                className="w-32 h-32 rounded-full border-4 border-white/20 shadow-2xl shadow-purple-500/30 z-10 relative object-cover transition-all duration-300 group-hover:border-purple-400/50"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=1a1a2e&color=fff&size=256`;
                }}
              />
              <motion.div 
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-yellow-500 text-gray-900 text-xs font-bold px-4 py-1.5 rounded-full shadow-lg z-20 flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <RiVipCrownFill className="text-yellow-700" />
                <span>PREMIUM MEMBER</span>
              </motion.div>
            </div>
          </motion.div>

          {/* User Info */}
          <div className="text-center">
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-300 via-pink-300 to-amber-300 text-transparent bg-clip-text mb-4">
              {user.name}
            </h1>
            <div className="flex items-center justify-center gap-3">
              <div className="flex items-center gap-2 bg-gray-900/50 rounded-full py-2 px-4 border border-gray-800/50 backdrop-blur-sm">
                <FaEnvelope className="text-gray-400 text-sm" />
                <p className="text-gray-300 text-sm">{user.email}</p>
              </div>
              <div className="flex items-center gap-2 bg-gray-900/50 rounded-full py-2 px-4 border border-gray-800/50 backdrop-blur-sm">
                <GiSparkles className="text-amber-400 text-sm" />
                <p className="text-gray-300 text-sm">Member since {user.joinDate}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation tabs */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex bg-gray-900/80 backdrop-blur-sm rounded-full p-1.5 border border-gray-800/50 shadow-lg">
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                activeTab === "profile"
                  ? "bg-gradient-to-r from-purple-600/80 to-pink-600/80 text-white shadow-purple-500/20"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <span>Profile</span>
            </button>
            <button
              onClick={() => setActiveTab("stats")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                activeTab === "stats"
                  ? "bg-gradient-to-r from-purple-600/80 to-pink-600/80 text-white shadow-purple-500/20"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <span>Stats</span>
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                activeTab === "settings"
                  ? "bg-gradient-to-r from-purple-600/80 to-pink-600/80 text-white shadow-purple-500/20"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <IoMdSettings />
              <span>Settings</span>
            </button>
          </div>
        </motion.div> */}

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Stats cards */}
            <motion.div
              whileHover={{ y: -5 }}
              onHoverStart={() => setHoveredCard("diary")}
              onHoverEnd={() => setHoveredCard(null)}
              className={`relative rounded-2xl overflow-hidden border ${
                hoveredCard === "diary" ? "border-purple-500/50" : "border-gray-800/50"
              } transition-all duration-300`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-gray-900/80 backdrop-blur-sm"></div>
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
              <div className="relative z-10 p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-purple-600/20 rounded-lg backdrop-blur-sm border border-purple-500/20">
                    <FaFilm className="text-purple-300 text-xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-purple-100">Movie Diary</h3>
                </div>
                <div className="mb-4">
                  <p className="text-purple-200/80 text-sm mb-1">Your cinematic journey</p>
                  <p className="text-5xl font-bold text-white">
                    {diaryCount}
                    <span className="text-xl font-normal text-purple-300/80 ml-2">
                      {diaryCount === 1 ? "entry" : "entries"}
                    </span>
                  </p>
                </div>
                <div className="h-1.5 bg-gray-800/50 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(diaryCount, 100)}%` }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                  ></motion.div>
                </div>
              </div>
              {hoveredCard === "diary" && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                ></motion.div>
              )}
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              onHoverStart={() => setHoveredCard("watchlist")}
              onHoverEnd={() => setHoveredCard(null)}
              className={`relative rounded-2xl overflow-hidden border ${
                hoveredCard === "watchlist" ? "border-amber-500/50" : "border-gray-800/50"
              } transition-all duration-300`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 to-gray-900/80 backdrop-blur-sm"></div>
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
              <div className="relative z-10 p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-amber-600/20 rounded-lg backdrop-blur-sm border border-amber-500/20">
                    <FaStar className="text-amber-300 text-xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-amber-100">Watchlist</h3>
                </div>
                <div className="mb-4">
                  <p className="text-amber-200/80 text-sm mb-1">Future screenings</p>
                  <p className="text-5xl font-bold text-white">
                    {watchLaterCount}
                    <span className="text-xl font-normal text-amber-300/80 ml-2">
                      {watchLaterCount === 1 ? "movie" : "movies"}
                    </span>
                  </p>
                </div>
                <div className="h-1.5 bg-gray-800/50 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(watchLaterCount, 100)}%` }}
                    transition={{ duration: 1.5, delay: 0.7 }}
                  ></motion.div>
                </div>
              </div>
              {hoveredCard === "watchlist" && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-amber-600/10 to-orange-600/10 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                ></motion.div>
              )}
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              onHoverStart={() => setHoveredCard("premium")}
              onHoverEnd={() => setHoveredCard(null)}
              className={`relative rounded-2xl overflow-hidden border ${
                hoveredCard === "premium" ? "border-blue-500/50" : "border-gray-800/50"
              } transition-all duration-300`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-gray-900/80 backdrop-blur-sm"></div>
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
              <div className="relative z-10 p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-blue-600/20 rounded-lg backdrop-blur-sm border border-blue-500/20">
                    <FaCrown className="text-blue-300 text-xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-blue-100">Premium Status</h3>
                </div>
                <div className="mb-4">
                  <p className="text-blue-200/80 text-sm mb-1">Exclusive benefits</p>
                  <p className="text-5xl font-bold text-white">
                    Active
                    <span className="text-xl font-normal text-blue-300/80 ml-2">
                      {user.premium ? "VIP" : "Basic"}
                    </span>
                  </p>
                </div>
                <div className="h-1.5 bg-gray-800/50 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.5, delay: 0.9 }}
                  ></motion.div>
                </div>
              </div>
              {hoveredCard === "premium" && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-cyan-600/10 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                ></motion.div>
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex justify-center gap-4 mt-16"
        >
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 0 25px rgba(139, 92, 246, 0.4)"
            }}
            onClick={()=> navigate('/pricing')}
            whileTap={{ scale: 0.95 }}
            className="relative overflow-hidden bg-gradient-to-br from-purple-600 to-pink-600 text-white px-8 py-3.5 rounded-full font-semibold shadow-xl hover:shadow-purple-500/30 transition-all duration-300 group flex items-center gap-2"
          >
            <span className="relative z-10">Upgrade Plan</span>
            <RiVipCrownFill className="relative z-10" />
            <span className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </motion.button>

          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 0 25px rgba(239, 68, 68, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 text-white px-8 py-3.5 rounded-full font-semibold shadow-xl hover:shadow-gray-500/20 transition-all duration-300 group flex items-center gap-2 border border-gray-700/50"
          >
            <span className="relative z-10">Logout</span>
            <FaSignOutAlt className="relative z-10" />
            <span className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </motion.button>
        </motion.div>
      </div>

      {/* Floating decorative elements */}
      <div className="fixed top-1/4 left-10 -translate-y-1/2 w-40 h-40 bg-purple-600/10 rounded-full filter blur-3xl opacity-30 animate-float-slow z-0"></div>
      <div className="fixed bottom-1/3 right-10 translate-y-1/2 w-60 h-60 bg-amber-600/10 rounded-full filter blur-3xl opacity-30 animate-float-reverse-slow z-0"></div>
    </div>
  );
}