import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import MoodSelector from "../components/MoodSelector";

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
      <div className="flex flex-col mt-[20rem]">
        <div className="z-10 text-center text-white space-y-4">
          <h2 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-teal-300 to-indigo-500 bg-clip-text text-transparent animate-pulse">
            🔐 Please Log In
          </h2>
          <p className="text-lg text-gray-300">
            to search and add movies to your diary 🎬
          </p>
        </div>
        <style>
          {`
      @keyframes floatSlow {
        0%, 100% { transform: translateY(0px) scale(1); }
        50% { transform: translateY(-20px) scale(1.05); }
      }
      .animate-float-slow {
        animation: floatSlow 8s ease-in-out infinite;
      }
      .delay-1000 {
        animation-delay: 1s;
      }
    `}
        </style>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-center mb-6 tracking-tight">
        🎥 Movie Finder
      </h1>

      <form onSubmit={handleSearch} className="flex gap-3 mb-8">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder=" Search for a movie title..."
          className="cursor-pointer flex-1 px-5 py-3 rounded-xl bg-gray-900 text-white placeholder-gray-400 border border-gray-700 focus:ring-2 focus:ring-lime-400 focus:outline-none transition duration-300"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Search
        </button>
      </form>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {results.map((movie) => (
          <div
            key={movie.imdbID}
            className="cursor-pointer mt-5 bg-gradient-to-br from-gray-900 via-gray-950 to-black rounded-3xl p-5 shadow-2xl border border-gray-800 hover:shadow-[0_0_30px_rgba(0,255,150,0.4)] transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-[1.02]"
          >
            <img
              src={movie.Poster !== "N/A" ? movie.Poster : "/fallback.png"}
              alt={movie.Title}
              className="w-full h-64 object-cover rounded-2xl shadow-lg border border-gray-600 hover:scale-105 hover:rotate-1 transition-transform duration-300 ease-in-out"
            />
            <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-rose-400 to-lime-400 mt-4 text-center drop-shadow">
              {movie.Title}
            </h3>
            <p className="text-sm text-center font-medium text-gray-400 italic tracking-wide mt-1">
              📅 {movie.Year}
            </p>

            <button
              onClick={() => setSelectedMovie(movie)}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-lime-400 to-emerald-500 hover:from-lime-500 hover:to-emerald-600 text-black font-semibold py-2.5 rounded-xl shadow-md transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-105 active:scale-95"
            >
              <span className="text-lg">➕</span> Add to Diary
            </button>

            <button
              onClick={() => handleAddToWatchLater(movie)}
              className="mt-2 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-semibold py-2.5 rounded-xl shadow-md transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-105 active:scale-95"
            >
              <span className="text-lg">🕒</span> Watch Later
            </button>
          </div>
        ))}
      </div>

      {selectedMovie && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4 py-8 overflow-y-auto">
          <div className="bg-gray-900 text-white rounded-2xl p-6 max-w-4xl w-full flex flex-col md:flex-row gap-6 border border-gray-700 shadow-2xl">
            <div className="flex-shrink-0">
              <img
                src={
                  selectedMovie.Poster !== "N/A"
                    ? selectedMovie.Poster
                    : "/fallback.png"
                }
                alt={selectedMovie.Title}
                className="w-40 h-60 object-cover rounded-xl border border-gray-700"
              />
              <div className="mt-4">
                <h3 className="text-lg font-semibold">{selectedMovie.Title}</h3>
                <p className="text-sm text-gray-400">{selectedMovie.Year}</p>
              </div>
            </div>

            <div className="flex-1 flex flex-col space-y-4">
              <h2 className="text-2xl font-bold text-lime-400 text-center md:text-left">
                🎬 Add to Diary
              </h2>

              <textarea
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white resize-none placeholder-gray-400"
                placeholder="Write your review..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows={4}
              />

              <MoodSelector selected={mood} onSelect={setMood} />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setSelectedMovie(null)}
                  className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveToDiary}
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-lime-500 to-emerald-600 hover:brightness-110 text-black font-bold"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
