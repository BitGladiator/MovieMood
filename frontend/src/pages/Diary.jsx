import { useEffect, useState, useMemo } from "react";
import { auth, db, collection, query, where, getDocs } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { deleteDoc, doc } from "firebase/firestore";
import { toast } from "react-hot-toast";
import EntryCard from "../components/EntryCard";
import EntryModal from "../components/EntryModal";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiSearch, FiX, FiChevronDown, FiFilter, FiStar, FiCalendar, FiClock, FiPlus } from "react-icons/fi";

export default function Diary() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("dateDesc");
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Memoized filtered and sorted entries
  const filteredEntries = useMemo(() => {
    let result = [...entries];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(entry => 
        (entry.title?.toLowerCase().includes(query) || 
         entry.director?.toLowerCase().includes(query) ||
         entry.notes?.toLowerCase().includes(query))
      );
    }
    
    // Sort options with proper null handling
    switch (sortOption) {
      case "dateAsc":
        return [...result].sort((a, b) => (new Date(a.watchedDate || "1970-01-01") - new Date(b.watchedDate || "1970-01-01")));
      case "dateDesc":
        return [...result].sort((a, b) => (new Date(b.watchedDate || "1970-01-01") - new Date(a.watchedDate || "1970-01-01")));
      case "ratingDesc":
        return [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case "ratingAsc":
        return [...result].sort((a, b) => (a.rating || 0) - (b.rating || 0));
      case "titleAsc":
        return [...result].sort((a, b) => (a.title || "").localeCompare(b.title || ""));
      case "titleDesc":
        return [...result].sort((a, b) => (b.title || "").localeCompare(a.title || ""));
      case "runtimeAsc":
        return [...result].sort((a, b) => (parseInt(a.runtime) || 0) - (parseInt(b.runtime) || 0));
      case "runtimeDesc":
        return [...result].sort((a, b) => (parseInt(b.runtime) || 0) - (parseInt(a.runtime) || 0));
      default:
        return result;
    }
  }, [entries, searchQuery, sortOption]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalRuntime = entries.reduce((total, entry) => total + (parseInt(entry.runtime) || 0), 0);
    const averageRating = entries.length > 0 
      ? entries.reduce((sum, entry) => sum + (entry.rating || 0), 0) / entries.length
      : 0;
    
    return {
      totalMovies: entries.length,
      averageRating,
      totalHours: Math.floor(totalRuntime / 60),
      totalMinutes: totalRuntime % 60,
      showingPercentage: entries.length > 0 
        ? Math.round((filteredEntries.length / entries.length) * 100) 
        : 0
    };
  }, [entries, filteredEntries.length]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        toast.error("Failed to load your collection", {
          style: {
            background: "#1a1a2e",
            color: "#fff",
            border: "1px solid #ef4444",
          },
        });
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
      toast.success("Entry deleted successfully", {
        style: {
          background: "#1a1a2e",
          color: "#fff",
          border: "1px solid #4f46e5",
        },
        iconTheme: {
          primary: "#4f46e5",
          secondary: "#fff",
        },
      });
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete entry", {
        style: {
          background: "#1a1a2e",
          color: "#fff",
          border: "1px solid #ef4444",
        },
      });
    }
  };

  const sortOptions = [
    { value: "dateDesc", label: "Newest First", icon: <FiCalendar className="text-indigo-400" /> },
    { value: "dateAsc", label: "Oldest First", icon: <FiCalendar className="text-purple-400" /> },
    { value: "ratingDesc", label: "Highest Rated", icon: <FiStar className="text-yellow-400" /> },
    { value: "ratingAsc", label: "Lowest Rated", icon: <FiStar className="text-gray-400" /> },
    { value: "titleAsc", label: "Title (A-Z)", icon: <FiFilter className="text-blue-400" /> },
    { value: "titleDesc", label: "Title (Z-A)", icon: <FiFilter className="text-pink-400" /> },
    { value: "runtimeDesc", label: "Longest First", icon: <FiClock className="text-red-400" /> },
    { value: "runtimeAsc", label: "Shortest First", icon: <FiClock className="text-green-400" /> },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-950 text-white p-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwMDAiLz48ZyBvcGFjaXR5PSIwLjAzIj48cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSIjZmZmIi8+PC9nPjwvc3ZnPg==')] opacity-10 pointer-events-none"></div>
        
        {/* Floating film strips */}
        <div className="absolute top-1/4 left-1/4 text-8xl opacity-5 animate-float">🎞️</div>
        <div className="absolute top-1/3 right-1/4 text-9xl opacity-5 animate-float-delay">🎬</div>
        <div className="absolute bottom-1/4 left-1/3 text-7xl opacity-5 animate-float-reverse">📽️</div>

        {/* Main loader */}
        <div className="relative w-full max-w-md flex flex-col items-center z-10">
          <div className="relative">
            {/* Double spinner with gradient colors */}
            <div className="w-24 h-24 border-4 border-transparent border-t-indigo-600 border-r-purple-600 rounded-full animate-spin mb-8" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-transparent border-b-pink-600 border-l-blue-600 rounded-full animate-spin-reverse" />
            </div>
          </div>
          
          {/* Animated text */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center w-full"
          >
            <h2 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 text-transparent bg-clip-text animate-pulse">
              Loading Your Cinematic Journey
            </h2>
            <motion.p 
              initial={{ y: 10 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-4 text-gray-400 text-sm sm:text-base italic font-light tracking-wider"
            >
              Preparing your personalized movie experience...
            </motion.p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gray-950">
        {/* Cinematic background effects */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwMDAiLz48ZyBvcGFjaXR5PSIwLjAzIj48cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSIjZmZmIi8+PC9nPjwvc3ZnPg==')] opacity-5 pointer-events-none"></div>
        
        {/* Animated projector light effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-full bg-gradient-to-b from-indigo-900/10 via-transparent to-transparent opacity-20"></div>
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute top-0 h-full w-0.5 bg-gradient-to-b from-transparent via-indigo-500/40 to-transparent"
              style={{
                left: `${30 + i * 20}%`,
                animation: `lightStreak ${6 + i * 2}s infinite ${i * 0.5}s`,
              }}
            />
          ))}
        </div>

        {/* Floating cinema elements */}
        <div className="absolute top-1/4 left-1/4 text-6xl opacity-10 animate-float">🎥</div>
        <div className="absolute top-1/3 right-1/4 text-5xl opacity-10 animate-float-delay">🎞️</div>
        <div className="absolute bottom-1/4 left-1/3 text-7xl opacity-10 animate-float-reverse">📽️</div>

        {/* Main content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 max-w-2xl mx-auto text-center p-8 md:p-12 bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-800 shadow-2xl overflow-hidden"
        >
          {/* Decorative border animation */}
          <div className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden">
            <div className="absolute inset-0 border-2 border-transparent border-t-indigo-600/30 border-r-purple-600/30 rounded-2xl animate-border-spin"></div>
            <div className="absolute inset-0 border-2 border-transparent border-b-pink-600/30 border-l-blue-600/30 rounded-2xl animate-border-spin-reverse"></div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="relative z-10"
          >
            {/* Animated film clapper icon */}
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-8xl mb-8 inline-block"
            >
              🎬
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-6 leading-tight"
            >
              Your Personal Film Archive
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-gray-300 mb-8 max-w-lg mx-auto font-light tracking-wide"
            >
              Curate your cinematic journey. Track, rate, and relive every movie experience in your personal digital theater.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Link
                to="/login"
                className="relative overflow-hidden px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium tracking-wide shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 flex items-center justify-center gap-3 group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign In
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Link>
              <Link
                to="/register"
                className="relative overflow-hidden px-8 py-4 rounded-xl bg-gray-800/70 hover:bg-gray-800 text-white font-medium tracking-wide shadow-lg hover:shadow-purple-500/20 transition-all duration-300 flex items-center justify-center gap-3 border border-gray-700/50 group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Create Account
                </span>
                <span className="absolute inset-0 bg-gray-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-950 text-gray-300 flex flex-col items-center justify-center p-8 relative overflow-hidden">
        {/* Film grain overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwMDAiLz48ZyBvcGFjaXR5PSIwLjAyIj48cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSIjZmZmIi8+PC9nPjwvc3ZnPg==')] opacity-10 pointer-events-none"></div>
        
        {/* Floating cinema elements */}
        <div className="absolute top-1/4 left-1/4 text-8xl opacity-5 animate-float">🎞️</div>
        <div className="absolute top-1/3 right-1/4 text-9xl opacity-5 animate-float-delay">📽️</div>
        <div className="absolute bottom-1/4 left-1/3 text-7xl opacity-5 animate-float-reverse">🎥</div>

        {/* Main content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center relative z-10"
        >
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="text-8xl mb-8 inline-block"
          >
            🎬
          </motion.div>
          <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Your Movie Diary Awaits
          </h2>
          <p className="text-xl text-gray-400 max-w-md mx-auto mb-8 font-light tracking-wide">
            Start building your cinematic collection. Search for movies and add them to your personal archive.
          </p>
          <Link
            to="/finder"
            className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium tracking-wide shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 group"
          >
            <FiPlus className="mr-2" />
            <span>Add Your First Movie</span>
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-950 text-gray-300 relative overflow-hidden">
      {/* Film grain overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwMDAiLz48ZyBvcGFjaXR5PSIwLjAyIj48cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSIjZmZmIi8+PC9nPjwvc3ZnPg==')] opacity-10 pointer-events-none"></div>
      
      {/* Floating light effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo-900/10 via-transparent to-transparent opacity-30"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-purple-900/10 to-transparent opacity-20"></div>
      </div>

      {/* Main content */}
      <main className="pt-24 pb-12 container mx-auto px-4 sm:px-6">
        {/* Collection header with search and sort */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                Your Cinematic Collection
              </h2>
              <p className="text-gray-400 font-light tracking-wide">
                {filteredEntries.length} {filteredEntries.length === 1 ? "movie" : "movies"} in your archive
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Premium search bar */}
              <div className="relative flex-1 min-w-[250px]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search movies..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/70 border border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300 text-white placeholder-gray-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <FiX className="text-gray-400 hover:text-white transition-colors" />
                  </button>
                )}
              </div>
              
              {/* Premium sort dropdown */}
              {/* <div className="relative">
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="flex items-center gap-2 px-4 py-3 bg-gray-800/70 hover:bg-gray-800/90 border border-gray-700/50 hover:border-gray-600/50 rounded-xl transition-all duration-300 text-white"
                >
                  <FiFilter className="text-indigo-400" />
                  {/* <span className="text-sm font-medium">
                    {sortOptions.find(opt => opt.value === sortOption)?.label || "Sort"}
                  </span> 
                  <FiChevronDown className={`transition-transform duration-200 ${isSortOpen ? "rotate-180" : ""}`} />
                </button>
                
                <AnimatePresence>
                  {isSortOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-56 bg-gray-800/90 backdrop-blur-lg rounded-xl shadow-lg border border-gray-700/50 z-50 overflow-hidden"
                    >
                      <div className="py-1">
                        {sortOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setSortOption(option.value);
                              setIsSortOpen(false);
                            }}
                            className={`flex items-center gap-3 w-full px-4 py-2 text-left text-sm transition-colors ${
                              sortOption === option.value 
                                ? 'bg-gradient-to-r from-indigo-900/30 to-purple-900/30 text-indigo-300' 
                                : 'text-gray-300 hover:bg-gray-700/50'
                            }`}
                          >
                            {option.icon}
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div> */}
            </div>
          </div>
          
          {/* Premium stats cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 mb-8">
            <motion.div 
              whileHover={{ y: -2 }}
              className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-indigo-500/30 transition-all duration-300"
            >
              <p className="text-sm text-gray-400 mb-1">Total Movies</p>
              <p className="text-2xl font-bold text-white">{stats.totalMovies}</p>
            </motion.div>
            
            {/* <motion.div 
              whileHover={{ y: -2 }}
              className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300"
            >
              <p className="text-sm text-gray-400 mb-1">Average Rating</p>
              <p className="text-2xl font-bold text-white">
                {stats.averageRating.toFixed(1)}
                <span className="text-sm text-indigo-400 ml-1">/ 10</span>
              </p>
            </motion.div>
             */}
            {/* <motion.div 
              whileHover={{ y: -2 }}
              className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-pink-500/30 transition-all duration-300"
            >
              <p className="text-sm text-gray-400 mb-1">Total Runtime</p>
              <p className="text-2xl font-bold text-white">
                {stats.totalHours}h
                <span className="text-sm text-purple-400 ml-1">
                  {stats.totalMinutes}m
                </span>
              </p>
            </motion.div> */}
            
            <motion.div 
              whileHover={{ y: -2 }}
              className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300"
            >
              <p className="text-sm text-gray-400 mb-1">Showing</p>
              <p className="text-2xl font-bold text-white">
                {filteredEntries.length}
                <span className="text-sm text-pink-400 ml-1">
                  ({stats.showingPercentage}%)
                </span>
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Empty state */}
        {filteredEntries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold text-gray-300 mb-2">
              No movies found
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Try adjusting your search or filter to find what you're looking for.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSortOption("dateDesc");
              }}
              className="px-6 py-2 rounded-lg bg-gray-800/70 hover:bg-gray-800/90 text-white font-medium transition-colors duration-300 border border-gray-700/50"
            >
              Reset Filters
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {filteredEntries.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                whileHover={{ y: -5 }}
                className="relative group"
              >
                <EntryCard
                  entry={entry}
                  onClick={setSelectedEntry}
                  onDelete={handleDelete}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl"></div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      {/* Add movie floating button */}
      <Link
        to="/finder"
        className="fixed bottom-8 right-8 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 group"
      >
        <FiPlus className="text-white text-xl group-hover:rotate-90 transition-transform duration-300" />
      </Link>

      {/* Premium modal */}
      <AnimatePresence>
        {selectedEntry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4"
          >
            {/* Modal background effects */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwMDAiLz48ZyBvcGFjaXR5PSIwLjAzIj48cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSIjZmZmIi8+PC9nPjwvc3ZnPg==')] opacity-10"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20"></div>
            </div>

            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <EntryModal
                entry={selectedEntry}
                onClose={() => setSelectedEntry(null)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animation keyframes */}
      <style jsx global>{`
        @keyframes lightStreak {
          0% { top: -100%; opacity: 0; }
          10% { opacity: 0.3; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes border-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes border-spin-reverse {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-delay {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-3deg); }
        }
        @keyframes float-reverse {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(20px) rotate(-5deg); }
        }
      `}</style>
    </div>
  );
}