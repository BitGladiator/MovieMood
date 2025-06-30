import { useState } from "react";
import MoodSelector from "./MoodSelector";

export default function AddToDiaryModal({ movie, onClose, onSave }) {
  const [review, setReview] = useState("");
  const [mood, setMood] = useState(null);

  const handleSave = async () => {
    if (!mood) return toast.error("Please select a mood!");

    try {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${
          import.meta.env.VITE_OMDB_API_KEY
        }&i=${movie.imdbID}&plot=full`
      );
      const data = await res.json();

      if (data.Response !== "True") throw new Error("Movie details not found");

      const entry = {
        ...data,
        review,
        mood,
        date: new Date().toISOString(),
      };

      onSave(entry);
      onClose();
      toast.success("Movie added to diary!");
    } catch (err) {
      console.error("Error saving movie:", err);
      toast.error("Failed to add movie to diary.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="w-full max-w-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white rounded-2xl shadow-2xl p-6 flex gap-6 items-start border border-gray-700">
        {/* Poster + info */}
        <div className="flex-shrink-0">
          <img
            src={movie.Poster !== "N/A" ? movie.Poster : "/fallback.png"}
            alt={movie.Title}
            className="w-40 h-56 object-cover rounded-xl shadow-lg border border-gray-700"
          />
          <div className="mt-4">
            <h3 className="text-lg font-bold">{movie.Title}</h3>
            <p className="text-sm text-gray-400">{movie.Year}</p>
          </div>
        </div>

        {/* Right-side content */}
        <div className="flex-1 space-y-4 max-h-[90vh] overflow-y-auto pr-1">
          <h2 className="text-2xl font-extrabold text-lime-400 tracking-tight text-center">
            🎬 Add to Diary
          </h2>

          <textarea
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white resize-none placeholder-gray-400 focus:ring-2 focus:ring-lime-500"
            placeholder="Write your review..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows={4}
          />

          <MoodSelector selected={mood} onSelect={setMood} />

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-lime-500 to-emerald-600 hover:brightness-110 transition text-black font-bold shadow cursor-pointer"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
