import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Film, 
  Star, 
  Heart, 
  Search, 
  BarChart2, 
  Play, 
  ChevronRight,
  X,
  Clock,
  Calendar,
  Smile,
  Frown,
  Meh,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Demo = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedMood, setSelectedMood] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const moods = [
    { id: 1, name: "Euphoric", icon: <Zap className="w-6 h-6" />, color: "bg-amber-500" },
    { id: 2, name: "Romantic", icon: <Heart className="w-6 h-6" />, color: "bg-rose-500" },
    { id: 3, name: "Thoughtful", icon: <Meh className="w-6 h-6" />, color: "bg-blue-500" },
    { id: 4, name: "Nostalgic", icon: <Clock className="w-6 h-6" />, color: "bg-purple-500" },
    { id: 5, name: "Adventurous", icon: <Frown className="w-6 h-6" />, color: "bg-emerald-500" },
  ];

  const recommendedMovies = [
    {
      id: 1,
      title: "The Grand Budapest Hotel",
      year: 2014,
      rating: 8.1,
      mood: "Whimsical",
      image: "https://m.media-amazon.com/images/M/MV5BMzM5NjUxOTEyMl5BMl5BanBnXkFtZTgwNjEyMDM0MDE@._V1_FMjpg_UX1000_.jpg",
      match: 92
    },
    {
      id: 2,
      title: "La La Land",
      year: 2016,
      rating: 8.0,
      mood: "Romantic",
      image: "https://m.media-amazon.com/images/M/MV5BMzUzNDM2NzM2MV5BMl5BanBnXkFtZTgwNTM3NTg4OTE@._V1_FMjpg_UX1000_.jpg",
      match: 88
    },
    {
      id: 3,
      title: "Inception",
      year: 2010,
      rating: 8.8,
      mood: "Thoughtful",
      image: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_FMjpg_UX1000_.jpg",
      match: 85
    },
  ];

  const features = [
    {
      icon: <Search className="w-8 h-8" />,
      title: "Mood Detection",
      description: "Our AI analyzes your emotional state to suggest perfect films."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Personalized Collections",
      description: "Curated watchlists that adapt to your evolving tastes."
    },
    {
      icon: <BarChart2 className="w-8 h-8" />,
      title: "Smart Analytics",
      description: "Insights into your viewing patterns and preferences."
    }
  ];

  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-gray-100 font-sans">
      {/* Navigation */}
      {/* <nav className="fixed w-full z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Film className="w-6 h-6 text-purple-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              MovieMood
            </span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-purple-500/30">
              Get Started
            </Link>
          </div>
        </div>
      </nav> */}

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-800/50 border border-gray-700 mb-6">
              <span className="text-xs font-semibold tracking-wider text-purple-400 uppercase">
                Interactive Demo
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-100 via-gray-300 to-gray-400 bg-clip-text text-transparent leading-tight mb-6">
              Experience <span className="text-white">MovieMood</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              See how our mood-based recommendation engine finds the perfect films for you.
            </p>
          </motion.div>

          {/* Demo Steps */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
            {/* Progress Bar */}
            <div className="h-1.5 bg-gray-800 relative">
              <motion.div 
                className="h-full bg-gradient-to-r from-purple-600 to-pink-600 absolute top-0 left-0"
                initial={{ width: "0%" }}
                animate={{ width: `${currentStep * 25}%` }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              />
            </div>

            {/* Step Content */}
            <div className="p-8 md:p-12">
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center"
                  >
                    <div className="w-20 h-20 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-8">
                      <Smile className="w-10 h-10 text-purple-400" />
                    </div>
                    <h2 className="text-3xl font-bold mb-6 text-center">How are you feeling today?</h2>
                    <p className="text-gray-400 mb-10 text-center max-w-md">
                      Select your current mood to discover films that match your emotional state.
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full max-w-2xl">
                      {moods.map(mood => (
                        <motion.button
                          key={mood.id}
                          whileHover={{ y: -5 }}
                          whileTap={{ scale: 0.95 }}
                          className={`p-4 rounded-xl border ${selectedMood === mood.id ? 'border-purple-500 bg-gray-800' : 'border-gray-700 hover:border-gray-600'} transition-all flex flex-col items-center`}
                          onClick={() => setSelectedMood(mood.id)}
                        >
                          <div className={`w-12 h-12 rounded-full ${mood.color} flex items-center justify-center mb-3`}>
                            {mood.icon}
                          </div>
                          <span>{mood.name}</span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center"
                  >
                    <div className="w-20 h-20 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-8">
                      <Film className="w-10 h-10 text-purple-400" />
                    </div>
                    <h2 className="text-3xl font-bold mb-6 text-center">Your Perfect Matches</h2>
                    <p className="text-gray-400 mb-10 text-center max-w-md">
                      Based on your mood, we've curated these exceptional film recommendations.
                    </p>
                    
                    <div className="w-full max-w-4xl">
                      <div className="grid md:grid-cols-3 gap-6">
                        {recommendedMovies.map(movie => (
                          <motion.div
                            key={movie.id}
                            whileHover={{ y: -5 }}
                            className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-purple-500/50 transition-all"
                          >
                            <div className="relative aspect-[2/3]">
                              <img 
                                src={movie.image} 
                                alt={movie.title} 
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                              <div className="absolute bottom-0 left-0 p-4">
                                <div className="flex items-center space-x-1 mb-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star 
                                      key={i} 
                                      className={`w-4 h-4 ${i < Math.floor(movie.rating / 2) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'}`}
                                    />
                                  ))}
                                </div>
                                <h3 className="font-bold text-lg">{movie.title}</h3>
                                <p className="text-sm text-gray-400">{movie.year} • {movie.mood}</p>
                              </div>
                              <div className="absolute top-4 right-4 bg-purple-600 text-xs font-bold px-2 py-1 rounded-full">
                                {movie.match}% match
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center"
                  >
                    <div className="w-20 h-20 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-8">
                      <BarChart2 className="w-10 h-10 text-purple-400" />
                    </div>
                    <h2 className="text-3xl font-bold mb-6 text-center">Your Mood Profile</h2>
                    <p className="text-gray-400 mb-10 text-center max-w-md">
                      Discover insights about your viewing patterns and mood correlations.
                    </p>
                    
                    <div className="w-full max-w-4xl bg-gray-800 rounded-xl p-6 border border-gray-700">
                      <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ y: -5 }}
                            className="bg-gray-900/50 rounded-xl p-6 border border-gray-700 hover:border-purple-500/30 transition-all"
                          >
                            <div className="w-12 h-12 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4 text-purple-400">
                              {feature.icon}
                            </div>
                            <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                            <p className="text-gray-400 text-sm">{feature.description}</p>
                          </motion.div>
                        ))}
                      </div>
                      
                      <div className="mt-8 bg-gray-900 rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold">Your Mood History</h4>
                          <span className="text-xs text-gray-500">Last 30 days</span>
                        </div>
                        <div className="h-48 bg-gray-950 rounded border border-gray-800 flex items-end">
                          {[20, 45, 60, 30, 75, 90, 50].map((value, i) => (
                            <motion.div
                              key={i}
                              initial={{ height: 0 }}
                              animate={{ height: `${value}%` }}
                              transition={{ duration: 0.8, delay: i * 0.1 }}
                              className={`w-full ${i % 2 === 0 ? 'bg-purple-600' : 'bg-pink-600'} rounded-t-sm`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center text-center"
                  >
                    <div className="w-20 h-20 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-8">
                      <Star className="w-10 h-10 text-purple-400 fill-purple-400" />
                    </div>
                    <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Movie Nights?</h2>
                    <p className="text-gray-400 mb-10 max-w-md">
                      Join thousands of cinephiles who never struggle to pick a movie again.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 mb-12">
                      <Link
                        to="/register"
                        className="px-8 py-4 rounded-xl font-semibold text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/40"
                      >
                        Start Your Free Trial
                      </Link>
                      <button
                        onClick={() => setShowVideo(true)}
                        className="px-8 py-4 rounded-xl font-semibold text-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
                      >
                        <Play className="w-5 h-5" /> Watch Demo Video
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-center space-x-6 text-gray-500">
                      <div className="flex -space-x-2">
                        {[
                          "https://randomuser.me/api/portraits/women/44.jpg",
                          "https://randomuser.me/api/portraits/men/32.jpg",
                          "https://randomuser.me/api/portraits/women/68.jpg",
                          "https://randomuser.me/api/portraits/men/55.jpg",
                          "https://randomuser.me/api/portraits/women/90.jpg",
                        ].map((src, i) => (
                          <img
                            key={i}
                            src={src}
                            alt={`User ${i + 1}`}
                            className="w-10 h-10 rounded-full border-2 border-gray-800 object-cover"
                          />
                        ))}
                      </div>
                      <div className="text-sm">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 text-yellow-400 fill-yellow-400"
                            />
                          ))}
                        </div>
                        <span>Trusted by 50K+ film lovers</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Controls */}
              <div className="flex justify-between mt-12">
                <button
                  onClick={handlePrev}
                  disabled={currentStep === 1}
                  className={`px-6 py-3 rounded-lg font-medium border ${currentStep === 1 ? 'border-gray-800 text-gray-600 cursor-not-allowed' : 'border-gray-700 hover:border-gray-600'}`}
                >
                  Back
                </button>
                {currentStep < 4 ? (
                  <button
                    onClick={handleNext}
                    className="px-6 py-3 rounded-lg font-medium bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 flex items-center gap-2"
                  >
                    Next <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <Link
                    to="/register"
                    className="px-6 py-3 rounded-lg font-medium bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 flex items-center gap-2"
                  >
                    Get Started <ChevronRight className="w-5 h-5" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      <AnimatePresence>
        {showVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative w-full max-w-4xl bg-gray-900 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setShowVideo(false)}
                className="absolute top-4 right-4 z-10 bg-gray-800/50 hover:bg-gray-700/80 rounded-full p-2 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="aspect-video bg-gray-800 flex items-center justify-center">
                <div className="text-center">
                  <Play className="w-16 h-16 mx-auto text-purple-500 mb-4" />
                  <p className="text-xl font-medium">MovieMood Demo Video</p>
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-800">
                <h3 className="text-xl font-bold mb-2">How MovieMood Works</h3>
                <p className="text-gray-400">
                  Watch this 2-minute video to see how our mood-based recommendation engine transforms your movie nights.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-12 bg-gray-900/50 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-6 md:mb-0">
              <Film className="w-6 h-6 text-purple-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                MovieMood
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/faq" className="text-gray-400 hover:text-white transition-colors">
                FAQ
              </Link>
              <Link to="/blog" className="text-gray-400 hover:text-white transition-colors">
                Blog
              </Link>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center md:text-left">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} MovieMood. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Demo;