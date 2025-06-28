import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
export default function Navbar() {
  const [showModal, setShowModal] = useState(false);
  const [surpriseMovie, setSurpriseMovie] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("diary") || "[]");
    if (stored.length) {
      const random = stored[Math.floor(Math.random() * stored.length)];
      setSurpriseMovie(random);
    }
  }, [showModal]);

  const linkClass = ({ isActive }) =>
    `px-4 py-2 text-sm font-medium transition-all duration-300 rounded-md ${
      isActive
        ? "bg-indigo-600 text-white"
        : "text-gray-200 hover:text-white hover:bg-indigo-600/30"
    }`;

  return (
    <nav className="w-full px-6 py-4 bg-gradient-to-r from-gray-900 via-black to-gray-900 shadow-lg flex justify-between items-center">
      {/* Logo */}
      <div className="text-2xl font-extrabold bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-transparent bg-clip-text tracking-wide drop-shadow-sm">
        🎥 MovieMood
      </div>

      {/* Centered Links */}
      <div className="flex gap-6 items-center justify-center mx-auto">
        <NavLink to="/" className={linkClass}>
          Home
        </NavLink>
        <NavLink to="/diary" className={linkClass}>
          Diary
        </NavLink>
        <NavLink to="/stats" className={linkClass}>
          Stats
        </NavLink>
        <NavLink to='/watchlater' className={linkClass}>
        WatchLater
        </NavLink>
      </div>

      {/* Surprise Me Button */}
      <button
        onClick={() => setShowModal(true)}
        className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition cursor-pointer"
      >
        🎁 Surprise Me
      </button>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative bg-gradient-to-br from-indigo-900 to-gray-900 text-white rounded-2xl shadow-2xl w-[90%] max-w-md p-6 border-4 border-indigo-600"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              {/* Close Button */}
              <div className="absolute top-3 right-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white text-xl"
                >
                  ✖
                </button>
              </div>

              <h2 className="text-3xl font-bold mb-4 text-center bg-gradient-to-r from-pink-500 to-yellow-500 text-transparent bg-clip-text">
                🎉 Surprise Pick!
              </h2>

              {surpriseMovie ? (
                <div className="text-center space-y-4">
                  <img
                    src={
                      surpriseMovie.poster !== "N/A"
                        ? surpriseMovie.poster
                        : "/no-poster.png"
                    }
                    alt={surpriseMovie.title}
                    className="w-full h-64 object-cover rounded-lg shadow-md"
                  />
                  <h3 className="text-2xl font-semibold">
                    {surpriseMovie.title}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {surpriseMovie.year} • {surpriseMovie.genre}
                  </p>
                  <p className="text-sm text-gray-400">
                    👥 {surpriseMovie.actors}
                  </p>
                  <p className="text-gray-300 text-sm italic">
                    "{surpriseMovie.plot || "No plot available."}"
                  </p>
                </div>
              ) : (
                <p className="text-center text-sm text-gray-400">
                  No movies available to surprise you yet.
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
