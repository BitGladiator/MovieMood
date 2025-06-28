import { useEffect, useState } from "react";
import { Trash2, PlusCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function WatchLater() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("watchLater") || "[]");
    setMovies(saved);
  }, []);

  const handleRemove = (imdbID) => {
    const updated = movies.filter((m) => m.imdbID !== imdbID);
    setMovies(updated);
    localStorage.setItem("watchLater", JSON.stringify(updated));
  };

  const handleAddToDiary = async (movie) => {
    try {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${
          import.meta.env.VITE_OMDB_API_KEY
        }&i=${movie.imdbID}`
      );
      const data = await res.json();

      if (data.Response === "True") {
        const existingDiary = JSON.parse(localStorage.getItem("diary") || "[]");
        localStorage.setItem("diary", JSON.stringify([...existingDiary, data]));
        handleRemove(movie.imdbID);
      } else {
        console.error("Failed to fetch full movie details");
      }
    } catch (err) {
      console.error("Error adding to diary:", err);
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
        setMovieDetails(data);
      } else {
        setMovieDetails({ error: "Details not found." });
      }
    } catch {
      setMovieDetails({ error: "Failed to fetch details." });
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedMovie(null);
    setMovieDetails(null);
  };

  if (!movies.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-300 p-8 flex flex-col items-center justify-center">
        <div className="text-7xl animate-bounce mb-4 drop-shadow-lg">🎯</div>
        <h2 className="text-4xl md:text-5xl font-extrabold text-center bg-gradient-to-r from-green-400 via-lime-400 to-emerald-500 bg-clip-text text-transparent mb-3">
          No Movies in Watch Later
        </h2>
        <p className="text-lg text-gray-400 text-center max-w-md">
          Add movies here to keep track of what you want to watch next!
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white p-6">
        <h1 className="text-5xl font-bold text-center mb-8 text-lime-400 tracking-tight">
          🎯{" "}
          <span className=" decoration-wavy decoration-green-500">
            Watch Later
          </span>
        </h1>

        <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {movies.map((movie) => (
            <div
              key={movie.imdbID}
              className="cursor-pointer relative group rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md bg-white/5 border border-white/10 hover:scale-105 transition-transform duration-300"
              onClick={() => openModal(movie)}
            >
              <img
                src={movie.Poster !== "N/A" ? movie.Poster : "/no-poster.png"}
                alt={movie.Title}
                className="w-full h-80 object-cover opacity-70 group-hover:opacity-50 transition duration-300"
              />
              <div className="absolute bottom-0 p-5 w-full bg-gradient-to-t from-black via-black/70 to-transparent text-white">
                <h2 className="text-xl font-bold">{movie.Title}</h2>
                <p className="text-sm text-gray-300">🎬 {movie.Year}</p>
                <div className="flex gap-3 mt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToDiary(movie);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-sm px-4 py-1.5 rounded-md transition flex items-center gap-1 cursor-pointer"
                  >
                    <PlusCircle size={16} /> Add to Diary
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(movie.imdbID);
                    }}
                    className="bg-red-600 hover:bg-red-700 text-sm px-4 py-1.5 rounded-md transition flex items-center gap-1 cursor-pointer"
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
        {selectedMovie && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={closeModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-gradient-to-br from-gray-800/70 to-black/90 backdrop-blur-xl rounded-2xl p-6 w-full max-w-3xl text-white shadow-2xl border border-gray-700 overflow-hidden"
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

              <h2 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-green-400 to-teal-500 text-transparent bg-clip-text">
                🎬 {selectedMovie.Title}
              </h2>

              {loading ? (
                <div className="flex flex-col items-center justify-center h-60 text-center animate-fade-in">
                  <div className="w-16 h-16 mb-4 animate-pulse">🎞️</div>
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-lime-400 via-emerald-400 to-cyan-500 text-transparent bg-clip-text animate-pulse">
                    Loading movie details...
                  </h3>
                  <p className="text-sm text-gray-400 mt-1 italic">
                    Fetching details from the vault...
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
                        <span className="font-bold text-lime-400">
                          🎞️ Year:
                        </span>{" "}
                        {movieDetails.Year}
                      </p>
                      <p>
                        <span className="font-bold text-lime-400">
                          📀 Genre:
                        </span>{" "}
                        {movieDetails.Genre}
                      </p>
                      <p>
                        <span className="font-bold text-lime-400">
                          🎬 Director:
                        </span>{" "}
                        {movieDetails.Director}
                      </p>
                      <p>
                        <span className="font-bold text-lime-400">
                          👥 Actors:
                        </span>{" "}
                        {movieDetails.Actors}
                      </p>
                      <p>
                        <span className="font-bold text-lime-400">
                          ⏱ Runtime:
                        </span>{" "}
                        {movieDetails.Runtime}
                      </p>
                      <p>
                        <span className="font-bold text-lime-400">
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
