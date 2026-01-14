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
            <div className="version-dropdown">
              <button
                className="version-button"
                onClick={() => setVersionOpen(!versionOpen)}
              >
                v1.0
                <ChevronDown size={14} />
              </button>
              <AnimatePresence>
                {versionOpen && (
                  <motion.div
                    className="version-menu"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                  >
                    <div className="version-item active">v1.0 (Current)</div>
                    <div className="version-item">v0.9</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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

      {/* Mobile Navigation */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <ul className="mobile-nav-links">
              {navItems.map((item) => (
                <li key={item.path} className="mobile-nav-item">
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `mobile-nav-link ${isActive ? 'active' : ''}`
                    }
                    onClick={() => setMenuOpen(false)}
                  >
                    <span>{item.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>

            {!user && (
              <div className="mobile-auth-buttons">
                <Link to="/login" className="btn-login" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="btn-get-started" onClick={() => setMenuOpen(false)}>
                  Get Started
                </Link>
              </div>
            )}

            {user && (
              <div className="mobile-auth-buttons">
                <Link to="/profile" className="btn-login" onClick={() => setMenuOpen(false)}>
                  Profile
                </Link>
                <button
                  className="btn-login"
                  onClick={() => {
                    auth.signOut();
                    setMenuOpen(false);
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}