import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Diary() {
  const [diary, setDiary] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [movieDetails, setMovieDetails] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("diary") || "[]");
    setDiary(stored);
  }, []);

  const handleDelete = (indexToRemove) => {
    const updated = diary.filter((_, index) => index !== indexToRemove);
    localStorage.setItem("diary", JSON.stringify(updated));
    setDiary(updated);
    if (selectedMovie && indexToRemove === selectedMovie.index) {
      closeModal();
    }
  };

  const openModal = async (movie, index) => {
    setSelectedMovie({ ...movie, index });
    setLoadingDetails(true);
    setMovieDetails(null);

    try {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${
          import.meta.env.VITE_OMDB_API_KEY
        }&i=${movie.imdbID}&plot=full`
      );
      const data = await res.json();
      if (data.Response === "True") {
        setMovieDetails(data);
      } else {
        setMovieDetails({ error: "Details not found." });
      }
    } catch {
      setMovieDetails({ error: "Failed to fetch details." });
    } finally {
      setLoadingDetails(false);
    }
  };

  const closeModal = () => {
    setSelectedMovie(null);
    setMovieDetails(null);
  };

  const filteredDiary = diary.filter((movie) => {
    const lower = searchTerm.toLowerCase();
    return (
      movie.Title?.toLowerCase().includes(lower) ||
      movie.Year?.toLowerCase().includes(lower) ||
      movie.Genre?.toLowerCase().includes(lower) ||
      movie.Actors?.toLowerCase().includes(lower)
    );
  });

  if (!diary.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-300 p-8 flex flex-col items-center justify-center">
        <div className="text-7xl animate-bounce mb-4 drop-shadow-lg">🎥</div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-center bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 bg-clip-text text-transparent mb-3">
          Your Movie Diary
        </h1>
        <p className="text-lg text-gray-400 text-center max-w-md">
          No movies added yet. Start exploring and documenting your cinematic
          adventures!
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-200 p-6">
        <h1 className="text-4xl font-bold mb-6 text-center tracking-tight">
          🎞️ Your Movie Diary
        </h1>

        <div className="mb-8 max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search by title, year, genre, or actors..."
            className="w-full p-3 rounded-md bg-gray-800 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredDiary.length === 0 && (
          <p className="text-center text-pink-400 text-lg mt-10 animate-pulse">
            No cinematic matches found. Try a different keyword! 🎬
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredDiary.map((movie, index) => (
            <div
              key={index}
              onClick={() => openModal(movie, index)}
              className="cursor-pointer relative group rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md bg-white/5 border border-white/10 hover:scale-105 transition-transform duration-300"
            >
              <img
                src={movie.Poster !== "N/A" ? movie.Poster : "/no-poster.png"}
                alt={movie.Title}
                className="w-full h-80 object-cover opacity-70 group-hover:opacity-50 transition duration-300"
              />
              <div className="absolute bottom-0 p-5 w-full bg-gradient-to-t from-black via-black/70 to-transparent text-white">
                <h2 className="text-xl font-bold">{movie.Title}</h2>
                <p className="text-sm text-gray-300">🎬 {movie.Year}</p>
                <p className="text-sm text-gray-400">📀 {movie.Genre}</p>
                <p className="text-sm text-gray-500">👥 {movie.Actors}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(index);
                  }}
                  className="mt-3 flex items-center gap-2 bg-red-600 hover:bg-red-700 text-sm px-4 py-1.5 rounded-md transition"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedMovie && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-6"
            onClick={closeModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-gradient-to-br from-gray-800/70 to-black/90 backdrop-blur-xl rounded-2xl p-8 w-full max-w-3xl text-white shadow-2xl border border-gray-700"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <button
                onClick={closeModal}
                className="absolute top-6 right-6 text-gray-400 hover:text-white text-3xl font-bold cursor-pointer"
              >
                &times;
              </button>

              <h2 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-pink-500 to-yellow-500 text-transparent bg-clip-text">
                🎬 {selectedMovie.Title}
              </h2>

              {loadingDetails ? (
                <div className="flex flex-col items-center justify-center h-60 text-center animate-fade-in">
                  <div className="w-16 h-16 mb-4 animate-pulse">🎞️</div>
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-pink-400 via-indigo-400 to-purple-500 text-transparent bg-clip-text animate-pulse">
                    Loading movie details...
                  </h3>
                  <p className="text-sm text-gray-400 mt-1 italic">
                    Fetching secrets from the film vault...
                  </p>
                </div>
              ) : movieDetails?.error ? (
                <p className="text-red-500">{movieDetails.error}</p>
              ) : (
                <>
                  <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                    <img
                      src={
                        movieDetails.Poster !== "N/A"
                          ? movieDetails.Poster
                          : "/no-poster.png"
                      }
                      alt={movieDetails.Title}
                      className="rounded-lg shadow-lg w-56 h-auto border border-gray-700"
                    />
                    <div className="space-y-2 text-sm text-gray-300">
                      <p>
                        <span className="font-bold text-indigo-400">
                          🎞️ Year:
                        </span>{" "}
                        {movieDetails.Year}
                      </p>
                      <p>
                        <span className="font-bold text-indigo-400">
                          📀 Genre:
                        </span>{" "}
                        {movieDetails.Genre}
                      </p>
                      <p>
                        <span className="font-bold text-indigo-400">
                          🎬 Director:
                        </span>{" "}
                        {movieDetails.Director}
                      </p>
                      <p>
                        <span className="font-bold text-indigo-400">
                          👥 Actors:
                        </span>{" "}
                        {movieDetails.Actors}
                      </p>
                      <p>
                        <span className="font-bold text-indigo-400">
                          ⏱ Runtime:
                        </span>{" "}
                        {movieDetails.Runtime}
                      </p>
                      <p>
                        <span className="font-bold text-indigo-400">
                          ⭐ IMDb:
                        </span>{" "}
                        {movieDetails.imdbRating}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 max-h-40 overflow-y-auto pr-2">
                    <h3 className="text-xl font-semibold mb-2 text-green-400">
                      🎭 Plot
                    </h3>
                    <p className="text-gray-300 italic leading-relaxed border-l-4 border-green-500 pl-4">
                      {movieDetails.Plot}
                    </p>
                  </div>

                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                      movieDetails.Title + " trailer"
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
                  >
                    ▶️ Watch Trailer
                  </a>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
