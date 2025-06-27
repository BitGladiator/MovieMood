import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

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

  // Filter diary safely with optional chaining and fallback to empty string
  const filteredDiary = diary.filter(({ title, year, genre, actors }) => {
    const lowerSearch = searchTerm.toLowerCase();

    return (
      (title?.toLowerCase() || "").includes(lowerSearch) ||
      (year?.toLowerCase() || "").includes(lowerSearch) ||
      (genre?.toLowerCase() || "").includes(lowerSearch) ||
      (actors?.toLowerCase() || "").includes(lowerSearch)
    );
  });

  if (!diary.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-300 p-8 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4 tracking-tight">
          🎥 Your Movie Diary
        </h1>
        <p className="text-lg text-gray-400">No movies added yet.</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-200 p-6">
        <h1 className="text-4xl font-bold mb-6 text-center tracking-tight">
          🎞️ Your Movie Diary
        </h1>

        {/* Search Bar */}
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
          <p className="text-center text-gray-400">No matching movies found.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredDiary.map((movie, index) => (
            <div
              key={index}
              onClick={() => openModal(movie, index)}
              className="cursor-pointer relative group rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md bg-white/5 border border-white/10 hover:scale-105 transition-transform duration-300"
            >
              {/* Movie Poster */}
              <img
                src={movie.poster !== "N/A" ? movie.poster : "/no-poster.png"}
                alt={movie.title}
                className="w-full h-80 object-cover opacity-70 group-hover:opacity-50 transition duration-300"
              />

              {/* Overlay Info */}
              <div className="absolute bottom-0 p-5 w-full bg-gradient-to-t from-black via-black/70 to-transparent text-white">
                <h2 className="text-xl font-bold">{movie.title}</h2>
                <p className="text-sm text-gray-300">🎬 {movie.year}</p>
                <p className="text-sm text-gray-400">📀 {movie.genre}</p>
                <p className="text-sm text-gray-500">👥 {movie.actors}</p>

                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click event
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

      {/* Modal */}
      {selectedMovie && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-6"
          onClick={closeModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-900 rounded-xl max-w-3xl w-full p-8 text-white shadow-xl overflow-auto max-h-[90vh]"
          >
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 text-gray-400 hover:text-white text-3xl font-bold"
              aria-label="Close modal"
            >
              &times;
            </button>

            <h2 className="text-3xl font-bold mb-4">{selectedMovie.title}</h2>

            {loadingDetails && (
              <div className="flex flex-col items-center justify-center h-60 text-center animate-fade-in">
                <div className="w-16 h-16 mb-4 animate-pulse">🎬</div>
                <h3 className="text-xl font-semibold bg-gradient-to-r from-pink-400 via-indigo-400 to-purple-500 text-transparent bg-clip-text animate-pulse">
                  Loading movie details...
                </h3>
                <p className="text-sm text-gray-400 mt-1 italic">
                  Fetching secrets from the film vault...
                </p>
              </div>
            )}

            {movieDetails && !loadingDetails && (
              <>
                {movieDetails.error ? (
                  <p className="text-red-500">{movieDetails.error}</p>
                ) : (
                  <>
                    <div className="flex flex-col md:flex-row gap-6">
                      <img
                        src={
                          movieDetails.Poster !== "N/A"
                            ? movieDetails.Poster
                            : "/no-poster.png"
                        }
                        alt={movieDetails.Title}
                        className="w-48 h-auto rounded-md"
                      />
                      <div>
                        <p>
                          <strong>Year:</strong> {movieDetails.Year}
                        </p>
                        <p>
                          <strong>Genre:</strong> {movieDetails.Genre}
                        </p>
                        <p>
                          <strong>Director:</strong> {movieDetails.Director}
                        </p>
                        <p>
                          <strong>Actors:</strong> {movieDetails.Actors}
                        </p>
                        <p>
                          <strong>Runtime:</strong> {movieDetails.Runtime}
                        </p>
                        <p>
                          <strong>IMDB Rating:</strong>{" "}
                          {movieDetails.imdbRating}
                        </p>
                      </div>
                    </div>
                    <div className="mt-6">
                      <h3 className="text-xl font-semibold mb-2">Plot</h3>
                      <p className="text-gray-300">{movieDetails.Plot}</p>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
