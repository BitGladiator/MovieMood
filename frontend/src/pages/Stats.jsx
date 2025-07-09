import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db, collection, query, where, getDocs } from "../firebase";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Tooltip,
  Cell,
  XAxis,
  YAxis,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { saveAs } from "file-saver";

const COLORS = ["#60a5fa", "#34d399", "#fbbf24", "#f472b6", "#818cf8"];

export default function Stats() {
  const [watched, setWatched] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (!u) return setLoading(false);

      try {
        const q = query(collection(db, "diary"), where("uid", "==", u.uid));
        const querySnapshot = await getDocs(q);

        const movies = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            title: data.title,
            genres: data.Genre?.split(/,\s*/).filter(Boolean),
            cast: data.Actors?.split(/,\s*/).map((a) => a.trim()),
            director: data.Director?.trim(),
            year: data.Year,
            runtime: parseInt(data.Runtime) || 0,
          };
        });

        setWatched(movies);
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const filtered = useMemo(() => {
    return watched.filter((movie) => {
      const matchesGenre =
        selectedGenre === "All" || (movie.genres || []).includes(selectedGenre);
      const matchesYear = selectedYear === "All" || movie.year === selectedYear;
      return matchesGenre && matchesYear;
    });
  }, [watched, selectedGenre, selectedYear]);

  const genreCounts = useMemo(() => {
    return filtered
      .flatMap((movie) => movie.genres || [])
      .reduce((acc, genre) => {
        acc[genre] = (acc[genre] || 0) + 1;
        return acc;
      }, {});
  }, [filtered]);

  const actorCounts = useMemo(() => {
    return filtered
      .flatMap((movie) => movie.cast || [])
      .reduce((acc, actor) => {
        acc[actor] = (acc[actor] || 0) + 1;
        return acc;
      }, {});
  }, [filtered]);

  const directorCounts = useMemo(() => {
    return filtered.reduce((acc, movie) => {
      if (movie.director) acc[movie.director] = (acc[movie.director] || 0) + 1;
      return acc;
    }, {});
  }, [filtered]);

  const yearCounts = useMemo(() => {
    return filtered.reduce((acc, movie) => {
      if (movie.year) acc[movie.year] = (acc[movie.year] || 0) + 1;
      return acc;
    }, {});
  }, [filtered]);

  const genreData = Object.entries(genreCounts).map(([name, value]) => ({
    name,
    value,
  }));
  const topActors = Object.entries(actorCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  const topDirectors = Object.entries(directorCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  const yearData = Object.entries(yearCounts)
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => parseInt(a.year) - parseInt(b.year));

  const averageYear = useMemo(() => {
    const years = filtered.map((m) => parseInt(m.year)).filter(Boolean);
    return years.length
      ? Math.round(years.reduce((a, b) => a + b, 0) / years.length)
      : 0;
  }, [filtered]);

  const longestMovie = useMemo(() => {
    return filtered.reduce(
      (longest, movie) => (movie.runtime > longest.runtime ? movie : longest),
      { runtime: 0 }
    );
  }, [filtered]);

  const mostCommonDecade = useMemo(() => {
    const counts = {};
    filtered.forEach((m) => {
      const decade = Math.floor(parseInt(m.year || 0) / 10) * 10;
      if (decade) counts[decade] = (counts[decade] || 0) + 1;
    });
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    return top ? `${top[0]}s` : "N/A";
  }, [filtered]);

  const downloadCSV = () => {
    const header = "Title,Year,Genres,Actors,Director,Runtime\n";
    const rows = watched.map(
      (m) =>
        `${m.title},${m.year},"${(m.genres || []).join(";")}","${(
          m.cast || []
        ).join(";")}",${m.director},${m.runtime}`
    );
    const blob = new Blob([header + rows.join("\n")], { type: "text/csv" });
    saveAs(blob, "movie_stats.csv");
  };

  const genres = useMemo(
    () => ["All", ...new Set(watched.flatMap((m) => m.genres || []))],
    [watched]
  );
  const years = useMemo(
    () => ["All", ...new Set(watched.map((m) => m.year).filter(Boolean))],
    [watched]
  );

  if (loading){
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin mb-6" />
        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-transparent bg-clip-text animate-pulse">
          Loading Your Stats...
        </h2>
        <p className="mt-2 text-gray-400 text-sm italic">
          Fetching data from the Diary 🎬
        </p>
      </div>
    );
  }
  if (!user){
    return (
      <div className="flex flex-col mt-[20rem]">
        <div className="z-10 text-center text-white space-y-4">
          <h2 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-teal-300 to-indigo-500 bg-clip-text text-transparent animate-pulse">
            🔐 Please Log In
          </h2>
          <p className="text-lg text-gray-300">
            to view the stats of your movies.
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
    <div className="p-6 min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-6" aria-label="Movie Stats Dashboard">
        🎬 Movie Stats Dashboard
      </h1>

      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="bg-gray-800 text-white p-2 rounded-lg"
          aria-label="Filter by Genre"
        >
          {genres.map((g) => (
            <option key={g}>{g}</option>
          ))}
        </select>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="bg-gray-800 text-white p-2 rounded-lg"
          aria-label="Filter by Year"
        >
          {years.map((y) => (
            <option key={y}>{y}</option>
          ))}
        </select>

        <button
          onClick={downloadCSV}
          disabled={watched.length === 0}
          className={`cursor-pointer ml-auto px-4 py-2 rounded-xl text-sm ${
            watched.length === 0
              ? "bg-gray-600 text-gray-300 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-500 text-white"
          }`}
          aria-label="Download stats as CSV"
        >
          Export CSV
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center text-gray-400 text-lg mt-10">
          No movies to show for selected filters.
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-6">
            <StatChart title="Genre Distribution">
              <ResponsiveContainer width="100%" height={350}>
                <PieChart margin={{ top: 20, right: 20, bottom: 40, left: 20 }}>
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
                  <Tooltip />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                  />
                </PieChart>
              </ResponsiveContainer>
            </StatChart>

            <StatChart title="Top Actors">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={topActors}>
                  <XAxis dataKey="name" stroke="#ccc" />
                  <YAxis stroke="#ccc" />
                  <Tooltip />
                  <Bar
                    dataKey="count"
                    fill="#60a5fa"
                    barSize={30}
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </StatChart>

            <StatChart title="Top Directors">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={topDirectors}>
                  <XAxis dataKey="name" stroke="#ccc" />
                  <YAxis stroke="#ccc" />
                  <Tooltip />
                  <Bar
                    dataKey="count"
                    fill="#f472b6"
                    barSize={30}
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </StatChart>

            <StatChart title="Movies by Year">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={yearData}>
                  <XAxis dataKey="year" stroke="#ccc" />
                  <YAxis stroke="#ccc" />
                  <Tooltip />
                  <Bar
                    dataKey="count"
                    fill="#34d399"
                    barSize={20}
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </StatChart>
          </div>

          <div className="mt-10 text-sm space-y-2 text-gray-300">
            <p>
              <strong>Average Release Year:</strong> {averageYear}
            </p>
            <p>
              <strong>Longest Movie:</strong> {longestMovie.title || "N/A"} (
              {longestMovie.runtime} mins)
            </p>
            <p>
              <strong>Most Common Decade:</strong> {mostCommonDecade}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

function StatChart({ title, children }) {
  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow" aria-label={title}>
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}
