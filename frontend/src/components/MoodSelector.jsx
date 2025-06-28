import { useState } from "react";
import toast from "react-hot-toast";

const moods = [
  { label: "Happy", emoji: "😁" },
  { label: "Sad", emoji: "😢" },
  { label: "Excited", emoji: "🤩" },
  { label: "Chill", emoji: "😌" },
  { label: "Romantic", emoji: "❤️" },
  { label: "Spooky", emoji: "👻" },
];

export default function MoodSelector({ selected, onSelect, onSave }) {
  const [localMood, setLocalMood] = useState(selected);

  const handleSelect = (mood) => {
    setLocalMood(mood);
    onSelect?.(mood);
  };

  const handleSave = () => {
    if (!localMood) {
      toast.error("Please select a mood!");
      return;
    }
    onSave?.(localMood);
    toast.success(`Mood saved: ${localMood} 🎉`);
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6 rounded-2xl shadow-xl w-full max-w-md mx-auto border border-gray-700">
      <h2 className="text-2xl font-bold text-center mb-6 tracking-wide text-lime-400">
        What's Your Mood?
      </h2>

      <div className="grid grid-cols-3 gap-4">
        {moods.map(({ label, emoji }) => (
          <button
            key={label}
            onClick={() => handleSelect(label)}
            className={`flex flex-col items-center justify-center gap-1 py-4 rounded-xl shadow-md transition-all duration-200 text-sm font-medium ${
              localMood === label
                ? "bg-gradient-to-r from-green-500 to-lime-500 text-black scale-105"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            <span className="text-3xl">{emoji}</span>
            {label}
          </button>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          className="bg-gradient-to-r from-green-400 to-emerald-500 hover:brightness-110 text-black px-6 py-2 rounded-lg font-bold shadow-lg transition cursor-pointer"
        >
          Save Mood
        </button>
      </div>
    </div>
  );
}
