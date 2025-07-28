import { Link, NavLink } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import logo from "../images/logo.png";
import { Crown, Sparkles, Star, Gem, ChevronDown } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [profileHover, setProfileHover] = useState(false);
  const [premiumHover, setPremiumHover] = useState(false);
  const menuRef = useRef();

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

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Mock premium status - replace with your actual premium check
  const isPremium = user?.premium || false;

  return (
    <motion.nav 
      className={`w-full px-6 py-3 backdrop-blur-xl flex items-center justify-between flex-wrap sticky top-0 z-50 transition-all duration-500 ${
        scrolled 
          ? "bg-gray-900/95 border-b border-gray-800/50 shadow-2xl" 
          : "bg-transparent border-b border-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3 group">
        <motion.div 
          className="relative"
          whileHover={{ rotate: 10 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <img
            src={logo}
            alt="MovieMood Logo"
            className="w-10 h-10 rounded-full border-2 border-purple-500/80 shadow-lg shadow-purple-500/30 transition-all duration-500"
          />
          <motion.div 
            className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-purple-400/50"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0, 0.5, 0]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
        <motion.span 
          className="text-2xl md:text-3xl font-bold tracking-tight uppercase bg-gradient-to-r from-amber-400 via-pink-500 to-violet-500 text-transparent bg-clip-text"
          whileHover={{ 
            textShadow: "0 0 10px rgba(236, 72, 153, 0.7)",
            transition: { duration: 0.3 }
          }}
        >
          MovieMood
        </motion.span>
      </Link>

      {/* Navigation Menu */}
      <div
        ref={menuRef}
        className={`${menuOpen ? "flex animate-fadeIn" : "hidden"} 
        absolute md:static top-16 left-1/2 -translate-x-1/2 md:translate-x-0 md:flex 
        md:items-center md:gap-4 w-[calc(100%-3rem)] md:w-auto 
        bg-gray-900/95 md:bg-transparent p-5 md:p-0 rounded-2xl md:rounded-none 
        border border-gray-800/50 md:border-none shadow-2xl md:shadow-none 
        flex-col md:flex-row transition-all duration-300 z-40`}
      >
        {(user
          ? [
              { path: "/dashboard", name: "Dashboard", premium: false },
              { path: "/finder", name: "Finder", premium: false },
              { path: "/diary", name: "Diary", premium: false },
              { path: "/stats", name: "Stats", premium: true },
              { path: "/watchlater", name: "Watch Later", premium: false },
            ]
          : [
              { path: "/", name: "Home", premium: false },
              { path: "/features", name: "Features", premium: false },
              { path: "/pricing", name: "Pricing", premium: false },
            ]
        ).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2.5 md:py-1.5 rounded-lg transition-all 
              duration-300 hover:bg-gray-800/50 hover:shadow-lg text-sm md:text-[0.95rem] relative
              ${
                isActive
                  ? "text-white bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-l-4 md:border-l-0 md:border-b-2 border-purple-500 shadow-purple-500/10 font-medium"
                  : "text-gray-300 hover:text-white"
              }
              ${item.premium && !isPremium ? "pr-8" : ""}`
            }
            onClick={() => setMenuOpen(false)}
          >
            <span>{item.name}</span>
            {item.premium && !isPremium && (
              <span className="absolute right-2 top-1/2 -translate-y-1/2">
                <Gem className="w-4 h-4 text-amber-400" />
              </span>
            )}
          </NavLink>
        ))}

        {/* Premium Upgrade Button (Visible when logged in but not premium) */}
        {user && !isPremium && (
          <motion.div 
            className="relative group"
            onMouseEnter={() => setPremiumHover(true)}
            onMouseLeave={() => setPremiumHover(false)}
          >
            <Link
              to="/pricing"
              className="flex items-center gap-2 px-4 py-2.5 md:py-1.5 rounded-lg transition-all duration-300 bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-300 hover:text-white hover:from-amber-600/30 hover:to-amber-700/30 hover:shadow-amber-500/10"
            >
              <Sparkles className="w-4 h-4" />
              <span>Upgrade</span>
            </Link>

            {/* Premium Tooltip */}
            <AnimatePresence>
              {premiumHover && (
                <motion.div 
                  className="absolute top-full right-0 mt-2 w-64 bg-gray-900/95 backdrop-blur-xl rounded-xl p-4 shadow-2xl border border-amber-500/20 z-50"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-amber-500/10 p-2 rounded-lg">
                      <Crown className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Unlock Premium</h4>
                      <p className="text-xs text-gray-400 mt-1">
                        Get access to exclusive features like advanced stats, 
                        personalized recommendations, and ad-free experience.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-3">
        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden relative w-9 h-9 flex items-center justify-center rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-300 group"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <motion.div
            className={`absolute w-5 h-[2px] bg-white transition-all duration-300 ${
              menuOpen ? "rotate-45 translate-y-0" : "-translate-y-1.5"
            }`}
            animate={{
              backgroundColor: menuOpen ? "#ec4899" : "#ffffff"
            }}
          />
          <motion.div
            className={`absolute w-5 h-[2px] bg-white transition-all duration-300 ${
              menuOpen ? "opacity-0 scale-0" : "opacity-100 scale-100"
            }`}
            animate={{
              backgroundColor: menuOpen ? "#ec4899" : "#ffffff"
            }}
          />
          <motion.div
            className={`absolute w-5 h-[2px] bg-white transition-all duration-300 ${
              menuOpen ? "-rotate-45 translate-y-0" : "translate-y-1.5"
            }`}
            animate={{
              backgroundColor: menuOpen ? "#ec4899" : "#ffffff"
            }}
          />
          <motion.div 
            className="absolute inset-0 rounded-lg border border-transparent group-hover:border-pink-500/30"
            animate={{
              scale: menuOpen ? 1.1 : 1,
              borderColor: menuOpen ? "rgba(236, 72, 153, 0.3)" : "transparent"
            }}
            transition={{ type: "spring", stiffness: 500 }}
          />
        </button>

        {!user ? (
          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/login"
              className="relative overflow-hidden text-sm text-indigo-300 hover:text-white px-4 py-1.5 rounded-lg transition-all duration-300 hover:bg-indigo-500/10 hover:shadow-[0_0_10px_rgba(99,102,241,0.2)] group"
            >
              <span className="relative z-10">Login</span>
              <motion.span 
                className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-indigo-600/10 opacity-0 group-hover:opacity-100"
                initial={{ x: -100 }}
                whileHover={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
              />
            </Link>
            <Link
              to="/register"
              className="relative overflow-hidden text-sm text-white px-4 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 hover:shadow-[0_0_10px_rgba(16,185,129,0.4)] group"
            >
              <span className="relative z-10">Register</span>
              <motion.span 
                className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100"
                initial={{ x: -100 }}
                whileHover={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
              />
            </Link>
          </div>
        ) : (
          <div className="relative group"
            onMouseEnter={() => setProfileHover(true)}
            onMouseLeave={() => setProfileHover(false)}
          >
            <Link to="/profile" className="block">
              <motion.div 
                className="relative w-10 h-10 rounded-full overflow-hidden"
                animate={{
                  scale: profileHover ? 1.1 : 1,
                }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                {/* Premium crown badge */}
                {isPremium && (
                  <div className="absolute -top-1 -right-1 z-20">
                    <div className="bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full p-0.5 shadow-lg">
                      <Crown className="w-3 h-3 text-white fill-white" />
                    </div>
                  </div>
                )}

                {/* Profile image with cinematic border effect */}
                <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-purple-400/50 transition-all duration-500 z-10 pointer-events-none">
                  <motion.div 
                    className="absolute inset-0 rounded-full border-2 border-transparent"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0, 0.5, 0],
                      borderColor: ["rgba(192, 132, 252, 0)", "rgba(192, 132, 252, 0.5)", "rgba(192, 132, 252, 0)"]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </div>
                
                {/* Glow effect */}
                <motion.div 
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  animate={{
                    opacity: profileHover ? 0.3 : 0,
                  }}
                />
                
                <img
                  src={
                    user.photoURL ||
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/2048px-Circle-icons-profile.svg.png"
                  }
                  alt="Profile"
                  className="w-full h-full object-cover relative z-0"
                />
              </motion.div>
            </Link>
            
            {/* Enhanced Profile Dropdown */}
            <AnimatePresence>
              {profileHover && (
                <motion.div 
                  className="absolute right-0 top-full mt-2 w-56 bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-800/50 overflow-hidden z-50"
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {/* Profile header */}
                  <div className="p-4 border-b border-gray-800/50 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={
                            user.photoURL ||
                            "https://img.icons8.com/fluency-systems-filled/48/user-male-circle.png"
                          }
                          alt="Profile"
                          className="w-10 h-10 rounded-full border-2 border-purple-500/50"
                        />
                        {isPremium && (
                          <div className="absolute -top-1 -right-1 z-20">
                            <div className="bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full p-0.5 shadow-lg">
                              <Crown className="w-3 h-3 text-white fill-white" />
                            </div>
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-white truncate">
                          {user.displayName || "User"}
                          {isPremium && (
                            <span className="ml-1 text-xs bg-gradient-to-r from-amber-400 to-yellow-500 text-transparent bg-clip-text">
                              PRO
                            </span>
                          )}
                        </h4>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Menu items */}
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800/50 hover:text-white transition-colors flex items-center gap-2"
                    >
                      <span>Profile</span>
                    </Link>
                    <Link
                      to="/settings"
                      className="px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800/50 hover:text-white transition-colors flex items-center gap-2"
                    >
                      <span>Settings</span>
                    </Link>
                    {!isPremium && (
                      <Link
                        to="/pricing"
                        className="px-4 py-2.5 text-sm text-amber-300 hover:bg-amber-900/10 transition-colors flex items-center gap-2 border-t border-gray-800/50"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Upgrade to Premium</span>
                      </Link>
                    )}
                    <Link
                      to="/logout"
                      className="px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800/50 hover:text-white transition-colors flex items-center gap-2 border-t border-gray-800/50"
                    >
                      <span>Logout</span>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Mobile Buttons */}
      {menuOpen && (
        <motion.div 
          className="block md:hidden w-full mt-4 space-y-3"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          {!user && (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block w-full bg-indigo-600/90 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all duration-300 shadow-lg hover:shadow-indigo-500/30 flex items-center justify-center gap-2"
              >
                <span>🔑</span>
                <span>Login</span>
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="block w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-emerald-500/30 flex items-center justify-center gap-2"
              >
                <span>✨</span>
                <span>Register</span>
              </Link>
            </>
          )}
          {user && !isPremium && (
            <Link
              to="/pricing"
              onClick={() => setMenuOpen(false)}
              className="block w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:from-amber-600 hover:to-yellow-600 transition-all duration-300 shadow-lg hover:shadow-amber-500/30 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Upgrade to Premium</span>
            </Link>
          )}
        </motion.div>
      )}
    </motion.nav>
  );
}