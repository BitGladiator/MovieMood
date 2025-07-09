import { Card, CardContent } from "./ui/card";
import { motion } from "framer-motion";

export default function EntryCard({ entry, onClick, onDelete }) {
  return (
    <motion.div
      onClick={() => onClick(entry)}
      className="relative cursor-pointer"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.025 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card className="h-[28rem] flex flex-col justify-between rounded-3xl border border-gray-700 bg-white/5 backdrop-blur-lg shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)] transition-all duration-300">
        <CardContent className="p-5 flex flex-col h-full">
          <motion.img
            src={entry.Poster}
            alt={entry.Title}
            loading="lazy"
            className="w-full h-60 object-cover rounded-xl mb-4 border border-gray-600 shadow-md"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
          />

          <div className="mb-4">
            <h3 className="text-xl font-extrabold text-white mb-1">
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent drop-shadow">
                {entry.Title}
              </span>
            </h3>
            <p className="text-sm text-gray-300 italic">🎬 {entry.Year}</p>
          </div>

          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(entry.id);
            }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer mt-auto w-full py-2.5 bg-gradient-to-r from-fuchsia-600 via-rose-500 to-red-500 hover:brightness-110 text-white font-semibold rounded-xl shadow-lg transition-all"
          >
             Delete Entry
          </motion.button>
        </CardContent>
      </Card>

      {/* Mood Badge */}
      {entry.mood && (
        <motion.div
          className="absolute top-2 right-2 z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
        >
          <span className="text-xs font-semibold bg-lime-700/80 text-lime-200 px-3 py-1 rounded-full border border-lime-400 shadow-md">
            {entry.mood}
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}
