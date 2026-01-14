import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Film,
  Clock,
  TrendingUp,
  Star,
  Heart,
  BarChart2,
  Calendar,
  ChevronRight
} from "lucide-react";
import { auth, db, logout } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import { toast } from "react-hot-toast";

const dashboardStyles = `
  .dashboard-page {
    min-height: 100vh;
    background: linear-gradient(180deg, #fdfbf9 0%, #fef5f0 50%, #faf5ff 100%);
    padding-top: 80px;
    padding-bottom: 60px;
  }

  .dashboard-container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .dashboard-header {
    margin-bottom: 3rem;
  }

  .greeting-title {
    font-size: clamp(2rem, 4vw, 2.75rem);
    font-weight: 700;
    color: #1a1a2e;
    margin-bottom: 0.5rem;
  }

  .greeting-subtitle {
    font-size: 1.125rem;
    color: #64748b;
  }

  .accent-name {
    background: linear-gradient(135deg, #7c3aed, #ec4899);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
  }

  .stat-card {
    background: white;
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
    border: 1px solid rgba(0, 0, 0, 0.04);
    transition: all 0.3s ease;
  }

  .stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
  }

  .stat-icon.purple {
    background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
    color: #7c3aed;
  }

  .stat-icon.pink {
    background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%);
    color: #ec4899;
  }

  .stat-icon.blue {
    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
    color: #3b82f6;
  }

  .stat-icon.amber {
    background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
    color: #f59e0b;
  }

  .stat-label {
    font-size: 0.9375rem;
    color: #64748b;
    margin-bottom: 0.5rem;
  }

  .stat-value {
    font-size: 2.25rem;
    font-weight: 700;
    color: #1a1a2e;
  }

  .section {
    margin-bottom: 3rem;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .section-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1a1a2e;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .section-title svg {
    width: 24px;
    height: 24px;
    color: #7c3aed;
  }

  .view-all-link {
    color: #7c3aed;
    font-size: 0.9375rem;
    font-weight: 600;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    transition: all 0.2s ease;
  }

  .view-all-link:hover {
    gap: 0.5rem;
  }

  .movies-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.5rem;
  }

  .movie-card {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
    border: 1px solid rgba(0, 0, 0, 0.04);
    transition: all 0.3s ease;
  }

  .movie-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
  }

  .movie-poster {
    width: 100%;
    aspect-ratio: 2/3;
    background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #7c3aed;
    position: relative;
    overflow: hidden;
  }

  .movie-poster img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .movie-card:hover .movie-poster img {
    transform: scale(1.05);
  }

  .movie-info {
    padding: 1rem;
  }

  .movie-title {
    font-size: 0.9375rem;
    font-weight: 600;
    color: #1a1a2e;
    margin-bottom: 0.5rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .movie-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.8125rem;
  }

  .movie-date {
    color: #64748b;
  }

  .movie-rating {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    color: #f59e0b;
    font-weight: 600;
  }

  .empty-state {
    background: white;
    border-radius: 20px;
    padding: 3rem 2rem;
    text-align: center;
    border: 2px dashed #e5e7eb;
  }

  .empty-state-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 1rem;
    background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #7c3aed;
  }

  .empty-state-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1a1a2e;
    margin-bottom: 0.5rem;
  }

  .empty-state-text {
    color: #64748b;
    margin-bottom: 1.5rem;
  }

  .empty-state-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: #7c3aed;
    color: white;
    font-weight: 600;
    border-radius: 10px;
    text-decoration: none;
    transition: all 0.3s ease;
  }

  .empty-state-btn:hover {
    background: #6d28d9;
    transform: translateY(-2px);
  }

  .activity-chart {
    background: white;
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  }

  .chart-bars {
    display: flex;
    align-items: flex-end;
    gap: 0.5rem;
    height: 200px;
    margin-top: 2rem;
  }

  .chart-bar {
    flex: 1;
    background: linear-gradient(180deg, #7c3aed 0%, #a855f7 100%);
    border-radius: 6px 6px 0 0;
    position: relative;
    transition: all 0.3s ease;
  }

  .chart-bar:hover {
    background: linear-gradient(180deg, #6d28d9 0%, #9333ea 100%);
  }

  .chart-label {
    position: absolute;
    bottom: -24px;
    left: 0;
    right: 0;
    text-align: center;
    font-size: 0.75rem;
    color: #64748b;
  }

  .chart-value {
    position: absolute;
    top: -24px;
    left: 0;
    right: 0;
    text-align: center;
    font-size: 0.75rem;
    font-weight: 600;
    color: #1a1a2e;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .chart-bar:hover .chart-value {
    opacity: 1;
  }

  .loading-screen {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(180deg, #fdfbf9 0%, #faf5ff 100%);
  }

  .loading-content {
    text-align: center;
  }

  .loading-spinner {
    width: 64px;
    height: 64px;
    margin: 0 auto 1.5rem;
    border-radius: 50%;
    border: 4px solid #f3e8ff;
    border-top-color: #7c3aed;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .loading-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1a1a2e;
    margin-bottom: 0.5rem;
  }

  .loading-text {
    color: #64748b;
  }

  @media (max-width: 768px) {
    .dashboard-container {
      padding: 0 1rem;
    }

    .stats-grid {
      grid-template-columns: 1fr;
    }

    .movies-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
`;

const Dashboard = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
  });

  const [stats, setStats] = useState({
    diaryCount: 0,
    watchLaterCount: 0,
    recentlyAdded: [],
    topRated: [],
    monthlyActivity: Array(12).fill(0),
  });

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate("/login");
        return;
      }

      try {
        setUser({
          uid: currentUser.uid,
          name: currentUser.displayName || currentUser.email?.split("@")[0] || "Movie Buff",
          email: currentUser.email,
        });

        const [diarySnapshot, watchSnapshot] = await Promise.all([
          getDocs(query(collection(db, "diary"), where("uid", "==", currentUser.uid))),
          getDocs(query(collection(db, "watchLater"), where("uid", "==", currentUser.uid))),
        ]);

        const monthlyCounts = Array(12).fill(0);
        const now = new Date();

        diarySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.dateWatched) {
            const watchedDate = new Date(data.dateWatched);
            const monthDiff =
              (now.getFullYear() - watchedDate.getFullYear()) * 12 +
              now.getMonth() - watchedDate.getMonth();
            if (monthDiff >= 0 && monthDiff < 12) {
              monthlyCounts[11 - monthDiff]++;
            }
          }
        });

        let recentMovies = [];
        let topRatedMovies = [];

        try {
          const recentQuery = query(
            collection(db, "diary"),
            where("uid", "==", currentUser.uid),
            orderBy("dateWatched", "desc"),
            limit(4)
          );
          const recentSnapshot = await getDocs(recentQuery);
          recentMovies = recentSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
          console.warn("Error fetching recent movies:", error);
        }

        try {
          const topRatedQuery = query(
            collection(db, "diary"),
            where("uid", "==", currentUser.uid),
            where("rating", ">=", 4),
            orderBy("rating", "desc"),
            limit(4)
          );
          const topRatedSnapshot = await getDocs(topRatedQuery);
          topRatedMovies = topRatedSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
          console.warn("Error fetching top-rated movies:", error);
        }

        setStats({
          diaryCount: diarySnapshot.size,
          watchLaterCount: watchSnapshot.size,
          recentlyAdded: recentMovies,
          topRated: topRatedMovies,
          monthlyActivity: monthlyCounts,
        });
      } catch (error) {
        console.error("Dashboard error:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <>
        <style>{dashboardStyles}</style>
        <div className="loading-screen">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <h2 className="loading-title">Loading Your Dashboard</h2>
            <p className="loading-text">Preparing your personalized movie experience...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{dashboardStyles}</style>
      <div className="dashboard-page">
        <div className="dashboard-container">
          {/* Header */}
          <motion.div
            className="dashboard-header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="greeting-title">
              {getGreeting()}, <span className="accent-name">{user.name}</span>!
            </h1>
            <p className="greeting-subtitle">
              Welcome to your personalized movie dashboard
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            className="stats-grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <motion.div className="stat-card" whileHover={{ y: -4 }}>
              <div className="stat-icon purple">
                <Film size={24} />
              </div>
              <div className="stat-label">Movies Watched</div>
              <div className="stat-value">{stats.diaryCount}</div>
            </motion.div>

            <motion.div className="stat-card" whileHover={{ y: -4 }}>
              <div className="stat-icon pink">
                <Heart size={24} />
              </div>
              <div className="stat-label">Watchlist</div>
              <div className="stat-value">{stats.watchLaterCount}</div>
            </motion.div>

            <motion.div className="stat-card" whileHover={{ y: -4 }}>
              <div className="stat-icon amber">
                <Star size={24} />
              </div>
              <div className="stat-label">Top Rated</div>
              <div className="stat-value">{stats.topRated.length}</div>
            </motion.div>

            <motion.div className="stat-card" whileHover={{ y: -4 }}>
              <div className="stat-icon blue">
                <TrendingUp size={24} />
              </div>
              <div className="stat-label">This Year</div>
              <div className="stat-value">
                {stats.monthlyActivity.reduce((a, b) => a + b, 0)}
              </div>
            </motion.div>
          </motion.div>

          {/* Recently Added */}
          <motion.div
            className="section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="section-header">
              <h2 className="section-title">
                <Film size={24} />
                Recently Added
              </h2>
              <Link to="/diary" className="view-all-link">
                View all <ChevronRight size={16} />
              </Link>
            </div>

            {stats.recentlyAdded.length > 0 ? (
              <div className="movies-grid">
                {stats.recentlyAdded.map((movie, index) => (
                  <motion.div
                    key={movie.id || index}
                    className="movie-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <div className="movie-poster">
                      {movie.poster ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w500${movie.poster}`}
                          alt={movie.title}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <Film size={32} />
                      )}
                    </div>
                    <div className="movie-info">
                      <div className="movie-title">{movie.title || "Untitled"}</div>
                      <div className="movie-meta">
                        <span className="movie-date">
                          {movie.dateWatched
                            ? new Date(movie.dateWatched).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })
                            : "No date"}
                        </span>
                        {movie.rating && (
                          <span className="movie-rating">
                            <Star size={14} fill="currentColor" />
                            {movie.rating}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <Film size={32} />
                </div>
                <h3 className="empty-state-title">No movies yet</h3>
                <p className="empty-state-text">
                  Start your movie journey by adding your first film
                </p>
                <Link to="/finder" className="empty-state-btn">
                  <Film size={18} />
                  Find Movies
                </Link>
              </div>
            )}
          </motion.div>

          {/* Top Rated */}
          {stats.topRated.length > 0 && (
            <motion.div
              className="section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="section-header">
                <h2 className="section-title">
                  <Star size={24} />
                  Your Top Rated
                </h2>
                <Link to="/diary" className="view-all-link">
                  View all <ChevronRight size={16} />
                </Link>
              </div>

              <div className="movies-grid">
                {stats.topRated.map((movie, index) => (
                  <motion.div
                    key={movie.id || index}
                    className="movie-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <div className="movie-poster">
                      {movie.poster ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w500${movie.poster}`}
                          alt={movie.title}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <Film size={32} />
                      )}
                    </div>
                    <div className="movie-info">
                      <div className="movie-title">{movie.title || "Untitled"}</div>
                      <div className="movie-meta">
                        <span className="movie-date">
                          {movie.dateWatched
                            ? new Date(movie.dateWatched).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })
                            : "No date"}
                        </span>
                        <span className="movie-rating">
                          <Star size={14} fill="currentColor" />
                          {movie.rating}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Activity Chart */}
          <motion.div
            className="section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="activity-chart">
              <h2 className="section-title">
                <BarChart2 size={24} />
                Your Activity
              </h2>
              <div className="chart-bars">
                {stats.monthlyActivity.map((count, index) => {
                  const month = new Date(0, index).toLocaleString("default", {
                    month: "short",
                  });
                  const maxCount = Math.max(...stats.monthlyActivity, 1);
                  const height = `${(count / maxCount) * 100}%`;
                  return (
                    <motion.div
                      key={index}
                      className="chart-bar"
                      style={{ height }}
                      initial={{ height: 0 }}
                      animate={{ height }}
                      transition={{ delay: 0.7 + index * 0.05, duration: 0.5 }}
                    >
                      <div className="chart-value">{count}</div>
                      <div className="chart-label">{month}</div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
