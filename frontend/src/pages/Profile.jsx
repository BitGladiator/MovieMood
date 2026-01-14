import React, { useEffect, useState } from "react";
import { auth, logout, db } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";
import { FiEdit2, FiShare2, FiLogOut, FiFilm, FiClock, FiPlus } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";

const profileStyles = `
  .profile-page {
    min-height: 100vh;
    padding-top: 100px;
    padding-bottom: 60px;
    transition: background 0.3s ease;
  }

  .profile-page.light {
    background: linear-gradient(180deg, #fdfbf9 0%, #fef5f0 50%, #faf5ff 100%);
  }

  .profile-page.dark {
    background: radial-gradient(ellipse at top, #1e1b4b 0%, #0a0118 50%, #000000 100%);
  }

  .profile-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 0 1.5rem;
  }

  /* Profile Header */
  .profile-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding-bottom: 2rem;
  }

  .avatar-wrapper {
    margin-bottom: 1rem;
  }

  .avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
  }

  .profile-page.light .avatar {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }

  .profile-page.dark .avatar {
    box-shadow: 0 4px 20px rgba(124, 58, 237, 0.3);
    border: 3px solid rgba(167, 139, 250, 0.3);
  }

  .profile-name {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
  }

  .profile-page.light .profile-name {
    color: #1a1a2e;
  }

  .profile-page.dark .profile-name {
    color: #f8f9ff;
  }

  .profile-username {
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
  }

  .profile-page.light .profile-username {
    color: #64748b;
  }

  .profile-page.dark .profile-username {
    color: #a5b4fc;
  }

  .profile-stats {
    font-size: 0.9375rem;
    margin-bottom: 1rem;
  }

  .profile-page.light .profile-stats {
    color: #374151;
  }

  .profile-page.dark .profile-stats {
    color: #e0e7ff;
  }

  .profile-stats strong {
    font-weight: 600;
  }

  /* Action Buttons */
  .profile-actions {
    display: flex;
    gap: 0.5rem;
  }

  .action-btn {
    padding: 0.625rem 1rem;
    font-size: 0.875rem;
    font-weight: 600;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.2s ease;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
  }

  .profile-page.light .action-btn {
    background: #f1f5f9;
    color: #1a1a2e;
    border: none;
  }

  .profile-page.light .action-btn:hover {
    background: #e2e8f0;
  }

  .profile-page.dark .action-btn {
    background: rgba(88, 28, 135, 0.4);
    color: #e0e7ff;
    border: 1px solid rgba(167, 139, 250, 0.3);
  }

  .profile-page.dark .action-btn:hover {
    background: rgba(124, 58, 237, 0.5);
  }

  /* Tabs */
  .tabs-wrapper {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-bottom: 1.5rem;
  }

  .tab-btn {
    padding: 0.75rem 0;
    font-size: 1rem;
    font-weight: 500;
    background: none;
    border: none;
    cursor: pointer;
    position: relative;
  }

  .profile-page.light .tab-btn {
    color: #9ca3af;
  }

  .profile-page.light .tab-btn.active {
    color: #1a1a2e;
  }

  .profile-page.dark .tab-btn {
    color: #6b7280;
  }

  .profile-page.dark .tab-btn.active {
    color: #f8f9ff;
  }

  .tab-btn.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: #1a1a2e;
  }

  .profile-page.dark .tab-btn.active::after {
    background: #a78bfa;
  }

  /* Boards Section */
  .boards-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding: 0 0.25rem;
  }

  .boards-header-icon {
    padding: 0.5rem;
    border-radius: 50%;
    cursor: pointer;
  }

  .profile-page.light .boards-header-icon {
    color: #374151;
  }

  .profile-page.dark .boards-header-icon {
    color: #e0e7ff;
  }

  /* Pinterest-style Board Cards */
  .boards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 1rem;
  }

  .board-card {
    text-decoration: none;
    display: block;
  }

  .board-images {
    display: grid;
    grid-template-columns: 2fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 2px;
    border-radius: 16px;
    overflow: hidden;
    aspect-ratio: 1;
    margin-bottom: 0.75rem;
  }

  .board-image-main {
    grid-row: span 2;
  }

  .board-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .board-image-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .profile-page.light .board-image-placeholder {
    background: #f3f4f6;
    color: #9ca3af;
  }

  .profile-page.dark .board-image-placeholder {
    background: rgba(30, 27, 75, 0.8);
    color: #a78bfa;
  }

  .board-title {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.125rem;
  }

  .profile-page.light .board-title {
    color: #1a1a2e;
  }

  .profile-page.dark .board-title {
    color: #f8f9ff;
  }

  .board-meta {
    font-size: 0.8125rem;
  }

  .profile-page.light .board-meta {
    color: #6b7280;
  }

  .profile-page.dark .board-meta {
    color: #a5b4fc;
  }

  /* Add Button */
  .add-btn {
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 40;
    transition: transform 0.2s ease;
  }

  .profile-page.light .add-btn {
    background: #1a1a2e;
    color: white;
  }

  .profile-page.dark .add-btn {
    background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
    color: white;
  }

  .add-btn:hover {
    transform: scale(1.1);
  }

  /* Logout */
  .logout-section {
    margin-top: 3rem;
    text-align: center;
  }

  .logout-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1.25rem;
    font-size: 0.875rem;
    font-weight: 500;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .profile-page.light .logout-btn {
    background: #fef2f2;
    color: #dc2626;
    border: 1px solid #fecaca;
  }

  .profile-page.light .logout-btn:hover {
    background: #fee2e2;
  }

  .profile-page.dark .logout-btn {
    background: rgba(220, 38, 38, 0.15);
    color: #fca5a5;
    border: 1px solid rgba(220, 38, 38, 0.3);
  }

  .profile-page.dark .logout-btn:hover {
    background: rgba(220, 38, 38, 0.25);
  }

  /* Loading */
  .loading-screen {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .loading-spinner {
    width: 48px;
    height: 48px;
    border: 4px solid #f3e8ff;
    border-top-color: #7c3aed;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export default function Profile() {
  const [user, setUser] = useState(null);
  const [diaryCount, setDiaryCount] = useState(0);
  const [watchLaterCount, setWatchLaterCount] = useState(0);
  const [diaryMovies, setDiaryMovies] = useState([]);
  const [watchLaterMovies, setWatchLaterMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("saved");
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser({
          name: currentUser.displayName || currentUser.email.split('@')[0] || "Movie Buff",
          email: currentUser.email,
          uid: currentUser.uid,
          avatar:
            currentUser.photoURL ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              currentUser.displayName || currentUser.email.split('@')[0] || "MB"
            )}&background=7c3aed&color=fff&size=256`,
        });

        try {
          const [diarySnapshot, watchSnapshot] = await Promise.all([
            getDocs(query(collection(db, "diary"), where("uid", "==", currentUser.uid))),
            getDocs(query(collection(db, "watchLater"), where("uid", "==", currentUser.uid)))
          ]);

          setDiaryCount(diarySnapshot.size);
          setWatchLaterCount(watchSnapshot.size);

          const diaryDocs = diarySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          const watchDocs = watchSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

          setDiaryMovies(diaryDocs.slice(0, 3));
          setWatchLaterMovies(watchDocs.slice(0, 3));
        } catch (error) {
          console.error("Error fetching counts:", error);
        }
      } else {
        navigate("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Get posters for board display
  const getBoardImages = (movies, posterField) => {
    const images = movies.slice(0, 3).map(m => m[posterField] || m.Poster || m.poster);
    return images.filter(img => img && img !== "N/A");
  };

  if (loading || !user) {
    return (
      <>
        <style>{profileStyles}</style>
        <div className={`profile-page ${theme}`}>
          <div className="loading-screen">
            <div className="loading-spinner"></div>
          </div>
        </div>
      </>
    );
  }

  const diaryImages = getBoardImages(diaryMovies, "Poster");
  const watchImages = getBoardImages(watchLaterMovies, "poster");

  return (
    <>
      <style>{profileStyles}</style>
      <div className={`profile-page ${theme}`}>
        <div className="profile-container">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="profile-header"
          >
            <div className="avatar-wrapper">
              <img
                src={user.avatar}
                alt={user.name}
                className="avatar"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=7c3aed&color=fff&size=256`;
                }}
              />
            </div>

            <h1 className="profile-name">{user.name}</h1>
            <p className="profile-username">@{user.email.split('@')[0]}</p>

            <p className="profile-stats">
              <strong>{diaryCount}</strong> movies · <strong>{watchLaterCount}</strong> watchlist
            </p>

            <div className="profile-actions">
              <button className="action-btn">Share</button>
              <button className="action-btn">Edit profile</button>
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="tabs-wrapper">
            <button
              className={`tab-btn ${activeTab === "created" ? "active" : ""}`}
              onClick={() => setActiveTab("created")}
            >
              Created
            </button>
            <button
              className={`tab-btn ${activeTab === "saved" ? "active" : ""}`}
              onClick={() => setActiveTab("saved")}
            >
              Saved
            </button>
          </div>

          {/* Boards Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="boards-grid">
              {/* All Movies Board */}
              <Link to="/diary" className="board-card">
                <div className="board-images">
                  {/* Main large image */}
                  <div className="board-image-main">
                    {diaryImages[0] ? (
                      <img src={diaryImages[0]} alt="" className="board-image" />
                    ) : (
                      <div className="board-image board-image-placeholder">
                        <FiFilm size={32} />
                      </div>
                    )}
                  </div>
                  {/* Top right small image */}
                  <div>
                    {diaryImages[1] ? (
                      <img src={diaryImages[1]} alt="" className="board-image" />
                    ) : (
                      <div className="board-image board-image-placeholder">
                        <FiFilm size={16} />
                      </div>
                    )}
                  </div>
                  {/* Bottom right small image */}
                  <div>
                    {diaryImages[2] ? (
                      <img src={diaryImages[2]} alt="" className="board-image" />
                    ) : (
                      <div className="board-image board-image-placeholder">
                        <FiFilm size={16} />
                      </div>
                    )}
                  </div>
                </div>
                <h3 className="board-title">All Movies</h3>
                <p className="board-meta">{diaryCount} movies</p>
              </Link>

              {/* Watch Later Board */}
              <Link to="/watchlater" className="board-card">
                <div className="board-images">
                  <div className="board-image-main">
                    {watchImages[0] ? (
                      <img src={watchImages[0]} alt="" className="board-image" />
                    ) : (
                      <div className="board-image board-image-placeholder">
                        <FiClock size={32} />
                      </div>
                    )}
                  </div>
                  <div>
                    {watchImages[1] ? (
                      <img src={watchImages[1]} alt="" className="board-image" />
                    ) : (
                      <div className="board-image board-image-placeholder">
                        <FiClock size={16} />
                      </div>
                    )}
                  </div>
                  <div>
                    {watchImages[2] ? (
                      <img src={watchImages[2]} alt="" className="board-image" />
                    ) : (
                      <div className="board-image board-image-placeholder">
                        <FiClock size={16} />
                      </div>
                    )}
                  </div>
                </div>
                <h3 className="board-title">Watch Later</h3>
                <p className="board-meta">{watchLaterCount} movies</p>
              </Link>
            </div>

            {/* Logout */}
            <div className="logout-section">
              <button onClick={handleLogout} className="logout-btn">
                <FiLogOut size={16} />
                Logout
              </button>
            </div>
          </motion.div>

          {/* Add Button */}
          <Link to="/finder" className="add-btn">
            <FiPlus size={24} />
          </Link>
        </div>
      </div>
    </>
  );
}