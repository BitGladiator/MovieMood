import { motion } from "framer-motion";

export default function EntryModal({ entry, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="bg-gradient-to-br from-gray-900/90 to-black/90 text-white rounded-2xl p-6 max-w-3xl w-full flex flex-col md:flex-row gap-6 border border-gray-700 shadow-[0_10px_60px_rgba(0,255,150,0.2)] relative"
      >
        {/* Poster */}
        <div className="flex-shrink-0 hidden md:block">
          <img
            src={entry.Poster}
            alt={entry.Title}
            className="w-44 h-64 object-cover rounded-xl border border-gray-700 shadow-xl"
          />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4 relative">
          {/* Title & Mood */}
          <div className="flex items-start justify-between">
            <h2 className="text-2xl md:text-3xl font-extrabold text-transparent bg-gradient-to-r from-lime-300 via-emerald-400 to-cyan-400 bg-clip-text drop-shadow max-w-[85%] break-words">
              {entry.Title}
            </h2>
            <span className="ml-2 text-xs font-semibold bg-lime-900/50 text-lime-300 px-3 py-1 rounded-full border border-lime-500 shadow shadow-lime-400/30 whitespace-nowrap">
              Mood: {entry.mood}
            </span>
          </div>

          {/* Details */}
          <div className="text-sm text-gray-300 space-y-1">
            <p>📅 <span className="italic text-gray-400">{entry.Year}</span></p>
            <p><strong>Genre:</strong> {entry.Genre}</p>
            <p><strong>Director:</strong> {entry.director}</p>
            <p><strong>Actors:</strong> {entry.Actors}</p>
            <p><strong>Runtime:</strong> {entry.Runtime}</p>
            <p><strong>IMDb Rating:</strong> {entry.IMDbRating}</p>
          </div>

          {/* Review */}
          <div>
            <h3 className="text-lime-300 font-semibold">Your Review:</h3>
            <div className="h-[10rem] overflow-y-auto border border-lime-400 rounded-xl p-4 bg-black/40 shadow-inner shadow-lime-500/20 scroll-smooth hover:shadow-lime-300/40 transition-all duration-300 custom-scrollbar">
              <p className="text-sm text-lime-100 whitespace-pre-line leading-relaxed tracking-wide">
                {entry.review || <i>No Review available.</i>}
              </p>
            </div>
          </div>

          {/* Close Button */}
          <div className="text-right pt-2">
            <button
              onClick={onClose}
              className="cursor-pointer px-5 py-2 rounded-xl border border-gray-600 text-gray-300 bg-black/30 hover:bg-gray-700/50 hover:scale-105 transition-all duration-300 shadow-md"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
