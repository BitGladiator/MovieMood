import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Tooltip,
  Cell,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#60a5fa", "#34d399", "#fbbf24", "#f472b6", "#818cf8"];

export default function Stats() {
  const [watched, setWatched] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const diaryEntries = JSON.parse(localStorage.getItem("diary") || "[]");

    async function fetchMovieDetails() {
      const movies = [];

      for (const entry of diaryEntries) {
        try {
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${
              import.meta.env.VITE_OMDB_API_KEY
            }&i=${entry.imdbID}`
          );
          const data = await res.json();
          if (data.Response === "True") {
            movies.push({
              title: data.Title,
              genres: data.Genre?.split(", ").filter(Boolean),
              cast: data.Actors?.split(", ").filter(Boolean),
              year: data.Year,
            });
          }
        } catch (err) {
          console.error("Error fetching movie:", err);
        }
      }

      setWatched(movies);
      setLoading(false);
    }

    fetchMovieDetails();
  }, []);

  // Genre distribution
  const genreCounts = watched
    .flatMap((movie) => movie.genres || [])
    .reduce((acc, genre) => {
      acc[genre] = (acc[genre] || 0) + 1;
      return acc;
    }, {});

  const genreData = Object.entries(genreCounts).map(([genre, value]) => ({
    name: genre,
    value,
  }));

  // Top actors
  const actorCounts = watched
    .flatMap((movie) => movie.cast || [])
    .reduce((acc, actor) => {
      acc[actor] = (acc[actor] || 0) + 1;
      return acc;
    }, {});

  const topActors = Object.entries(actorCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Movies by year
  const yearCounts = watched
    .map((movie) => movie.year)
    .filter(Boolean)
    .reduce((acc, year) => {
      acc[year] = (acc[year] || 0) + 1;
      return acc;
    }, {});

  const yearData = Object.entries(yearCounts)
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => a.year.localeCompare(b.year));

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin mb-6" />

        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-transparent bg-clip-text animate-pulse">
          Loading Movie Stats...
        </h2>
        <p className="mt-2 text-gray-400 text-sm italic">
          Fetching data from the movieverse 🎬
        </p>
      </div>
    );

  if (!watched.length)
    return <p className="text-gray-300 p-6">No watched movies found.</p>;

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <h1 className="text-4xl font-extrabold mb-8 tracking-tight">
        🎬 Movie Stats Dashboard
      </h1>

      {/* Total movies watched — clickable */}
      <div
        onClick={() => navigate("/diary")}
        className="mb-10 bg-gray-800 rounded-2xl shadow-xl p-6 text-center cursor-pointer hover:bg-gray-700 transition"
        title="Go to Diary"
      >
        <h2 className="text-3xl font-semibold text-green-400 mb-1">
          Total Movies Watched
        </h2>
        <p className="text-5xl font-bold text-white">{watched.length}</p>
        <p className="text-gray-400 mt-2 italic">Click to view your diary</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Genre Pie Chart */}
        <div className="bg-gray-800 rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-semibold mb-4 text-cyan-400">
            Genre Distribution
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genreData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {genreData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#1f2937", color: "white" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Actor Bar Chart */}
        <div className="bg-gray-800 rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-semibold mb-4 text-pink-400">
            Top Actors
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topActors}>
                <XAxis dataKey="name" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1f2937", color: "white" }}
                />
                <Bar
                  dataKey="count"
                  fill="#60a5fa"
                  barSize={30}
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Movies by Year Bar Chart */}
        <div className="bg-gray-800 rounded-2xl shadow-xl p-6 md:col-span-2">
          <h2 className="text-2xl font-semibold mb-4 text-green-400">
            Movies Watched by Year
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearData}>
                <XAxis dataKey="year" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1f2937", color: "white" }}
                />
                <Bar
                  dataKey="count"
                  fill="#34d399"
                  barSize={20}
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
