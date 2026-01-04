import React, { useEffect, useState } from "react";
import { login } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import logo from "../images/logo.png";
import { motion } from "framer-motion";
import {
  Film,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Sparkles,
  Star,
  Camera,
  Shield,
  Zap,
  ChevronRight,
  User,
  Smartphone,
  Globe,
  Headphones,
  Download,
} from "lucide-react";

export default function PremiumLogin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  // Check screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const user = await login(formData.email, formData.password);

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", formData.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      navigate("/dashboard");
    } catch (error) {
      const form = e.target;
      form.classList.add("shake");
      setTimeout(() => form.classList.remove("shake"), 500);
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setFormData((prev) => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4 md:p-6 lg:p-8 relative overflow-hidden">
      {/* Premium Animated Background */}
      <div className="absolute inset-0 z-0">
        {/* Base Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>

        {/* Animated Gradient Mesh */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-purple-500/10 via-transparent to-blue-500/10 animate-spin-slow"></div>
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-r from-blue-500/10 via-transparent to-purple-500/10 animate-spin-slow-reverse"></div>
        </div>

        {/* Geometric Patterns */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 2px, transparent 2px)`,
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>

        {/* Floating Particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[1px] h-[1px] bg-white/30 rounded-full"
            initial={{
              x: Math.random() * 100 + "vw",
              y: Math.random() * 100 + "vh",
            }}
            animate={{
              y: [null, "-20px", "0px"],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main Login Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`relative z-10 w-full ${
          isMobile ? "max-w-md" : "max-w-4xl lg:max-w-6xl"
        }`}
      >
        <div
          className={`${
            isMobile ? "flex-col" : "grid lg:grid-cols-3"
          } gap-4 lg:gap-6`}
        >
          {/* Left Brand Section */}
          <motion.div
            initial={{ opacity: 0, x: isMobile ? 0 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`${isMobile ? "w-full" : "col-span-1"}`}
          >
            <div className="backdrop-blur-xl bg-gradient-to-br from-gray-900/90 to-black/90 rounded-2xl lg:rounded-3xl border border-white/10 p-6 lg:p-8 h-full shadow-2xl">
              {/* Logo */}
              <div className="flex flex-col items-center lg:items-start mb-8">
                <motion.div
                  className="relative mb-4"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full ">
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
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
                  <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 text-transparent bg-clip-text">
                    MovieMood
                  </h1>
                  <p className="text-sm text-white/60 tracking-wider mt-1">
                    PREMIUM CINEMA
                  </p>
                  <p className="text-white/70 mt-3 text-sm lg:text-base">
                    Your gateway to unlimited cinematic experiences
                  </p>
                </div>
              </div>

              {/* Mobile: Quick Stats */}
              {isMobile && (
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[
                    {
                      value: "50K+",
                      label: "Movies",
                      icon: <Film className="w-4 h-4" />,
                    },
                    {
                      value: "4.9★",
                      label: "Rating",
                      icon: <Star className="w-4 h-4" />,
                    },
                    {
                      value: "99%",
                      label: "Uptime",
                      icon: <Shield className="w-4 h-4" />,
                    },
                  ].map((stat, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * idx }}
                      className="text-center p-3 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10"
                    >
                      <div className="flex justify-center mb-1">
                        {stat.icon}
                      </div>
                      <div className="text-lg font-bold text-white">
                        {stat.value}
                      </div>
                      <div className="text-xs text-white/60">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Premium Features */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  Premium Features
                </h3>
                {[
                  {
                    icon: <Camera />,
                    text: "4K Ultra HD",
                    color: "text-blue-400",
                  },
                  {
                    icon: <Zap />,
                    text: "Instant Play",
                    color: "text-yellow-400",
                  },
                  {
                    icon: <Shield />,
                    text: "Ad-Free Experience",
                    color: "text-green-400",
                  },
                  {
                    icon: <User />,
                    text: "Multi-Profile",
                    color: "text-pink-400",
                  },
                  {
                    icon: <Globe />,
                    text: "Global Content",
                    color: "text-cyan-400",
                  },
                  {
                    icon: <Headphones />,
                    text: "Dolby Atmos",
                    color: "text-orange-400",
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 text-white/70 hover:text-white transition-colors group cursor-default"
                  >
                    <div
                      className={`w-10 h-10 rounded-lg bg-gradient-to-br from-white/5 to-transparent flex items-center justify-center ${feature.color} group-hover:scale-110 transition-transform border border-white/10`}
                    >
                      {feature.icon}
                    </div>
                    <span className="text-sm">{feature.text}</span>
                  </motion.div>
                ))}
              </div>

              {/* Desktop Stats */}
              {!isMobile && (
                <div className="mt-8 pt-6 border-t border-white/10">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-white/5 rounded-xl border border-white/10">
                      <div className="text-2xl font-bold text-white">50K+</div>
                      <div className="text-xs text-white/60">Movies</div>
                    </div>
                    <div className="text-center p-3 bg-white/5 rounded-xl border border-white/10">
                      <div className="text-2xl font-bold text-white">4.9★</div>
                      <div className="text-xs text-white/60">Rating</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Center Login Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={`${isMobile ? "w-full" : "col-span-2"}`}
          >
            <div className="backdrop-blur-2xl bg-gradient-to-br from-gray-900/40 to-black/40 rounded-2xl lg:rounded-3xl border border-white/20 p-6 md:p-8 lg:p-10 shadow-2xl relative overflow-hidden">
              {/* Glowing Border Effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/30 via-blue-600/30 to-purple-600/30 rounded-2xl lg:rounded-3xl blur-sm"></div>

              {/* Content */}
              <div className="relative z-10 bg-gradient-to-br from-gray-900/80 to-black/80 rounded-2xl lg:rounded-3xl p-6 md:p-8 lg:p-10">
                {/* Form Header */}
                <div className="mb-8 text-center lg:text-left">
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 mb-4"
                  >
                    <Shield className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-purple-300">
                      Secure Login
                    </span>
                  </motion.div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                    Welcome Back
                  </h2>
                  <p className="text-white/60">
                    Sign in to your cinematic universe
                  </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Input */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="group"
                  >
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      <Mail className="inline w-4 h-4 mr-2" />
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all backdrop-blur-sm"
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
                    transition={{ delay: 0.2 }}
                    className="group"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-white/80">
                        <Lock className="inline w-4 h-4 mr-2" />
                        Password
                      </label>
                      <Link
                        to="/forgot-password"
                        className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        Forgot Password?
                      </Link>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all backdrop-blur-sm pr-12"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white transition-colors p-1"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </motion.div>

                  {/* Remember Me & Terms */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="absolute opacity-0 cursor-pointer w-5 h-5"
                        />
                        <div
                          className={`w-5 h-5 rounded border ${
                            rememberMe
                              ? "bg-gradient-to-br from-purple-600 to-blue-600 border-transparent"
                              : "border-white/20"
                          } flex items-center justify-center transition-all group-hover:border-purple-500`}
                        >
                          {rememberMe && (
                            <svg
                              className="w-3 h-3 text-white"
                              viewBox="0 0 12 12"
                              fill="none"
                            >
                              <path
                                d="M10 3L4.5 8.5L2 6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                      <span className="text-sm text-white/70 group-hover:text-white transition-colors">
                        Remember me for 30 days
                      </span>
                    </label>

                    <div className="text-xs text-white/50">
                      By signing in, you agree to our{" "}
                      <Link
                        to="/terms"
                        className="text-purple-400 hover:text-purple-300"
                      >
                        Terms & Privacy
                      </Link>
                    </div>
                  </motion.div>

                  {/* Submit Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full relative overflow-hidden group mt-2"
                    >
                      <div className="relative z-10 w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-[0_0_40px_-10px_rgba(139,92,246,0.5)] flex items-center justify-center gap-3">
                        {isLoading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Signing in...</span>
                          </>
                        ) : (
                          <>
                            <span>Sign In</span>
                            <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                          </>
                        )}
                      </div>
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    </button>
                  </motion.div>

                  {/* Divider */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="relative my-6"
                  >
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/10"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-transparent text-white/50">
                        Or continue with
                      </span>
                    </div>
                  </motion.div>

                  {/* Social Login */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="grid grid-cols-2 gap-4"
                  >
                    <button
                      type="button"
                      className="bg-white/10 border border-white/10 rounded-xl py-3 px-4 text-white/70 hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-2 group hover:bg-white/5 backdrop-blur-sm"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z" />
                      </svg>
                      <span className="text-sm">Google</span>
                    </button>
                    <button
                      type="button"
                      className="bg-white/10 border border-white/10 rounded-xl py-3 px-4 text-white/70 hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-2 group hover:bg-white/5 backdrop-blur-sm"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      <span className="text-sm">GitHub</span>
                    </button>
                  </motion.div>

                  {/* Sign Up Link */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="text-center pt-4"
                  >
                    <p className="text-white/60">
                      New to MovieMood?{" "}
                      <Link
                        to="/register"
                        className="text-white hover:text-purple-300 font-semibold transition-colors group inline-flex items-center gap-1"
                      >
                        Create an account
                        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </p>
                  </motion.div>
                </form>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Mobile App Download CTA */}
        {isMobile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-6 backdrop-blur-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-white/10 rounded-2xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">Get the Mobile App</p>
                <p className="text-white/60 text-sm">
                  Download for better experience
                </p>
              </div>
              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* CSS Animations */}
      <style jsx="true" global="true">{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translateX(-5px);
          }
          20%,
          40%,
          60%,
          80% {
            transform: translateX(5px);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes spin-slow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-slow-reverse {
          0% {
            transform: rotate(360deg);
          }
          100% {
            transform: rotate(0deg);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }

        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 25s linear infinite;
        }

        .shake {
          animation: shake 0.5s ease-in-out;
        }

        .floating {
          animation: float 6s ease-in-out infinite;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #8b5cf6, #3b82f6);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #7c3aed, #2563eb);
        }

        /* Selection color */
        ::selection {
          background: rgba(139, 92, 246, 0.3);
          color: white;
        }

        /* Input autofill styling */
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-text-fill-color: white;
          -webkit-box-shadow: 0 0 0px 1000px rgba(255, 255, 255, 0.05) inset;
          transition: background-color 5000s ease-in-out 0s;
        }

        /* Smooth transitions */
        * {
          transition: background-color 0.3s ease, border-color 0.3s ease,
            transform 0.3s ease;
        }

        /* Mobile optimizations */
        @media (max-width: 640px) {
          input,
          button,
          textarea {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
}
