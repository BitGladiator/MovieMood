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
  const menuRef = useRef();

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
    <nav className="w-full px-6 py-4 bg-gray-950/90 backdrop-blur-lg border-b border-gray-800 flex items-center justify-between flex-wrap sticky top-0 z-50 shadow-xl">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3 group">
        <div className="relative">
          <img
            src={logo}
            alt="MovieMood Logo"
            className="w-12 h-12 rounded-full border-2 border-purple-500/80 shadow-lg shadow-purple-500/20 transform group-hover:rotate-12 transition-all duration-500"
          />
        </div>
        <span className="text-3xl md:text-4xl font-extrabold tracking-tight uppercase bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-transparent bg-clip-text drop-shadow-lg group-hover:drop-shadow-[0_5px_10px_rgba(236,72,153,0.4)] transition-all duration-300">
          MovieMood
        </span>
      </Link>

      {/* Navigation Menu */}
      <div
        ref={menuRef}
        className={`${menuOpen ? "flex animate-fadeIn" : "hidden"} 
        absolute md:static top-20 left-1/2 -translate-x-1/2 md:translate-x-0 md:flex 
        md:items-center md:gap-6 w-[calc(100%-3rem)] md:w-auto 
        bg-gray-900/95 md:bg-transparent p-6 md:p-0 rounded-xl md:rounded-none 
        border border-gray-800 md:border-none shadow-2xl md:shadow-none 
        flex-col md:flex-row transition-all duration-300 z-40`}
      >
        {(user
          ? [
              { path: "/dashboard", name: "Dashboard", icon: "📊" },
              { path: "/finder", name: "Finder", icon: "🔍" },
              { path: "/diary", name: "Diary", icon: "📔" },
              { path: "/stats", name: "Stats", icon: "📊" },
              { path: "/watchlater", name: "WatchLater", icon: "⏱️" },
            ]
          : [
              { path: "/", name: "Home", icon: "🏠" },
              { path: "/features", name: "Features", icon: "✨" },
              { path: "/how-it-works", name: "How it works", icon: "⚙️" },
            ]
        ).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-3 md:py-2 rounded-lg transition-all 
            duration-300 hover:bg-gray-800/50 hover:shadow-lg text-sm md:text-base 
            ${
              isActive
                ? "text-white bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-l-4 md:border-l-0 md:border-b-2 border-purple-500 shadow-purple-500/20"
                : "text-gray-300 hover:text-white"
            }`
            }
            onClick={() => setMenuOpen(false)}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-300"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div
            className={`absolute w-6 h-0.5 bg-white transition-all duration-300 ${
              menuOpen ? "rotate-45 translate-y-0" : "-translate-y-2"
            }`}
          ></div>
          <div
            className={`absolute w-6 h-0.5 bg-white transition-all duration-300 ${
              menuOpen ? "opacity-0" : "opacity-100"
            }`}
          ></div>
          <div
            className={`absolute w-6 h-0.5 bg-white transition-all duration-300 ${
              menuOpen ? "-rotate-45 translate-y-0" : "translate-y-2"
            }`}
          ></div>
        </button>

        {!user ? (
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="relative overflow-hidden text-sm text-indigo-300 hover:text-white border border-indigo-400/50 px-5 py-2 rounded-full transition-all duration-300 hover:bg-indigo-500/10 hover:shadow-[0_0_10px_rgba(99,102,241,0.3)]"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="relative overflow-hidden text-sm text-white px-5 py-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transition-all duration-300 hover:shadow-[0_0_10px_rgba(52,211,153,0.4)]"
            >
              Register
            </Link>
          </div>
        ) : (
          <div className="relative group">
            <Link to="/profile">
              <img
                src={
                  user.avatar ||
                  "https://img.icons8.com/fluency-systems-filled/48/user-male-circle.png"
                }
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-indigo-500/80 hover:border-purple-400 transition-all duration-300 shadow-lg hover:shadow-purple-500/20"
              />
            </Link>
            <div className="absolute right-0 top-full mt-2 w-48 bg-gray-900/95 backdrop-blur-lg rounded-lg shadow-xl border border-gray-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
              <Link
                to="/profile"
                className="block px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800/50 hover:text-white rounded-t-lg transition-colors"
              >
                👤 My Profile
              </Link>
              <Link
                to="/settings"
                className="block px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800/50 hover:text-white transition-colors"
              >
                ⚙️ Settings
              </Link>
              {/* <button className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-gray-800/50 rounded-b-lg transition-colors border-t border-gray-800">
                Logout
              </button> */}
            </div>
          </div>
        )}

        {/* Surprise Me Button */}
        {/* Surprise Me Button (Visible only when logged in) */}
        {user && (
          <div className="hidden md:block">
            <button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:shadow-[0_0_15px_rgba(192,38,211,0.5)] flex items-center gap-2"
            >
              <span>Surprise Me</span>
            </button>
          </div>
        )}
      </div>

      {/* Mobile Buttons */}
      {menuOpen && (
        <div className="block md:hidden w-full mt-4 space-y-3">
          {!user && (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block w-full bg-indigo-600/90 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-all duration-300 shadow-lg hover:shadow-indigo-500/30 flex items-center justify-center gap-2"
              >
                <span>🔑</span>
                <span>Login</span>
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="block w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl text-sm font-medium hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-emerald-500/30 flex items-center justify-center gap-2"
              >
                <span>✨</span>
                <span>Register</span>
              </Link>
            </>
          )}
          {/* Surprise Me Button (Visible only when logged in) */}
          {user && (
            <div className="hidden md:block">
              <button
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:shadow-[0_0_15px_rgba(192,38,211,0.5)] flex items-center gap-2"
              >
                <span>Surprise Me</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Perfectly Aligned Surprise Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 mt-[25rem] bg-black/80 backdrop-blur-lg flex items-center justify-center z-[999] p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="relative flex flex-col md:flex-row gap-8 bg-gray-900 text-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-800"
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl cursor-pointer transition-colors duration-300 z-10"
              >
                &times;
              </button>

              {/* Movie Poster */}
              <div className="w-full md:w-2/5 h-64 md:h-auto min-h-[300px] bg-gray-800 relative overflow-hidden rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none">
                <img
                  src={
                    surpriseMovie?.Poster !== "N/A"
                      ? surpriseMovie?.Poster
                      : "/no-poster.png"
                  }
                  alt={surpriseMovie?.Title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <h3 className="text-2xl font-bold text-white">
                    {surpriseMovie?.Title}
                  </h3>
                  <p className="text-gray-300">{surpriseMovie?.Year}</p>
                </div>
              </div>

              {/* Movie Details */}
              <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col">
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                  🎉 Your Surprise Pick!
                </h2>

                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 bg-purple-900/50 text-purple-300 rounded-full text-xs font-medium">
                    ⭐ {surpriseMovie?.imdbRating || "N/A"} IMDb
                  </span>
                  <span className="px-3 py-1 bg-blue-900/50 text-blue-300 rounded-full text-xs font-medium">
                    🎭 {surpriseMovie?.Genre?.split(",")[0] || "N/A"}
                  </span>
                  <span className="px-3 py-1 bg-green-900/50 text-green-300 rounded-full text-xs font-medium">
                    ⏱️ {surpriseMovie?.Runtime || "N/A"}
                  </span>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">
                      Plot
                    </h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {surpriseMovie?.Plot || "No plot available."}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">
                        Director
                      </h4>
                      <p className="text-white text-sm">
                        {surpriseMovie?.Director || "N/A"}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">
                        Actors
                      </h4>
                      <p className="text-white text-sm">
                        {surpriseMovie?.Actors?.split(",")
                          .slice(0, 3)
                          .join(", ") || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-auto pt-4">
                  <button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center gap-2 text-sm">
                    <span>➕</span>
                    <span>Add to Watchlist</span>
                  </button>
                  <button className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-lg font-medium hover:bg-gray-700 transition-all duration-300 flex items-center justify-center gap-2 text-sm border border-gray-700">
                    <span>🎬</span>
                    <span>Find Similar</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
