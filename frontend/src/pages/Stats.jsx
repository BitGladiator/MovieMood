import { useEffect, useState } from "react";
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
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#60a5fa", "#34d399", "#fbbf24", "#f472b6", "#818cf8"];

export default function Stats() {
  const [watched, setWatched] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (!u) {
        setLoading(false);
        return;
      }

      try {
        const q = query(collection(db, "diary"), where("uid", "==", u.uid));
        const querySnapshot = await getDocs(q);

        const movies = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            title: data.title,
            genres: data.Genre?.split(", ").filter(Boolean),
            cast: data.Actors?.split(", ").filter(Boolean),
            year: data.Year,
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
    console.log("🔍 Watched movies:", watched);
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

  if (loading) {
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
  }

  if (!user) {
    return (
      <div className="flex flex-col mt-[20rem] items-center justify-center text-center text-white">
        <p className="text-3xl md:text-4xl font-bold animate-pulse text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-purple-500 to-blue-500 drop-shadow-lg max-w-xl">
          🔒 Please log in to view your movie stats dashboard.
        </p>
      </div>
    );
  }

  if (!watched.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-300 p-8 flex flex-col items-center justify-center">
        <div className="text-7xl animate-bounce mb-4 drop-shadow-lg">📊</div>
        <h2 className="text-4xl md:text-5xl font-extrabold text-center bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent mb-3">
          No Stats Available
        </h2>
        <p className="text-lg text-gray-400 text-center max-w-md">
          You haven’t watched any movies yet. Once you do, your viewing stats
          will shine here!
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <h1 className="text-4xl font-extrabold mb-8 tracking-tight">
        🎬 Movie Stats Dashboard
      </h1>

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
