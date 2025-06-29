import { Link, NavLink } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
export default function Navbar() {
  const [showModal, setShowModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [surpriseMovie, setSurpriseMovie] = useState(null);
  const menuRef = useRef();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("diary") || "[]");
    if (stored.length) {
      const random = stored[Math.floor(Math.random() * stored.length)];
      setSurpriseMovie(random);
    }
  }, [showModal]);

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const linkClass = ({ isActive }) =>
    `block px-4 py-2 text-sm font-medium transition-all duration-300 rounded-md ${
      isActive
        ? "bg-indigo-600 text-white"
        : "text-gray-200 hover:text-white hover:bg-indigo-600/30"
    }`;

  return (
    <nav className="w-full px-6 py-3 bg-gradient-to-r from-gray-900 via-black to-gray-900 shadow-lg flex items-center justify-between flex-wrap relative z-50">
      <Link
        to="/"
        className="text-2xl font-extrabold bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-transparent bg-clip-text tracking-wide drop-shadow-sm"
      >
        🎥 MovieMood
      </Link>

      {/* Mobile menu toggle */}
      

      {/* Nav Links */}
      <div
        ref={menuRef}
        className={`${
          menuOpen ? "block" : "hidden"
        } absolute md:static top-16 left-0 md:flex md:items-center md:gap-6 w-full md:w-auto bg-gray-900 md:bg-transparent p-4 md:p-0 rounded-md md:rounded-none`}
      >
        <NavLink
          to="/"
          className={linkClass}
          onClick={() => setMenuOpen(false)}
        >
          Home
        </NavLink>
        <NavLink
          to="/finder"
          className={linkClass}
          onClick={() => setMenuOpen(false)}
        >
          Finder
        </NavLink>
        <NavLink
          to="/diary"
          className={linkClass}
          onClick={() => setMenuOpen(false)}
        >
          Diary
        </NavLink>
        <NavLink
          to="/stats"
          className={linkClass}
          onClick={() => setMenuOpen(false)}
        >
          Stats
        </NavLink>
        <NavLink
          to="/watchlater"
          className={linkClass}
          onClick={() => setMenuOpen(false)}
        >
          WatchLater
        </NavLink>
      </div>
      <div className="flex items-center gap-4">
      <button
        className="text-white md:hidden"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X /> : <Menu />}
      </button>
  {/* Profile Badge */}
  <div className="flex items-center gap-4">
  <Link
    to="/login"
    className="text-sm text-indigo-400 hover:text-white border border-indigo-400 px-4 py-2 rounded-full transition duration-300 hover:bg-indigo-500 hover:shadow-lg"
  >
    Login
  </Link>
  <Link
    to="/register"
    className="text-sm text-green-400 hover:text-white border border-green-400 px-4 py-2 rounded-full transition duration-300 hover:bg-green-500 hover:shadow-lg"
  >
    Register
  </Link>
</div>
  <Link to="/profile">
    <img
      src="https://img.icons8.com/fluency-systems-filled/48/user-male-circle.png"
      alt="Profile"
      className="w-10 h-10 rounded-full border-2 border-indigo-600 hover:scale-105 transition-transform bg-white"
    />
  </Link>

  {/* Surprise Button (visible on md and up) */}
  <div className="hidden md:block">
    <button
      onClick={() => setShowModal(true)}
      className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition cursor-pointer"
    >
      🎁 Surprise Me
    </button>
  </div>
</div>
      

      {/* Mobile surprise button below links */}
      {menuOpen && (
        <div className="block md:hidden w-full mt-2">
          <button
            onClick={() => {
              setShowModal(true);
              setMenuOpen(false);
            }}
            className="mt-4 w-full bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition cursor-pointer md:hidden"
          >
            🎁 Surprise Me
          </button>
        </div>
      )}

      {/* Surprise Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="relative flex flex-col md:flex-row gap-6 bg-gradient-to-br from-indigo-900 to-gray-900 text-white rounded-2xl shadow-2xl w-[95%] max-w-4xl p-6 border-4 border-indigo-600"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl cursor-pointer"
              >
                ✖
              </button>

              <img
                src={
                  surpriseMovie?.Poster !== "N/A"
                    ? surpriseMovie?.Poster
                    : "/no-poster.png"
                }
                alt={surpriseMovie?.Title}
                className="w-full md:w-1/3 h-auto object-cover rounded-xl shadow-md border border-indigo-700"
              />

              <div className="flex flex-col justify-between w-full md:w-2/3">
                <div>
                  <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-pink-500 to-yellow-500 text-transparent bg-clip-text">
                    🎉 Surprise Pick!
                  </h2>
                  <h3 className="text-2xl font-semibold mb-1">
                    {surpriseMovie?.Title}
                  </h3>

                  <div className="text-sm text-indigo-300 space-y-1">
                    <p>
                      📅{" "}
                      <span className="text-white">{surpriseMovie?.Year}</span>{" "}
                      &bull; 🎭{" "}
                      <span className="text-white">
                        {surpriseMovie?.Genre || "N/A"}
                      </span>
                    </p>
                    <p>
                      👥{" "}
                      <span className="text-white">
                        {surpriseMovie?.Actors || "Unknown"}
                      </span>
                    </p>
                    {surpriseMovie?.imdbRating && (
                      <p>
                        ⭐ IMDb Rating:{" "}
                        <span className="text-white">
                          {surpriseMovie.imdbRating}
                        </span>
                      </p>
                    )}
                  </div>

                  <p className="mt-3 text-sm italic text-gray-300">
                    “{surpriseMovie?.Plot || "No plot available."}”
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
