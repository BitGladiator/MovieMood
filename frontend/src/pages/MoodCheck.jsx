import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSmile, FaFrown, FaAngry, FaTired, FaLaugh, FaMeh, 
  FaHeart, FaFilm, FaPlay, FaArrowRight, FaSpinner,
  FaRegClock, FaChartBar, FaMusic, FaCalendarAlt,
  FaThermometerHalf, FaBrain, FaLeaf
} from 'react-icons/fa';
import { GiHeartBeats, GiNightSleep, GiPartyPopper, GiPopcorn } from 'react-icons/gi';
import { BsLightningCharge, BsStars, BsEmojiSunglasses } from 'react-icons/bs';
import { TbMoodCheck } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const moodOptions = [
  { 
    id: 'happy', 
    label: 'Happy 😊', 
    icon: <FaLaugh className="text-3xl" />,
    color: 'from-yellow-400 to-amber-400',
    bgColor: 'bg-yellow-500/20',
    borderColor: 'border-yellow-500/30',
    description: 'Feeling joyful, cheerful, and optimistic'
  },
  { 
    id: 'sad', 
    label: 'Sad 😢', 
    icon: <FaFrown className="text-3xl" />,
    color: 'from-blue-400 to-cyan-400',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/30',
    description: 'Feeling down, melancholic, or tearful'
  },
  { 
    id: 'angry', 
    label: 'Angry 😠', 
    icon: <FaAngry className="text-3xl" />,
    color: 'from-red-400 to-orange-400',
    bgColor: 'bg-red-500/20',
    borderColor: 'border-red-500/30',
    description: 'Feeling frustrated, irritated, or furious'
  },
  { 
    id: 'tired', 
    label: 'Tired 😴', 
    icon: <FaTired className="text-3xl" />,
    color: 'from-gray-400 to-slate-400',
    bgColor: 'bg-gray-500/20',
    borderColor: 'border-gray-500/30',
    description: 'Feeling exhausted, sleepy, or low-energy'
  },
  { 
    id: 'excited', 
    label: 'Excited 🤩', 
    icon: <BsLightningCharge className="text-3xl" />,
    color: 'from-purple-400 to-pink-400',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-500/30',
    description: 'Feeling energetic, enthusiastic, and pumped'
  },
  { 
    id: 'relaxed', 
    label: 'Relaxed 😌', 
    icon: <FaLeaf className="text-3xl" />,
    color: 'from-green-400 to-emerald-400',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/30',
    description: 'Feeling calm, peaceful, and stress-free'
  },
  { 
    id: 'anxious', 
    label: 'Anxious 😰', 
    icon: <GiHeartBeats className="text-3xl" />,
    color: 'from-rose-400 to-red-400',
    bgColor: 'bg-rose-500/20',
    borderColor: 'border-rose-500/30',
    description: 'Feeling nervous, worried, or on edge'
  },
  { 
    id: 'neutral', 
    label: 'Neutral 😐', 
    icon: <FaMeh className="text-3xl" />,
    color: 'from-gray-300 to-gray-400',
    bgColor: 'bg-gray-400/20',
    borderColor: 'border-gray-400/30',
    description: 'Feeling balanced, neither high nor low'
  }
];

const intensityLevels = [
  { level: 1, label: 'Very Mild', emoji: '😐', color: 'bg-blue-100 text-blue-800' },
  { level: 2, label: 'Mild', emoji: '🙂', color: 'bg-green-100 text-green-800' },
  { level: 3, label: 'Moderate', emoji: '😊', color: 'bg-yellow-100 text-yellow-800' },
  { level: 4, label: 'Strong', emoji: '🤩', color: 'bg-orange-100 text-orange-800' },
  { level: 5, label: 'Very Strong', emoji: '🔥', color: 'bg-red-100 text-red-800' }
];

const movieRecommendations = {
  happy: [
    { title: "The Grand Budapest Hotel", genre: "Comedy", duration: "1h 39m", match: "98%" },
    { title: "La La Land", genre: "Musical", duration: "2h 8m", match: "95%" },
    { title: "Back to the Future", genre: "Adventure", duration: "1h 56m", match: "92%" }
  ],
  sad: [
    { title: "The Shawshank Redemption", genre: "Drama", duration: "2h 22m", match: "96%" },
    { title: "Good Will Hunting", genre: "Drama", duration: "2h 6m", match: "94%" },
    { title: "Eternal Sunshine of the Spotless Mind", genre: "Romance", duration: "1h 48m", match: "91%" }
  ],
  angry: [
    { title: "Mad Max: Fury Road", genre: "Action", duration: "2h", match: "97%" },
    { title: "John Wick", genre: "Action", duration: "1h 41m", match: "95%" },
    { title: "Fight Club", genre: "Drama", duration: "2h 19m", match: "93%" }
  ],
  tired: [
    { title: "Spirited Away", genre: "Anime", duration: "2h 5m", match: "98%" },
    { title: "The Secret Life of Walter Mitty", genre: "Adventure", duration: "1h 54m", match: "95%" },
    { title: "Lost in Translation", genre: "Drama", duration: "1h 42m", match: "92%" }
  ],
  excited: [
    { title: "Avengers: Endgame", genre: "Action", duration: "3h 2m", match: "99%" },
    { title: "Inception", genre: "Sci-Fi", duration: "2h 28m", match: "96%" },
    { title: "The Dark Knight", genre: "Action", duration: "2h 32m", match: "95%" }
  ],
  relaxed: [
    { title: "Chef", genre: "Comedy", duration: "1h 54m", match: "97%" },
    { title: "The Hundred-Foot Journey", genre: "Drama", duration: "2h 2m", match: "94%" },
    { title: "Julie & Julia", genre: "Comedy", duration: "2h 3m", match: "92%" }
  ],
  anxious: [
    { title: "The Intern", genre: "Comedy", duration: "2h 1m", match: "96%" },
    { title: "Paddington", genre: "Family", duration: "1h 35m", match: "94%" },
    { title: "Groundhog Day", genre: "Comedy", duration: "1h 41m", match: "92%" }
  ],
  neutral: [
    { title: "The Social Network", genre: "Drama", duration: "2h", match: "95%" },
    { title: "The Truman Show", genre: "Comedy", duration: "1h 43m", match: "93%" },
    { title: "Her", genre: "Sci-Fi", duration: "2h 6m", match: "91%" }
  ]
};

const MoodCheck = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedMood, setSelectedMood] = useState(null);
  const [intensity, setIntensity] = useState(3);
  const [context, setContext] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [moodHistory, setMoodHistory] = useState([]);
  const [showDetails, setShowDetails] = useState(false);

  const chartRef = useRef(null);

  // Simulated mood history data
  useEffect(() => {
    const history = Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
      mood: ['happy', 'neutral', 'sad', 'happy', 'relaxed', 'excited', 'tired'][i],
      intensity: [4, 3, 2, 5, 3, 4, 2][i]
    }));
    setMoodHistory(history);
  }, []);

  const handleMoodSelect = (moodId) => {
    setSelectedMood(moodId);
    setTimeout(() => setStep(2), 300);
  };

  const handleIntensitySelect = (level) => {
    setIntensity(level);
    setTimeout(() => setStep(3), 300);
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsAnalyzing(false);
      setStep(4);
      setRecommendations(movieRecommendations[selectedMood] || []);
    }, 2000);
  };

  const handleStartOver = () => {
    setStep(1);
    setSelectedMood(null);
    setIntensity(3);
    setContext('');
    setRecommendations([]);
  };

  const handleSaveMood = () => {
    // In a real app, this would save to backend
    const moodEntry = {
      mood: selectedMood,
      intensity,
      context,
      timestamp: new Date().toISOString(),
      recommendations
    };
    
    console.log('Saving mood entry:', moodEntry);
    alert('Mood saved to your journal! 🎉');
    navigate('/mood-journal');
  };

  const getMoodData = () => {
    if (!selectedMood) return null;
    return moodOptions.find(m => m.id === selectedMood);
  };

  const chartData = {
    labels: moodHistory.map(h => h.date),
    datasets: [
      {
        label: 'Mood Level',
        data: moodHistory.map(h => h.intensity * 10),
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const index = context.dataIndex;
            const mood = moodHistory[index].mood;
            const moodLabel = moodOptions.find(m => m.id === mood)?.label;
            return `Mood: ${moodLabel} | Intensity: ${context.raw / 10}`;
          }
        }
      }
    },
    scales: {
      y: {
        min: 0,
        max: 50,
        ticks: {
          callback: (value) => value / 10
        }
      }
    }
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 mb-6">
              <TbMoodCheck className="text-4xl text-purple-400" />
            </div>
            <h2 className="text-3xl font-bold mb-4">How are you feeling right now?</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Select your current emotional state. This helps us find the perfect movie for your mood.
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {moodOptions.map((mood) => (
                <motion.button
                  key={mood.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleMoodSelect(mood.id)}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                    selectedMood === mood.id 
                      ? `${mood.borderColor} ${mood.bgColor} scale-105` 
                      : 'border-gray-700/50 hover:border-gray-600/50 bg-gray-800/30'
                  }`}
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${mood.color} mb-3`}>
                    {mood.icon}
                  </div>
                  <div className="font-medium">{mood.label.split(' ')[0]}</div>
                </motion.button>
              ))}
            </div>
            
            {selectedMood && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-6 p-4 bg-gray-800/30 rounded-xl border border-gray-700/50"
              >
                <p className="text-gray-300">
                  <span className="font-semibold">Selected:</span> {getMoodData()?.description}
                </p>
              </motion.div>
            )}
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-amber-600/20 to-orange-600/20 mb-6">
              <FaThermometerHalf className="text-4xl text-amber-400" />
            </div>
            <h2 className="text-3xl font-bold mb-4">How strong is this feeling?</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Rate the intensity of your current mood on a scale of 1 to 5.
            </p>
            
            <div className="grid grid-cols-5 gap-4 mb-8">
              {intensityLevels.map((level) => (
                <motion.button
                  key={level.level}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleIntensitySelect(level.level)}
                  className={`p-4 rounded-xl transition-all duration-300 ${
                    intensity === level.level
                      ? `${level.color} scale-105 ring-2 ring-offset-2 ring-offset-gray-900 ring-white/20`
                      : 'bg-gray-800/30 hover:bg-gray-700/30'
                  }`}
                >
                  <div className="text-3xl mb-2">{level.emoji}</div>
                  <div className="text-sm font-medium">{level.label}</div>
                  <div className="text-xs text-gray-400 mt-1">Level {level.level}</div>
                </motion.button>
              ))}
            </div>
            
            <div className="mt-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Mild</span>
                <span className="text-sm font-medium">Intensity Level: {intensity}</span>
                <span className="text-sm text-gray-400">Strong</span>
              </div>
              <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-red-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${(intensity / 5) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-600/20 to-cyan-600/20 mb-6">
              <FaBrain className="text-4xl text-blue-400" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Add some context (optional)</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Tell us more about your day or what's influencing your mood.
            </p>
            
            <div className="mb-8">
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="E.g., 'Just finished work', 'Celebrating something', 'Need to relax after a long day'..."
                className="w-full h-32 p-4 bg-gray-800/30 border border-gray-700/50 rounded-xl focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 focus:outline-none resize-none"
              />
              <div className="text-xs text-gray-500 text-right mt-2">
                {context.length}/200 characters
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { text: 'After work', icon: <FaRegClock /> },
                { text: 'Weekend vibes', icon: <FaCalendarAlt /> },
                { text: 'Need motivation', icon: <BsLightningCharge /> },
                { text: 'Alone time', icon: <GiNightSleep /> }
              ].map((item, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setContext(prev => prev ? `${prev}, ${item.text}` : item.text)}
                  className="p-3 bg-gray-800/30 border border-gray-700/50 rounded-lg hover:bg-gray-700/30 transition-colors flex items-center justify-center gap-2"
                >
                  {item.icon}
                  <span className="text-sm">{item.text}</span>
                </motion.button>
              ))}
            </div>
            
            <div className="flex gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-full font-semibold shadow-lg hover:shadow-purple-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <FaBrain />
                    Analyze My Mood
                  </>
                )}
              </motion.button>
              
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 bg-gray-800/50 border border-gray-700 hover:bg-gray-700/50 rounded-full font-medium transition-colors"
              >
                Back
              </button>
            </div>
          </motion.div>
        );

      case 4:
        const moodData = getMoodData();
        
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-green-600/20 to-emerald-600/20 mb-6">
              <BsStars className="text-4xl text-green-400" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Perfect Matches Found! 🎬</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Based on your <span className="font-semibold text-white">{moodData?.label}</span> mood
              {intensity >= 4 ? ' (strong intensity)' : intensity <= 2 ? ' (mild intensity)' : ''}
            </p>
            
            {/* Mood Summary */}
            <div className={`p-6 rounded-2xl ${moodData?.bgColor} border ${moodData?.borderColor} mb-8`}>
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${moodData?.color}`}>
                  {moodData?.icon}
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-bold mb-1">{moodData?.label}</h3>
                  <p className="text-gray-300 text-sm">{moodData?.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="text-sm text-gray-400">Intensity:</div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`w-3 h-3 rounded-full mx-0.5 ${
                            level <= intensity 
                              ? 'bg-gradient-to-r from-amber-400 to-orange-400' 
                              : 'bg-gray-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {context && (
                <div className="mt-4 p-3 bg-black/20 rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">Your context:</div>
                  <div className="text-gray-300">{context}</div>
                </div>
              )}
            </div>
            
            {/* Recommendations */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center justify-center gap-2">
                <GiPopcorn className="text-amber-400" />
                Your Personalized Recommendations
              </h3>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {recommendations.map((movie, index) => (
                  <motion.div
                    key={movie.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-5 hover:border-purple-500/30 hover:bg-gray-800/50 transition-all duration-300 group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-lg mb-1">{movie.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <FaFilm className="text-xs" />
                            {movie.genre}
                          </span>
                          <span className="flex items-center gap-1">
                            <FaRegClock className="text-xs" />
                            {movie.duration}
                          </span>
                        </div>
                      </div>
                      <div className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-sm font-bold">
                        {movie.match}
                      </div>
                    </div>
                    <button className="w-full mt-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 group-hover:bg-purple-600/20">
                      <FaPlay className="text-xs" />
                      Watch Now
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Mood History Chart */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <FaChartBar className="text-purple-400" />
                  Your Mood Trend
                </h3>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-sm text-gray-400 hover:text-white flex items-center gap-1"
                >
                  {showDetails ? 'Show Less' : 'Show Details'}
                  <FaArrowRight className={`text-xs transition-transform ${showDetails ? 'rotate-90' : ''}`} />
                </button>
              </div>
              
              <AnimatePresence>
                {showDetails ? (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4"
                  >
                    <Line ref={chartRef} data={chartData} options={chartOptions} />
                  </motion.div>
                ) : (
                  <div className="h-32 flex items-end justify-between gap-1 px-4">
                    {moodHistory.map((day, idx) => {
                      const moodData = moodOptions.find(m => m.id === day.mood);
                      return (
                        <div key={idx} className="flex flex-col items-center">
                          <div 
                            className={`w-8 rounded-t-lg ${moodData?.bgColor}`}
                            style={{ height: `${day.intensity * 15}px` }}
                          />
                          <div className="text-xs text-gray-500 mt-2">{day.date}</div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSaveMood}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-full font-semibold shadow-lg hover:shadow-purple-500/30 transition-all duration-300 flex items-center gap-2"
              >
                <FaHeart />
                Save to Mood Journal
              </motion.button>
              
              <button
                onClick={handleStartOver}
                className="px-6 py-3 bg-gray-800/50 border border-gray-700 hover:bg-gray-700/50 rounded-full font-medium transition-colors"
              >
                Check Another Mood
              </button>
              
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-gray-800/50 border border-gray-700 hover:bg-gray-700/50 rounded-full font-medium transition-colors"
              >
                Back to Home
              </button>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white px-4 py-8">
      {/* Navigation */}
      <div className="max-w-4xl mx-auto mb-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <FaArrowRight className="rotate-180" />
          Back to Features
        </button>
      </div>
      
      {/* Main Container */}
      <div className="max-w-4xl mx-auto">
        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex justify-between mb-4">
            {[1, 2, 3, 4].map((stepNum) => (
              <div key={stepNum} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= stepNum
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                    : 'bg-gray-800 border border-gray-700'
                }`}>
                  {step > stepNum ? '✓' : stepNum}
                </div>
                <div className="text-xs mt-2 text-gray-400">
                  {['Mood', 'Intensity', 'Context', 'Results'][stepNum - 1]}
                </div>
              </div>
            ))}
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600"
              initial={{ width: 0 }}
              animate={{ width: `${((step - 1) / 3) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
        
        {/* Content Card */}
        <div className="bg-gray-900/50 border border-gray-700/50 rounded-2xl p-6 md:p-10 backdrop-blur-sm shadow-2xl">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>
        
        {/* Tips */}
        {step < 4 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 p-6 bg-gray-800/30 border border-gray-700/50 rounded-xl"
          >
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <BsEmojiSunglasses className="text-amber-400" />
              Quick Tips
            </h3>
            <ul className="text-sm text-gray-400 space-y-2">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Be honest with your current feelings for better recommendations</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-pink-400 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Adding context helps our AI understand your specific situation</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Your mood data is private and only used to improve your experience</span>
              </li>
            </ul>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MoodCheck;