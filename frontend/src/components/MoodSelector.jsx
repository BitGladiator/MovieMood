import { useState } from "react";
import toast from "react-hot-toast";
import { useTheme } from "../context/ThemeContext";

const moods = [
  { label: "Happy", emoji: "😁" },
  { label: "Sad", emoji: "😢" },
  { label: "Excited", emoji: "🤩" },
  { label: "Chill", emoji: "😌" },
  { label: "Romantic", emoji: "❤️" },
  { label: "Spooky", emoji: "👻" },
];

const moodSelectorStyles = `
  .mood-selector {
    width: 100%;
    max-width: 28rem;
    margin: 0 auto;
    padding: 1.5rem;
    border-radius: 20px;
  }

  .mood-selector.light {
    background: white;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
    border: 1px solid rgba(0, 0, 0, 0.04);
  }

  .mood-selector.dark {
    background: linear-gradient(135deg, #1e1b4b 0%, #0a0118 100%);
    border: 1px solid rgba(167, 139, 250, 0.3);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }

  .mood-selector-title {
    font-size: 1.5rem;
    font-weight: 700;
    text-align: center;
    margin-bottom: 1.5rem;
    background: linear-gradient(135deg, #7c3aed, #ec4899);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .mood-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;
  }

  .mood-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 1rem 0.75rem;
    border-radius: 12px;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .mood-btn .emoji {
    font-size: 1.75rem;
  }

  .mood-selector.light .mood-btn {
    background: #f3f4f6;
    color: #4b5563;
  }

  .mood-selector.light .mood-btn:hover {
    background: #e5e7eb;
  }

  .mood-selector.light .mood-btn.selected {
    background: linear-gradient(135deg, #7c3aed, #a855f7);
    color: white;
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
  }

  .mood-selector.dark .mood-btn {
    background: rgba(167, 139, 250, 0.15);
    color: #c7d2fe;
  }

  .mood-selector.dark .mood-btn:hover {
    background: rgba(167, 139, 250, 0.25);
  }

  .mood-selector.dark .mood-btn.selected {
    background: linear-gradient(135deg, #7c3aed, #a855f7);
    color: white;
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(124, 58, 237, 0.4);
  }

  .mood-save-section {
    margin-top: 1.5rem;
    display: flex;
    justify-content: flex-end;
  }

  .mood-save-btn {
    padding: 0.75rem 1.5rem;
    font-size: 0.9375rem;
    font-weight: 600;
    border-radius: 12px;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
    color: white;
  }

  .mood-save-btn:hover {
    background: linear-gradient(135deg, #6d28d9 0%, #9333ea 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(124, 58, 237, 0.4);
  }
`;

export default function MoodSelector({ selected, onSelect, onSave }) {
  const [localMood, setLocalMood] = useState(selected);
  const { theme } = useTheme();

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
    <>
      <style>{moodSelectorStyles}</style>
      <div className={`mood-selector ${theme}`}>
        <h2 className="mood-selector-title">What's Your Mood?</h2>

        <div className="mood-grid">
          {moods.map(({ label, emoji }) => (
            <button
              key={label}
              onClick={() => handleSelect(label)}
              className={`mood-btn ${localMood === label ? "selected" : ""}`}
            >
              <span className="emoji">{emoji}</span>
              {label}
            </button>
          ))}
        </div>

        {onSave && (
          <div className="mood-save-section">
            <button onClick={handleSave} className="mood-save-btn">
              Save Mood
            </button>
          </div>
        )}
      </div>
    </>
  );
}
