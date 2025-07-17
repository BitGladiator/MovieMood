import { useEffect, useState, useMemo } from "react";
import { Trash2, PlusCircle, X, Clock, Star, Calendar, Filter, Popcorn } from "lucide-react";
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

export default function WatchLater() {
  const [user, setUser] = useState(null);
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("date");
  const [mood, setMood] = useState("");
  const [review, setReview] = useState("");
  const [isHovering, setIsHovering] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

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
      toast.custom((t) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="bg-gradient-to-r from-red-600 to-rose-700 text-white px-6 py-3 rounded-xl shadow-xl flex items-center gap-2"
        >
          🎥 Removed from Watch Later
        </motion.div>
      ));
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
        mood,
        review,
        createdAt: serverTimestamp(),
      });

      await handleRemove(movieDetails.imdbID);

      toast.custom((t) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl shadow-xl flex items-center gap-2"
        >
          🎬 Added to Diary!
        </motion.div>
      ));
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
        `https://www.omdbapi.com/?apikey=${
          import.meta.env.VITE_OMDB_API_KEY
        }&i=${movie.imdbID}&plot=full`
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
      } else {
        setMovieDetails({ error: "Details not found." });
      }
    } catch {
      setMovieDetails({ error: "Error fetching details." });
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
    return movies.filter(movie => 
      movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [movies, searchQuery]);

  const sortedMovies = useMemo(() => {
    const moviesCopy = [...filteredMovies];

    if (sortBy === "rating") {
      return moviesCopy
        .filter(movie => movie.imdbRating) // Filter first
        .sort((a, b) => parseFloat(b.imdbRating) - parseFloat(a.imdbRating)); // Then sort
    }

    if (sortBy === "date") {
      return moviesCopy.sort((a, b) => {
        const aTime = a.createdAt?.toMillis?.() || 0;
        const bTime = b.createdAt?.toMillis?.() || 0;
        return bTime - aTime;
      });
    }

    return moviesCopy;
  }, [filteredMovies, sortBy]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-black">
        {/* Animated background elements */}
        <div className="absolute -top-1/3 -left-1/4 w-[800px] h-[800px] bg-purple-900/20 blur-[150px] rounded-full animate-float-slow pointer-events-none"></div>
        <div className="absolute -bottom-1/3 -right-1/4 w-[800px] h-[800px] bg-blue-900/20 blur-[150px] rounded-full animate-float-slow-reverse pointer-events-none"></div>
        
        {/* Floating particles */}
        {[...Array(30)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-10"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `twinkle ${3 + Math.random() * 5}s infinite ${Math.random() * 2}s`
            }}
          />
        ))}
  
        {/* Main content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-2xl mx-auto text-center p-8 md:p-12 backdrop-blur-lg bg-gradient-to-br from-gray-900/80 to-gray-950/80 rounded-3xl border border-gray-800/50 shadow-2xl"
        >
          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/10 rounded-full filter blur-xl"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full filter blur-xl"></div>
          
          {/* Animated movie icon */}
          <motion.div
            animate={{
              y: [0, -15, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-6xl md:text-7xl mb-6"
          >
            🎬
          </motion.div>
          
          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-purple-500 to-blue-500 mb-6 leading-tight"
          >
            Unlock Your Cinematic Universe
          </motion.h1>
          
          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-gray-300 mb-8 max-w-lg mx-auto"
          >
            Log in to access your personalized movie diary, track your watch history, and discover new favorites.
          </motion.p>
          
          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link
              to="/login"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 border border-gray-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Create Account
            </Link>
          </motion.div>
        </motion.div>
  
        {/* Animation keyframes */}
        <style jsx global>{`
          @keyframes float-slow {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(10px, 10px); }
          }
          @keyframes float-slow-reverse {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(-10px, -10px); }
          }
          @keyframes twinkle {
            0%, 100% { opacity: 0.1; }
            50% { opacity: 0.5; }
          }
        `}</style>
      </div>
    );
  }

  if (!movies.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-300 flex flex-col items-center justify-center p-8 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute -top-1/3 -left-1/4 w-[800px] h-[800px] bg-purple-900/10 blur-[150px] rounded-full animate-float-slow pointer-events-none"></div>
        <div className="absolute -bottom-1/3 -right-1/4 w-[800px] h-[800px] bg-blue-900/10 blur-[150px] rounded-full animate-float-slow-reverse pointer-events-none"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center relative z-10"
        >
          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
              y: [0, -10, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-8xl mb-6"
          >
            🎯
          </motion.div>
          <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-4">
            Your Watch Later is Empty
          </h2>
          <p className="text-lg text-gray-400 max-w-md mb-8">
            Start building your cinematic queue by adding movies you're excited to watch.
          </p>
          <Link
            to="/finder"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <PlusCircle size={18} />
            Discover Movies
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white p-4 sm:p-8 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full filter blur-[80px]"></div>
          <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-blue-500 rounded-full filter blur-[80px]"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header with sort controls */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
          >
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Your Watch Later
              </h1>
              <p className="text-gray-400">{movies.length} {movies.length === 1 ? 'movie' : 'movies'} in your queue</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              {/* Search bar */}
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search your list..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl py-3 px-4 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <svg
                  className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              
              {/* Sort dropdown */}
              <div className="flex items-center gap-3 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-2">
                <Filter size={18} className="text-gray-400" />
                <div className="relative inline-block">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-transparent text-white py-2 pl-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="date" className="bg-gray-900">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        Date Added
                      </div>
                    </option>
                    <option value="rating" className="bg-gray-900">
                      <div className="flex items-center gap-2">
                        <Star size={16} />
                        IMDb Rating
                      </div>
                    </option>
                  </select>
                  <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-400">
                    ▼
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats bar */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4 flex items-center gap-3">
              <div className="p-2 bg-emerald-900/30 rounded-lg">
                <Popcorn className="text-emerald-400" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Movies</p>
                <p className="text-xl font-bold">{movies.length}</p>
              </div>
            </div>
            
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4 flex items-center gap-3">
              <div className="p-2 bg-purple-900/30 rounded-lg">
                <Star className="text-purple-400" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-400">Avg Rating</p>
                <p className="text-xl font-bold">
                  {movies.filter(m => m.imdbRating).length > 0 
                    ? (movies.reduce((acc, m) => acc + (parseFloat(m.imdbRating) || 0), 0) / 
                      movies.filter(m => m.imdbRating).length).toFixed(1)
                    : 'N/A'}
                </p>
              </div>
            </div>
            
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4 flex items-center gap-3">
              <div className="p-2 bg-blue-900/30 rounded-lg">
                <Calendar className="text-blue-400" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-400">Oldest</p>
                <p className="text-xl font-bold">
                  {movies.length > 0 
                    ? new Date(Math.min(...movies.map(m => m.createdAt?.toMillis?.() || Date.now()))).getFullYear()
                    : 'N/A'}
                </p>
              </div>
            </div>
            
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4 flex items-center gap-3">
              <div className="p-2 bg-amber-900/30 rounded-lg">
                <Clock className="text-amber-400" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-400">Recently Added</p>
                <p className="text-xl font-bold">
                  {movies.length > 0 
                    ? new Date(Math.max(...movies.map(m => m.createdAt?.toMillis?.() || 0))).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    : 'N/A'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Movie grid */}
          {sortedMovies.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-300 mb-2">No movies found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Try adjusting your search or add more movies to your watch later list
              </p>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, staggerChildren: 0.1 }}
              className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              <AnimatePresence>
                {sortedMovies.map((movie) => (
                  <motion.div
                    key={movie.imdbID}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    layout
                    className="relative group"
                    onMouseEnter={() => setIsHovering(movie.imdbID)}
                    onMouseLeave={() => setIsHovering(null)}
                  >
                    {/* Movie card */}
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      className="relative rounded-2xl overflow-hidden shadow-xl cursor-pointer h-full bg-gray-900/50 backdrop-blur-sm border border-gray-800"
                      onClick={() => openModal(movie)}
                    >
                      {/* Poster image with gradient overlay */}
                      <div className="relative aspect-[2/3] w-full">
                        <img
                          src={movie.poster !== "N/A" ? movie.poster : "/no-poster.png"}
                          alt={movie.title}
                          className="w-full h-full object-cover transition-all duration-500"
                          style={{
                            filter: isHovering === movie.imdbID ? 'brightness(0.7)' : 'brightness(0.6)'
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                        
                        {/* Date added badge */}
                        {movie.createdAt && (
                          <div className="absolute top-3 left-3 bg-black/70 text-xs text-gray-300 px-2 py-1 rounded-full backdrop-blur-sm">
                            {new Date(movie.createdAt.toMillis()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                        )}
                      </div>

                      {/* Movie info */}
                      <div className="absolute bottom-0 left-0 w-full p-4">
                        <motion.h2 
                          className="text-xl font-bold line-clamp-1"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          {movie.title}
                        </motion.h2>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-sm text-gray-300">{movie.year}</span>
                          {movie.imdbRating && (
                            <div className="flex items-center gap-1 text-sm bg-black/50 px-2 py-1 rounded">
                              <Star size={14} className="text-yellow-400 fill-yellow-400" />
                              <span>{movie.imdbRating}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action buttons that appear on hover */}
                      <motion.div 
                        className="absolute inset-0 flex items-center justify-center gap-3"
                        initial={{ opacity: 0 }}
                        animate={{ 
                          opacity: isHovering === movie.imdbID ? 1 : 0 
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            openModal(movie);
                          }}
                          className="bg-emerald-600 hover:bg-emerald-700 p-3 rounded-full shadow-lg transition-all"
                          title="Add to Diary"
                        >
                          <PlusCircle size={20} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemove(movie.imdbID);
                          }}
                          className="bg-rose-600 hover:bg-rose-700 p-3 rounded-full shadow-lg transition-all"
                          title="Remove"
                        >
                          <Trash2 size={20} />
                        </motion.button>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      {/* Movie details modal */}
      <AnimatePresence>
        {selectedMovie && movieDetails && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="bg-gray-900 text-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border border-gray-800"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 z-10 bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition"
                onClick={closeModal}
              >
                <X size={24} />
              </button>

              {loading ? (
                <div className="min-h-[400px] flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
                    <p className="text-gray-400">Fetching movie details...</p>
                  </div>
                </div>
              ) : movieDetails.error ? (
                <div className="min-h-[400px] flex items-center justify-center text-red-400">
                  {movieDetails.error}
                </div>
              ) : (
                <>
                  {/* Movie header with backdrop */}
                  <div className="relative h-48 bg-gradient-to-r from-purple-900 to-blue-900 overflow-hidden rounded-t-2xl">
                    {movieDetails.poster !== "N/A" && (
                      <img
                        src={movieDetails.poster}
                        alt={movieDetails.title}
                        className="absolute bottom-0 left-6 w-32 h-48 object-cover rounded-t-lg shadow-xl border-2 border-white/10"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
                    <div className="relative z-10 p-6 pl-48">
                      <h2 className="text-3xl font-bold">{movieDetails.title}</h2>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-gray-300">{movieDetails.year}</span>
                        {movieDetails.imdbRating && (
                          <div className="flex items-center gap-1 bg-black/40 px-3 py-1 rounded-full">
                            <Star size={16} className="text-yellow-400 fill-yellow-400" />
                            <span>{movieDetails.imdbRating}</span>
                          </div>
                        )}
                        <span className="text-gray-300">{movieDetails.runtime}</span>
                      </div>
                    </div>
                  </div>

                  {/* Movie content */}
                  <div className="p-6 pt-0">
                    <div className="ml-[calc(8rem+24px)] min-h-[8rem]">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {movieDetails.genre?.split(',').map(g => (
                          <span key={g} className="text-xs bg-gray-800 text-gray-300 px-3 py-1 rounded-full">
                            {g.trim()}
                          </span>
                        ))}
                      </div>

                      <div className="mb-6">
                        <h3 className="text-sm font-semibold text-gray-400 mb-1">SYNOPSIS</h3>
                        <p className="text-gray-300">{movieDetails.plot}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h3 className="text-sm font-semibold text-gray-400 mb-1">DIRECTOR</h3>
                          <p>{movieDetails.director}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-400 mb-1">CAST</h3>
                          <p className="text-gray-300">{movieDetails.actors}</p>
                        </div>
                      </div>
                    </div>

                    {/* Diary form */}
                    <div className="bg-gray-800/50 rounded-xl p-6 mt-6 border border-gray-700">
                      <h3 className="text-xl font-bold mb-4">Add to Diary</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Your Mood</label>
                          <select
                            value={mood}
                            onChange={(e) => setMood(e.target.value)}
                            className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          >
                            <option value="">How did it make you feel?</option>
                            <option value="happy">😊 Happy</option>
                            <option value="sad">😢 Sad</option>
                            <option value="excited">🤩 Excited</option>
                            <option value="thoughtful">🤔 Thoughtful</option>
                            <option value="bored">😐 Bored</option>
                            <option value="inspired">✨ Inspired</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Rating</label>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <motion.button
                                key={star}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className={`text-3xl ${mood === star.toString() ? 'text-yellow-400' : 'text-gray-500'}`}
                                onClick={() => setMood(star.toString())}
                              >
                                {mood >= star ? '★' : '☆'}
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Review</label>
                        <textarea
                          value={review}
                          onChange={(e) => setReview(e.target.value)}
                          className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-3 h-32 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          placeholder="Share your thoughts about this movie..."
                        ></textarea>
                      </div>

                      <div className="flex flex-wrap gap-3 mt-6">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleAddToDiary}
                          className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium rounded-lg shadow-md transition-all flex items-center gap-2"
                        >
                          <PlusCircle size={18} />
                          Add to Diary
                        </motion.button>
                        
                        <motion.a
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                            movieDetails.title + " trailer"
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-medium rounded-lg shadow-md transition-all flex items-center gap-2"
                        >
                          🎬 Watch Trailer
                        </motion.a>
                        
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleRemove(movieDetails.imdbID)}
                          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg shadow-md transition-all flex items-center gap-2"
                        >
                          <Trash2 size={18} />
                          Remove from List
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}