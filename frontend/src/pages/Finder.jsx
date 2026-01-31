import { useEffect, useState, useCallback, useRef } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import MoodSelector from "../components/MoodSelector";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const finderStyles = `
  .finder-page {
    min-height: 100vh;
    padding-top: 100px;
    padding-bottom: 60px;
    transition: background 0.3s ease;
  }

  .finder-page.light {
    background: linear-gradient(180deg, #fdfbf9 0%, #fef5f0 50%, #faf5ff 100%);
  }

  .finder-page.dark {
    background: radial-gradient(ellipse at top, #1e1b4b 0%, #0a0118 50%, #000000 100%);
  }

  .finder-container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .finder-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .finder-title {
    font-size: clamp(2rem, 4vw, 2.75rem);
    font-weight: 800;
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, #7c3aed, #ec4899);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .finder-subtitle {
    font-size: 1rem;
    max-width: 500px;
    margin: 0 auto;
  }

  .finder-page.light .finder-subtitle {
    color: #64748b;
  }

  .finder-page.dark .finder-subtitle {
    color: #c7d2fe;
  }

  /* Spotlight Search */
  .spotlight-wrapper {
    max-width: 680px;
    margin: 0 auto 3rem;
    position: relative;
    z-index: 30;
  }

  .spotlight-container {
    position: relative;
    border-radius: 16px;
    overflow: visible;
    transition: all 0.3s ease;
  }

  .spotlight-container.active {
    border-radius: 16px 16px 0 0;
  }

  .finder-page.light .spotlight-container {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow: 
      0 2px 40px rgba(0, 0, 0, 0.08),
      0 0 0 1px rgba(0, 0, 0, 0.04),
      inset 0 0 0 1px rgba(255, 255, 255, 0.6);
  }

  .finder-page.light .spotlight-container:focus-within {
    box-shadow: 
      0 8px 60px rgba(124, 58, 237, 0.15),
      0 0 0 1px rgba(124, 58, 237, 0.1),
      inset 0 0 0 1px rgba(255, 255, 255, 0.8);
  }

  .finder-page.dark .spotlight-container {
    background: rgba(30, 27, 75, 0.8);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow: 
      0 4px 40px rgba(0, 0, 0, 0.4),
      0 0 0 1px rgba(167, 139, 250, 0.15),
      inset 0 0 0 1px rgba(255, 255, 255, 0.05);
  }

  .finder-page.dark .spotlight-container:focus-within {
    box-shadow: 
      0 8px 60px rgba(124, 58, 237, 0.3),
      0 0 0 1px rgba(167, 139, 250, 0.3),
      inset 0 0 0 1px rgba(255, 255, 255, 0.08);
  }

  .spotlight-input-wrapper {
    display: flex;
    align-items: center;
    padding: 0.875rem 1.25rem;
    gap: 0.75rem;
  }

  .spotlight-icon {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    color: #9ca3af;
  }

  .spotlight-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    font-size: 1.0625rem;
    font-weight: 400;
  }

  .finder-page.light .spotlight-input {
    color: #1a1a2e;
  }

  .finder-page.light .spotlight-input::placeholder {
    color: #9ca3af;
  }

  .finder-page.dark .spotlight-input {
    color: #f8f9ff;
  }

  .finder-page.dark .spotlight-input::placeholder {
    color: #a5b4fc;
  }

  .spotlight-shortcuts {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .spotlight-key {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 24px;
    height: 24px;
    padding: 0 6px;
    font-size: 0.75rem;
    font-weight: 500;
    border-radius: 6px;
  }

  .finder-page.light .spotlight-key {
    background: #f1f5f9;
    color: #64748b;
    border: 1px solid #e2e8f0;
  }

  .finder-page.dark .spotlight-key {
    background: rgba(88, 28, 135, 0.4);
    color: #a5b4fc;
    border: 1px solid rgba(167, 139, 250, 0.2);
  }

  /* Suggestions Dropdown */
  .suggestions-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    border-radius: 0 0 16px 16px;
    overflow: hidden;
    z-index: 50;
  }

  .finder-page.light .suggestions-dropdown {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-top: 1px solid rgba(0, 0, 0, 0.06);
    box-shadow: 
      0 20px 60px rgba(0, 0, 0, 0.12),
      0 0 0 1px rgba(0, 0, 0, 0.04);
  }

  .finder-page.dark .suggestions-dropdown {
    background: rgba(26, 11, 46, 0.95);
    backdrop-filter: blur(20px);
    border-top: 1px solid rgba(167, 139, 250, 0.15);
    box-shadow: 
      0 20px 60px rgba(0, 0, 0, 0.5),
      0 0 0 1px rgba(167, 139, 250, 0.1);
  }

  .suggestions-list {
    max-height: 400px;
    overflow-y: auto;
    padding: 0.5rem;
  }

  .suggestion-item {
    display: flex;
    align-items: center;
    gap: 0.875rem;
    padding: 0.75rem 1rem;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .finder-page.light .suggestion-item:hover,
  .finder-page.light .suggestion-item.active {
    background: #f3f4f6;
  }

  .finder-page.dark .suggestion-item:hover,
  .finder-page.dark .suggestion-item.active {
    background: rgba(124, 58, 237, 0.2);
  }

  .suggestion-poster {
    width: 40px;
    height: 56px;
    border-radius: 6px;
    object-fit: cover;
    flex-shrink: 0;
  }

  .suggestion-poster-placeholder {
    width: 40px;
    height: 56px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 1.25rem;
  }

  .finder-page.light .suggestion-poster-placeholder {
    background: #f3f4f6;
    color: #9ca3af;
  }

  .finder-page.dark .suggestion-poster-placeholder {
    background: rgba(88, 28, 135, 0.4);
    color: #a78bfa;
  }

  .suggestion-info {
    flex: 1;
    min-width: 0;
  }

  .suggestion-title {
    font-size: 0.9375rem;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .finder-page.light .suggestion-title {
    color: #1a1a2e;
  }

  .finder-page.dark .suggestion-title {
    color: #f8f9ff;
  }

  .suggestion-meta {
    font-size: 0.8125rem;
    display: flex;
    gap: 0.5rem;
  }

  .finder-page.light .suggestion-meta {
    color: #64748b;
  }

  .finder-page.dark .suggestion-meta {
    color: #a5b4fc;
  }

  .suggestion-action {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.375rem 0.75rem;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 500;
    opacity: 0;
    transition: opacity 0.15s ease;
  }

  .suggestion-item:hover .suggestion-action {
    opacity: 1;
  }

  .finder-page.light .suggestion-action {
    background: #7c3aed;
    color: white;
  }

  .finder-page.dark .suggestion-action {
    background: rgba(167, 139, 250, 0.3);
    color: #e0e7ff;
  }

  .suggestions-loading {
    padding: 2rem;
    text-align: center;
  }

  .finder-page.light .suggestions-loading {
    color: #64748b;
  }

  .finder-page.dark .suggestions-loading {
    color: #a5b4fc;
  }

  .suggestions-empty {
    padding: 2rem;
    text-align: center;
  }

  .finder-page.light .suggestions-empty {
    color: #64748b;
  }

  .finder-page.dark .suggestions-empty {
    color: #a5b4fc;
  }

  /* Movies Grid */
  .movies-section {
    margin-top: 2rem;
  }

  .section-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .finder-page.light .section-title {
    color: #1a1a2e;
  }

  .finder-page.dark .section-title {
    color: #f8f9ff;
  }

  .movies-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.25rem;
  }

  .movie-card {
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .finder-page.light .movie-card {
    background: white;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
    border: 1px solid rgba(0, 0, 0, 0.04);
  }

  .finder-page.light .movie-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.08);
  }

  .finder-page.dark .movie-card {
    background: rgba(30, 27, 75, 0.6);
    border: 1px solid rgba(167, 139, 250, 0.2);
  }

  .finder-page.dark .movie-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 40px rgba(124, 58, 237, 0.3);
  }

  .movie-poster-wrapper {
    aspect-ratio: 2/3;
    overflow: hidden;
    position: relative;
  }

  .movie-poster {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }

  .movie-card:hover .movie-poster {
    transform: scale(1.05);
  }

  .movie-poster-fallback {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
  }

  .finder-page.light .movie-poster-fallback {
    background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
    color: #7c3aed;
  }

  .finder-page.dark .movie-poster-fallback {
    background: linear-gradient(135deg, #2e1065 0%, #1e1b4b 100%);
    color: #a78bfa;
  }

  .movie-info {
    padding: 1rem;
  }

  .movie-title {
    font-size: 0.9375rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .finder-page.light .movie-title {
    color: #1a1a2e;
  }

  .finder-page.dark .movie-title {
    color: #f8f9ff;
  }

  .movie-year {
    font-size: 0.8125rem;
  }

  .finder-page.light .movie-year {
    color: #64748b;
  }

  .finder-page.dark .movie-year {
    color: #a5b4fc;
  }

  .movie-actions {
    display: flex;
    gap: 0.5rem;
    padding: 0 1rem 1rem;
  }

  .movie-action-btn {
    flex: 1;
    padding: 0.625rem;
    font-size: 0.8125rem;
    font-weight: 600;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
  }

  .movie-action-btn.primary {
    background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
    color: white;
  }

  .movie-action-btn.primary:hover {
    background: linear-gradient(135deg, #6d28d9 0%, #9333ea 100%);
  }

  .movie-action-btn.secondary {
    border: 1.5px solid;
  }

  .finder-page.light .movie-action-btn.secondary {
    background: #f9fafb;
    color: #374151;
    border-color: #e5e7eb;
  }

  .finder-page.light .movie-action-btn.secondary:hover {
    background: #f3f4f6;
  }

  .finder-page.dark .movie-action-btn.secondary {
    background: rgba(88, 28, 135, 0.3);
    color: #c7d2fe;
    border-color: rgba(167, 139, 250, 0.3);
  }

  .finder-page.dark .movie-action-btn.secondary:hover {
    background: rgba(124, 58, 237, 0.4);
  }

  /* Empty State */
  .empty-state {
    text-align: center;
    padding: 4rem 2rem;
    border-radius: 20px;
  }

  .finder-page.light .empty-state {
    background: white;
    border: 2px dashed #e5e7eb;
  }

  .finder-page.dark .empty-state {
    background: rgba(30, 27, 75, 0.5);
    border: 2px dashed rgba(167, 139, 250, 0.3);
  }

  .empty-state-icon {
    font-size: 3.5rem;
    margin-bottom: 1rem;
  }

  .empty-state-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .finder-page.light .empty-state-title {
    color: #1a1a2e;
  }

  .finder-page.dark .empty-state-title {
    color: #f8f9ff;
  }

  .empty-state-text {
    max-width: 400px;
    margin: 0 auto;
  }

  .finder-page.light .empty-state-text {
    color: #64748b;
  }

  .finder-page.dark .empty-state-text {
    color: #a5b4fc;
  }
   @media (max-width: 768px) {
    .spotlight-shortcuts {
      display:none;
    }
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

  .finder-page.light .modal-overlay {
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(12px);
  }

  .finder-page.dark .modal-overlay {
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

  .finder-page.light .modal-content {
    background: white;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  }

  .finder-page.dark .modal-content {
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
  }

  .finder-page.light .modal-close {
    background: #f3f4f6;
    color: #6b7280;
  }

  .finder-page.dark .modal-close {
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

  .finder-page.light .form-label {
    color: #64748b;
  }

  .finder-page.dark .form-label {
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

  .finder-page.light .form-textarea {
    background: #f9fafb;
    border: 1.5px solid #e5e7eb;
    color: #1a1a2e;
  }

  .finder-page.light .form-textarea:focus {
    border-color: #7c3aed;
    outline: none;
  }

  .finder-page.dark .form-textarea {
    background: rgba(30, 27, 75, 0.5);
    border: 1.5px solid rgba(167, 139, 250, 0.2);
    color: #f8f9ff;
  }

  .finder-page.dark .form-textarea:focus {
    border-color: #a78bfa;
    outline: none;
  }

  .modal-actions {
    display: flex;
    gap: 0.75rem;
    margin-top: 0.5rem;
  }

  .modal-actions .movie-action-btn {
    padding: 0.75rem 1.25rem;
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

  .finder-page.light .auth-card {
    background: white;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  }

  .finder-page.dark .auth-card {
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

  .finder-page.light .auth-text {
    color: #64748b;
  }

  .finder-page.dark .auth-text {
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

  .auth-btn.primary:hover {
    background: linear-gradient(135deg, #6d28d9 0%, #9333ea 100%);
  }

  .auth-btn.secondary {
    border: 1.5px solid;
  }

  .finder-page.light .auth-btn.secondary {
    background: white;
    color: #374151;
    border-color: #e5e7eb;
  }

  .finder-page.dark .auth-btn.secondary {
    background: rgba(88, 28, 135, 0.3);
    color: #c7d2fe;
    border-color: rgba(167, 139, 250, 0.3);
  }
`;

export default function Finder() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [review, setReview] = useState("");
  const [mood, setMood] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const { theme } = useTheme();
  const searchInputRef = useRef(null);
  const suggestionsTimeoutRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return unsubscribe;
  }, []);

  // Debounced search for suggestions
  const fetchSuggestions = useCallback(async (query) => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      setIsSuggestionsOpen(false);
      return;
    }

    try {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${import.meta.env.VITE_OMDB_API_KEY}&s=${query}&type=movie`
      );
      const data = await res.json();
      if (data.Response === "True") {
        setSuggestions(data.Search.slice(0, 6));
        setIsSuggestionsOpen(true);
      } else {
        setSuggestions([]);
      }
    } catch (err) {
      console.error("Suggestions failed:", err);
    }
  }, []);

  // Debounce effect for suggestions
  useEffect(() => {
    if (suggestionsTimeoutRef.current) {
      clearTimeout(suggestionsTimeoutRef.current);
    }

    if (search.trim().length >= 2) {
      suggestionsTimeoutRef.current = setTimeout(() => {
        fetchSuggestions(search);
      }, 300);
    } else {
      setSuggestions([]);
      setIsSuggestionsOpen(false);
    }

    return () => {
      if (suggestionsTimeoutRef.current) {
        clearTimeout(suggestionsTimeoutRef.current);
      }
    };
  }, [search, fetchSuggestions]);

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!search.trim()) return;

    setIsSuggestionsOpen(false);
    setIsLoading(true);

    try {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${import.meta.env.VITE_OMDB_API_KEY}&s=${search}`
      );
      const data = await res.json();
      if (data.Response === "True") {
        setResults(data.Search);
        toast.success(`Found ${data.Search.length} movies!`);
      } else {
        setResults([]);
        toast.error(data.Error || "No movies found");
      }
    } catch (err) {
      console.error("Search failed:", err);
      toast.error("Search failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSuggestion = (movie) => {
    setSearch(movie.Title);
    setIsSuggestionsOpen(false);
    setResults([movie]);
  };

  const handleKeyDown = (e) => {
    if (!isSuggestionsOpen || suggestions.length === 0) {
      if (e.key === "Enter") {
        handleSearch(e);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestionIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestionIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeSuggestionIndex >= 0) {
        handleSelectSuggestion(suggestions[activeSuggestionIndex]);
      } else {
        handleSearch(e);
      }
    } else if (e.key === "Escape") {
      setIsSuggestionsOpen(false);
    }
  };

  const handleSaveToDiary = async () => {
    if (!user) return toast.error("Login required.");
    if (!mood) return toast.error("Select a mood.");

    try {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${import.meta.env.VITE_OMDB_API_KEY}&i=${selectedMovie.imdbID}&plot=full`
      );
      const fullData = await res.json();
      if (fullData.Response !== "True") throw new Error("Movie not found");

      await addDoc(collection(db, "diary"), {
        uid: user.uid,
        imdbID: fullData.imdbID,
        Title: fullData.Title,
        Year: fullData.Year,
        Poster: fullData.Poster,
        Genre: fullData.Genre,
        director: fullData.Director,
        Actors: fullData.Actors,
        Runtime: fullData.Runtime,
        IMDbRating: fullData.imdbRating,
        Plot: fullData.Plot,
        review,
        mood,
        createdAt: new Date(),
      });

      toast.success("Added to diary!");
      setSelectedMovie(null);
      setReview("");
      setMood(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add movie.");
    }
  };

  const handleAddToWatchLater = async (movie) => {
    if (!user) return toast.error("Login required.");
    try {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${import.meta.env.VITE_OMDB_API_KEY}&i=${movie.imdbID}`
      );
      const fullData = await res.json();
      await addDoc(collection(db, "watchLater"), {
        uid: user.uid,
        title: movie.Title,
        year: movie.Year,
        poster: movie.Poster,
        imdbID: movie.imdbID,
        imdbRating: parseFloat(fullData.imdbRating) || 0,
        createdAt: new Date(),
      });
      toast.success("Added to Watch Later!");
    } catch (err) {
      console.error("Failed to add to Watch Later:", err);
      toast.error("Failed to add to Watch Later.");
    }
  };

  if (!user) {
    return (
      <>
        <style>{finderStyles}</style>
        <div className={`finder-page ${theme}`}>
          <div className="auth-required">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="auth-card"
            >
              <div className="auth-icon">🎬</div>
              <h1 className="auth-title">MovieFinder</h1>
              <p className="auth-text">
                Sign in to search and save movies to your personal collection.
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

  return (
    <>
      <style>{finderStyles}</style>
      <div className={`finder-page ${theme}`}>
        <div className="finder-container">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="finder-header"
          >
            <h1 className="finder-title">MovieFinder</h1>
            <p className="finder-subtitle">
              Discover and save your favorite films
            </p>
          </motion.div>

          {/* Spotlight Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="spotlight-wrapper"
          >
            <div className={`spotlight-container ${isSuggestionsOpen && suggestions.length > 0 ? 'active' : ''}`}>
              <div className="spotlight-input-wrapper">
                <svg className="spotlight-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setActiveSuggestionIndex(-1);
                  }}
                  onKeyDown={handleKeyDown}
                  onFocus={() => {
                    if (suggestions.length > 0) setIsSuggestionsOpen(true);
                  }}
                  onBlur={() => {
                    setTimeout(() => setIsSuggestionsOpen(false), 200);
                  }}
                  placeholder="What are you looking for?"
                  className="spotlight-input"
                  autoComplete="off"
                />
                <div className="spotlight-shortcuts">
                  <span className="spotlight-key">⌘</span>
                  <span className="spotlight-key">/</span>
                </div>
              </div>

              {/* Suggestions Dropdown */}
              <AnimatePresence>
                {isSuggestionsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="suggestions-dropdown"
                  >
                    <div className="suggestions-list">
                      {suggestions.length > 0 ? (
                        suggestions.map((movie, index) => (
                          <motion.div
                            key={movie.imdbID}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.03 }}
                            className={`suggestion-item ${index === activeSuggestionIndex ? 'active' : ''}`}
                            onClick={() => handleSelectSuggestion(movie)}
                          >
                            {movie.Poster && movie.Poster !== "N/A" ? (
                              <img
                                src={movie.Poster}
                                alt={movie.Title}
                                className="suggestion-poster"
                              />
                            ) : (
                              <div className="suggestion-poster-placeholder">🎬</div>
                            )}
                            <div className="suggestion-info">
                              <div className="suggestion-title">{movie.Title}</div>
                              <div className="suggestion-meta">
                                <span>{movie.Year}</span>
                                <span>•</span>
                                <span>{movie.Type}</span>
                              </div>
                            </div>
                            <div className="suggestion-action">
                              Select ↵
                            </div>
                          </motion.div>
                        ))
                      ) : search.length >= 2 ? (
                        <div className="suggestions-empty">
                          <p>No movies found for "{search}"</p>
                        </div>
                      ) : null}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Results */}
          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="movies-section"
            >
              <h2 className="section-title">
                Search Results
              </h2>
              <div className="movies-grid">
                {results.map((movie, index) => (
                  <motion.div
                    key={movie.imdbID}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * index }}
                    className="movie-card"
                  >
                    <div className="movie-poster-wrapper">
                      {movie.Poster && movie.Poster !== "N/A" ? (
                        <img
                          src={movie.Poster}
                          alt={movie.Title}
                          className="movie-poster"
                          loading="lazy"
                        />
                      ) : (
                        <div className="movie-poster-fallback">🎬</div>
                      )}
                    </div>
                    <div className="movie-info">
                      <div className="movie-title">{movie.Title}</div>
                      <div className="movie-year">{movie.Year}</div>
                    </div>
                    <div className="movie-actions">
                      <button
                        onClick={() => setSelectedMovie(movie)}
                        className="movie-action-btn primary"
                      >
                        Diary
                      </button>
                      <button
                        onClick={() => handleAddToWatchLater(movie)}
                        className="movie-action-btn secondary"
                      >
                        Later
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Empty State */}
          {results.length === 0 && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="empty-state"
            >
              <div className="empty-state-icon">🍿</div>
              <h3 className="empty-state-title">Start Searching</h3>
              <p className="empty-state-text">
                Type a movie name above to find and save films
              </p>
            </motion.div>
          )}

          {/* Modal */}
          <AnimatePresence>
            {selectedMovie && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="modal-overlay"
                onClick={(e) => {
                  if (e.target === e.currentTarget) setSelectedMovie(null);
                }}
              >
                <motion.div
                  initial={{ scale: 0.95, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.95, y: 20 }}
                  className="modal-content"
                >
                  <button
                    onClick={() => setSelectedMovie(null)}
                    className="modal-close"
                  >
                    ×
                  </button>

                  <div className="modal-poster">
                    <img
                      src={selectedMovie.Poster !== "N/A" ? selectedMovie.Poster : "/fallback.png"}
                      alt={selectedMovie.Title}
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
                        onClick={handleSaveToDiary}
                        disabled={!mood}
                        className={`movie-action-btn ${mood ? "primary" : "secondary"}`}
                        style={!mood ? { opacity: 0.5 } : {}}
                      >
                        Save to Diary
                      </button>
                      <button
                        onClick={() => setSelectedMovie(null)}
                        className="movie-action-btn secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
