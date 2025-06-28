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
      <div className="text-2xl font-extrabold bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-transparent bg-clip-text tracking-wide drop-shadow-sm">
        🎥 MovieMood
      </div>

      <div className="flex gap-6 items-center justify-center mx-auto">
        <NavLink to="/" className={linkClass}>Home</NavLink>
        <NavLink to="/diary" className={linkClass}>Diary</NavLink>
        <NavLink to="/stats" className={linkClass}>Stats</NavLink>
        <NavLink to="/watchlater" className={linkClass}>WatchLater</NavLink>
      </div>

      <button
        onClick={() => setShowModal(true)}
        className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition cursor-pointer"
      >
        🎁 Surprise Me
      </button>

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
                className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
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
                  <h3 className="text-2xl font-semibold mb-1">{surpriseMovie?.Title}</h3>

                  <div className="text-sm text-indigo-300 space-y-1">
                    <p>
                      📅 <span className="text-white">{surpriseMovie?.Year}</span> &bull; 🎭{" "}
                      <span className="text-white">{surpriseMovie?.Genre || "N/A"}</span>
                    </p>
                    <p>
                      👥 <span className="text-white">{surpriseMovie?.Actors || "Unknown"}</span>
                    </p>
                    {surpriseMovie?.imdbRating && (
                      <p>
                        ⭐ IMDb Rating: <span className="text-white">{surpriseMovie.imdbRating}</span>
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
