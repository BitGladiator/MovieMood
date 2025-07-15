import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import MoodSelector from "../components/MoodSelector";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
export default function Finder() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [review, setReview] = useState("");
  const [mood, setMood] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return unsubscribe;
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    try {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${
          import.meta.env.VITE_OMDB_API_KEY
        }&s=${search}`
      );
      const data = await res.json();
      if (data.Response === "True") setResults(data.Search);
      else setResults([]);
      toast.success("Movies Fetched Successfully!!");
    } catch (err) {
      console.error("Search failed:", err);
      toast.error("Search failed");
    }
  };

  const handleSaveToDiary = async () => {
    if (!user) return toast.error("Login required.");
    if (!mood) return toast.error("Select a mood.");

    try {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${
          import.meta.env.VITE_OMDB_API_KEY
        }&i=${selectedMovie.imdbID}&plot=full`
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
        createdAt: new Date(), // Firestore Timestamp will parse this
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
        `https://www.omdbapi.com/?apikey=${
          import.meta.env.VITE_OMDB_API_KEY
        }&i=${movie.imdbID}`
      );

      const fullData = await res.json();
      await addDoc(collection(db, "watchLater"), {
        uid: user.uid,
        title: movie.Title,
        year: movie.Year,
        poster: movie.Poster,
        imdbID: movie.imdbID,
        imdbRating: parseFloat(fullData.imdbRating),
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
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950 p-4 pb-12 relative overflow-x-hidden">
    {/* Animated background elements */}
    <div className="fixed -top-1/2 -left-1/4 w-[800px] h-[800px] bg-purple-900/20 blur-[100px] rounded-full animate-float-slow pointer-events-none"></div>
    <div className="fixed -bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-indigo-900/20 blur-[100px] rounded-full animate-float-slow-reverse pointer-events-none"></div>
    
    {/* Floating particles */}
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {[...Array(30)].map((_, i) => (
        <div 
          key={i}
          className="absolute w-0.5 h-0.5 bg-white rounded-full opacity-10"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `twinkle ${3 + Math.random() * 5}s infinite ${Math.random() * 2}s`,
            transform: `scale(${0.5 + Math.random()})`
          }}
        />
      ))}
    </div>
  
    <div className="max-w-6xl mx-auto relative z-10">
      {/* Premium Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <h1 className="text-5xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 mb-4 tracking-tight leading-tight">
          🎬 Movie Finder
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Discover your next favorite film with our premium movie database
        </p>
      </motion.div>
  
      {/* Premium Search Form */}
      <motion.form 
        onSubmit={handleSearch}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4 mb-12 max-w-3xl mx-auto"
      >
        <div className="relative flex-1">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-md opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for a movie title..."
            className="relative w-full px-6 py-4 rounded-xl bg-gray-900/80 backdrop-blur-sm text-white placeholder-gray-400 border border-gray-700 focus:ring-2 focus:ring-lime-400 focus:outline-none transition-all duration-300 shadow-lg hover:shadow-purple-500/20"
          />
        </div>
        <button
          type="submit"
          className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group"
        >
          <span>Search</span>
          <svg 
            className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </motion.form>
  
      {/* Movie Grid */}
      <motion.div 
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {results.map((movie) => (
          <motion.div
            key={movie.imdbID}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="group relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-950 to-black rounded-3xl p-5 shadow-2xl border border-gray-800 hover:border-lime-400/30 transition-all duration-300"
          >
            {/* Glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-lime-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none"></div>
            
            {/* Poster with shimmer effect */}
            <div className="relative overflow-hidden rounded-2xl shadow-lg border border-gray-700">
              <img
                src={movie.Poster !== "N/A" ? movie.Poster : "/fallback.png"}
                alt={movie.Title}
                className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
            </div>
  
            {/* Movie Info */}
            <div className="mt-4 relative z-10">
              <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-rose-400 to-lime-400 group-hover:from-sky-300 group-hover:via-rose-300 group-hover:to-lime-300 transition-all duration-300">
                {movie.Title}
              </h3>
              <div className="flex items-center justify-between mt-2">
                <p className="text-sm font-medium text-gray-400 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  {movie.Year}
                </p>
                {movie.imdbRating && (
                  <p className="text-sm font-bold text-amber-400 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {movie.imdbRating}
                  </p>
                )}
              </div>
            </div>
  
            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              <button
                onClick={() => setSelectedMovie(movie)}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-lime-400 to-emerald-500 hover:from-lime-500 hover:to-emerald-600 text-gray-900 font-semibold py-3 rounded-xl shadow-md transition-all duration-300 group"
              >
                <span className="group-hover:scale-110 transition-transform duration-300">➕</span>
                <span>Add to Diary</span>
              </button>
              <button
                onClick={() => handleAddToWatchLater(movie)}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-gray-900 font-semibold py-3 rounded-xl shadow-md transition-all duration-300 group"
              >
                <span className="group-hover:scale-110 transition-transform duration-300">⏱️</span>
                <span>Watch Later</span>
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
  
      {/* Premium Movie Modal */}
      {selectedMovie && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-lg flex items-center justify-center overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative bg-gradient-to-br from-gray-900 to-gray-950 text-white rounded-3xl p-8 max-w-4xl w-full flex flex-col md:flex-row gap-8 border border-gray-800 shadow-2xl  h-[38rem] mt-[5rem] overflow-scroll"
          >
            {/* Modal background elements */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/10 rounded-full filter blur-xl"></div>
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-indigo-500/10 rounded-full filter blur-xl"></div>
            
            {/* Close button */}
            <button
              onClick={() => setSelectedMovie(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-white text-2xl cursor-pointer transition-colors duration-300 z-10"
            >
              &times;
            </button>
  
            {/* Movie Poster */}
            <div className="flex-shrink-0 w-full md:w-1/3">
              <div className="relative overflow-hidden rounded-2xl shadow-xl border border-gray-700">
                <img
                  src={selectedMovie.Poster !== "N/A" ? selectedMovie.Poster : "/fallback.png"}
                  alt={selectedMovie.Title}
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 p-4 w-full">
                  <h3 className="text-xl font-bold text-white">{selectedMovie.Title}</h3>
                  <p className="text-gray-300 text-sm">{selectedMovie.Year}</p>
                </div>
              </div>
              <div className="flex flex-col justify-end gap-4 pt-4">
                <button
                  onClick={() => setSelectedMovie(null)}
                  className="px-6 py-3 rounded-xl border border-gray-600 text-gray-300 hover:bg-gray-800/50 hover:text-white transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveToDiary}
                  className="px-8 py-3 rounded-xl  bg-gradient-to-r from-lime-500 to-emerald-600 hover:from-lime-600 hover:to-emerald-700 text-gray-900 font-bold shadow-lg hover:shadow-lime-500/30 transition-all duration-300 flex items-center justify-center gap-2"
                >
                   Save to Diary
                </button>
              </div>
            </div>
  
            {/* Movie Details Form */}
            <div className="flex-1 flex flex-col space-y-4">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-500">
                🎬 Add to Diary
              </h2>
  
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-400">Your Review</label>
                <textarea
                  className="w-full p-4 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all duration-300 "
                  placeholder="Share your thoughts about this movie..."
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  rows={3}
                />
              </div>
  
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-400">Your Mood</label>
                <MoodSelector selected={mood} onSelect={setMood} />
              </div>
  
              
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  
    {/* Animation keyframes */}
    <style jsx global>{`
      @keyframes float-slow {
        0%, 100% { transform: translate(0, 0); }
        50% { transform: translate(20px, 20px); }
      }
      @keyframes float-slow-reverse {
        0%, 100% { transform: translate(0, 0); }
        50% { transform: translate(-20px, -20px); }
      }
      @keyframes twinkle {
        0%, 100% { opacity: 0.1; }
        50% { opacity: 0.5; }
      }
    `}</style>
  </div>
  );
}
