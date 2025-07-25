import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      signOut(auth)
        .then(() => {
          navigate("/login");
        })
        .catch((error) => {
          console.error("Logout error:", error);
        });
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden p-4">
      {/* Premium Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-900/10 to-black z-10"></div>

        <div className="absolute inset-0 opacity-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 1.5 }}
            className="relative h-full w-full overflow-hidden"
          >
            <img
              src="https://image.tmdb.org/t/p/original/8Y43POKjjKDGI9MH89NW0NAzzp8.jpg"
              alt=""
              className="w-full h-full object-cover grayscale-[60%] brightness-50"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/90 pointer-events-none"></div>
          </motion.div>
        </div>

        <div className="absolute inset-0 z-20 pointer-events-none">
          <div className="absolute top-0 left-1/2 w-[200vw] h-[200vh] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent -translate-x-1/2"></div>
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-5"
              initial={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                scale: `${0.5 + Math.random() * 2}`,
              }}
              animate={{
                opacity: [0.05, 0.2, 0.05],
              }}
              transition={{
                duration: 5 + Math.random() * 10,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}
        </div>
      </div>

      {/* Logout Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -40 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-30 w-full max-w-md bg-neutral-900/80 backdrop-blur-3xl rounded-2xl overflow-hidden border border-neutral-800/50 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] p-10 text-center"
      >
        <div className="h-0.5 bg-gradient-to-r from-transparent via-purple-500/80 to-transparent"></div>

        <div className="my-8">
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
            className="w-20 h-20 rounded-full border-4 border-purple-500/30 border-t-purple-500 mx-auto mb-6"
          >
            <div className="w-full h-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-purple-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </div>
          </motion.div>

          <h1 className="text-3xl font-medium text-neutral-100 tracking-wider mb-2">
            Logging Out
          </h1>
          <p className="text-neutral-400 mb-6">
            Please wait while we securely sign you out...
          </p>

          {/* Animated progress bar */}
          <div className="w-full bg-neutral-800 rounded-full h-2.5 mb-8 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 3, ease: "linear" }}
              className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"
            ></motion.div>
          </div>

          <div className="flex justify-center space-x-2">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-purple-500 rounded-full"
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  repeatType: "loop",
                  delay: i * 0.15,
                }}
              />
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"></div>
      </motion.div>
    </div>
  );
}