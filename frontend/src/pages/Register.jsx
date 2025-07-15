import React, { useState } from "react";
import { signup } from "../firebase"; 
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(formData.username, formData.email, formData.password);
    navigate("/login");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-neutral-950 overflow-hidden p-4">
    {/* Premium Cinematic Background */}
    <div className="absolute inset-0 z-0">
      {/* Movie Backdrop Grid */}
      <div className="absolute inset-0 grid grid-cols-3 opacity-15">
        {[
          "https://image.tmdb.org/t/p/original/5gzzkR7y3hnY8AD1wXjCnVlHba5.jpg", // Blade Runner
          "https://image.tmdb.org/t/p/original/8uO0gUM8aNqYLs1OsTBQiXu0fEv.jpg", // Grand Budapest Hotel
          "https://image.tmdb.org/t/p/original/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg", // Interstellar
        ].map((backdrop, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            transition={{ duration: 1.5, delay: index * 0.4 }}
            className="relative h-full w-full overflow-hidden"
          >
            <img
              src={backdrop}
              alt=""
              className="w-full h-full object-cover grayscale-[80%] brightness-50"
              loading="lazy"
            />
            {/* Directional Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-${
              index === 0 ? 'r' : index === 1 ? 'b' : 'l'
            } from-black/90 via-black/20 to-black/90 pointer-events-none`}></div>
          </motion.div>
        ))}
      </div>
  
      {/* Animated Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] animate-grid-pan"></div>
      
      {/* Floating Light Orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-900/30 blur-[80px] animate-float-orb-1"></div>
      <div className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full bg-blue-900/20 blur-[90px] animate-float-orb-2"></div>
      
      {/* Floating Film Strips */}
      <div className="absolute inset-0 opacity-5">
        {[1, 2, 3].map((i) => (
          <div 
            key={i}
            className="absolute w-64 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent"
            style={{
              top: `${15 + i * 25}%`,
              animation: `float-horizontal ${30 + i * 10}s linear infinite`,
              animationDelay: `${i * 3}s`
            }}
          />
        ))}
      </div>
    </div>
  
    {/* Premium Glass Form */}
    <motion.form 
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative z-10 w-full max-w-md bg-neutral-900/80 backdrop-blur-3xl rounded-xl overflow-hidden border border-neutral-800/50 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.3)]"
    >
      {/* Metallic Top Bar */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-purple-600 to-transparent"></div>
      
      <div className="p-10">
        {/* Minimal Header */}
        <div className="mb-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-light text-neutral-100 mb-3 tracking-wider">JOIN MOVIEMOOD</h1>
          <div className="w-20 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto"></div>
        </div>
  
        {/* Luxury Input Fields */}
        <div className="space-y-8">
          <div className="group relative">
            <input
              type="text"
              className="peer w-full bg-transparent border-b border-neutral-700 px-0 pt-5 pb-2 text-neutral-100 placeholder-transparent focus:border-purple-500 focus:outline-none transition-all"
              placeholder=" "
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required
            />
            <label className="absolute left-0 top-1 text-neutral-400 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm">
              Username
            </label>
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-500 transition-all duration-500 group-hover:w-full"></div>
          </div>
  
          <div className="group relative">
            <input
              type="email"
              className="peer w-full bg-transparent border-b border-neutral-700 px-0 pt-5 pb-2 text-neutral-100 placeholder-transparent focus:border-purple-500 focus:outline-none transition-all"
              placeholder=" "
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
            <label className="absolute left-0 top-1 text-neutral-400 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm">
              Email Address
            </label>
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-500 transition-all duration-500 group-hover:w-full"></div>
          </div>
  
          <div className="group relative">
            <input
              type="password"
              className="peer w-full bg-transparent border-b border-neutral-700 px-0 pt-5 pb-2 text-neutral-100 placeholder-transparent focus:border-purple-500 focus:outline-none transition-all"
              placeholder=" "
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
            <label className="absolute left-0 top-1 text-neutral-400 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm">
              Password
            </label>
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-500 transition-all duration-500 group-hover:w-full"></div>
          </div>
        </div>
  
        {/* Cinematic Submit Button */}
        <button 
          type="submit" 
          className="w-full mt-12 py-4 px-6 bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_-5px_rgba(139,92,246,0.4)] relative overflow-hidden group"
        >
          <span className="relative z-10 flex items-center justify-center gap-3">
            <span className="opacity-70 group-hover:opacity-100 transition-opacity">✨</span>
            <span>Create Account</span>
          </span>
          <span className="absolute inset-0 bg-gradient-to-r from-purple-700/30 to-blue-700/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        </button>
  
        {/* Subtle Footer */}
        <div className="mt-8 text-center text-sm text-neutral-500">
          <span>Already have an account?</span>
          <Link
            to="/login" 
            className="ml-2 text-purple-400 hover:text-purple-300 transition-colors border-b border-transparent hover:border-purple-400/30 pb-0.5"
          >
            Sign in
          </Link>
        </div>
      </div>
  
      {/* Bottom Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
    </motion.form>
  
    {/* Animation keyframes */}
    <style jsx global>{`
      @keyframes grid-pan {
        0% { background-position: 0% 0%; }
        100% { background-position: 100% 100%; }
      }
      @keyframes float-orb-1 {
        0%, 100% { transform: translate(0, 0); }
        50% { transform: translate(20px, 20px); }
      }
      @keyframes float-orb-2 {
        0%, 100% { transform: translate(0, 0); }
        50% { transform: translate(-15px, -15px); }
      }
      @keyframes float-horizontal {
        0% { transform: translateX(-100vw); }
        100% { transform: translateX(100vw); }
      }
    `}</style>
  </div>
  );
}
