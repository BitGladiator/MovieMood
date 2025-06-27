import { useState } from "react";
import AddToDiaryModal from "../components/AddToDiaryModal";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setError("");
    setResults([]);

    try {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${
          import.meta.env.VITE_OMDB_API_KEY
        }&s=${query.trim()}`
      );
      const data = await res.json();
      if (data.Response === "True") setResults(data.Search);
      else setError(data.Error || "No results found");
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToDiary = (entry) => {
    const prev = JSON.parse(localStorage.getItem("diary") || "[]");
    localStorage.setItem("diary", JSON.stringify([...prev, entry]));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white px-6 py-8">
     <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-8 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-lg">
  🎬 Movie Finder
</h1>


      <div className="max-w-2xl mx-auto mb-8">
  <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm border border-white/20 shadow-xl rounded-xl p-4 flex items-center gap-3">
    <input
      type="text"
      className="flex-1 p-3 rounded-md bg-gray-200/70 dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Search for a movie..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
    />
    <button
      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition font-semibold"
      onClick={handleSearch}
    >
      Search
    </button>
  </div>
</div>

      {loading && (
        <p className="text-center text-gray-400 text-lg animate-pulse">
          🔍 Searching for movies...
        </p>
      )}

      {error && <p className="text-red-400 text-center mb-4">{error}</p>}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {results.map((movie) => (
          <div
            key={movie.imdbID}
            className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1"
          >
            <div className="relative w-full h-64 bg-gray-700 flex items-center justify-center overflow-hidden">
              {movie.Poster !== "N/A" ? (
                <img
                  src={movie.Poster}
                  alt={movie.Title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.parentNode.innerHTML = `
                      <div class='text-gray-400 text-sm text-center px-2'>
                        🎬 No Poster Available
                      </div>
                    `;
                  }}
                />
              ) : (
                <div className="text-gray-400 text-sm text-center px-2">
                  🎬 No Poster Available
                </div>
              )}
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold">{movie.Title}</h2>
              <p className="text-gray-400 text-sm">{movie.Year}</p>
              <button
                onClick={() => setSelectedMovie(movie)}
                className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md text-sm"
              >
                ➕ Add to Diary
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedMovie && (
        <AddToDiaryModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onSave={handleSaveToDiary}
        />
      )}
    </div>
  );
}
