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
import {
  FiDownload,
  FiFilter,
  FiBarChart2,
  FiPieChart,
  FiStar,
  FiClock,
  FiCalendar,
  FiAward,
} from "react-icons/fi";

const COLORS = ["#6366f1", "#8b5cf6", "#d946ef", "#ec4899", "#f43f5e"];

export default function Stats() {
  const [watched, setWatched] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [activeTab, setActiveTab] = useState("overview");
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
            id: doc.id,
            title: data.title || data.Title || '', // Check both 'title' and 'Title'
            genres: data.Genre?.split(/,\s*/).filter(Boolean),
            cast: data.Actors?.split(/,\s*/).map((a) => a.trim()),
            director: data.Director?.trim() || data.director?.trim() || '', // Check both 'Director' and 'director'
            year: data.Year || data.year,
            runtime: parseInt(data.Runtime || data.runtime) || 0,
            rating: parseFloat(data.rating) || 0,
            poster: data.Poster || data.poster,
          };
        });
  
        console.log("Extracted movies data:", movies); // Add this to debug
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

  // Data calculations remain the same...
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

  const highestRatedMovie = useMemo(() => {
    return filtered.reduce(
      (highest, movie) => (movie.rating > highest.rating ? movie : highest),
      { rating: 0 }
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

  const totalRuntime = useMemo(() => {
    return filtered.reduce((total, movie) => total + (movie.runtime || 0), 0);
  }, [filtered]);

  const downloadCSV = () => {
    const header = "Title,Year,Genres,Actors,Director,Runtime,Rating\n";
    const rows = watched.map((m) => {
      return [
        `"${m.title || 'Unknown'}"`,
        m.year || 'Unknown',
        `"${(m.genres || []).join(";")}"`,
        `"${(m.cast || []).join(";")}"`,
        `"${m.director || 'Unknown'}"`,
        m.runtime || 0,
        m.rating || 0
      ].join(',');
    });
    
    const csvContent = header + rows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white px-4 py-8">
        <div className="flex flex-col items-center justify-center w-full max-w-xs sm:max-w-md">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full mb-8"
          />

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text text-center px-2"
          >
            Loading Your Cinematic Journey
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 0.6 }}
            className="mt-4 text-gray-400 text-sm sm:text-base italic text-center max-w-xs"
          >
            Fetching your movie memories...
          </motion.p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-indigo-900/20 to-purple-900/20"
              initial={{
                width: `${Math.random() * 200 + 100}px`,
                height: `${Math.random() * 200 + 100}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: 0,
              }}
              animate={{
                opacity: [0, 0.3, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: "reverse",
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-2xl w-full mx-auto text-center p-8 md:p-12 backdrop-blur-lg bg-gray-900/80 rounded-3xl border border-gray-800 shadow-2xl"
        >
          <motion.div
            animate={{
              y: [0, -15, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="text-6xl md:text-7xl mb-8"
          >
            🎬
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-6 leading-tight"
          >
            Premium Movie Insights
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-gray-300 mb-8 max-w-lg mx-auto"
          >
            Sign in to unlock your personalized movie statistics dashboard with
            premium visualizations.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link
              to="/login"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-8 py-3.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 border border-gray-700"
            >
              Create Account
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
              Your Movie Stats
            </h1>
            <p className="text-gray-400 mt-1">
              {filtered.length} {filtered.length === 1 ? "movie" : "movies"}{" "}
              analyzed
            </p>
          </div>

          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none min-w-[180px]">
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
                aria-label="Filter by Genre"
              >
                {genres.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </div>

            <div className="relative flex-1 md:flex-none min-w-[150px]">
              <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
                aria-label="Filter by Year"
              >
                {years.map((y) => (
                  <option key={y}>{y}</option>
                ))}
              </select>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={downloadCSV}
              disabled={watched.length === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                watched.length === 0
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
              }`}
            >
              <FiDownload />
              Export Data
            </motion.button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-800 mb-8">
          {["overview", "genres", "people", "timeline"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium text-sm capitalize relative ${
                activeTab === tab
                  ? "text-purple-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="tabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-500 mb-4 text-6xl">🎥</div>
            <h3 className="text-xl font-medium text-gray-300 mb-2">
              No movies match your filters
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Try adjusting your genre or year filters to see your movie
              statistics.
            </p>
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* Key Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard
                    icon={<FiCalendar className="text-indigo-400" />}
                    title="Average Year"
                    value={averageYear}
                    change={`Most in ${mostCommonDecade}`}
                  />
                  <StatCard
                    icon={<FiClock className="text-purple-400" />}
                    title="Total Runtime"
                    value={`${Math.floor(totalRuntime / 60)}h ${
                      totalRuntime % 60
                    }m`}
                    change={`Longest: ${longestMovie.runtime}m`}
                  />
                  <StatCard
                    icon={<FiStar className="text-pink-400" />}
                    title="Highest Rated"
                    value={
                      highestRatedMovie.rating
                        ? `${highestRatedMovie.rating}/10`
                        : "N/A"
                    }
                    change={highestRatedMovie.title}
                  />
                  <StatCard
                    icon={<FiAward className="text-amber-400" />}
                    title="Top Genre"
                    value={genreData[0]?.name || "N/A"}
                    change={`${genreData[0]?.value} movies`}
                  />
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ChartCard title="Genre Distribution" icon={<FiPieChart />}>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={genreData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          innerRadius={40}
                          paddingAngle={5}
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {genreData.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value, name, props) => [
                            value,
                            `${name}: ${(
                              (props.payload.percent || 0) * 100
                            ).toFixed(1)}%`,
                          ]}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartCard>

                  <ChartCard title="Movies by Year" icon={<FiBarChart2 />}>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={yearData}>
                        <XAxis
                          dataKey="year"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#9CA3AF" }}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#9CA3AF" }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1F2937",
                            borderColor: "#374151",
                            borderRadius: "0.5rem",
                          }}
                        />
                        <Bar
                          dataKey="count"
                          fill="#8B5CF6"
                          radius={[4, 4, 0, 0]}
                          animationDuration={2000}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartCard>
                </div>
              </div>
            )}

            {/* Genres Tab */}
            {activeTab === "genres" && (
              <div className="space-y-8">
                <ChartCard title="Genre Breakdown" icon={<FiPieChart />}>
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={genreData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        innerRadius={60}
                        paddingAngle={2}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {genreData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name, props) => [
                          value,
                          `${name}: ${(
                            (props.payload.percent || 0) * 100
                          ).toFixed(1)}%`,
                        ]}
                      />
                      <Legend
                        layout="vertical"
                        align="right"
                        verticalAlign="middle"
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
            )}

            {/* People Tab */}
            {activeTab === "people" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Top Actors" icon={<FiBarChart2 />}>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={topActors}
                      layout="vertical"
                      margin={{ left: 30, right: 20 }}
                    >
                      <XAxis type="number" hide />
                      <YAxis
                        dataKey="name"
                        type="category"
                        width={100}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#9CA3AF" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          borderColor: "#374151",
                          borderRadius: "0.5rem",
                        }}
                      />
                      <Bar
                        dataKey="count"
                        fill="#EC4899"
                        radius={[0, 4, 4, 0]}
                        animationDuration={2000}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>

                {/* <ChartCard title="Top Directors" icon={<FiBarChart2 />}>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={topDirectors}
                      layout="vertical"
                      margin={{ left: 30, right: 20 }}
                    >
                      <XAxis type="number" hide />
                      <YAxis
                        dataKey="name"
                        type="category"
                        width={100}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#9CA3AF" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          borderColor: "#374151",
                          borderRadius: "0.5rem",
                        }}
                      />
                      <Bar
                        dataKey="count"
                        fill="#6366F1"
                        radius={[0, 4, 4, 0]}
                        animationDuration={2000}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard> */}
              </div>
            )}

            {/* Timeline Tab */}
            {activeTab === "timeline" && (
              <div className="space-y-8">
                <ChartCard
                  title="Movies by Release Year"
                  icon={<FiBarChart2 />}
                >
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={yearData}>
                      <XAxis
                        dataKey="year"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#9CA3AF" }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#9CA3AF" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          borderColor: "#374151",
                          borderRadius: "0.5rem",
                        }}
                      />
                      <Bar
                        dataKey="count"
                        fill="#F43F5E"
                        radius={[4, 4, 0, 0]}
                        animationDuration={2000}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}

function StatCard({ icon, title, value, change }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 backdrop-blur-sm"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gray-700/50 rounded-lg">{icon}</div>
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
      </div>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <p className="text-xs text-gray-500">{change}</p>
    </motion.div>
  );
}

function ChartCard({ title, icon, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 backdrop-blur-sm"
    >
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h3 className="font-medium text-gray-300">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}
