import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { ThemeContext } from "../context/ThemeContext";
import { Link } from "react-router-dom";

export default function Settings() {
  const [darkMode, setDarkMode] = useState(true);
  const { theme, changeTheme } = useContext(ThemeContext);
  const [notifications, setNotifications] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);
  
  const [volume, setVolume] = useState(80);

  const themes = [
    {
      name: "Purple",
      value: "purple",
      gradient: "from-purple-600 to-blue-600",
    },
    {
      name: "Crimson",
      value: "crimson",
      gradient: "from-rose-600 to-pink-600",
    },
    {
      name: "Emerald",
      value: "emerald",
      gradient: "from-emerald-600 to-cyan-600",
    },
    { name: "Amber", value: "amber", gradient: "from-amber-600 to-orange-600" },
  ];
  const handleThemeChange = (themeValue) => {
    changeTheme(themeValue);
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden p-4 md:p-8">
      {/* Premium Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-900/10 to-black z-10"></div>

        <div className="absolute inset-0 grid grid-cols-3 gap-0 opacity-20">
          {[
            "https://image.tmdb.org/t/p/original/8Y43POKjjKDGI9MH89NW0NAzzp8.jpg",
            "https://image.tmdb.org/t/p/original/9n2tJBplPbgR2ca05hS5CKXwP2c.jpg",
            "https://image.tmdb.org/t/p/original/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg",
          ].map((backdrop, index) => (
            <motion.div
              key={index}
              className="relative h-full w-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ duration: 1.5, delay: index * 0.4 }}
            >
              <img
                src={backdrop}
                alt=""
                className="w-full h-full object-cover grayscale-[60%] brightness-50"
                loading="lazy"
              />
              <div
                className={`absolute inset-0 bg-gradient-to-${
                  index === 0 ? "r" : index === 1 ? "b" : "l"
                } from-black/90 via-black/30 to-black/90`}
              ></div>
            </motion.div>
          ))}
        </div>

        <div className="absolute inset-0 z-20 pointer-events-none">
          <div className="absolute top-0 left-1/2 w-[200vw] h-[200vh] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent -translate-x-1/2"></div>
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-5"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `twinkle ${5 + Math.random() * 10}s infinite ${
                  Math.random() * 3
                }s`,
                transform: `scale(${0.5 + Math.random() * 2})`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Settings Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-30 max-w-4xl mx-auto bg-neutral-900/80 backdrop-blur-3xl rounded-2xl overflow-hidden border border-neutral-800/50 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]"
      >
        <div className="h-0.5 bg-gradient-to-r from-transparent via-purple-500/80 to-transparent"></div>

        <div className="p-8 md:p-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-2xl md:text-3xl font-medium text-neutral-100 tracking-wider flex items-center gap-3">
                <svg
                  className="w-8 h-8 text-purple-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                CINEMATIC SETTINGS
              </h1>
              <p className="text-sm text-neutral-400 mt-1">
                Customize your movie experience
              </p>
            </div>
            <Link
              to="/dashboard"
              className="text-purple-400 hover:text-purple-300 transition-colors text-sm font-medium flex items-center gap-1"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16l-4-4m0 0l4-4m-4 4h18"
                />
              </svg>
              Back to Dashboard
            </Link>
          </div>

          {/* Settings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Appearance Settings */}
            <div className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800/50">
              <h2 className="text-lg font-medium text-neutral-100 mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                Appearance
              </h2>

              <div className="space-y-5">
                {/* Dark Mode Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-neutral-100">Dark Mode</h3>
                    <p className="text-xs text-neutral-400">
                      Enjoy the cinematic dark theme
                    </p>
                  </div>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                      darkMode ? "bg-purple-600" : "bg-neutral-700"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        darkMode ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Theme Selection */}
                <div>
                  <h3 className="text-neutral-100 mb-2">Theme Color</h3>
                  <div className="flex gap-3">
                    {themes.map((themeOption) => (
                      <button
                        key={themeOption.value}
                        onClick={() => handleThemeChange(themeOption.value)}
                        className={`h-9 w-9 rounded-full bg-gradient-to-r ${
                          themeOption.gradient
                        } ${
                          theme === themeOption.value
                            ? "ring-2 ring-offset-2 ring-offset-neutral-900 ring-white"
                            : ""
                        }`}
                        title={themeOption.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Playback Settings */}
            <div className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800/50">
              <h2 className="text-lg font-medium text-neutral-100 mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-9.9a9 9 0 012.728-2.728"
                  />
                </svg>
                Playback
              </h2>

              <div className="space-y-5">
                {/* Autoplay Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-neutral-100">Autoplay</h3>
                    <p className="text-xs text-neutral-400">
                      Play next episode automatically
                    </p>
                  </div>
                  <button
                    onClick={() => setAutoPlay(!autoPlay)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                      autoPlay ? "bg-purple-600" : "bg-neutral-700"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        autoPlay ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Volume Control */}
                <div>
                  <h3 className="text-neutral-100 mb-1">Volume</h3>
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5 text-neutral-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 14a2 2 0 100-4 2 2 0 000 4z"
                      />
                    </svg>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={(e) => setVolume(e.target.value)}
                      className="w-full h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                    <span className="text-sm text-neutral-300 w-8">
                      {volume}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800/50">
              <h2 className="text-lg font-medium text-neutral-100 mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                Notifications
              </h2>

              <div className="space-y-5">
                {/* Notifications Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-neutral-100">Enable Notifications</h3>
                    <p className="text-xs text-neutral-400">
                      Get updates on new releases
                    </p>
                  </div>
                  <button
                    onClick={() => setNotifications(!notifications)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                      notifications ? "bg-purple-600" : "bg-neutral-700"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Notification Types */}
                {notifications && (
                  <div className="pl-2 space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded border-neutral-600 text-purple-500 focus:ring-purple-500"
                        defaultChecked
                      />
                      <span className="text-neutral-300">New Releases</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded border-neutral-600 text-purple-500 focus:ring-purple-500"
                        defaultChecked
                      />
                      <span className="text-neutral-300">
                        Watchlist Updates
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded border-neutral-600 text-purple-500 focus:ring-purple-500"
                      />
                      <span className="text-neutral-300">
                        Promotional Offers
                      </span>
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Account Settings */}
            <div className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800/50">
              <h2 className="text-lg font-medium text-neutral-100 mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Account
              </h2>

              <div className="space-y-4">
                <button className="w-full text-left py-2 px-3 rounded-lg hover:bg-neutral-800/50 transition-colors text-neutral-300">
                  Change Password
                </button>
                <button className="w-full text-left py-2 px-3 rounded-lg hover:bg-neutral-800/50 transition-colors text-neutral-300">
                  Update Email
                </button>
                <button className="w-full text-left py-2 px-3 rounded-lg hover:bg-neutral-800/50 transition-colors text-neutral-300">
                  Connected Devices
                </button>
                <button className="w-full text-left py-2 px-3 rounded-lg hover:bg-neutral-800/50 transition-colors text-purple-400 font-medium">
                  Logout All Devices
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-10 flex justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_-5px_rgba(139,92,246,0.4)]"
            >
              Save Changes
            </motion.button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"></div>
      </motion.div>
    </div>
  );
}
