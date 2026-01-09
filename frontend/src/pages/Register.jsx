import React, { useState } from "react";
import { signup } from "../firebase"; 
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Film, 
  User, 
  Mail, 
  Lock, 
  Sparkles, 
  ChevronRight,
  Shield,
  Star,
  Camera,
  Headphones, 
   Eye,
  EyeOff 
} from "lucide-react";
import logo from "../images/logo.png";
export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signup(formData.username, formData.email, formData.password);
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden p-4">
      {/* Premium Animated Background */}
      <div className="absolute inset-0 z-0">
        {/* Base Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>
        
        {/* Animated Mesh Gradient */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20 animate-gradient-rotate"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-blue-900/15 via-transparent to-purple-900/15 animate-gradient-rotate-reverse"></div>
        </div>

        {/* Geometric Grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}></div>
        </div>

        {/* Floating Elements */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 15 + i * 2,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.5,
            }}
            style={{
              left: `${(i * 15) % 100}%`,
              top: `${(i * 20) % 100}%`,
            }}
          />
        ))}
      </div>

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-6xl"
      >
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Brand & Features */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="backdrop-blur-xl bg-gradient-to-br from-gray-900/90 to-black/90 rounded-3xl border border-white/10 p-8 lg:p-10 shadow-2xl"
          >
            {/* Logo */}
            <div className="flex flex-col items-center lg:items-start mb-10">
              <motion.div
                className="relative mb-6"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-20 h-20 rounded-full">
                  <div className="w-full h-full rounded-full flex items-center justify-center">
                  <img src={logo} alt="MovieMood Logo" />
                  </div>
                </div>
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-transparent"
                  animate={{
                    rotate: 360,
                    borderColor: [
                      "rgba(139, 92, 246, 0)",
                      "rgba(139, 92, 246, 0.3)",
                      "rgba(139, 92, 246, 0)",
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </motion.div>
              <div className="text-center lg:text-left">
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 text-transparent bg-clip-text">
                  MovieMood
                </h1>
                <p className="text-sm text-white/60 tracking-wider mt-2">
                  PREMIUM CINEMA EXPERIENCE
                </p>
                <p className="text-white/70 mt-4 text-lg">
                  Join the ultimate cinematic community
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-purple-400" />
                Premium Benefits
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: <Camera />, text: "4K Streaming", color: "from-blue-500/20 to-blue-500/10" },
                  { icon: <Headphones />, text: "Dolby Atmos", color: "from-green-500/20 to-green-500/10" },
                  { icon: <Shield />, text: "Ad-Free", color: "from-purple-500/20 to-purple-500/10" },
                  { icon: <Star />, text: "Exclusive Content", color: "from-yellow-500/20 to-yellow-500/10" },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-gradient-to-br ${feature.color} border border-white/10 rounded-xl p-4 backdrop-blur-sm`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white">
                        {feature.icon}
                      </div>
                      <span className="text-sm font-medium text-white">{feature.text}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="mt-10 pt-8 border-t border-white/10">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: "50K+", label: "Movies" },
                  { value: "10K+", label: "Users" },
                  { value: "24/7", label: "Support" },
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-white/60 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Registration Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="backdrop-blur-2xl bg-gradient-to-br from-gray-900/40 to-black/40 rounded-3xl border border-white/20 p-8 lg:p-10 shadow-2xl relative overflow-hidden"
          >
            {/* Glowing Border */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-purple-600/20 rounded-3xl blur-sm"></div>
            
            <div className="relative z-10">
              {/* Form Header */}
              <div className="mb-10 text-center">
               
                <h2 className="text-3xl font-bold text-white mb-3">
                  Create Account
                </h2>
                <p className="text-white/60">
                  Join our exclusive cinematic community
                </p>
              </div>

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Username Input */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="group"
                >
                  <label className="block text-sm font-medium text-white/80 mb-3">
                    <User className="inline w-4 h-4 mr-2" />
                    Username
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all backdrop-blur-sm"
                      placeholder="Enter your username"
                      required
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  </div>
                </motion.div>

                {/* Email Input */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="group"
                >
                  <label className="block text-sm font-medium text-white/80 mb-3">
                    <Mail className="inline w-4 h-4 mr-2" />
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all backdrop-blur-sm"
                      placeholder="you@example.com"
                      required
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  </div>
                </motion.div>

                {/* Password Input */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="group"
                >
                  <label className="block text-sm font-medium text-white/80 mb-3">
                    <Lock className="inline w-4 h-4 mr-2" />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all backdrop-blur-sm pr-12"
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white transition-colors p-2"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-white/50 mt-2">
                    Password must be at least 6 characters long
                  </p>
                </motion.div>

                {/* Terms & Conditions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-start gap-3"
                >
                  <input
                    type="checkbox"
                    id="terms"
                    className="mt-1 w-4 h-4 rounded border-white/20 bg-white/10 focus:ring-2 focus:ring-purple-500/30"
                    required
                  />
                  <label htmlFor="terms" className="text-sm text-white/70">
                    I agree to the{" "}
                    <Link to="/terms" className="text-purple-400 hover:text-purple-300">
                      Terms & Conditions
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-purple-400 hover:text-purple-300">
                      Privacy Policy
                    </Link>
                  </label>
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full relative overflow-hidden group mt-4"
                  >
                    <div className="relative z-10 w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-5 px-6 rounded-xl transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-[0_0_40px_-10px_rgba(139,92,246,0.5)] flex items-center justify-center gap-3">
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Creating Account...</span>
                        </>
                      ) : (
                        <>
                          <span>Create Premium Account</span>
                          <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </div>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  </button>
                </motion.div>

                {/* Login Link */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-center pt-6 border-t border-white/10"
                >
                  <p className="text-white/60">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-white hover:text-purple-300 font-semibold transition-colors group inline-flex items-center gap-1"
                    >
                      Sign in here
                      <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </p>
                </motion.div>
              </form>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* CSS Animations */}
      <style jsx="true" global="true">{`
        @keyframes gradient-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes gradient-rotate-reverse {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }

        .animate-gradient-rotate {
          animation: gradient-rotate 20s linear infinite;
        }

        .animate-gradient-rotate-reverse {
          animation: gradient-rotate-reverse 25s linear infinite;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #8b5cf6, #3b82f6);
          border-radius: 4px;
        }

        ::selection {
          background: rgba(139, 92, 246, 0.3);
          color: white;
        }

        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-text-fill-color: white;
          -webkit-box-shadow: 0 0 0px 1000px rgba(255, 255, 255, 0.05) inset;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>
    </div>
  );
}