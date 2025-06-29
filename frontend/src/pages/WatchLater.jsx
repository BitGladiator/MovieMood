// ✅ ONLY casing updated, everything else untouched

import { useEffect, useState } from "react";
import { Trash2, PlusCircle } from "lucide-react";
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
  Timestamp,
} from "firebase/firestore";

export default function WatchLater() {
  const [user, setUser] = useState(null);
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const [moodModalMovie, setMoodModalMovie] = useState(null);
  const [selectedMood, setSelectedMood] = useState("");

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

  const handleAddToDiary = (movie, e) => {
    e.stopPropagation();
    setMoodModalMovie(movie);
  };

  const confirmAddToDiary = async () => {
    if (!user || !moodModalMovie || !selectedMood) return;

    try {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${import.meta.env.VITE_OMDB_API_KEY}&i=${moodModalMovie.imdbID}&plot=full`
      );
      const fullData = await res.json();

      if (fullData.Response !== "True") {
        toast.error("❌ Failed to fetch full movie info.");
        return;
      }

      await addDoc(collection(db, "diary"), {
        uid: user.uid,
        imdbID: fullData.imdbID,
        Title: fullData.Title,
        Year: fullData.Year,
        Poster: fullData.Poster,
        Genre: fullData.Genre,
        Director: fullData.Director,
        Actors: fullData.Actors,
        Runtime: fullData.Runtime,
        IMDbRating: fullData.imdbRating,
        Plot: fullData.Plot,
        mood: selectedMood,
        createdAt: new Date(), // unify this field too
      });

      await handleRemove(moodModalMovie.imdbID);
      toast.success("🎉 Added to Diary");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to diary.");
    } finally {
      setMoodModalMovie(null);
      setSelectedMood("");
    }
  };

  const closeMoodModal = () => {
    setMoodModalMovie(null);
    setSelectedMood("");
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
  };

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
        <h1 className="text-5xl font-bold text-center mb-8 text-lime-400 tracking-tight">
          🎯 Watch Later
        </h1>
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {movies.map((movie) => (
            <div
              key={movie.imdbID}
              className="relative group rounded-2xl overflow-hidden shadow-xl bg-white/5 border border-gray-700 hover:scale-105 transform transition duration-300"
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
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={(e) => handleAddToDiary(movie, e)}
                    className="bg-green-600 px-3 py-1 rounded-md flex items-center gap-1 hover:bg-green-700 transition"
                  >
                    <PlusCircle size={16} /> Diary
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(movie.imdbID);
                    }}
                    className="bg-red-600 px-3 py-1 rounded-md flex items-center gap-1 hover:bg-red-700 transition"
                  >
                    <Trash2 size={16} /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mood selection modal */}
      <AnimatePresence>
        {moodModalMovie && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={closeMoodModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 rounded-2xl p-6 w-full max-w-md text-white shadow-xl border border-gray-700 space-y-4"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <h2 className="text-2xl font-bold text-lime-400">
                What's your mood for "{moodModalMovie.title}"?
              </h2>
              <select
                value={selectedMood}
                onChange={(e) => setSelectedMood(e.target.value)}
                className="w-full p-2 bg-gray-800 rounded-md border border-gray-600 text-white"
              >
                <option value="">Select mood</option>
                <option value="😍 Loved it">😍 Loved it</option>
                <option value="🙂 It was nice">🙂 It was nice</option>
                <option value="😐 Just okay">😐 Just okay</option>
                <option value="😞 Didn't like it">😞 Didn't like it</option>
              </select>
              <div className="flex justify-end gap-2">
                <button
                  onClick={closeMoodModal}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAddToDiary}
                  disabled={!selectedMood}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md disabled:opacity-50"
                >
                  Add to Diary
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedMovie && (
          <motion.div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 text-white rounded-2xl p-6 w-full max-w-3xl shadow-2xl border border-gray-700 transform transition"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
              {loading ? (
                <div className="h-40 flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-lime-500 rounded-full animate-spin" />
                </div>
              ) : movieDetails?.error ? (
                <p className="text-red-500">{movieDetails.error}</p>
              ) : (
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold text-lime-400">
                    {movieDetails.title}
                  </h2>
                  <div className="flex flex-col md:flex-row gap-6">
                    <img
                      src={movieDetails.poster}
                      alt={movieDetails.title}
                      className="w-40 rounded-lg border border-gray-700 shadow-lg"
                    />
                    <div className="text-sm space-y-2">
                      <p><strong>🎞️ Year:</strong> {movieDetails.year}</p>
                      <p><strong>📀 Genre:</strong> {movieDetails.genre}</p>
                      <p><strong>🎬 Director:</strong> {movieDetails.director}</p>
                      <p><strong>👥 Actors:</strong> {movieDetails.actors}</p>
                      <p><strong>⏱ Runtime:</strong> {movieDetails.runtime}</p>
                      <p><strong>⭐ IMDb:</strong> {movieDetails.imdbRating}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-green-400">Plot</h3>
                    <p className="text-gray-300 italic border-l-4 border-green-500 pl-3 max-h-40 overflow-y-auto">
                      {movieDetails.plot}
                    </p>
                  </div>
                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                      movieDetails.title + " trailer"
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 bg-red-600 px-4 py-2 rounded-md hover:bg-red-700 transition"
                  >
                    ▶️ Watch Trailer
                  </a>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
