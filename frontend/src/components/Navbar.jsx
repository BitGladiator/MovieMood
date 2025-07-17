import { Link, NavLink } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import logo from "../images/logo.png";

export default function Navbar() {
  const [showModal, setShowModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [surpriseMovie, setSurpriseMovie] = useState(null);
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("diary") || "[]");
    if (stored.length) {
      const random = stored[Math.floor(Math.random() * stored.length)];
      setSurpriseMovie(random);
    }
  }, [showModal]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.nav 
      className={`w-full px-6 py-3 backdrop-blur-xl flex items-center justify-between flex-wrap sticky top-0 z-50 transition-all duration-500 ${
        scrolled 
          ? "bg-gray-900/90 border-b border-gray-800/50 shadow-2xl" 
          : "bg-transparent border-b border-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3 group">
        <motion.div 
          className="relative"
          whileHover={{ rotate: 10 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <img
            src={logo}
            alt="MovieMood Logo"
            className="w-10 h-10 rounded-full border-2 border-purple-500/80 shadow-lg shadow-purple-500/30 transition-all duration-500"
          />
          <motion.div 
            className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-purple-400/50"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0, 0.5, 0]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
        <motion.span 
          className="text-2xl md:text-3xl font-bold tracking-tight uppercase bg-gradient-to-r from-amber-400 via-pink-500 to-violet-500 text-transparent bg-clip-text"
          whileHover={{ 
            textShadow: "0 0 10px rgba(236, 72, 153, 0.7)",
            transition: { duration: 0.3 }
          }}
        >
          MovieMood
        </motion.span>
      </Link>

      {/* Navigation Menu */}
      <div
        ref={menuRef}
        className={`${menuOpen ? "flex animate-fadeIn" : "hidden"} 
        absolute md:static top-16 left-1/2 -translate-x-1/2 md:translate-x-0 md:flex 
        md:items-center md:gap-4 w-[calc(100%-3rem)] md:w-auto 
        bg-gray-900/95 md:bg-transparent p-5 md:p-0 rounded-2xl md:rounded-none 
        border border-gray-800/50 md:border-none shadow-2xl md:shadow-none 
        flex-col md:flex-row transition-all duration-300 z-40`}
      >
        {(user
          ? [
              { path: "/dashboard", name: "Dashboard", icon: "📊" },
              { path: "/finder", name: "Finder", icon: "🔍" },
              { path: "/diary", name: "Diary", icon: "📔" },
              { path: "/stats", name: "Stats", icon: "📈" },
              { path: "/watchlater", name: "Watch Later", icon: "⏱️" },
            ]
          : [
              { path: "/", name: "Home", icon: "🏠" },
              { path: "/features", name: "Features", icon: "✨" },
              { path: "/how-it-works", name: "How It Works", icon: "⚙️" },
            ]
        ).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2.5 md:py-1.5 rounded-lg transition-all 
              duration-300 hover:bg-gray-800/50 hover:shadow-lg text-sm md:text-[0.95rem] 
              ${
                isActive
                  ? "text-white bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-l-4 md:border-l-0 md:border-b-2 border-purple-500 shadow-purple-500/10 font-medium"
                  : "text-gray-300 hover:text-white"
              }`
            }
            onClick={() => setMenuOpen(false)}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-3">
        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden relative w-9 h-9 flex items-center justify-center rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-300 group"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <motion.div
            className={`absolute w-5 h-[2px] bg-white transition-all duration-300 ${
              menuOpen ? "rotate-45 translate-y-0" : "-translate-y-1.5"
            }`}
            animate={{
              backgroundColor: menuOpen ? "#ec4899" : "#ffffff"
            }}
          />
          <motion.div
            className={`absolute w-5 h-[2px] bg-white transition-all duration-300 ${
              menuOpen ? "opacity-0 scale-0" : "opacity-100 scale-100"
            }`}
            animate={{
              backgroundColor: menuOpen ? "#ec4899" : "#ffffff"
            }}
          />
          <motion.div
            className={`absolute w-5 h-[2px] bg-white transition-all duration-300 ${
              menuOpen ? "-rotate-45 translate-y-0" : "translate-y-1.5"
            }`}
            animate={{
              backgroundColor: menuOpen ? "#ec4899" : "#ffffff"
            }}
          />
          <motion.div 
            className="absolute inset-0 rounded-lg border border-transparent group-hover:border-pink-500/30"
            animate={{
              scale: menuOpen ? 1.1 : 1,
              borderColor: menuOpen ? "rgba(236, 72, 153, 0.3)" : "transparent"
            }}
            transition={{ type: "spring", stiffness: 500 }}
          />
        </button>

        {!user ? (
          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/login"
              className="relative overflow-hidden text-sm text-indigo-300 hover:text-white px-4 py-1.5 rounded-lg transition-all duration-300 hover:bg-indigo-500/10 hover:shadow-[0_0_10px_rgba(99,102,241,0.2)] group"
            >
              <span className="relative z-10">Login</span>
              <motion.span 
                className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-indigo-600/10 opacity-0 group-hover:opacity-100"
                initial={{ x: -100 }}
                whileHover={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
              />
            </Link>
            <Link
              to="/register"
              className="relative overflow-hidden text-sm text-white px-4 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 hover:shadow-[0_0_10px_rgba(16,185,129,0.4)] group"
            >
              <span className="relative z-10">Register</span>
              <motion.span 
                className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100"
                initial={{ x: -100 }}
                whileHover={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
              />
            </Link>
          </div>
        ) : (
          <div className="relative group">
            <Link to="/profile" className="block">
              <motion.div 
                className="w-9 h-9 rounded-full border-2 border-indigo-500/70 hover:border-pink-400 transition-all duration-300 shadow-lg hover:shadow-pink-500/20 overflow-hidden"
                whileHover={{ scale: 1.05 }}
              >
                <img
                  src={
                    user.photoURL ||
                    "https://img.icons8.com/fluency-systems-filled/48/user-male-circle.png"
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </Link>
            <motion.div 
              className="absolute right-0 top-full mt-2 w-48 bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-800/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 z-50 overflow-hidden"
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: 0,
                y: 10,
                transition: { duration: 0 }
              }}
            >
              <Link
                to="/profile"
                className="block px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800/50 hover:text-white transition-colors border-b border-gray-800/50"
              >
                <span className="text-pink-400 mr-2">👤</span> Profile
              </Link>
              <Link
                to="/settings"
                className="block px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800/50 hover:text-white transition-colors"
              >
                <span className="text-blue-400 mr-2">⚙️</span> Settings
              </Link>
            </motion.div>
          </div>
        )}

        {/* Surprise Me Button (Visible only when logged in) */}
        {user && (
          <div className="hidden md:block">
            <motion.button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:shadow-[0_0_15px_rgba(192,38,211,0.4)] flex items-center gap-2 group relative overflow-hidden"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10">🎲 Surprise Me</span>
              <motion.span 
                className="absolute inset-0 bg-gradient-to-r from-pink-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100"
                initial={{ x: -100 }}
                whileHover={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
              />
            </motion.button>
          </div>
        )}
      </div>

      {/* Mobile Buttons */}
      {menuOpen && (
        <motion.div 
          className="block md:hidden w-full mt-4 space-y-3"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          {!user && (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block w-full bg-indigo-600/90 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all duration-300 shadow-lg hover:shadow-indigo-500/30 flex items-center justify-center gap-2"
              >
                <span>🔑</span>
                <span>Login</span>
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="block w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-emerald-500/30 flex items-center justify-center gap-2"
              >
                <span>✨</span>
                <span>Register</span>
              </Link>
            </>
          )}
          {user && (
            <button
              onClick={() => {
                setShowModal(true);
                setMenuOpen(false);
              }}
              className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/30 flex items-center justify-center gap-2"
            >
              <span>🎲</span>
              <span>Surprise Me</span>
            </button>
          )}
        </motion.div>
      )}

      {/* Premium Surprise Modal */}
      <AnimatePresence>
        {showModal && surpriseMovie && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-2xl flex items-center justify-center z-[999] p-4 mt-[20rem]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="relative flex flex-col md:flex-row gap-0 bg-gray-900 text-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-800/50"
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Glowing background effect */}
              <motion.div 
                className="absolute inset-0 opacity-20"
                initial={{ background: "radial-gradient(circle at center, rgba(139, 92, 246, 0.2) 0%, transparent 70%)" }}
                animate={{
                  background: [
                    "radial-gradient(circle at center, rgba(139, 92, 246, 0.2) 0%, transparent 70%)",
                    "radial-gradient(circle at center, rgba(236, 72, 153, 0.2) 0%, transparent 70%)",
                    "radial-gradient(circle at center, rgba(139, 92, 246, 0.2) 0%, transparent 70%)"
                  ]
                }}
                transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
              />

              {/* Close button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl cursor-pointer transition-colors duration-300 z-10 bg-gray-800/80 rounded-full w-8 h-8 flex items-center justify-center border border-gray-700/50"
              >
                &times;
              </button>

              {/* Movie Poster */}
              <div className="w-full md:w-2/5 h-64 md:h-auto min-h-[300px] bg-gray-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
                <img
                  src={
                    surpriseMovie?.Poster !== "N/A"
                      ? surpriseMovie?.Poster
                      : "/no-poster.png"
                  }
                  alt={surpriseMovie?.Title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 p-6 w-full z-20">
                  <h3 className="text-2xl font-bold text-white drop-shadow-lg">
                    {surpriseMovie?.Title}
                  </h3>
                  <p className="text-gray-300 text-sm">{surpriseMovie?.Year}</p>
                </div>
              </div>

              {/* Movie Details */}
              <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col overflow-y-auto">
                <motion.h2 
                  className="text-2xl font-bold mb-4 bg-gradient-to-r from-amber-300 via-pink-400 to-violet-400 text-transparent bg-clip-text"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  🎉 Your Surprise Pick!
                </motion.h2>

                <motion.div 
                  className="flex flex-wrap gap-2 mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="px-3 py-1 bg-purple-900/50 text-purple-300 rounded-full text-xs font-medium backdrop-blur-sm">
                    ⭐ {surpriseMovie?.imdbRating || "N/A"} IMDb
                  </span>
                  <span className="px-3 py-1 bg-blue-900/50 text-blue-300 rounded-full text-xs font-medium backdrop-blur-sm">
                    🎭 {surpriseMovie?.Genre?.split(",")[0] || "N/A"}
                  </span>
                  <span className="px-3 py-1 bg-emerald-900/50 text-emerald-300 rounded-full text-xs font-medium backdrop-blur-sm">
                    ⏱️ {surpriseMovie?.Runtime || "N/A"}
                  </span>
                </motion.div>

                <motion.div 
                  className="space-y-4 mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div>
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                      Plot
                    </h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {surpriseMovie?.Plot || "No plot available."}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                        Director
                      </h4>
                      <p className="text-white text-sm">
                        {surpriseMovie?.Director || "N/A"}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                        Actors
                      </h4>
                      <p className="text-white text-sm">
                        {surpriseMovie?.Actors?.split(",")
                          .slice(0, 3)
                          .join(", ") || "N/A"}
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-center gap-3 mt-auto pt-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.button 
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2.5 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>➕</span>
                    <span>Watchlist</span>
                  </motion.button>
                  <motion.button 
                    className="flex-1 bg-gray-800/50 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-gray-700/50 transition-all duration-300 flex items-center justify-center gap-2 text-sm border border-gray-700/50 backdrop-blur-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>🎬</span>
                    <span>Similar</span>
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}