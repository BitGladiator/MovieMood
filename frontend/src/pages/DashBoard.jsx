import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaHeart, FaStar, FaFilm } from "react-icons/fa";
import { FiClock, FiTrendingUp, FiFilm } from "react-icons/fi";
import { auth, db, logout } from "../firebase";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit
} from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [user, setUser] = useState({
    name: "",
    email: "",
    avatar: "https://img.icons8.com/fluency-systems-filled/96/user-male-circle.png"
  });

  const [stats, setStats] = useState({
    diaryCount: 0,
    watchLaterCount: 0,
    recentlyAdded: [],
    topRated: [],
    monthlyActivity: Array(12).fill(0)
  });

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate("/login");
        return;
      }

      try {
        // Set basic user info
        setUser({
          uid: currentUser.uid,
          name: currentUser.displayName || currentUser.email.split('@')[0] || "Movie Buff",
          email: currentUser.email,
          avatar: currentUser.photoURL || "https://img.icons8.com/fluency-systems-filled/96/user-male-circle.png"
        });

        // Fetch basic counts
        const [diarySnapshot, watchSnapshot] = await Promise.all([
          getDocs(query(collection(db, "diary"), where("uid", "==", currentUser.uid))),
          getDocs(query(collection(db, "watchLater"), where("uid", "==", currentUser.uid)))
        ]);

        // Calculate monthly activity
        const monthlyCounts = Array(12).fill(0);
        const now = new Date();
        
        diarySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.dateWatched) {
            const watchedDate = new Date(data.dateWatched);
            const monthDiff = (now.getFullYear() - watchedDate.getFullYear()) * 12 + 
                             now.getMonth() - watchedDate.getMonth();
            if (monthDiff >= 0 && monthDiff < 12) {
              monthlyCounts[11 - monthDiff]++;
            }
          }
        });

        // Fetch recent and top-rated movies (with error handling)
        let recentMovies = [];
        let topRatedMovies = [];
        
        try {
          const recentQuery = query(
            collection(db, "diary"),
            where("uid", "==", currentUser.uid),
            orderBy("dateWatched", "desc"),
            limit(4)
          );
          const recentSnapshot = await getDocs(recentQuery);
          recentMovies = recentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
          console.warn("Error fetching recent movies:", error);
          toast.warning("Couldn't load recent movies. Create the index in Firebase Console.");
        }

        try {
          const topRatedQuery = query(
            collection(db, "diary"),
            where("uid", "==", currentUser.uid),
            where("rating", ">=", 4),
            orderBy("rating", "desc"),
            limit(4)
          );
          const topRatedSnapshot = await getDocs(topRatedQuery);
          topRatedMovies = topRatedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
          console.warn("Error fetching top-rated movies:", error);
          toast.warning("Couldn't load top-rated movies. Create the index in Firebase Console.");
        }

        setStats({
          diaryCount: diarySnapshot.size,
          watchLaterCount: watchSnapshot.size,
          recentlyAdded: recentMovies,
          topRated: topRatedMovies,
          monthlyActivity: monthlyCounts
        });

      } catch (error) {
        console.error("Dashboard error:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Logout failed");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="relative mx-auto w-24 h-24 mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
            <div className="relative flex items-center justify-center w-full h-full">
              <FaFilm className="w-12 h-12 text-purple-400 animate-bounce" />
            </div>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 text-transparent bg-clip-text">
            Curating Your Cinema Universe
          </h2>
          <p className="mt-2 text-gray-400">Loading your personalized dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-x-hidden relative">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[1200px] h-[1200px] bg-gradient-to-br from-purple-900/20 via-indigo-900/10 to-transparent blur-[150px] rounded-full -top-1/2 -left-1/4 animate-float-slow"></div>
        <div className="absolute w-[800px] h-[800px] bg-gradient-to-br from-amber-900/10 via-rose-900/10 to-transparent blur-[120px] rounded-full -bottom-1/4 -right-1/4 animate-float-reverse-slow"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header with user profile */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16"
        >
          <div>
            <motion.h1 
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-amber-300 text-transparent bg-clip-text mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Welcome back, <span className="text-white">{user.name}</span>
            </motion.h1>
            <p className="text-gray-400 text-lg max-w-2xl">
              Your personal film curator is ready. Let's explore your cinematic universe.
            </p>
          </div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 shadow-lg relative overflow-hidden"
          >
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-md opacity-20"></div>
              <img
                src={user.avatar}
                alt="User avatar"
                className="w-14 h-14 rounded-full border-2 border-purple-400/50 relative z-10 object-cover"
                onError={(e) => {
                  e.target.src = "https://img.icons8.com/fluency-systems-filled/96/user-male-circle.png";
                }}
              />
            </div>
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-gray-400">{user.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs px-2 py-0.5 bg-purple-600/30 text-purple-300 rounded-full border border-purple-500/30">
                  PRO MEMBER
                </span>
                <span className="text-xs px-2 py-0.5 bg-amber-600/30 text-amber-300 rounded-full border border-amber-500/30">
                  FILM CRITIC
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Navigation tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex overflow-x-auto pb-2 mb-8 scrollbar-hide"
        >
          <div className="flex space-x-2">
            {["overview", "diary", "watchlist", "stats", "achievements"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? "bg-purple-600 text-white shadow-purple-500/30"
                    : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Dashboard content */}
        <div className="space-y-12">
          {/* Stats overview */}
          {activeTab === "overview" && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <FiTrendingUp className="text-purple-400" />
                  Your Film Journey at a Glance
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Diary count */}
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 shadow-lg overflow-hidden relative group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-purple-600/20 rounded-lg group-hover:bg-purple-600/40 transition-colors">
                        <FiFilm className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Movies Logged</p>
                        <p className="text-3xl font-bold mt-1">
                          {stats.diaryCount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Watch later */}
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 shadow-lg overflow-hidden relative group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-amber-600/20 rounded-lg group-hover:bg-amber-600/40 transition-colors">
                        <FiClock className="w-6 h-6 text-amber-400" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Watchlist</p>
                        <p className="text-3xl font-bold mt-1">
                          {stats.watchLaterCount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Top rated */}
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 shadow-lg overflow-hidden relative group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-rose-600/20 rounded-lg group-hover:bg-rose-600/40 transition-colors">
                        <FaStar className="w-6 h-6 text-rose-400" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Top Rated</p>
                        <p className="text-3xl font-bold mt-1">
                          {stats.topRated.length.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Activity */}
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 shadow-lg overflow-hidden relative group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-600/20 rounded-lg group-hover:bg-blue-600/40 transition-colors">
                        <FaHeart className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Monthly Activity</p>
                        <p className="text-3xl font-bold mt-1">
                          {stats.monthlyActivity.reduce((a, b) => a + b, 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Recently added */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <FiFilm className="text-purple-400" />
                    Recently Added to Your Diary
                  </h2>
                  <button 
                    className="text-sm text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
                    onClick={() => setActiveTab("diary")}
                  >
                    View all
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {stats.recentlyAdded.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.recentlyAdded.map((movie, index) => (
                      <motion.div
                        key={movie.id || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        whileHover={{ y: -8, scale: 1.02 }}
                        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden shadow-lg group relative"
                      >
                        <div className="h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative overflow-hidden">
                          {movie.poster ? (
                            <img 
                              src={`https://image.tmdb.org/t/p/w500${movie.poster}`}
                              alt={movie.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              onError={(e) => {
                                e.target.src = "";
                                e.target.parentElement.classList.add("text-gray-500", "text-center", "p-4");
                                e.target.parentElement.innerHTML = `
                                  <FiFilm className="w-12 h-12 mx-auto mb-2" />
                                  <p>Poster unavailable</p>
                                `;
                              }}
                            />
                          ) : (
                            <div className="text-gray-500 text-center p-4">
                              <FiFilm className="w-12 h-12 mx-auto mb-2" />
                              <p>No poster available</p>
                            </div>
                          )}
                        </div>
                        <div className="p-5">
                          <h3 className="font-bold text-lg mb-1 line-clamp-1">{movie.title || "Untitled Movie"}</h3>
                          <div className="flex items-center justify-between text-sm text-gray-400">
                            <span>{movie.dateWatched ? new Date(movie.dateWatched).toLocaleDateString() : "No date"}</span>
                            {movie.rating && (
                              <span className="flex items-center gap-1 font-medium text-amber-400">
                                <FaStar className="text-amber-400" />
                                {movie.rating}/5
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-8 text-center">
                    <p className="text-gray-400">Your movie diary is empty</p>
                    <button 
                      className="mt-4 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg text-sm font-medium transition-colors hover:from-purple-500 hover:to-indigo-500"
                      onClick={() => navigate("/add-movie")}
                    >
                      Add your first movie
                    </button>
                  </div>
                )}
              </motion.div>

              {/* Top rated */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <FaStar className="text-amber-400" />
                    Your Highest Rated Films
                  </h2>
                  <button 
                    className="text-sm text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1"
                    onClick={() => setActiveTab("diary")}
                  >
                    View all
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                
                {stats.topRated.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.topRated.map((movie, index) => (
                      <motion.div
                        key={movie.id || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 + index * 0.1 }}
                        whileHover={{ y: -8, scale: 1.02 }}
                        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden shadow-lg group relative"
                      >
                        {index < 3 && (
                          <div className="absolute top-4 left-4 z-20">
                            <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-amber-500 to-amber-600 rounded-full text-xs font-bold shadow-md">
                              #{index + 1}
                            </div>
                          </div>
                        )}
                        <div className="h-48 bg-gradient-to-br from-amber-900/20 to-gray-900 flex items-center justify-center relative overflow-hidden">
                          {movie.poster ? (
                            <img 
                              src={`https://image.tmdb.org/t/p/w500${movie.poster}`}
                              alt={movie.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              onError={(e) => {
                                e.target.src = "";
                                e.target.parentElement.classList.add("text-gray-500", "text-center", "p-4");
                                e.target.parentElement.innerHTML = `
                                  <FaStar className="w-12 h-12 mx-auto mb-2 text-amber-400" />
                                  <p>Poster unavailable</p>
                                `;
                              }}
                            />
                          ) : (
                            <div className="text-gray-500 text-center p-4">
                              <FaStar className="w-12 h-12 mx-auto mb-2 text-amber-400" />
                              <p>No poster available</p>
                            </div>
                          )}
                        </div>
                        <div className="p-5">
                          <h3 className="font-bold text-lg mb-1 line-clamp-1">{movie.title || "Untitled Movie"}</h3>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">
                              {movie.dateWatched ? new Date(movie.dateWatched).toLocaleDateString() : "No date"}
                            </span>
                            <span className="flex items-center gap-1 font-medium text-amber-400">
                              <FaStar className="text-amber-400" />
                              {movie.rating}/5
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-8 text-center">
                    <p className="text-gray-400">No top rated movies yet</p>
                    <p className="text-sm text-gray-500 mt-1">Rate movies 4 stars or higher to see them here</p>
                  </div>
                )}
              </motion.div>

              {/* Activity graph */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 shadow-lg"
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <FiTrendingUp className="text-blue-400" />
                  Your Movie Activity
                </h2>
                <div className="h-64">
                  <div className="flex items-end h-48 gap-1">
                    {stats.monthlyActivity.map((count, index) => {
                      const month = new Date(0, index).toLocaleString('default', { month: 'short' });
                      const maxCount = Math.max(...stats.monthlyActivity, 1); // Ensure we don't divide by zero
                      const height = `${Math.min((count / maxCount) * 100, 100)}%`;
                      return (
                        <motion.div
                          key={index}
                          initial={{ height: 0 }}
                          animate={{ height }}
                          transition={{ delay: 1.1 + index * 0.05, duration: 0.8 }}
                          className="flex-1 bg-gradient-to-t from-blue-500 to-cyan-500 rounded-t-sm relative group"
                        >
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-400">
                            {month}
                          </div>
                          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                            {count} {count === 1 ? "movie" : "movies"}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </>
          )}

          {/* Other tabs content would go here */}
          {activeTab !== "overview" && (
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-8 text-center">
              <p className="text-gray-400">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} view coming soon</p>
            </div>
          )}

          {/* Premium CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2 }}
            className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 border border-purple-500/30 rounded-2xl p-8 md:p-10 overflow-hidden relative"
          >
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-purple-600/30 border border-purple-500/50 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                <span className="text-purple-300">✨ Premium Feature</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-200 via-pink-200 to-amber-200 text-transparent bg-clip-text mb-4">
                Unlock Your Full Cinematic Experience
              </h2>
              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                Get personalized recommendations, advanced stats, and exclusive content with our Premium membership.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button className="px-8 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-full font-semibold shadow-lg hover:shadow-purple-500/30 transition-all duration-300 flex items-center justify-center gap-2">
                  Upgrade Now
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <button className="px-8 py-3.5 bg-gray-800/50 border border-gray-700 hover:bg-gray-700/50 rounded-full font-medium shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
                  Learn More
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Toast notifications */}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

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
      `}</style>
    </div>
  );
};

export default Dashboard;