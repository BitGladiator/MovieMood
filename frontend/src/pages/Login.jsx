import React, { useState } from "react";
import { login } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData.email, formData.password);
    navigate("/profile");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden p-4">
    {/* Premium Cinematic Background */}
    <div className="absolute inset-0 z-0">
      {/* Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-900/10 to-black z-10"></div>
      
      {/* Elegant Movie Backdrops */}
      <div className="absolute inset-0 grid grid-cols-3 gap-0 opacity-20">
        {[
          "https://image.tmdb.org/t/p/original/8Y43POKjjKDGI9MH89NW0NAzzp8.jpg", // Blade Runner 2049
          "https://image.tmdb.org/t/p/original/9n2tJBplPbgR2ca05hS5CKXwP2c.jpg", // The Matrix
          "https://image.tmdb.org/t/p/original/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg", // Interstellar
        ].map((backdrop, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 1.5, delay: index * 0.4 }}
            className="relative h-full w-full overflow-hidden"
          >
            <img
              src={backdrop}
              alt=""
              className="w-full h-full object-cover grayscale-[60%] brightness-50"
              loading="lazy"
            />
            {/* Directional Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-${
              index === 0 ? 'r' : index === 1 ? 'b' : 'l'
            } from-black/90 via-black/30 to-black/90 pointer-events-none`}></div>
          </motion.div>
        ))}
      </div>
  
      {/* Cinematic Light Effects */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {/* Projector Light Effect */}
        <div className="absolute top-0 left-1/2 w-[200vw] h-[200vh] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent -translate-x-1/2"></div>
        
        {/* Floating Light Particles */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-5"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `twinkle ${5 + Math.random() * 10}s infinite ${Math.random() * 3}s`,
              transform: `scale(${0.5 + Math.random() * 2})`
            }}
          />
        ))}
      </div>
    </div>
  
    {/* Luxury Glass Form Container */}
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-30 w-full max-w-md bg-neutral-900/80 backdrop-blur-3xl rounded-2xl overflow-hidden border border-neutral-800/50 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]"
    >
      {/* Metallic Accent Bar */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-purple-500/80 to-transparent"></div>
      
      <div className="p-10">
        {/* Premium Header */}
        <div className="mb-10 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-medium text-neutral-100 tracking-wider">CINEMATIC UNIVERSE</h1>
          <p className="text-sm text-neutral-400 mt-2">Access your personal movie collection</p>
        </div>
  
        {/* Luxury Input Fields */}
        <div className="space-y-6">
          <div className="group">
            <div className="relative">
              <input
                type="email"
                className="peer w-full bg-neutral-900/30 border border-neutral-800 rounded-lg px-4 py-3 text-neutral-100 placeholder-transparent focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all"
                placeholder=" "
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
              <label className="absolute left-4 top-1 text-xs text-neutral-400 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-xs">
                Email Address
              </label>
            </div>
          </div>
  
          <div className="group">
            <div className="relative">
              <input
                type="password"
                className="peer w-full bg-neutral-900/30 border border-neutral-800 rounded-lg px-4 py-3 text-neutral-100 placeholder-transparent focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all"
                placeholder=" "
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
              <label className="absolute left-4 top-1 text-xs text-neutral-400 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-xs">
                Password
              </label>
            </div>
          </div>
        </div>
  
        {/* Premium Actions */}
        <div className="mt-8 flex items-center justify-between">
          <label className="flex items-center space-x-2 cursor-pointer">
            <div className="relative w-5 h-5 bg-neutral-800 border border-neutral-700 rounded-sm flex items-center justify-center transition-all group-hover:border-purple-500">
              <input 
                type="checkbox" 
                className="absolute opacity-0 cursor-pointer w-full h-full"
              />
              <svg className="w-3 h-3 text-purple-500 opacity-0 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-sm text-neutral-400">Remember me</span>
          </label>
          
          <a href="#" className="text-sm text-neutral-400 hover:text-purple-400 transition-colors">Forgot password?</a>
        </div>
  
        {/* Cinematic Submit Button */}
        <button 
          type="submit" 
          className="w-full mt-8 py-3.5 px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_-5px_rgba(139,92,246,0.4)] relative overflow-hidden group"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Sign In
          </span>
          <span className="absolute inset-0 bg-gradient-to-r from-purple-700/30 to-blue-700/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        </button>
  
        {/* Elegant Footer */}
        <div className="mt-6 text-center text-sm text-neutral-500">
          <span>New to our platform? </span>
          <Link to="/register" className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
            Create account
          </Link>
        </div>
      </div>
  
      {/* Bottom Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"></div>
    </motion.div>
  
    {/* Animation keyframes */}
    <style jsx global>{`
      @keyframes twinkle {
        0%, 100% { opacity: 0.05; }
        50% { opacity: 0.2; }
      }
    `}</style>
  </div>
  );
}
