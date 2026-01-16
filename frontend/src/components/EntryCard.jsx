import { motion } from "framer-motion";
import { FiStar, FiClock, FiTrash2 } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";

const entryCardStyles = `
  .entry-card {
    border-radius: 20px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
  }

  .entry-card.light {
    background: white;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
    border: 1px solid rgba(0, 0, 0, 0.04);
  }

  .entry-card.light:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }

  .entry-card.dark {
    background: linear-gradient(135deg, rgba(30, 27, 75, 0.8) 0%, rgba(26, 11, 46, 0.9) 100%);
    border: 1px solid rgba(167, 139, 250, 0.2);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  }

  .entry-card.dark:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 50px rgba(124, 58, 237, 0.3);
    border-color: rgba(167, 139, 250, 0.4);
  }

  .card-image-wrapper {
    position: relative;
    aspect-ratio: 4/3;
    overflow: hidden;
  }

  .card-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  .entry-card:hover .card-image {
    transform: scale(1.05);
  }

  .card-image-fallback {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
  }

  .entry-card.light .card-image-fallback {
    background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
    color: #7c3aed;
  }

  .entry-card.dark .card-image-fallback {
    background: linear-gradient(135deg, #2e1065 0%, #1e1b4b 100%);
    color: #a78bfa;
  }

  .card-bookmark {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .card-bookmark:hover {
    background: rgba(239, 68, 68, 0.8);
    transform: scale(1.1);
  }

  .card-content {
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    flex: 1;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .card-title {
    font-size: 1.125rem;
    font-weight: 700;
    line-height: 1.3;
    flex: 1;
  }

  .entry-card.light .card-title {
    color: #1a1a2e;
  }

  .entry-card.dark .card-title {
    color: #f8f9ff;
  }

  .rating-badge {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.375rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8125rem;
    font-weight: 600;
  }

  .entry-card.light .rating-badge {
    background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
    color: #b45309;
  }

  .entry-card.dark .rating-badge {
    background: rgba(245, 158, 11, 0.2);
    color: #fbbf24;
    border: 1px solid rgba(245, 158, 11, 0.3);
  }

  .card-description {
    font-size: 0.875rem;
    line-height: 1.6;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .entry-card.light .card-description {
    color: #64748b;
  }

  .entry-card.dark .card-description {
    color: #a5b4fc;
  }

  .card-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: auto;
  }

  .card-tag {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.375rem 0.75rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 500;
  }

  .entry-card.light .card-tag {
    background: #f3f4f6;
    color: #4b5563;
  }

  .entry-card.dark .card-tag {
    background: rgba(124, 58, 237, 0.15);
    color: #c7d2fe;
    border: 1px solid rgba(167, 139, 250, 0.2);
  }

  .card-tag.mood {
    background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
    color: #7c3aed;
  }

  .entry-card.dark .card-tag.mood {
    background: rgba(124, 58, 237, 0.25);
    color: #a78bfa;
    border: 1px solid rgba(167, 139, 250, 0.3);
  }

  .card-action-btn {
    width: 100%;
    padding: 0.875rem;
    margin-top: 0.75rem;
    border-radius: 12px;
    font-size: 0.9375rem;
    font-weight: 600;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
  }

  .entry-card.light .card-action-btn {
    background: #1a1a2e;
    color: white;
  }

  .entry-card.light .card-action-btn:hover {
    background: #2d2d4a;
  }

  .entry-card.dark .card-action-btn {
    background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
    color: white;
  }

  .entry-card.dark .card-action-btn:hover {
    background: linear-gradient(135deg, #6d28d9 0%, #9333ea 100%);
  }
`;

export default function EntryCard({ entry, onClick, onDelete }) {
  const { theme } = useTheme();

  // Get display values with fallbacks
  const title = entry.Title || entry.title || "Untitled";
  const year = entry.Year || entry.year || "";
  const rating = entry.IMDbRating || entry.rating || "";
  const poster = entry.Poster || entry.poster;
  const genre = entry.Genre || entry.genre || "";
  const runtime = entry.Runtime || entry.runtime || "";
  const plot = entry.Plot || entry.plot || entry.review || "";
  const mood = entry.mood || "";

  // Parse genre to get first genre
  const primaryGenre = genre ? genre.split(",")[0].trim() : "";

  // Format runtime
  const formattedRuntime = runtime ? runtime.replace(" min", "m") : "";

  return (
    <>
      <style>{entryCardStyles}</style>
      <motion.div
        onClick={() => onClick(entry)}
        className={`entry-card ${theme}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
      >
        {/* Image Section */}
        <div className="card-image-wrapper">
          {poster && poster !== "N/A" ? (
            <img
              src={poster}
              alt={title}
              className="card-image"
              loading="lazy"
            />
          ) : (
            <div className="card-image-fallback">🎬</div>
          )}

          {/* Delete Button */}
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(entry.id);
            }}
            className="card-bookmark"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiTrash2 size={16} />
          </motion.button>
        </div>

      
        <div className="card-content">
       
          <div className="card-header">
            <h3 className="card-title">{title}</h3>
            {rating && (
              <div className="rating-badge">
                <FiStar size={14} />
                {rating}
              </div>
            )}
          </div>

          {/* Description */}
          {plot && (
            <p className="card-description">{plot}</p>
          )}

        
          <div className="card-tags">
            {rating && (
              <span className="card-tag">
                <FiStar size={12} />
                {rating}
              </span>
            )}
            {primaryGenre && (
              <span className="card-tag">{primaryGenre}</span>
            )}
            {formattedRuntime && (
              <span className="card-tag">
                <FiClock size={12} />
                {formattedRuntime}
              </span>
            )}
            {mood && (
              <span className="card-tag mood">{mood}</span>
            )}
          </div>

          {/* Action Button */}
          <button className="card-action-btn">
            View Details
          </button>
        </div>
      </motion.div>
    </>
  );
}
