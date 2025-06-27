import { useState } from "react";
import MoodSelector from "./MoodSelector";

export default function AddToDiaryModal({ movie, onClose, onSave }) {
  const [review, setReview] = useState("");
  const [mood, setMood] = useState(null);

  const handleSave = () => {
    if (!mood) return alert("Select a mood!");
    const entry = {
      imdbID: movie.imdbID,
      title: movie.Title,
      poster: movie.Poster,
      year: movie.Year,
      review,
      mood,
      date: new Date().toISOString(),
    };
    onSave(entry);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-50 px-4 overflow-auto">
      <div className="w-full max-w-md bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white rounded-2xl shadow-2xl p-6 space-y-6 my-10 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-center">🎬 Add to Diary</h2>

        <div className="flex items-center gap-4">
          <img
            src={movie.Poster !== "N/A" ? movie.Poster : "/fallback.png"}
            alt={movie.Title}
            className="w-20 h-28 object-cover rounded-lg shadow"
          />
          <div>
            <h3 className="text-lg font-semibold">{movie.Title}</h3>
            <p className="text-sm text-gray-400">{movie.Year}</p>
          </div>
        </div>

        <textarea
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white resize-none placeholder-gray-400"
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
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition text-white font-semibold"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
