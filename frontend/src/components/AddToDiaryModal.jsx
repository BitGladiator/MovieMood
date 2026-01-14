import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { FiX } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";
import toast from "react-hot-toast";

const moods = [
  { label: "Happy", emoji: "😁" },
  { label: "Sad", emoji: "😢" },
  { label: "Excited", emoji: "🤩" },
  { label: "Chill", emoji: "😌" },
  { label: "Romantic", emoji: "❤️" },
  { label: "Spooky", emoji: "👻" },
];

const modalStyles = `
  /* Overlay - Blurred Spotlight Background */
  .add-diary-overlay {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    z-index: 2147483647 !important;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    padding: 2rem;
  }

  /* Modal Container */
  .add-diary-modal {
    position: relative;
    width: 100%;
    max-width: 480px;
    background: white;
    border-radius: 16px;
    box-shadow: 
      0 0 0 1px rgba(0, 0, 0, 0.05),
      0 20px 50px rgba(0, 0, 0, 0.2),
      0 10px 30px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    max-height: calc(100vh - 4rem);
    display: flex;
    flex-direction: column;
  }

  .add-diary-modal.dark {
    background: #1a1a2e;
    box-shadow: 
      0 0 0 1px rgba(167, 139, 250, 0.2),
      0 20px 50px rgba(0, 0, 0, 0.5);
  }

  /* Close Button */
  .diary-close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    background: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    transition: all 0.15s ease;
    color: #6b7280;
  }

  .diary-close-btn:hover {
    background: #f3f4f6;
    border-color: #d1d5db;
    color: #374151;
  }

  .add-diary-modal.dark .diary-close-btn {
    background: rgba(167, 139, 250, 0.1);
    border-color: rgba(167, 139, 250, 0.2);
    color: #a5b4fc;
  }

  .add-diary-modal.dark .diary-close-btn:hover {
    background: rgba(167, 139, 250, 0.2);
    color: #c7d2fe;
  }

  /* Header Section */
  .diary-header {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1.5rem;
    padding-right: 3.5rem;
  }

  .diary-poster-thumbnail {
    flex-shrink: 0;
    width: 80px;
    height: 120px;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    background: #f3f4f6;
  }

  .diary-poster-thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .diary-poster-fallback {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
    color: #7c3aed;
  }

  .add-diary-modal.dark .diary-poster-fallback {
    background: linear-gradient(135deg, #2e1065 0%, #1e1b4b 100%);
    color: #a78bfa;
  }

  .diary-header-info {
    flex: 1;
    min-width: 0;
    padding-top: 0.25rem;
  }

  .diary-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1a1a2e;
    margin-bottom: 0.5rem;
    line-height: 1.3;
  }

  .add-diary-modal.dark .diary-title {
    color: #f8f9ff;
  }

  .diary-movie-title {
    font-size: 0.9375rem;
    font-weight: 500;
    color: #374151;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 0.125rem;
  }

  .add-diary-modal.dark .diary-movie-title {
    color: #c7d2fe;
  }

  .diary-movie-year {
    font-size: 0.8125rem;
    color: #9ca3af;
  }

  .add-diary-modal.dark .diary-movie-year {
    color: #a5b4fc;
  }

  /* Content Section */
  .diary-content {
    flex: 1;
    padding: 0 1.5rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    overflow-y: auto;
  }

  /* Labels */
  .diary-section-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: #6b7280;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .add-diary-modal.dark .diary-section-label {
    color: #a5b4fc;
  }

  /* Textarea */
  .diary-textarea {
    width: 100%;
    padding: 0.875rem 1rem;
    border-radius: 10px;
    font-size: 0.9375rem;
    line-height: 1.5;
    resize: none;
    transition: all 0.15s ease;
    font-family: inherit;
    background: #f9fafb;
    border: 1.5px solid #e5e7eb;
    color: #1a1a2e;
  }

  .diary-textarea:focus {
    outline: none;
    border-color: #7c3aed;
    background: white;
    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.08);
  }

  .diary-textarea::placeholder {
    color: #9ca3af;
  }

  .add-diary-modal.dark .diary-textarea {
    background: rgba(30, 27, 75, 0.5);
    border-color: rgba(167, 139, 250, 0.2);
    color: #e0e7ff;
  }

  .add-diary-modal.dark .diary-textarea:focus {
    border-color: #a78bfa;
    box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.12);
  }

  .add-diary-modal.dark .diary-textarea::placeholder {
    color: #a5b4fc;
  }

  /* Mood Selector Card */
  .diary-mood-card {
    border-radius: 12px;
    padding: 1rem;
    border: 1.5px solid #e5e7eb;
    background: #fafafa;
  }

  .add-diary-modal.dark .diary-mood-card {
    border-color: rgba(167, 139, 250, 0.2);
    background: rgba(30, 27, 75, 0.3);
  }

  .diary-mood-card-title {
    font-size: 1rem;
    font-weight: 600;
    text-align: center;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, #7c3aed, #ec4899);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* Mood Grid */
  .diary-mood-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }

  .diary-mood-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    padding: 0.75rem 0.5rem;
    border-radius: 10px;
    border: 1.5px solid transparent;
    cursor: pointer;
    transition: all 0.15s ease;
    font-size: 0.6875rem;
    font-weight: 500;
    background: white;
  }

  .diary-mood-btn .emoji {
    font-size: 1.5rem;
  }

  .add-diary-modal.light .diary-mood-btn {
    background: white;
    border-color: #e5e7eb;
    color: #4b5563;
  }

  .add-diary-modal.light .diary-mood-btn:hover {
    border-color: #c4b5fd;
    background: #faf5ff;
  }

  .add-diary-modal.light .diary-mood-btn.selected {
    background: linear-gradient(135deg, #7c3aed, #a855f7);
    border-color: transparent;
    color: white;
    box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
    transform: scale(1.02);
  }

  .add-diary-modal.dark .diary-mood-btn {
    background: rgba(167, 139, 250, 0.08);
    border-color: rgba(167, 139, 250, 0.15);
    color: #c7d2fe;
  }

  .add-diary-modal.dark .diary-mood-btn:hover {
    border-color: rgba(167, 139, 250, 0.35);
    background: rgba(167, 139, 250, 0.15);
  }

  .add-diary-modal.dark .diary-mood-btn.selected {
    background: linear-gradient(135deg, #7c3aed, #a855f7);
    border-color: transparent;
    color: white;
    box-shadow: 0 4px 12px rgba(124, 58, 237, 0.4);
    transform: scale(1.02);
  }

  /* Footer */
  .diary-footer {
    display: flex;
    gap: 0.75rem;
    padding: 1rem 1.5rem 1.5rem;
  }

  .diary-btn {
    flex: 1;
    padding: 0.75rem 1rem;
    font-size: 0.9375rem;
    font-weight: 600;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.15s ease;
    text-align: center;
  }

  .diary-btn-cancel {
    background: white;
    color: #374151;
    border: 1.5px solid #e5e7eb;
  }

  .diary-btn-cancel:hover {
    background: #f3f4f6;
    border-color: #d1d5db;
  }

  .add-diary-modal.dark .diary-btn-cancel {
    background: rgba(167, 139, 250, 0.1);
    color: #c7d2fe;
    border-color: rgba(167, 139, 250, 0.2);
  }

  .add-diary-modal.dark .diary-btn-cancel:hover {
    background: rgba(167, 139, 250, 0.2);
  }

  .diary-btn-save {
    background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
    color: white;
    border: none;
  }

  .diary-btn-save:hover {
    background: linear-gradient(135deg, #6d28d9 0%, #9333ea 100%);
    box-shadow: 0 4px 12px rgba(124, 58, 237, 0.35);
    transform: translateY(-1px);
  }

  /* Responsive */
  @media (max-width: 520px) {
    .add-diary-overlay {
      padding: 1rem;
    }

    .add-diary-modal {
      max-height: calc(100vh - 2rem);
      border-radius: 14px;
    }

    .diary-header {
      padding: 1.25rem;
      padding-right: 3rem;
    }

    .diary-poster-thumbnail {
      width: 70px;
      height: 100px;
    }

    .diary-content {
      padding: 0 1.25rem 1.25rem;
    }

    .diary-footer {
      padding: 1rem 1.25rem 1.25rem;
    }
  }
`;

export default function AddToDiaryModal({ movie, onClose, onSave }) {
  const [review, setReview] = useState("");
  const [mood, setMood] = useState(null);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  // Ensure portal mounts after initial render
  useEffect(() => {
    setMounted(true);
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleSave = async () => {
    if (!mood) {
      toast.error("Please select a mood!");
      return;
    }

    try {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${import.meta.env.VITE_OMDB_API_KEY
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

  const poster = movie.Poster !== "N/A" ? movie.Poster : null;

  const modalContent = (
    <>
      <style>{modalStyles}</style>
      <div
        className="add-diary-overlay"
        onClick={onClose}
        style={{ zIndex: 2147483647, position: 'fixed' }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={`add-diary-modal ${theme}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button className="diary-close-btn" onClick={onClose}>
            <FiX size={18} />
          </button>

          {/* Header with Poster & Movie Info */}
          <div className="diary-header">
            <div className="diary-poster-thumbnail">
              {poster ? (
                <img src={poster} alt={movie.Title} />
              ) : (
                <div className="diary-poster-fallback">🎬</div>
              )}
            </div>
            <div className="diary-header-info">
              <h2 className="diary-title">Add to Diary</h2>
              <h3 className="diary-movie-title">{movie.Title}</h3>
              <p className="diary-movie-year">{movie.Year}</p>
            </div>
          </div>

          {/* Content Section */}
          <div className="diary-content">
            {/* Review */}
            <div className="diary-review-section">
              <label className="diary-section-label">Your Review</label>
              <textarea
                className="diary-textarea"
                placeholder="What did you think?"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows={3}
              />
            </div>

            {/* Mood Selection */}
            <div className="diary-mood-section">
              <label className="diary-section-label">Your Mood</label>
              <div className="diary-mood-card">
                <div className="diary-mood-card-title">What's Your Mood?</div>
                <div className="diary-mood-grid">
                  {moods.map(({ label, emoji }) => (
                    <button
                      key={label}
                      onClick={() => setMood(label)}
                      className={`diary-mood-btn ${mood === label ? "selected" : ""}`}
                    >
                      <span className="emoji">{emoji}</span>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="diary-footer">
            <button className="diary-btn diary-btn-save" onClick={handleSave}>
              Save to Diary
            </button>
            <button className="diary-btn diary-btn-cancel" onClick={onClose}>
              Cancel
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );

  // Use React Portal to render at document body level
  // This ensures the modal is outside any stacking context
  if (!mounted) return null;

  return createPortal(modalContent, document.body);
}
