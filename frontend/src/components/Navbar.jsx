import { Link, NavLink } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import logo from "../images/logo.png";
import { 
  Crown, 
  Sparkles, 
  Star, 
  Gem, 
  ChevronDown, 
  Menu, 
  X, 
  Home, 
  Search, 
  BookOpen, 
  BarChart3, 
  Clock, 
  User, 
  Settings, 
  LogOut,
  Zap,
  Film,
  Bell,
  Moon,
  Sun
} from "lucide-react";
import "./PremiumNavbar.css"; // We'll create this CSS file

export default function PremiumNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

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

  // Mock premium status
  const isPremium = user?.premium || false;

  const navItems = user
    ? [
        { path: "/dashboard", name: "Dashboard", icon: <Home className="nav-icon" />, premium: false },
        { path: "/finder", name: "Finder", icon: <Search className="nav-icon" />, premium: false },
        { path: "/diary", name: "Diary", icon: <BookOpen className="nav-icon" />, premium: false },
        { path: "/stats", name: "Stats", icon: <BarChart3 className="nav-icon" />, premium: true },
        { path: "/watchlater", name: "Watch Later", icon: <Clock className="nav-icon" />, premium: false },
        { path: "/notifications", name: "Notifications", icon: <Bell className="nav-icon" />, premium: false },
      ]
    : [
        { path: "/", name: "Home", icon: <Home className="nav-icon" />, premium: false },
        { path: "/features", name: "Features", icon: <Zap className="nav-icon" />, premium: false },
        { path: "/how-it-works", name: "How it Works", icon: <Film className="nav-icon" />, premium: false },
        { path: "/pricing", name: "Pricing", icon: <Crown className="nav-icon" />, premium: false },
      ];

  return (
    <motion.nav 
      className={`premium-navbar ${scrolled ? 'scrolled' : ''}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Logo */}
      <Link to={user ? "/dashboard" : "/"} className="logo-container">
        <motion.div 
          className="logo-wrapper"
          whileHover={{ rotate: 10 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="logo-glow">
            <img
              src={logo}
              alt="MovieMood Logo"
              className="logo-image"
            />
          </div>
          <div className="logo-ring"></div>
        </motion.div>
        
        <div className="logo-text">
          <motion.span 
            className="logo-title"
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.3 }
            }}
          >
            MovieMood
          </motion.span>
          <span className="logo-subtitle">
            CINEMATIC EXPERIENCE
          </span>
        </div>
      </Link>

      {/* Desktop Navigation */}
      <div className="nav-desktop">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            <div className="nav-item-content">
              {item.icon}
              <span className="nav-item-text">{item.name}</span>
              {item.premium && !isPremium && (
                <span className="premium-badge">
                  <Crown className="badge-icon" />
                  <span>PRO</span>
                </span>
              )}
            </div>
            <div className="nav-item-indicator"></div>
          </NavLink>
        ))}
      </div>

      {/* Right Actions */}
      <div className="nav-actions">
        {/* Theme Toggle */}
        <button 
          className="theme-toggle"
          onClick={() => setDarkMode(!darkMode)}
          aria-label="Toggle theme"
        >
          {darkMode ? (
            <Sun className="theme-icon" />
          ) : (
            <Moon className="theme-icon" />
          )}
        </button>

        {/* Premium Upgrade Button */}
        {user && !isPremium && (
          <Link 
            to="/pricing" 
            className="premium-upgrade-btn"
          >
            <Sparkles className="sparkle-icon" />
            <span>Upgrade</span>
            <div className="shimmer-effect"></div>
          </Link>
        )}

        {/* Auth Buttons or Profile */}
        {!user ? (
          <div className="auth-buttons">
            <Link to="/login" className="btn-login">
              Login
            </Link>
            <Link to="/register" className="btn-register">
              <Sparkles className="btn-icon" />
              Get Started
            </Link>
          </div>
        ) : (
          <div className="profile-container">
            {/* Notifications */}
            <button className="notification-btn">
              <Bell className="notification-icon" />
              <span className="notification-dot"></span>
            </button>

            {/* Profile Dropdown */}
            <div className="profile-dropdown-wrapper">
              <button 
                className="profile-trigger"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <div className="avatar-container">
                  <img
                    src={
                      user.photoURL ||
                      `https://ui-avatars.com/api/?name=${user.displayName || 'User'}&background=7C3AED&color=fff`
                    }
                    alt="Profile"
                    className="avatar-image"
                  />
                  {isPremium && (
                    <div className="premium-crown">
                      <Crown className="crown-icon" />
                    </div>
                  )}
                  <div className="avatar-glow"></div>
                </div>
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div 
                    className="profile-dropdown"
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {/* Profile Header */}
                    <div className="profile-header">
                      <div className="profile-info">
                        <div className="profile-avatar">
                          <img
                            src={
                              user.photoURL ||
                              `https://ui-avatars.com/api/?name=${user.displayName || 'User'}&background=7C3AED&color=fff`
                            }
                            alt="Profile"
                          />
                          {isPremium && (
                            <div className="profile-premium-badge">
                              <Crown className="profile-crown" />
                            </div>
                          )}
                        </div>
                        <div className="profile-details">
                          <h4 className="profile-name">
                            {user.displayName || "User"}
                            {isPremium && <span className="profile-premium-tag">PRO</span>}
                          </h4>
                          <p className="profile-email">{user.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="profile-menu">
                      <Link to="/profile" className="profile-menu-item" onClick={() => setProfileOpen(false)}>
                        <User className="menu-icon" />
                        <span>Profile</span>
                      </Link>
                      <Link to="/settings" className="profile-menu-item" onClick={() => setProfileOpen(false)}>
                        <Settings className="menu-icon" />
                        <span>Settings</span>
                      </Link>
                      {!isPremium && (
                        <Link to="/pricing" className="profile-menu-item premium" onClick={() => setProfileOpen(false)}>
                          <Crown className="menu-icon" />
                          <span>Upgrade to Premium</span>
                        </Link>
                      )}
                      <div className="profile-menu-divider"></div>
                      <Link to="/logout" className="profile-menu-item logout" onClick={() => setProfileOpen(false)}>
                        <LogOut className="menu-icon" />
                        <span>Logout</span>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className={`hamburger ${menuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div 
              className="mobile-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.div 
              className="mobile-menu"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25 }}
            >
              {/* Mobile Menu Header */}
              <div className="mobile-header">
                <Link to="/" className="mobile-logo" onClick={() => setMenuOpen(false)}>
                  <div className="mobile-logo-image">
                    <img src={logo} alt="Logo" />
                  </div>
                  <div>
                    <span className="mobile-logo-title">MovieMood</span>
                    <p className="mobile-logo-subtitle">Cinematic Experience</p>
                  </div>
                </Link>
                <button 
                  className="mobile-close-btn"
                  onClick={() => setMenuOpen(false)}
                >
                  <X className="close-icon" />
                </button>
              </div>

              {/* Mobile Navigation */}
              <nav className="mobile-nav">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `mobile-nav-item ${isActive ? 'active' : ''}`
                    }
                    onClick={() => setMenuOpen(false)}
                  >
                    <div className="mobile-nav-content">
                      {item.icon}
                      <span>{item.name}</span>
                    </div>
                    {item.premium && !isPremium && (
                      <span className="mobile-premium-badge">
                        <Crown className="mobile-badge-icon" />
                        <span>PRO</span>
                      </span>
                    )}
                  </NavLink>
                ))}
              </nav>

              {/* Mobile Auth Section */}
              <div className="mobile-auth">
                {!user ? (
                  <>
                    <Link
                      to="/login"
                      className="mobile-login-btn"
                      onClick={() => setMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="mobile-register-btn"
                      onClick={() => setMenuOpen(false)}
                    >
                      <Sparkles className="mobile-btn-icon" />
                      Get Started
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="mobile-profile">
                      <div className="mobile-profile-avatar">
                        <img
                          src={
                            user.photoURL ||
                            `https://ui-avatars.com/api/?name=${user.displayName || 'User'}&background=7C3AED&color=fff`
                          }
                          alt="Profile"
                        />
                        {isPremium && (
                          <div className="mobile-premium-indicator">
                            <Crown className="mobile-crown" />
                          </div>
                        )}
                      </div>
                      <div className="mobile-profile-info">
                        <p className="mobile-profile-name">{user.displayName || "User"}</p>
                        <p className="mobile-profile-email">{user.email}</p>
                      </div>
                    </div>
                    {!isPremium && (
                      <Link
                        to="/pricing"
                        className="mobile-upgrade-btn"
                        onClick={() => setMenuOpen(false)}
                      >
                        <Crown className="mobile-upgrade-icon" />
                        Upgrade to Premium
                      </Link>
                    )}
                    <Link
                      to="/logout"
                      className="mobile-logout-btn"
                      onClick={() => setMenuOpen(false)}
                    >
                      <LogOut className="mobile-logout-icon" />
                      Logout
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}