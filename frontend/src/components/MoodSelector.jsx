import { useState } from "react";

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

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6 rounded-2xl shadow-xl w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6 tracking-wide">What's Your Mood?</h2>

      <div className="grid grid-cols-3 gap-4">
        {moods.map(({ label, emoji }) => (
          <button
            key={label}
            onClick={() => handleSelect(label)}
            className={`flex flex-col items-center justify-center gap-1 py-4 rounded-lg shadow-md transition-all duration-200 ${
              localMood === label
                ? "bg-blue-600 text-white scale-105"
                : "bg-gray-800 text-gray-200 hover:bg-gray-700"
            }`}
          >
            <span className="text-2xl">{emoji}</span>
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={() => onSave?.(localMood)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow transition"
        >
          Save
        </button>
      </div>
    </div>
  );
}
