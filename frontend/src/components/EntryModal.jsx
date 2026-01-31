import { motion } from "framer-motion";
import { FiX, FiStar, FiClock, FiUser, FiFilm, FiCalendar } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";

const modalStyles = `
  .entry-modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    overflow-y: auto;
  }

  @media (max-width: 767px) {
    .entry-modal-overlay {
      padding: 0.5rem;
      align-items: flex-start;
      padding-top: 8rem;
    }
  }

  .entry-modal-overlay.light {
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(8px);
  }

  .entry-modal-overlay.dark {
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(12px);
  }

  .entry-modal {
    position: relative;
    width: 100%;
    max-width: 900px;
    border-radius: 24px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  @media (max-width: 767px) {
    .entry-modal {
      border-radius: 16px;
      max-width: 100%;
    }
  }

  @media (min-width: 768px) {
    .entry-modal {
      flex-direction: row;
    }
  }

  .entry-modal.light {
    background: white;
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.15);
  }

  .entry-modal.dark {
    background: linear-gradient(135deg, #1e1b4b 0%, #0a0118 100%);
    border: 1px solid rgba(167, 139, 250, 0.3);
    box-shadow: 0 25px 80px rgba(0, 0, 0, 0.6);
  }

  .modal-close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    transition: all 0.2s ease;
  }

  @media (max-width: 767px) {
    .modal-close-btn {
      top: 0.75rem;
      right: 0.75rem;
      width: 32px;
      height: 32px;
    }
  }

  .entry-modal.light .modal-close-btn {
    background: rgba(0, 0, 0, 0.05);
    color: #6b7280;
  }

  .entry-modal.light .modal-close-btn:hover {
    background: rgba(0, 0, 0, 0.1);
    color: #374151;
  }

  .entry-modal.dark .modal-close-btn {
    background: rgba(255, 255, 255, 0.1);
    color: #c7d2fe;
  }

  .entry-modal.dark .modal-close-btn:hover {
    background: rgba(255, 255, 255, 0.15);
    color: white;
  }

  /* Poster Section */
  .modal-poster-section {
    flex-shrink: 0;
    position: relative;
    display: none;
  }

  @media (min-width: 768px) {
    .modal-poster-section {
      width: 280px;
      display: block;
    }
  }

  .modal-poster {
    width: 100%;
    height: 100%;
    min-height: 300px;
    object-fit: cover;
  }

  @media (min-width: 768px) {
    .modal-poster {
      min-height: 420px;
    }
  }

  .modal-poster-fallback {
    width: 100%;
    min-height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 4rem;
  }

  .entry-modal.light .modal-poster-fallback {
    background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
    color: #7c3aed;
  }

  .entry-modal.dark .modal-poster-fallback {
    background: linear-gradient(135deg, #2e1065 0%, #1e1b4b 100%);
    color: #a78bfa;
  }

  /* Content Section */
  .modal-content {
    flex: 1;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    overflow-y: auto;
    max-height: 80vh;
  }

  @media (max-width: 767px) {
    .modal-content {
      padding: 1.25rem;
      padding-top: 3rem;
      gap: 1.25rem;
      max-height: calc(100vh - 2rem);
    }
  }

  @media (min-width: 768px) {
    .modal-content {
      max-height: none;
    }
  }

  .modal-header {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  @media (max-width: 767px) {
    .modal-header {
      gap: 0.625rem;
    }
  }

  .modal-title {
    font-size: 1.75rem;
    font-weight: 700;
    line-height: 1.2;
    background: linear-gradient(135deg, #7c3aed, #ec4899);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  @media (max-width: 767px) {
    .modal-title {
      font-size: 1.5rem;
      padding-right: 2rem;
    }
  }

  .modal-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  @media (max-width: 767px) {
    .modal-badges {
      gap: 0.375rem;
    }
  }

  .modal-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.375rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8125rem;
    font-weight: 500;
  }

  @media (max-width: 767px) {
    .modal-badge {
      padding: 0.3rem 0.625rem;
      font-size: 0.75rem;
    }
  }

  .modal-badge.rating {
    background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
    color: #b45309;
  }

  .entry-modal.dark .modal-badge.rating {
    background: rgba(245, 158, 11, 0.2);
    color: #fbbf24;
  }

  .modal-badge.mood {
    background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
    color: #7c3aed;
  }

  .entry-modal.dark .modal-badge.mood {
    background: rgba(124, 58, 237, 0.25);
    color: #a78bfa;
  }

  .modal-badge.year {
    background: #f3f4f6;
    color: #4b5563;
  }

  .entry-modal.dark .modal-badge.year {
    background: rgba(167, 139, 250, 0.15);
    color: #c7d2fe;
  }

  /* Details Grid */
  .modal-details {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  @media (max-width: 767px) {
    .modal-details {
      grid-template-columns: 1fr;
      gap: 0.875rem;
    }
  }

  .detail-item {
    display: flex;
    align-items: flex-start;
    gap: 0.625rem;
  }

  @media (max-width: 767px) {
    .detail-item {
      gap: 0.5rem;
    }
  }

  .detail-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  @media (max-width: 767px) {
    .detail-icon {
      width: 28px;
      height: 28px;
    }
  }

  .entry-modal.light .detail-icon {
    background: #f3f4f6;
    color: #7c3aed;
  }

  .entry-modal.dark .detail-icon {
    background: rgba(124, 58, 237, 0.2);
    color: #a78bfa;
  }

  .detail-content {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .detail-label {
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  @media (max-width: 767px) {
    .detail-label {
      font-size: 0.6875rem;
    }
  }

  .entry-modal.light .detail-label {
    color: #9ca3af;
  }

  .entry-modal.dark .detail-label {
    color: #a5b4fc;
  }

  .detail-value {
    font-size: 0.875rem;
    font-weight: 500;
  }

  @media (max-width: 767px) {
    .detail-value {
      font-size: 0.8125rem;
    }
  }

  .entry-modal.light .detail-value {
    color: #1a1a2e;
  }

  .entry-modal.dark .detail-value {
    color: #f8f9ff;
  }

  /* Review Section */
  .review-section {
    flex: 1;
  }

  .review-label {
    font-size: 0.875rem;
    font-weight: 600;
    margin-bottom: 0.625rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  @media (max-width: 767px) {
    .review-label {
      font-size: 0.8125rem;
      margin-bottom: 0.5rem;
    }
  }

  .entry-modal.light .review-label {
    color: #1a1a2e;
  }

  .entry-modal.dark .review-label {
    color: #f8f9ff;
  }

  .review-content {
    padding: 1rem;
    border-radius: 12px;
    min-height: 120px;
    max-height: 180px;
    overflow-y: auto;
    font-size: 0.9375rem;
    line-height: 1.7;
  }

  @media (max-width: 767px) {
    .review-content {
      padding: 0.875rem;
      min-height: 100px;
      max-height: 150px;
      font-size: 0.875rem;
      line-height: 1.6;
    }
  }

  .entry-modal.light .review-content {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    color: #374151;
  }

  .entry-modal.dark .review-content {
    background: rgba(30, 27, 75, 0.5);
    border: 1px solid rgba(167, 139, 250, 0.2);
    color: #e0e7ff;
  }

  .review-empty {
    font-style: italic;
  }

  .entry-modal.light .review-empty {
    color: #9ca3af;
  }

  .entry-modal.dark .review-empty {
    color: #a5b4fc;
  }

  /* Close Button at bottom */
  .modal-footer {
    display: flex;
    justify-content: flex-end;
    padding-top: 0.5rem;
  }

  @media (max-width: 767px) {
    .modal-footer {
      padding-top: 0.25rem;
    }
  }

  .close-btn {
    padding: 0.75rem 1.5rem;
    font-size: 0.9375rem;
    font-weight: 600;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  @media (max-width: 767px) {
    .close-btn {
      padding: 0.625rem 1.25rem;
      font-size: 0.875rem;
      width: 100%;
    }
  }

  .entry-modal.light .close-btn {
    background: #1a1a2e;
    color: white;
    border: none;
  }

  .entry-modal.light .close-btn:hover {
    background: #2d2d4a;
  }

  .entry-modal.dark .close-btn {
    background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
    color: white;
    border: none;
  }

  .entry-modal.dark .close-btn:hover {
    background: linear-gradient(135deg, #6d28d9 0%, #9333ea 100%);
  }
`;

export default function EntryModal({ entry, onClose }) {
  const { theme } = useTheme();

  // Get display values with fallbacks
  const title = entry.Title || entry.title || "Untitled";
  const year = entry.Year || entry.year || "";
  const poster = entry.Poster || entry.poster;
  const genre = entry.Genre || entry.genre || "";
  const director = entry.director || entry.Director || "";
  const actors = entry.Actors || entry.actors || "";
  const runtime = entry.Runtime || entry.runtime || "";
  const rating = entry.IMDbRating || entry.imdbRating || entry.rating || "";
  const review = entry.review || entry.Review || "";
  const mood = entry.mood || "";

  return (
    <>
      <style>{modalStyles}</style>
      <div className={`entry-modal-overlay ${theme}`} onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`entry-modal ${theme}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button className="modal-close-btn" onClick={onClose}>
            <FiX size={20} />
          </button>

          {/* Poster */}
          <div className="modal-poster-section">
            {poster && poster !== "N/A" ? (
              <img src={poster} alt={title} className="modal-poster" />
            ) : (
              <div className="modal-poster-fallback">🎬</div>
            )}
          </div>

          {/* Content */}
          <div className="modal-content">
            {/* Header */}
            <div className="modal-header">
              <h2 className="modal-title">{title}</h2>
              <div className="modal-badges">
                {rating && (
                  <span className="modal-badge rating">
                    <FiStar size={14} />
                    {rating}
                  </span>
                )}
                {mood && (
                  <span className="modal-badge mood">{mood}</span>
                )}
                {year && (
                  <span className="modal-badge year">{year}</span>
                )}
              </div>
            </div>

            {/* Details Grid */}
            <div className="modal-details">
              {genre && (
                <div className="detail-item">
                  <div className="detail-icon">
                    <FiFilm size={16} />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Genre</span>
                    <span className="detail-value">{genre}</span>
                  </div>
                </div>
              )}
              {director && (
                <div className="detail-item">
                  <div className="detail-icon">
                    <FiUser size={16} />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Director</span>
                    <span className="detail-value">{director}</span>
                  </div>
                </div>
              )}
              {runtime && (
                <div className="detail-item">
                  <div className="detail-icon">
                    <FiClock size={16} />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Runtime</span>
                    <span className="detail-value">{runtime}</span>
                  </div>
                </div>
              )}
              {actors && (
                <div className="detail-item">
                  <div className="detail-icon">
                    <FiUser size={16} />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Cast</span>
                    <span className="detail-value">{actors}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Review */}
            <div className="review-section">
              <div className="review-label">
                 Your Review
              </div>
              <div className="review-content">
                {review ? (
                  <p>{review}</p>
                ) : (
                  <p className="review-empty">No review added yet.</p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <button className="close-btn" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
