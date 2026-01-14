import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import { FiTrash2, FiPlus, FiX, FiStar, FiClock, FiFilm, FiSearch } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";
import MoodSelector from "../components/MoodSelector";

const watchLaterStyles = `
  .watchlater-page {
    min-height: 100vh;
    padding-top: 100px;
    padding-bottom: 60px;
    transition: background 0.3s ease;
  }

  .watchlater-page.light {
    background: linear-gradient(180deg, #fdfbf9 0%, #fef5f0 50%, #faf5ff 100%);
  }

  .watchlater-page.dark {
    background: radial-gradient(ellipse at top, #1e1b4b 0%, #0a0118 50%, #000000 100%);
  }

  .watchlater-container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .watchlater-header {
    margin-bottom: 2rem;
  }

  .watchlater-title {
    font-size: clamp(2rem, 4vw, 2.5rem);
    font-weight: 700;
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, #7c3aed, #ec4899);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .watchlater-subtitle {
    font-size: 1rem;
  }

  .watchlater-page.light .watchlater-subtitle {
    color: #64748b;
  }

  .watchlater-page.dark .watchlater-subtitle {
    color: #c7d2fe;
  }

  /* Stats Grid */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .stat-card {
    padding: 1.25rem;
    border-radius: 16px;
    transition: all 0.3s ease;
  }

  .watchlater-page.light .stat-card {
    background: white;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
    border: 1px solid rgba(0, 0, 0, 0.04);
  }

  .watchlater-page.dark .stat-card {
    background: rgba(30, 27, 75, 0.5);
    border: 1px solid rgba(167, 139, 250, 0.2);
  }

  .stat-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.75rem;
  }

  .stat-icon.purple {
    background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
    color: #7c3aed;
  }

  .stat-icon.amber {
    background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
    color: #f59e0b;
  }

  .stat-label {
    font-size: 0.8125rem;
    margin-bottom: 0.25rem;
  }

  .watchlater-page.light .stat-label {
    color: #64748b;
  }

  .watchlater-page.dark .stat-label {
    color: #a5b4fc;
  }

  .stat-value {
    font-size: 1.5rem;
    font-weight: 700;
  }

  .watchlater-page.light .stat-value {
    color: #1a1a2e;
  }

  .watchlater-page.dark .stat-value {
    color: #f8f9ff;
  }

  /* Search */
  .search-wrapper {
    position: relative;
    max-width: 400px;
    margin-bottom: 2rem;
  }

  .search-input {
    width: 100%;
    padding: 0.875rem 1rem;
    padding-left: 2.75rem;
    font-size: 0.9375rem;
    border-radius: 12px;
    transition: all 0.3s ease;
  }

  .watchlater-page.light .search-input {
    background: white;
    border: 1.5px solid #e5e7eb;
    color: #1a1a2e;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.02);
  }

  .watchlater-page.light .search-input:focus {
    border-color: #7c3aed;
    box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.1);
    outline: none;
  }

  .watchlater-page.dark .search-input {
    background: rgba(30, 27, 75, 0.6);
    border: 1.5px solid rgba(167, 139, 250, 0.2);
    color: #f8f9ff;
  }

  .watchlater-page.dark .search-input:focus {
    border-color: #a78bfa;
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
  }

  /* Movies Grid */
  .movies-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  /* Movie Card - Reference Style */
  .movie-card {
    border-radius: 20px;
    overflow: hidden;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
  }

  .watchlater-page.light .movie-card {
    background: white;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
    border: 1px solid rgba(0, 0, 0, 0.04);
  }

  .watchlater-page.light .movie-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }

  .watchlater-page.dark .movie-card {
    background: rgba(30, 27, 75, 0.6);
    border: 1px solid rgba(167, 139, 250, 0.2);
  }

  .watchlater-page.dark .movie-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 50px rgba(124, 58, 237, 0.3);
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

  .movie-card:hover .card-image {
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

  .watchlater-page.light .card-image-fallback {
    background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
    color: #7c3aed;
  }

  .watchlater-page.dark .card-image-fallback {
    background: linear-gradient(135deg, #2e1065 0%, #1e1b4b 100%);
    color: #a78bfa;
  }

  .card-delete-btn {
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

  .card-delete-btn:hover {
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

  .watchlater-page.light .card-title {
    color: #1a1a2e;
  }

  .watchlater-page.dark .card-title {
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

  .watchlater-page.light .rating-badge {
    background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
    color: #b45309;
  }

  .watchlater-page.dark .rating-badge {
    background: rgba(245, 158, 11, 0.2);
    color: #fbbf24;
  }

  .card-description {
    font-size: 0.875rem;
    line-height: 1.6;
  }

  .watchlater-page.light .card-description {
    color: #64748b;
  }

  .watchlater-page.dark .card-description {
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

  .watchlater-page.light .card-tag {
    background: #f3f4f6;
    color: #4b5563;
  }

  .watchlater-page.dark .card-tag {
    background: rgba(124, 58, 237, 0.15);
    color: #c7d2fe;
  }

  .card-action-btn {
    width: 100%;
    padding: 0.875rem;
    margin-top: 0.5rem;
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

  .watchlater-page.light .card-action-btn {
    background: #1a1a2e;
    color: white;
  }

  .watchlater-page.light .card-action-btn:hover {
    background: #2d2d4a;
  }

  .watchlater-page.dark .card-action-btn {
    background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
    color: white;
  }

  .watchlater-page.dark .card-action-btn:hover {
    background: linear-gradient(135deg, #6d28d9 0%, #9333ea 100%);
  }

  /* Empty State */
  .empty-state {
    text-align: center;
    padding: 4rem 2rem;
    border-radius: 20px;
  }

  .watchlater-page.light .empty-state {
    background: white;
    border: 2px dashed #e5e7eb;
  }

  .watchlater-page.dark .empty-state {
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

  .watchlater-page.light .empty-state-title {
    color: #1a1a2e;
  }

  .watchlater-page.dark .empty-state-title {
    color: #f8f9ff;
  }

  .empty-state-text {
    max-width: 400px;
    margin: 0 auto 1.5rem;
  }

  .watchlater-page.light .empty-state-text {
    color: #64748b;
  }

  .watchlater-page.dark .empty-state-text {
    color: #a5b4fc;
  }

  .empty-state-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.875rem 1.5rem;
    background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
    color: white;
    font-weight: 600;
    border-radius: 12px;
    text-decoration: none;
    transition: all 0.3s ease;
  }

  .empty-state-btn:hover {
    background: linear-gradient(135deg, #6d28d9 0%, #9333ea 100%);
    transform: translateY(-2px);
  }

  /* Auth Required */
  .auth-required {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  .auth-card {
    max-width: 480px;
    width: 100%;
    text-align: center;
    padding: 2.5rem 2rem;
    border-radius: 20px;
  }

  .watchlater-page.light .auth-card {
    background: white;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  }

  .watchlater-page.dark .auth-card {
    background: rgba(26, 11, 46, 0.9);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(167, 139, 250, 0.2);
  }

  .auth-icon {
    font-size: 3.5rem;
    margin-bottom: 1rem;
  }

  .auth-title {
    font-size: 1.75rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, #7c3aed, #ec4899);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .auth-text {
    margin-bottom: 1.5rem;
  }

  .watchlater-page.light .auth-text {
    color: #64748b;
  }

  .watchlater-page.dark .auth-text {
    color: #c7d2fe;
  }

  .auth-buttons {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
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
    padding: 0.75rem 1.5rem;
    font-size: 0.9375rem;
    font-weight: 600;
    border-radius: 10px;
    text-decoration: none;
    transition: all 0.2s ease;
  }

  .auth-btn.primary {
    background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
    color: white;
  }

  .auth-btn.secondary {
    border: 1.5px solid;
  }

  .watchlater-page.light .auth-btn.secondary {
    background: white;
    color: #374151;
    border-color: #e5e7eb;
  }

  .watchlater-page.dark .auth-btn.secondary {
    background: rgba(88, 28, 135, 0.3);
    color: #c7d2fe;
    border-color: rgba(167, 139, 250, 0.3);
  }

  /* Modal */
  .modal-overlay {
    position: fixed !important;
    inset: 0;
    z-index: 2147483647 !important;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }

  .watchlater-page.light .modal-overlay {
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(12px);
  }

  .watchlater-page.dark .modal-overlay {
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(12px);
  }

  .modal-content {
    position: relative;
    width: 100%;
    max-width: 800px;
    border-radius: 20px;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    max-height: 90vh;
    overflow-y: auto;
  }

  @media (min-width: 768px) {
    .modal-content {
      flex-direction: row;
      gap: 2rem;
    }
  }

  .watchlater-page.light .modal-content {
    background: white;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  }

  .watchlater-page.dark .modal-content {
    background: linear-gradient(135deg, #1e1b4b 0%, #0a0118 100%);
    border: 1px solid rgba(167, 139, 250, 0.3);
  }

  .modal-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    font-size: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
  }

  .watchlater-page.light .modal-close {
    background: #f3f4f6;
    color: #6b7280;
  }

  .watchlater-page.dark .modal-close {
    background: rgba(88, 28, 135, 0.4);
    color: #c7d2fe;
  }

  .modal-poster {
    flex-shrink: 0;
    width: 200px;
    border-radius: 12px;
    overflow: hidden;
    margin: 0 auto;
  }

  @media (min-width: 768px) {
    .modal-poster {
      margin: 0;
    }
  }

  .modal-poster img {
    width: 100%;
    display: block;
  }

  .modal-form {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .modal-title {
    font-size: 1.25rem;
    font-weight: 700;
    background: linear-gradient(135deg, #7c3aed, #ec4899);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .form-label {
    display: block;
    font-size: 0.8125rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.5rem;
  }

  .watchlater-page.light .form-label {
    color: #64748b;
  }

  .watchlater-page.dark .form-label {
    color: #a5b4fc;
  }

  .form-textarea {
    width: 100%;
    min-height: 100px;
    padding: 0.875rem;
    font-size: 0.9375rem;
    border-radius: 10px;
    resize: vertical;
  }

  .watchlater-page.light .form-textarea {
    background: #f9fafb;
    border: 1.5px solid #e5e7eb;
    color: #1a1a2e;
  }

  .watchlater-page.dark .form-textarea {
    background: rgba(30, 27, 75, 0.5);
    border: 1.5px solid rgba(167, 139, 250, 0.2);
    color: #f8f9ff;
  }

  .modal-actions {
    display: flex;
    gap: 0.75rem;
    margin-top: 0.5rem;
  }

  .modal-btn {
    flex: 1;
    padding: 0.75rem 1.25rem;
    font-size: 0.9375rem;
    font-weight: 600;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
  }

  .modal-btn.primary {
    background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
    color: white;
  }

  .modal-btn.primary:hover {
    background: linear-gradient(135deg, #6d28d9 0%, #9333ea 100%);
  }

  .modal-btn.primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .modal-btn.secondary {
    border: 1.5px solid;
  }

  .watchlater-page.light .modal-btn.secondary {
    background: #f9fafb;
    color: #374151;
    border-color: #e5e7eb;
  }

  .watchlater-page.dark .modal-btn.secondary {
    background: rgba(88, 28, 135, 0.3);
    color: #c7d2fe;
    border-color: rgba(167, 139, 250, 0.3);
  }
`;

export default function WatchLater() {
  const [user, setUser] = useState(null);
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mood, setMood] = useState("");
  const [review, setReview] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { theme } = useTheme();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return unsub;
  }, []);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "watchLater"), where("uid", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          imdbID: d.imdbID,
          title: d.title,
          poster: d.poster,
          year: d.year,
          imdbRating: d.imdbRating || d.IMDbRating || null,
          createdAt: d.createdAt || null,
        };
      });
      setMovies(data);
    });

    return () => unsubscribe();
  }, [user]);

  const handleRemove = async (imdbID) => {
    const movieToDelete = movies.find((m) => m.imdbID === imdbID);
    if (!movieToDelete?.id) return;

    try {
      await deleteDoc(doc(db, "watchLater", movieToDelete.id));
      toast.success("Removed from Watchlist");
    } catch (err) {
      toast.error("Failed to remove movie.");
      console.error(err);
    }
  };

  const handleAddToDiary = async () => {
    if (!movieDetails || !user) return;
    if (!mood) return toast.error("Please select a mood");

    try {
      await addDoc(collection(db, "diary"), {
        uid: user.uid,
        imdbID: movieDetails.imdbID,
        Title: movieDetails.title,
        Poster: movieDetails.poster,
        Year: movieDetails.year,
        Genre: movieDetails.genre,
        Director: movieDetails.director,
        Actors: movieDetails.actors,
        Runtime: movieDetails.runtime,
        IMDbRating: movieDetails.imdbRating,
        Plot: movieDetails.plot,
        mood,
        review,
        createdAt: serverTimestamp(),
      });

      await handleRemove(movieDetails.imdbID);
      toast.success("Added to Diary!");
      closeModal();
    } catch (err) {
      toast.error("Failed to add to diary.");
      console.error(err);
    }
  };

  const openModal = async (movie) => {
    setSelectedMovie(movie);
    setLoading(true);
    try {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${import.meta.env.VITE_OMDB_API_KEY}&i=${movie.imdbID}&plot=full`
      );
      const data = await res.json();
      if (data.Response === "True") {
        setMovieDetails({
          imdbID: data.imdbID,
          title: data.Title,
          poster: data.Poster,
          year: data.Year,
          genre: data.Genre,
          director: data.Director,
          actors: data.Actors,
          runtime: data.Runtime,
          imdbRating: data.imdbRating,
          plot: data.Plot,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedMovie(null);
    setMovieDetails(null);
    setMood("");
    setReview("");
  };

  const filteredMovies = useMemo(() => {
    return movies.filter((movie) =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [movies, searchQuery]);

  // Stats
  const avgRating = useMemo(() => {
    const rated = movies.filter((m) => m.imdbRating);
    if (rated.length === 0) return "N/A";
    const avg = rated.reduce((acc, m) => acc + parseFloat(m.imdbRating), 0) / rated.length;
    return avg.toFixed(1);
  }, [movies]);

  if (!user) {
    return (
      <>
        <style>{watchLaterStyles}</style>
        <div className={`watchlater-page ${theme}`}>
          <div className="auth-required">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="auth-card"
            >
              <div className="auth-icon">🎬</div>
              <h1 className="auth-title">Your Watchlist</h1>
              <p className="auth-text">
                Sign in to manage your movie watchlist and track what you want to see.
              </p>
              <div className="auth-buttons">
                <Link to="/login" className="auth-btn primary">Sign In</Link>
                <Link to="/register" className="auth-btn secondary">Create Account</Link>
              </div>
            </motion.div>
          </div>
        </div>
      </>
    );
  }

  if (movies.length === 0) {
    return (
      <>
        <style>{watchLaterStyles}</style>
        <div className={`watchlater-page ${theme}`}>
          <div className="watchlater-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="empty-state"
              style={{ marginTop: '2rem' }}
            >
              <div className="empty-state-icon">🎯</div>
              <h2 className="empty-state-title">Your Watchlist is Empty</h2>
              <p className="empty-state-text">
                Start building your movie queue by adding films you're excited to watch.
              </p>
              <Link to="/finder" className="empty-state-btn">
                <FiPlus size={18} />
                Discover Movies
              </Link>
            </motion.div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{watchLaterStyles}</style>
      <div className={`watchlater-page ${theme}`}>
        <div className="watchlater-container">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="watchlater-header"
          >
            <h1 className="watchlater-title">Your Watchlist</h1>
            <p className="watchlater-subtitle">
              {movies.length} {movies.length === 1 ? "movie" : "movies"} waiting to be watched
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="stats-grid"
          >
            <div className="stat-card">
              <div className="stat-icon purple">
                <FiFilm size={20} />
              </div>
              <div className="stat-label">Total Movies</div>
              <div className="stat-value">{movies.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon amber">
                <FiStar size={20} />
              </div>
              <div className="stat-label">Avg. Rating</div>
              <div className="stat-value">{avgRating}</div>
            </div>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="search-wrapper"
          >
            <FiSearch className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search your watchlist..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </motion.div>

          {/* Movies Grid */}
          {filteredMovies.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <h3 className="empty-state-title">No movies found</h3>
              <p className="empty-state-text">Try a different search term.</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="movies-grid"
            >
              <AnimatePresence>
                {filteredMovies.map((movie, index) => (
                  <motion.div
                    key={movie.imdbID}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: 0.05 * index }}
                    className="movie-card"
                  >
                    {/* Image */}
                    <div className="card-image-wrapper">
                      {movie.poster && movie.poster !== "N/A" ? (
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          className="card-image"
                          loading="lazy"
                        />
                      ) : (
                        <div className="card-image-fallback">🎬</div>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(movie.imdbID);
                        }}
                        className="card-delete-btn"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="card-content">
                      <div className="card-header">
                        <h3 className="card-title">{movie.title}</h3>
                        {movie.imdbRating && (
                          <div className="rating-badge">
                            <FiStar size={14} />
                            {movie.imdbRating}
                          </div>
                        )}
                      </div>

                      <p className="card-description">
                        Added to your watchlist - ready for your next movie night!
                      </p>

                      <div className="card-tags">
                        <span className="card-tag">
                          <FiClock size={12} />
                          {movie.year}
                        </span>
                        <span className="card-tag">Watch Later</span>
                      </div>

                      <button
                        onClick={() => openModal(movie)}
                        className="card-action-btn"
                      >
                        Mark as Watched
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        {/* Modal */}
        <AnimatePresence>
          {selectedMovie && movieDetails && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="modal-overlay"
              onClick={closeModal}
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <button onClick={closeModal} className="modal-close">
                  <FiX size={20} />
                </button>

                <div className="modal-poster">
                  <img
                    src={movieDetails.poster !== "N/A" ? movieDetails.poster : "/fallback.png"}
                    alt={movieDetails.title}
                  />
                </div>

                <div className="modal-form">
                  <h2 className="modal-title">Add to Diary</h2>

                  <div>
                    <label className="form-label">Your Review</label>
                    <textarea
                      className="form-textarea"
                      placeholder="What did you think?"
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="form-label">Your Mood</label>
                    <MoodSelector selected={mood} onSelect={setMood} />
                  </div>

                  <div className="modal-actions">
                    <button
                      onClick={handleAddToDiary}
                      disabled={!mood}
                      className={`modal-btn ${mood ? "primary" : "secondary"}`}
                    >
                      Save to Diary
                    </button>
                    <button onClick={closeModal} className="modal-btn secondary">
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
