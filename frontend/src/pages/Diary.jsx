import { useEffect, useState, useMemo } from "react";
import { auth, db, collection, query, where, getDocs } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { deleteDoc, doc } from "firebase/firestore";
import { toast } from "react-hot-toast";
import EntryCard from "../components/EntryCard";
import EntryModal from "../components/EntryModal";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiSearch, FiX, FiPlus, FiFilm, FiClock, FiStar } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";

const diaryStyles = `
  .diary-page {
    min-height: 100vh;
    padding-top: 100px;
    padding-bottom: 60px;
    transition: background 0.3s ease;
  }

  .diary-page.light {
    background: linear-gradient(180deg, #fdfbf9 0%, #fef5f0 50%, #faf5ff 100%);
  }

  .diary-page.dark {
    background: radial-gradient(ellipse at top, #1e1b4b 0%, #0a0118 50%, #000000 100%);
  }

  .diary-container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .diary-header {
    margin-bottom: 2rem;
  }

  .diary-title {
    font-size: clamp(2rem, 4vw, 2.75rem);
    font-weight: 700;
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, #7c3aed, #ec4899);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .diary-subtitle {
    font-size: 1rem;
  }

  .diary-page.light .diary-subtitle {
    color: #64748b;
  }

  .diary-page.dark .diary-subtitle {
    color: #c7d2fe;
  }

  /* Stats Grid */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .stat-card {
    padding: 1.5rem;
    border-radius: 16px;
    transition: all 0.3s ease;
  }

  .diary-page.light .stat-card {
    background: white;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
    border: 1px solid rgba(0, 0, 0, 0.04);
  }

  .diary-page.light .stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
  }

  .diary-page.dark .stat-card {
    background: rgba(30, 27, 75, 0.5);
    border: 1px solid rgba(167, 139, 250, 0.2);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }

  .diary-page.dark .stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(124, 58, 237, 0.3);
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
  }

  .stat-icon.purple {
    background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
    color: #7c3aed;
  }

  .stat-icon.pink {
    background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%);
    color: #ec4899;
  }

  .stat-icon.amber {
    background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
    color: #f59e0b;
  }

  .stat-label {
    font-size: 0.875rem;
    margin-bottom: 0.25rem;
  }

  .diary-page.light .stat-label {
    color: #64748b;
  }

  .diary-page.dark .stat-label {
    color: #a5b4fc;
  }

  .stat-value {
    font-size: 2rem;
    font-weight: 700;
  }

  .diary-page.light .stat-value {
    color: #1a1a2e;
  }

  .diary-page.dark .stat-value {
    color: #f8f9ff;
  }

  /* Search and Controls */
  .controls-row {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  @media (min-width: 640px) {
    .controls-row {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }

  .search-wrapper {
    position: relative;
    flex: 1;
    max-width: 400px;
  }

  .search-input {
    width: 100%;
    padding: 0.875rem 1rem;
    padding-left: 2.75rem;
    font-size: 0.9375rem;
    border-radius: 12px;
    transition: all 0.3s ease;
  }

  .diary-page.light .search-input {
    background: white;
    border: 1.5px solid #e5e7eb;
    color: #1a1a2e;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.02);
  }

  .diary-page.light .search-input:focus {
    border-color: #7c3aed;
    box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.1);
    outline: none;
  }

  .diary-page.dark .search-input {
    background: rgba(30, 27, 75, 0.6);
    border: 1.5px solid rgba(167, 139, 250, 0.2);
    color: #f8f9ff;
  }

  .diary-page.dark .search-input:focus {
    border-color: #a78bfa;
    box-shadow: 0 0 0 4px rgba(167, 139, 250, 0.1);
    outline: none;
  }

  .search-input::placeholder {
    color: #9ca3af;
  }

  .search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
    pointer-events: none;
  }

  .search-clear {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    padding: 0.25rem;
    border: none;
    background: none;
    cursor: pointer;
    color: #9ca3af;
    transition: color 0.2s ease;
  }

  .search-clear:hover {
    color: #6b7280;
  }

  .add-movie-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.875rem 1.5rem;
    font-size: 0.9375rem;
    font-weight: 600;
    border-radius: 12px;
    border: none;
    cursor: pointer;
    background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);
    transition: all 0.3s ease;
    text-decoration: none;
  }

  .add-movie-btn:hover {
    background: linear-gradient(135deg, #6d28d9 0%, #9333ea 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
  }

  /* Movies Grid */
  .movies-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1.5rem;
  }

  .movie-card-wrapper {
    position: relative;
  }

  /* Empty State */
  .empty-state {
    text-align: center;
    padding: 4rem 2rem;
    border-radius: 20px;
  }

  .diary-page.light .empty-state {
    background: white;
    border: 2px dashed #e5e7eb;
  }

  .diary-page.dark .empty-state {
    background: rgba(30, 27, 75, 0.5);
    border: 2px dashed rgba(167, 139, 250, 0.3);
  }

  .empty-state-icon {
    font-size: 4rem;
    margin-bottom: 1.5rem;
  }

  .empty-state-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
  }

  .diary-page.light .empty-state-title {
    color: #1a1a2e;
  }

  .diary-page.dark .empty-state-title {
    color: #f8f9ff;
  }

  .empty-state-text {
    max-width: 400px;
    margin: 0 auto 1.5rem;
  }

  .diary-page.light .empty-state-text {
    color: #64748b;
  }

  .diary-page.dark .empty-state-text {
    color: #a5b4fc;
  }

  .reset-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    font-size: 0.9375rem;
    font-weight: 500;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .diary-page.light .reset-btn {
    background: #f3f4f6;
    border: 1.5px solid #e5e7eb;
    color: #374151;
  }

  .diary-page.light .reset-btn:hover {
    background: #e5e7eb;
  }

  .diary-page.dark .reset-btn {
    background: rgba(88, 28, 135, 0.3);
    border: 1.5px solid rgba(167, 139, 250, 0.3);
    color: #c7d2fe;
  }

  .diary-page.dark .reset-btn:hover {
    background: rgba(124, 58, 237, 0.4);
  }

  /* Floating Add Button */
  .floating-add-btn {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
    color: white;
    box-shadow: 0 8px 25px rgba(124, 58, 237, 0.4);
    transition: all 0.3s ease;
    z-index: 40;
    text-decoration: none;
  }

  .floating-add-btn:hover {
    background: linear-gradient(135deg, #6d28d9 0%, #9333ea 100%);
    transform: translateY(-4px) scale(1.05);
    box-shadow: 0 12px 35px rgba(124, 58, 237, 0.5);
  }

  .floating-add-btn svg {
    transition: transform 0.3s ease;
  }

  .floating-add-btn:hover svg {
    transform: rotate(90deg);
  }

  /* Modal Overlay */
  .modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }

  .diary-page.light .modal-overlay {
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(8px);
  }

  .diary-page.dark .modal-overlay {
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(12px);
  }

  .modal-content-wrapper {
    position: relative;
    max-width: 900px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
  }

  /* Auth Required Screen */
  .auth-required {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  .auth-card {
    max-width: 540px;
    width: 100%;
    text-align: center;
    padding: 3rem 2rem;
    border-radius: 24px;
  }

  .diary-page.light .auth-card {
    background: white;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
  }

  .diary-page.dark .auth-card {
    background: rgba(26, 11, 46, 0.9);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(167, 139, 250, 0.2);
    box-shadow: 0 25px 70px rgba(0, 0, 0, 0.6);
  }

  .auth-icon {
    font-size: 4rem;
    margin-bottom: 1.5rem;
  }

  .auth-title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
    background: linear-gradient(135deg, #7c3aed, #ec4899);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .auth-text {
    font-size: 1.125rem;
    margin-bottom: 2rem;
  }

  .diary-page.light .auth-text {
    color: #64748b;
  }

  .diary-page.dark .auth-text {
    color: #c7d2fe;
  }

  .auth-buttons {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  @media (min-width: 400px) {
    .auth-buttons {
      flex-direction: row;
      justify-content: center;
    }
  }

  .auth-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.875rem 1.75rem;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 12px;
    text-decoration: none;
    transition: all 0.3s ease;
  }

  .auth-btn.primary {
    background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
    color: white;
    box-shadow: 0 4px 20px rgba(124, 58, 237, 0.4);
  }

  .auth-btn.primary:hover {
    background: linear-gradient(135deg, #6d28d9 0%, #9333ea 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(124, 58, 237, 0.5);
  }

  .auth-btn.secondary {
    border: 1.5px solid;
  }

  .diary-page.light .auth-btn.secondary {
    background: white;
    color: #374151;
    border-color: #e5e7eb;
  }

  .diary-page.light .auth-btn.secondary:hover {
    background: #f9fafb;
    border-color: #d1d5db;
  }

  .diary-page.dark .auth-btn.secondary {
    background: rgba(88, 28, 135, 0.3);
    color: #c7d2fe;
    border-color: rgba(167, 139, 250, 0.3);
  }

  .diary-page.dark .auth-btn.secondary:hover {
    background: rgba(124, 58, 237, 0.4);
    border-color: rgba(167, 139, 250, 0.5);
  }

  /* Loading State */
  .loading-screen {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .diary-page.light .loading-screen {
    background: linear-gradient(180deg, #fdfbf9 0%, #faf5ff 100%);
  }

  .diary-page.dark .loading-screen {
    background: radial-gradient(ellipse at top, #1e1b4b 0%, #0a0118 50%, #000000 100%);
  }

  .loading-content {
    text-align: center;
  }

  .loading-spinner {
    width: 64px;
    height: 64px;
    margin: 0 auto 1.5rem;
    border-radius: 50%;
    border: 4px solid #f3e8ff;
    border-top-color: #7c3aed;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .loading-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, #7c3aed, #ec4899);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .loading-text {
    color: #64748b;
  }
`;

export default function Diary() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("dateDesc");
  const { theme } = useTheme();


  const filteredEntries = useMemo(() => {
    let result = [...entries];

   
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(entry =>
      (entry.title?.toLowerCase().includes(query) ||
        entry.director?.toLowerCase().includes(query) ||
        entry.notes?.toLowerCase().includes(query) ||
        entry.Title?.toLowerCase().includes(query))
      );
    }

 
    switch (sortOption) {
      case "dateAsc":
        return [...result].sort((a, b) => (new Date(a.watchedDate || a.createdAt || "1970-01-01") - new Date(b.watchedDate || b.createdAt || "1970-01-01")));
      case "dateDesc":
        return [...result].sort((a, b) => (new Date(b.watchedDate || b.createdAt || "1970-01-01") - new Date(a.watchedDate || a.createdAt || "1970-01-01")));
      case "ratingDesc":
        return [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case "ratingAsc":
        return [...result].sort((a, b) => (a.rating || 0) - (b.rating || 0));
      case "titleAsc":
        return [...result].sort((a, b) => (a.title || a.Title || "").localeCompare(b.title || b.Title || ""));
      case "titleDesc":
        return [...result].sort((a, b) => (b.title || b.Title || "").localeCompare(a.title || a.Title || ""));
      default:
        return result;
    }
  }, [entries, searchQuery, sortOption]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalRuntime = entries.reduce((total, entry) => total + (parseInt(entry.runtime || entry.Runtime) || 0), 0);
    const averageRating = entries.length > 0
      ? entries.reduce((sum, entry) => sum + (parseFloat(entry.rating || entry.IMDbRating) || 0), 0) / entries.length
      : 0;

    return {
      totalMovies: entries.length,
      averageRating,
      totalHours: Math.floor(totalRuntime / 60),
      totalMinutes: totalRuntime % 60,
    };
  }, [entries]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, "diary"),
          where("uid", "==", currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const results = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEntries(results);
      } catch (err) {
        console.error("Failed to fetch diary entries:", err);
        toast.error("Failed to load your collection");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "diary", id));
      setEntries(prev => prev.filter((entry) => entry.id !== id));
      toast.success("Entry deleted successfully");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete entry");
    }
  };

  if (loading) {
    return (
      <>
        <style>{diaryStyles}</style>
        <div className={`diary-page ${theme}`}>
          <div className="loading-screen">
            <div className="loading-content">
              <div className="loading-spinner"></div>
              <h2 className="loading-title">Loading Your Collection</h2>
              <p className="loading-text">Preparing your movie diary...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <style>{diaryStyles}</style>
        <div className={`diary-page ${theme}`}>
          <div className="auth-required">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="auth-card"
            >
              <div className="auth-icon">🎬</div>
              <h1 className="auth-title">Your Movie Diary</h1>
              <p className="auth-text">
                Curate your cinematic journey. Track, rate, and relive every movie experience in your personal collection.
              </p>
              <div className="auth-buttons">
                <Link to="/login" className="auth-btn primary">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign In
                </Link>
                <Link to="/register" className="auth-btn secondary">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Create Account
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </>
    );
  }

  if (entries.length === 0) {
    return (
      <>
        <style>{diaryStyles}</style>
        <div className={`diary-page ${theme}`}>
          <div className="diary-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="empty-state"
              style={{ marginTop: '2rem' }}
            >
              <div className="empty-state-icon">🎬</div>
              <h2 className="empty-state-title">Your Movie Diary Awaits</h2>
              <p className="empty-state-text">
                Start building your cinematic collection. Search for movies and add them to your personal archive.
              </p>
              <Link to="/finder" className="add-movie-btn">
                <FiPlus size={18} />
                Add Your First Movie
              </Link>
            </motion.div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{diaryStyles}</style>
      <div className={`diary-page ${theme}`}>
        <div className="diary-container">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="diary-header"
          >
            <h1 className="diary-title">Your Movie Diary</h1>
            <p className="diary-subtitle">
              {filteredEntries.length} {filteredEntries.length === 1 ? "movie" : "movies"} in your collection
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="stats-grid"
          >
            <motion.div className="stat-card" whileHover={{ y: -4 }}>
              <div className="stat-icon purple">
                <FiFilm size={24} />
              </div>
              <div className="stat-label">Total Movies</div>
              <div className="stat-value">{stats.totalMovies}</div>
            </motion.div>

            <motion.div className="stat-card" whileHover={{ y: -4 }}>
              <div className="stat-icon amber">
                <FiStar size={24} />
              </div>
              <div className="stat-label">Avg. Rating</div>
              <div className="stat-value">{stats.averageRating.toFixed(1)}</div>
            </motion.div>

            <motion.div className="stat-card" whileHover={{ y: -4 }}>
              <div className="stat-icon pink">
                <FiClock size={24} />
              </div>
              <div className="stat-label">Watch Time</div>
              <div className="stat-value">{stats.totalHours}h {stats.totalMinutes}m</div>
            </motion.div>
          </motion.div>

          {/* Controls Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="controls-row"
          >
            <div className="search-wrapper">
              <FiSearch className="search-icon" size={18} />
              <input
                type="text"
                placeholder="Search movies..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="search-clear"
                >
                  <FiX size={16} />
                </button>
              )}
            </div>

            <Link to="/finder" className="add-movie-btn">
              <FiPlus size={18} />
              Add Movie
            </Link>
          </motion.div>

          {/* Movies Grid or Empty State */}
          {filteredEntries.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="empty-state"
            >
              <div className="empty-state-icon">🔍</div>
              <h3 className="empty-state-title">No movies found</h3>
              <p className="empty-state-text">
                Try adjusting your search to find what you're looking for.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSortOption("dateDesc");
                }}
                className="reset-btn"
              >
                Reset Filters
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="movies-grid"
            >
              {filteredEntries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className="movie-card-wrapper"
                >
                  <EntryCard
                    entry={entry}
                    onClick={setSelectedEntry}
                    onDelete={handleDelete}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Floating Add Button */}
        <Link to="/finder" className="floating-add-btn">
          <FiPlus size={24} />
        </Link>

        {/* Modal */}
        <AnimatePresence>
          {selectedEntry && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="modal-overlay"
              onClick={(e) => {
                if (e.target === e.currentTarget) setSelectedEntry(null);
              }}
            >
              <motion.div
                initial={{ scale: 0.95, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 20, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="modal-content-wrapper"
              >
                <EntryModal
                  entry={selectedEntry}
                  onClose={() => setSelectedEntry(null)}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}