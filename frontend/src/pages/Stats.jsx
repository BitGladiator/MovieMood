import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { motion } from "framer-motion";

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
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute -top-1/3 -left-1/4 w-[800px] h-[800px] bg-purple-900/20 blur-[150px] rounded-full animate-float-slow pointer-events-none"></div>
        <div className="absolute -bottom-1/3 -right-1/4 w-[800px] h-[800px] bg-blue-900/20 blur-[150px] rounded-full animate-float-slow-reverse pointer-events-none"></div>
        
        {/* Floating particles */}
        {[...Array(30)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-10"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `twinkle ${3 + Math.random() * 5}s infinite ${Math.random() * 2}s`
            }}
          />
        ))}
  
        {/* Main content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-2xl mx-auto text-center p-8 md:p-12 backdrop-blur-lg bg-gradient-to-br from-gray-900/80 to-gray-950/80 rounded-3xl border border-gray-800/50 shadow-2xl"
        >
          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/10 rounded-full filter blur-xl"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full filter blur-xl"></div>
          
          {/* Animated movie icon */}
          <motion.div
            animate={{
              y: [0, -15, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-6xl md:text-7xl mb-6"
          >
            🎬
          </motion.div>
          
          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-purple-500 to-blue-500 mb-6 leading-tight"
          >
            Unlock Your Cinematic Universe
          </motion.h1>
          
          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-gray-300 mb-8 max-w-lg mx-auto"
          >
            Log in to access your personalized movie diary, track your watch history, and discover new favorites.
          </motion.p>
          
          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link
              to="/login"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 border border-gray-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Create Account
            </Link>
          </motion.div>
        </motion.div>
  
        {/* Animation keyframes */}
        <style jsx global>{`
          @keyframes float-slow {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(10px, 10px); }
          }
          @keyframes float-slow-reverse {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(-10px, -10px); }
          }
          @keyframes twinkle {
            0%, 100% { opacity: 0.1; }
            50% { opacity: 0.5; }
          }
        `}</style>
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
