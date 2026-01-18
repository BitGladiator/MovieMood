import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import {
  Crown,
  Menu,
  X,
  Home,
  Zap,
  Film,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Github,
  Twitter,
  MessageCircle
} from "lucide-react";
import "./PremiumNavbar.css";
import { useTheme } from "../context/ThemeContext";

export default function PremiumNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [versionOpen, setVersionOpen] = useState(false);
  const { theme, toggleTheme, isDark } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  const navItems = user
    ? [
      { path: "/dashboard", name: "Dashboard", hasDropdown: false },
      { path: "/finder", name: "Finder", hasDropdown: false },
      { path: "/diary", name: "Diary", hasDropdown: false },
      { path: "/watchlater", name: "Watchlist", hasDropdown: false },
      { path: "/pricing", name: "Pricing", hasDropdown: false },
    ]
    : [
      { path: "/", name: "Home", hasDropdown: false },
      { path: "/features", name: "Features", hasDropdown: true },
      { path: "/how-it-works", name: "Docs", hasDropdown: false },
      { path: "/pricing", name: "Pricing", hasDropdown: false },
    ];

  return (
    <nav className={`premium-navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-wrapper">
        <div className="navbar-content">
          {/* Logo with Version */}
          <div className="logo-section">
            <Link to={user ? "/dashboard" : "/"} className="logo-container">
              <div className="logo-box">
                <Film className="logo-icon" />
              </div>
            </Link>
            
          </div>

          {/* Navigation Links */}
          <ul className="nav-links">
            {navItems.map((item) => (
              <li key={item.path} className="nav-item">
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                >
                  {item.name}
                  {item.hasDropdown && <ChevronDown size={14} className="dropdown-icon" />}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Right Section */}
          <div className="nav-right">
            {/* Action Icons */}
            <div className="action-icons">
              <button className="action-button" aria-label="Twitter">
                <Twitter size={18} />
              </button>
              <button className="action-button" aria-label="GitHub">
                <Github size={18} />
              </button>
              <button className="action-button" aria-label="Discord">
                <MessageCircle size={18} />
              </button>
            </div>

            {/* Auth Buttons (for non-logged in users) */}
            {!user && (
              <div className="auth-buttons">
                <Link to="/login" className="btn-login">
                  Login
                </Link>
                <Link to="/register" className="btn-get-started">
                  Get Started
                </Link>
              </div>
            )}

            {/* User Section (for logged in users) */}
            {user && (
              <div className="user-section">
                <button className="notifications-button">
                  <Bell size={18} />
                  <span className="notification-badge"></span>
                </button>

                <div style={{ position: 'relative' }}>
                  <button
                    className="profile-button"
                    onClick={() => setProfileOpen(!profileOpen)}
                  >
                    <div className="profile-avatar">
                      {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </div>
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        className="profile-dropdown"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                      >
                        <Link to="/profile" className="dropdown-item" onClick={() => setProfileOpen(false)}>
                          <User size={18} />
                          Profile
                        </Link>
                        <Link to="/settings" className="dropdown-item" onClick={() => setProfileOpen(false)}>
                          <Settings size={18} />
                          Settings
                        </Link>
                        <div className="dropdown-divider"></div>
                        <button
                          className="dropdown-item"
                          onClick={() => {
                            auth.signOut();
                            setProfileOpen(false);
                          }}
                        >
                          <LogOut size={18} />
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="mobile-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {menuOpen && (
          <motion.aside
            className="mobile-sidebar"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            {/* Sidebar Header */}
            <div className="sidebar-header">
              <div className="sidebar-user-info">
                {user ? (
                  <span className="sidebar-username">
                    {user.displayName || user.email?.split('@')[0] || 'User'}'s
                  </span>
                ) : (
                  <span className="sidebar-username">MovieMood</span>
                )}
              </div>
              <button
                className="sidebar-close-btn"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Quick Action */}
            <Link
              to="/finder"
              className="sidebar-quick-action"
              onClick={() => setMenuOpen(false)}
            >
              <span>New Mood Discovery</span>
              <span className="sidebar-action-icon">+</span>
            </Link>

            {/* Navigation Links */}
            <nav className="sidebar-nav">
              {user ? (
                <>
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <Home size={20} />
                    <span>Dashboard</span>
                  </NavLink>
                  <NavLink
                    to="/finder"
                    className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <Zap size={20} />
                    <span>Finder</span>
                  </NavLink>
                  <NavLink
                    to="/diary"
                    className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <Film size={20} />
                    <span>Diary</span>
                  </NavLink>
                  <NavLink
                    to="/watchlater"
                    className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <Bell size={20} />
                    <span>Watchlist</span>
                  </NavLink>
                  <NavLink
                    to="/pricing"
                    className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <Crown size={20} />
                    <span>Pricing</span>
                  </NavLink>
                  <NavLink
                    to="/settings"
                    className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <Settings size={20} />
                    <span>Settings</span>
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink
                    to="/"
                    className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <Home size={20} />
                    <span>Home</span>
                  </NavLink>
                  <NavLink
                    to="/features"
                    className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <Zap size={20} />
                    <span>Features</span>
                  </NavLink>
                  <NavLink
                    to="/how-it-works"
                    className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <Film size={20} />
                    <span>Docs</span>
                  </NavLink>
                  <NavLink
                    to="/pricing"
                    className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <Crown size={20} />
                    <span>Pricing</span>
                  </NavLink>
                </>
              )}
            </nav>

            {/* Divider */}
            <div className="sidebar-divider"></div>

            {/* Mood Collections */}
            <div className="sidebar-collections">
              <div className="sidebar-collection-item">
                <span className="collection-dot" style={{ background: '#ef4444' }}></span>
                <span>Action & Thriller</span>
              </div>
              <div className="sidebar-collection-item">
                <span className="collection-dot" style={{ background: '#3b82f6' }}></span>
                <span>Drama & Romance</span>
              </div>
              <div className="sidebar-collection-item">
                <span className="collection-dot" style={{ background: '#22c55e' }}></span>
                <span>Comedy & Feel-Good</span>
              </div>
              <button className="sidebar-add-collection">
                Add collection
              </button>
            </div>

            {/* Auth Section at Bottom */}
            <div className="sidebar-footer">
              {!user ? (
                <>
                  <Link
                    to="/login"
                    className="sidebar-auth-btn sidebar-login-btn"
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="sidebar-auth-btn sidebar-register-btn"
                    onClick={() => setMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                <button
                  className="sidebar-auth-btn sidebar-logout-btn"
                  onClick={() => {
                    auth.signOut();
                    setMenuOpen(false);
                  }}
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </nav>
  );
}