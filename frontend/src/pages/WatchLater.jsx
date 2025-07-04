import { useEffect, useState, useMemo } from "react";
import { Trash2, PlusCircle, X } from "lucide-react";
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

export default function WatchLater() {
  const [user, setUser] = useState(null);
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("date");
  const [mood, setMood] = useState("");
  const [review, setReview] = useState("");

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
      toast.error("📌 Removed from Watch Later");
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

      toast.success("📔 Added to Diary!");
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

  const sortedMovies = useMemo(() => {
    const moviesCopy = [...movies];

    if (sortBy === "rating") {
      return moviesCopy.sort(
        (a, b) => parseFloat(b.imdbRating || 0) - parseFloat(a.imdbRating || 0)
      );
    }

    if (sortBy === "date") {
      return moviesCopy.sort((a, b) => {
        const aTime = a.createdAt?.toMillis?.() || 0;
        const bTime = b.createdAt?.toMillis?.() || 0;
        return bTime - aTime;
      });
    }

    return moviesCopy;
  }, [movies, sortBy]);

  if (!user) {
    return (
      <div className="mt-[20rem] flex items-center justify-center">
        <p className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-transparent bg-clip-text animate-pulse">
          🔒 Please log in to view your Watch Later list.
        </p>
      </div>
    );
  }

  if (!movies.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-300 flex flex-col items-center justify-center p-8">
        <div className="text-7xl animate-bounce mb-4">🎯</div>
        <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-green-400 to-lime-400 bg-clip-text text-transparent mb-3">
          No Movies in Watch Later
        </h2>
        <p className="text-lg text-gray-400 text-center max-w-md">
          Browse and add movies you'd like to watch next!
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white p-6">
        <div className="relative mb-8">
          <div className="absolute right-0 top-0 z-10">
            <div className="relative inline-block">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-gray-800 text-white border border-gray-600 py-2 px-4 pr-10 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-lime-400"
              >
                <option value="date">📅 Date Added</option>
                <option value="rating">⭐ IMDb Rating</option>
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400 text-sm">
                ▼
              </span>
            </div>
          </div>

          <h1 className="text-center text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-lime-400 via-green-400 to-emerald-500 tracking-tight animate-pulse">
            🎯 Watch Later
          </h1>
        </div>

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {sortedMovies.map((movie) => (
            <div
              key={movie.imdbID}
              className="cursor-pointer relative group rounded-2xl overflow-hidden shadow-xl bg-white/5 border border-gray-700 hover:scale-105 transform transition duration-300"
              onClick={() => openModal(movie)}
            >
              <img
                src={movie.poster !== "N/A" ? movie.poster : "/no-poster.png"}
                alt={movie.title}
                className="w-full h-80 object-cover opacity-80 group-hover:opacity-60 transition duration-300"
              />
              <div className="absolute bottom-0 w-full bg-gradient-to-t from-black via-black/70 to-transparent p-4">
                <h2 className="text-xl font-bold">{movie.title}</h2>
                <p className="text-sm text-gray-300">🎬 {movie.year}</p>
                <div className="text-sm text-yellow-400">
                  ⭐ {movie.imdbRating ?? "N/A"}
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(movie);
                    }}
                    className="bg-green-600 px-3 py-1 rounded-md flex items-center gap-1 hover:bg-green-700 transition cursor-pointer"
                  >
                    <PlusCircle size={16} /> Diary
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(movie.imdbID);
                    }}
                    className="bg-red-600 px-3 py-1 rounded-md flex items-center gap-1 hover:bg-red-700 transition cursor-pointer"
                  >
                    <Trash2 size={16} /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

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
              className="bg-gray-900 text-white rounded-xl max-w-2xl w-full p-6 shadow-xl relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
                onClick={closeModal}
              >
                <X size={24} />
              </button>
              {loading ? (
                <div className="text-center text-xl">Loading...</div>
              ) : movieDetails.error ? (
                <div className="text-center text-red-400">
                  {movieDetails.error}
                </div>
              ) : (
                <>
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div>  <img
                      src={
                        movieDetails.poster !== "N/A"
                          ? movieDetails.poster
                          : "/no-poster.png"
                      }
                      alt={movieDetails.title}
                      className="hidden sm:block w-48 h-auto rounded-lg shadow-md object-cover"
                    /></div>
                  

                    <div className="flex-1">
                      <h2 className="text-3xl font-bold mb-2">
                        {movieDetails.title}
                      </h2>
                      <p className="text-sm text-gray-400 mb-2">
                        {movieDetails.year} • {movieDetails.genre}
                      </p>
                      <div className="h-[6rem] overflow-y-scroll p-2 rounded-md border border-gray-700 bg-white/5 backdrop-blur-sm text-sm text-gray-200 scroll-smooth scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                        <p className="mb-0">{movieDetails.plot}</p>
                      </div>

                      <br />
                      <p className="text-sm">
                        🎬 Director: {movieDetails.director}
                      </p>
                      <p className="text-sm">🎭 Cast: {movieDetails.actors}</p>
                      <p className="text-sm">
                        ⏱ Runtime: {movieDetails.runtime}
                      </p>
                      <p className="text-sm text-yellow-400 mt-2">
                        ⭐ IMDb Rating: {movieDetails.imdbRating}
                      </p>

                      <div className="mt-4">
                        <label className="block text-sm font-medium mb-1">
                          Mood
                        </label>
                        <select
                          value={mood}
                          onChange={(e) => setMood(e.target.value)}
                          className="w-full bg-gray-800 text-white border border-gray-600 rounded-md px-3 py-2"
                        >
                          <option value="">Select a mood</option>
                          <option value="happy">😊 Happy</option>
                          <option value="sad">😢 Sad</option>
                          <option value="excited">🤩 Excited</option>
                          <option value="bored">😐 Bored</option>
                        </select>
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium mb-1">
                          Review
                        </label>
                        <textarea
                          value={review}
                          onChange={(e) => setReview(e.target.value)}
                          className="w-full bg-gray-800 text-white border border-gray-600 rounded-md px-3 py-2"
                          rows={3}
                          placeholder="Write your thoughts..."
                        ></textarea>
                      </div>

                      <button
                        onClick={handleAddToDiary}
                        className="mt-4 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md"
                      >
                        ✅ Add to Diary
                      </button>
                      <a
                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                          movieDetails.title + " trailer"
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="m-2 inline-flex items-center gap-2 mt-4 bg-gradient-to-r from-red-500 via-yellow-500 to-pink-500 hover:opacity-90 text-white font-semibold px-4 py-2 rounded-md shadow-md transition-all duration-300"
                      >
                        🎬 Watch Trailer
                      </a>
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
