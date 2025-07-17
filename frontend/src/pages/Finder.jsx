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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return unsubscribe;
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${
          import.meta.env.VITE_OMDB_API_KEY
        }&s=${search}`
      );
      const data = await res.json();
      if (data.Response === "True") {
        setResults(data.Search);
        toast.success("Movies found successfully!");
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
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-black">
        {/* Cinematic background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-black to-gray-950 z-0"></div>
        
        {/* Animated film reel effect */}
        <div className="absolute inset-0 overflow-hidden z-0">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="absolute h-1 w-32 bg-yellow-400/10"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                transform: `rotate(${Math.random() * 360}deg)`,
                animation: `filmReel ${15 + Math.random() * 10}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>
        
        {/* Projector light effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-48 bg-gradient-to-b from-yellow-500/5 to-transparent pointer-events-none"></div>

        {/* Main content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 max-w-2xl w-full mx-auto text-center p-8 md:p-12 backdrop-blur-sm bg-gray-900/80 rounded-3xl border border-gray-800 shadow-2xl"
        >
          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/10 rounded-full filter blur-xl"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full filter blur-xl"></div>
          
          {/* Animated clapperboard icon */}
          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="text-6xl md:text-7xl mb-6"
          >
            🎬
          </motion.div>
          
          {/* Main heading with cinematic text effect */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 mb-6 leading-tight tracking-tight"
          >
            Welcome to CineArchive
          </motion.h1>
          
          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-gray-300 mb-8 max-w-lg mx-auto"
          >
            Your personal movie diary awaits. Log in to track films you've watched, save ones you want to see, and relive your cinematic journey.
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
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-yellow-500 to-red-600 hover:from-yellow-600 hover:to-red-700 text-gray-900 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              <svg className="w-5 h-5 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 border border-gray-700 group"
            >
              <svg className="w-5 h-5 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Create Account
            </Link>
          </motion.div>
        </motion.div>

        {/* Animation keyframes */}
        <style jsx global>{`
          @keyframes filmReel {
            0% { transform: translateX(-100vw) rotate(0deg); }
            100% { transform: translateX(100vw) rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4 pb-12 relative overflow-x-hidden">
      {/* Cinematic curtain effect */}
      <div className="fixed inset-0 bg-gradient-to-b from-red-900/10 via-transparent to-transparent pointer-events-none z-0"></div>
      <div className="fixed inset-0 bg-gradient-to-t from-blue-900/10 via-transparent to-transparent pointer-events-none z-0"></div>
      
      {/* Film grain overlay for texture */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-5">
        {[...Array(200)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Projector light effect */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[150%] h-48 bg-gradient-to-b from-yellow-400/5 to-transparent pointer-events-none z-0"></div>

      {/* Main content container */}
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Premium Header with cinematic flair */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-12 pt-8"
        >
          <motion.div
            animate={{
              scale: [1, 1.02, 1],
              opacity: [1, 0.9, 1]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="inline-block mb-4"
          >
            <div className="text-6xl sm:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 mb-2 tracking-tight leading-tight">
              🎬 MovieFinder Pro
            </div>
          </motion.div>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto font-light tracking-wide">
            Discover, catalog, and relive your cinematic journey
          </p>
        </motion.div>

        {/* Premium Search Form with cinematic effects */}
        <motion.form 
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4 mb-16 max-w-3xl mx-auto px-4"
        >
          <div className="relative flex-1">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-red-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            
            {/* Search input */}
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for movies..."
              className="relative w-full px-6 py-4 rounded-xl bg-gray-900/80 backdrop-blur-sm text-white placeholder-gray-500 border border-gray-700 focus:ring-2 focus:ring-yellow-400 focus:outline-none transition-all duration-300 shadow-lg hover:shadow-red-500/20 text-lg font-medium"
            />
            
            {/* Search icon */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          {/* Search button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`px-8 py-4 bg-gradient-to-r from-yellow-500 to-red-600 hover:from-yellow-600 hover:to-red-700 text-gray-900 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group ${
              isLoading ? "opacity-80 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <>
                <span>Search</span>
                <svg 
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </>
            )}
          </button>
        </motion.form>

        {/* Results section */}
        {results.length > 0 ? (
          <motion.div 
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          >
            {results.map((movie) => (
              <motion.div
                key={movie.imdbID}
                whileHover={{ y: -10, scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="group relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-950 to-black rounded-3xl p-5 shadow-2xl border border-gray-800 hover:border-yellow-400/50 transition-all duration-500"
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none"></div>
                
                {/* Poster with cinematic frame */}
                <div className="relative overflow-hidden rounded-2xl shadow-lg border-2 border-gray-700 group-hover:border-yellow-400/30 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 pointer-events-none"></div>
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent z-10 pointer-events-none"></div>
                  
                  {/* Movie poster with loading shimmer */}
                  {movie.Poster !== "N/A" ? (
                    <img
                      src={movie.Poster}
                      alt={movie.Title}
                      className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-80 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                      <span className="text-gray-500 text-lg">No Poster</span>
                    </div>
                  )}
                  
                  {/* Title overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                    <h3 className="text-xl font-bold text-white truncate">{movie.Title}</h3>
                    <p className="text-sm text-gray-300">{movie.Year}</p>
                  </div>
                </div>

                {/* Action buttons with cinematic styling */}
                <div className="mt-6 space-y-3">
                  <button
                    onClick={() => setSelectedMovie(movie)}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-gray-900 font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group"
                  >
                    <span className="group-hover:animate-pulse">📽️</span>
                    <span>Add to Diary</span>
                  </button>
                  <button
                    onClick={() => handleAddToWatchLater(movie)}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group border border-gray-700"
                  >
                    <span className="group-hover:animate-spin">⏱️</span>
                    <span>Watch Later</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center py-20"
          >
            <div className="text-5xl mb-4">🍿</div>
            <h3 className="text-2xl font-bold text-gray-300 mb-2">Start Your Search</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {isLoading ? "Searching for movies..." : "Find your favorite movies by searching above"}
            </p>
          </motion.div>
        )}

        {/* Premium Movie Modal */}
        {selectedMovie && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="relative bg-gradient-to-br from-gray-900 to-gray-950 text-white rounded-3xl p-8 max-w-4xl w-full flex flex-col md:flex-row gap-8 border border-gray-800 shadow-2xl overflow-hidden max-h-[90vh]"
            >
              {/* Modal background elements */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-yellow-500/10 rounded-full filter blur-xl"></div>
              <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-red-500/10 rounded-full filter blur-xl"></div>
              
              {/* Close button */}
              <button
                onClick={() => setSelectedMovie(null)}
                className="absolute top-6 right-6 text-gray-400 hover:text-white text-2xl cursor-pointer transition-colors duration-300 z-10"
              >
                &times;
              </button>

              {/* Movie Poster */}
              <div className="flex-shrink-0 w-full md:w-1/3 relative">
                <div className="sticky top-8">
                  <div className="relative overflow-hidden rounded-2xl shadow-xl border-2 border-gray-700">
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
                  
                  {/* Action buttons */}
                  <div className="flex flex-col gap-3 mt-6">
                    <button
                      onClick={handleSaveToDiary}
                      disabled={!mood}
                      className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                        mood 
                          ? "bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-gray-900 shadow-lg hover:shadow-yellow-500/30"
                          : "bg-gray-800 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      <span>🎬</span>
                      <span>Save to Diary</span>
                    </button>
                    <button
                      onClick={() => setSelectedMovie(null)}
                      className="px-6 py-3 rounded-xl border border-gray-700 bg-gray-900/50 text-gray-300 hover:bg-gray-800/50 hover:text-white transition-all duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>

              {/* Movie Details Form */}
              <div className="flex-1 flex flex-col space-y-6 overflow-y-auto">
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">
                  Add to Your Movie Diary
                </h2>

                {/* Review section */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 tracking-wide">YOUR REVIEW</label>
                  <textarea
                    className="w-full p-4 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300 min-h-[120px]"
                    placeholder="Share your thoughts about this movie..."
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                  />
                </div>

                {/* Mood selector */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 tracking-wide">YOUR MOOD</label>
                  <MoodSelector selected={mood} onSelect={setMood} />
                </div>

                {/* Additional movie details (fetched when selected) */}
                {selectedMovie && (
                  <div className="mt-6 border-t border-gray-800 pt-6">
                    <h3 className="text-lg font-semibold text-gray-300 mb-3">MOVIE DETAILS</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Director</p>
                        <p className="text-gray-300">{selectedMovie.Director || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Actors</p>
                        <p className="text-gray-300">{selectedMovie.Actors ? selectedMovie.Actors.split(',').slice(0, 3).join(', ') : "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Genre</p>
                        <p className="text-gray-300">{selectedMovie.Genre || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Runtime</p>
                        <p className="text-gray-300">{selectedMovie.Runtime || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}