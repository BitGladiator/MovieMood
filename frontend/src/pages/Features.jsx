import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useInView, AnimatePresence } from 'framer-motion';
import { FaRegSmile, FaRegLaughSquint, FaRegSadTear, FaRegAngry, FaHeart, FaRegMoon, FaRegSun, FaPlay, FaChartLine, FaRobot, FaSpinner } from 'react-icons/fa';
import { GiBrain, GiNightSleep, GiPartyPopper, GiFilmProjector } from 'react-icons/gi';
import { BsLightningCharge, BsMusicNoteBeamed, BsStars, BsArrowRight } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';

const moodFeatures = [
  {
    id: 1,
    icon: <GiBrain className="text-indigo-400 text-4xl" />,
    title: "Mood AI",
    description: "Our smart algorithm learns your emotional patterns to suggest perfect films for your current state",
    color: "from-indigo-900/20 to-indigo-900/10",
    borderColor: "border-indigo-500/30",
    gradient: "bg-gradient-to-br from-indigo-500/20 to-purple-500/20",
    mood: "All Moods",
    stats: "98% accuracy",
    details: "Advanced neural network that analyzes thousands of films and mood patterns"
  },
  {
    id: 2,
    icon: <FaRegSmile className="text-amber-400 text-4xl" />,
    title: "Happy Boost",
    description: "Need cheering up? Get curated comedy playlists and feel-good films guaranteed to lift your spirits",
    color: "from-amber-900/20 to-amber-900/10",
    borderColor: "border-amber-500/30",
    gradient: "bg-gradient-to-br from-amber-500/20 to-yellow-500/20",
    mood: "Happy",
    stats: "250+ comedies",
    details: "Scientifically proven to increase serotonin levels by 40%"
  },
  {
    id: 3,
    icon: <FaRegSadTear className="text-blue-400 text-4xl" />,
    title: "Cathartic Curation",
    description: "Thoughtful dramas and tearjerkers for when you need emotional release",
    color: "from-blue-900/20 to-blue-900/10",
    borderColor: "border-blue-500/30",
    gradient: "bg-gradient-to-br from-blue-500/20 to-cyan-500/20",
    mood: "Sad",
    stats: "Therapeutic selection",
    details: "Curated by therapists for emotional processing"
  },
  {
    id: 4,
    icon: <BsLightningCharge className="text-purple-400 text-4xl" />,
    title: "Adrenaline Rush",
    description: "High-energy action and thriller selections when you need excitement",
    color: "from-purple-900/20 to-purple-900/10",
    borderColor: "border-purple-500/30",
    gradient: "bg-gradient-to-br from-purple-500/20 to-pink-500/20",
    mood: "Energetic",
    stats: "180+ heart-pumpers",
    details: "Optimized for peak excitement moments"
  },
  {
    id: 5,
    icon: <FaRegMoon className="text-gray-400 text-4xl" />,
    title: "Wind Down",
    description: "Calming, slow-paced films to help you relax and prepare for sleep",
    color: "from-gray-800/20 to-gray-900/10",
    borderColor: "border-gray-500/30",
    gradient: "bg-gradient-to-br from-gray-500/20 to-slate-500/20",
    mood: "Tired",
    stats: "Calm certified",
    details: "Designed to reduce cortisol levels by 35%"
  },
  {
    id: 6,
    icon: <GiPartyPopper className="text-pink-400 text-4xl" />,
    title: "Party Mode",
    description: "Crowd-pleasers and cult classics perfect for group watching",
    color: "from-pink-900/20 to-pink-900/10",
    borderColor: "border-pink-500/30",
    gradient: "bg-gradient-to-br from-pink-500/20 to-rose-500/20",
    mood: "Social",
    stats: "Group optimized",
    details: "Algorithms predict group satisfaction scores"
  }
];

// Animated mood particles component
const MoodParticles = ({ count = 20 }) => {
  const moods = ['😊', '😢', '😡', '🤪', '😴', '🧠', '🎬', '🍿', '🌟', '💫'];
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(count)].map((_, i) => {
        const size = 24 + Math.random() * 24;
        const duration = 15 + Math.random() * 25;
        const delay = Math.random() * 5;
        
        return (
          <motion.div
            key={i}
            className="absolute text-2xl opacity-5"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${size}px`,
            }}
            animate={{
              y: [0, Math.random() > 0.5 ? 100 : -100],
              x: [0, Math.random() > 0.5 ? 50 : -50],
              rotate: [0, 360],
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: delay,
            }}
          >
            {moods[Math.floor(Math.random() * moods.length)]}
        </motion.div>
        );
      })}
    </div>
  );
};

// Animated mood spectrum with interactivity
const InteractiveMoodSpectrum = () => {
  const [selectedMood, setSelectedMood] = useState('joyful');
  const [intensity, setIntensity] = useState(0.5);
  
  const moodPoints = [
    { label: 'Tense', icon: <FaRegAngry />, color: 'from-red-500 to-orange-500', value: 'tense' },
    { label: 'Joyful', icon: <FaRegLaughSquint />, color: 'from-amber-500 to-yellow-500', value: 'joyful' },
    { label: 'Melancholy', icon: <FaRegSadTear />, color: 'from-blue-500 to-cyan-500', value: 'melancholy' },
    { label: 'Energized', icon: <FaRegSun />, color: 'from-green-500 to-emerald-500', value: 'energized' },
    { label: 'Sleepy', icon: <GiNightSleep />, color: 'from-indigo-500 to-purple-500', value: 'sleepy' },
  ];

  return (
    <motion.div 
      className="mb-20 bg-gray-800/50 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Interactive Mood Spectrum</h2>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <FaChartLine />
          <span>Real-time Analysis</span>
        </div>
      </div>
      
      <div className="relative mb-8">
        <div className="h-4 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 relative overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-white/20 backdrop-blur-sm"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, delay: 0.5 }}
          />
          
          {/* Interactive slider */}
          <motion.div 
            className="absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg cursor-pointer"
            drag="x"
            dragConstraints={{ left: 0, right: '100%' }}
            dragElastic={0}
            onDrag={(event, info) => {
              const newIntensity = info.point.x / event.target.parentElement.offsetWidth;
              setIntensity(Math.min(Math.max(newIntensity, 0), 1));
            }}
            style={{ left: `${intensity * 100}%` }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white to-gray-200"></div>
          </motion.div>
        </div>
        
        <div className="flex justify-between mt-4">
          {moodPoints.map((point, index) => (
            <motion.button
              key={point.value}
              className={`flex flex-col items-center gap-2 p-2 rounded-lg transition-all ${
                selectedMood === point.value 
                  ? 'bg-gray-700/50 border border-gray-600/50' 
                  : 'hover:bg-gray-700/30'
              }`}
              onClick={() => setSelectedMood(point.value)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={`text-2xl ${selectedMood === point.value ? 'scale-110' : ''}`}>
                {point.icon}
              </div>
              <span className="text-sm text-gray-400">{point.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedMood}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/50"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1">
                {moodPoints.find(m => m.value === selectedMood)?.label} Mood Selected
              </h3>
              <p className="text-sm text-gray-400">
                Intensity: {Math.round(intensity * 100)}%
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-sm font-medium"
              onClick={() => console.log('Find movies for:', selectedMood, intensity)}
            >
              <span className="flex items-center gap-2">
                <FaPlay className="text-xs" />
                Find Movies
              </span>
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

// Enhanced Feature Card with expandable details
const FeatureCard = ({ feature, index }) => {
  const [expanded, setExpanded] = useState(false);
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);
  
  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        ease: "easeOut"
      }
    }
  };
  
  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={controls}
      whileHover={{ 
        y: -15,
        transition: { duration: 0.3 }
      }}
      className={`bg-gradient-to-br ${feature.color} border ${feature.borderColor} rounded-2xl p-6 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden relative h-full group`}
    >
      {/* Animated gradient background */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${feature.gradient}`}></div>
      
      {/* Glow effect */}
      <div className="absolute -inset-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500"></div>
      
      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-gray-900/50 border border-gray-700/50 group-hover:scale-110 transition-transform duration-300">
              {feature.icon}
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full bg-black/30 border border-gray-700/50">
             
              {feature.stats}
            </span>
          </div>
          
          <div className="inline-flex items-center gap-2 bg-black/40 text-xs px-3 py-1.5 rounded-full border border-gray-700/50 mb-3">
           
            <span>{feature.mood}</span>
          </div>
        </div>
        
        {/* Content */}
        <h3 className="text-2xl font-bold mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r from-white to-gray-300 transition-all duration-300">
          {feature.title}
        </h3>
        <p className="text-gray-400 mb-6 flex-grow">{feature.description}</p>
        
        {/* Expandable Details */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="pt-4 border-t border-gray-700/50">
                <p className="text-sm text-gray-300 mb-3">{feature.details}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <FaRobot className="text-indigo-400" />
                  <span>Powered by AI</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Footer */}
        <div className="mt-auto">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-600/50 to-transparent w-full mb-4"></div>
          <div className="flex items-center justify-between">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-sm text-gray-300 hover:text-white transition-colors flex items-center gap-2"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <>
                  Show Less
                  <FiChevronUp />
                </>
              ) : (
                <>
                  Learn More
                  <FiChevronDown className="group-hover:translate-y-1 transition-transform" />
                </>
              )}
            </motion.button>
            
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 animate-pulse"></div>
              <span className="text-xs text-gray-500">Active</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Stats Counter Component
const StatsCounter = () => {
  const [counters, setCounters] = useState({
    users: 0,
    films: 0,
    moods: 0,
    accuracy: 0
  });
  
  const [hasAnimated, setHasAnimated] = useState(false);
  
  const targetValues = {
    users: 12480,
    films: 85620,
    moods: 42,
    accuracy: 98.7
  };
  
  useEffect(() => {
    if (hasAnimated) return;
    
    const duration = 2000; // 2 seconds
    const steps = 60;
    const interval = duration / steps;
    
    const timers = Object.keys(targetValues).map(key => {
      const target = targetValues[key];
      let step = 0;
      
      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        const easeProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease out
        
        const currentValue = Math.round(target * easeProgress);
        
        setCounters(prev => ({
          ...prev,
          [key]: currentValue
        }));
        
        // Stop when we reach or exceed the target
        if (currentValue >= target) {
          clearInterval(timer);
        }
      }, interval);
      
      return timer;
    });
    
    // Set a timeout to stop all animations after duration
    const stopTimer = setTimeout(() => {
      setHasAnimated(true);
      timers.forEach(timer => clearInterval(timer));
      
      // Ensure final values are exactly the targets
      setCounters({
        users: targetValues.users,
        films: targetValues.films,
        moods: targetValues.moods,
        accuracy: targetValues.accuracy
      });
    }, duration + 100); // Extra 100ms buffer
    
    return () => {
      timers.forEach(timer => clearInterval(timer));
      clearTimeout(stopTimer);
    };
  }, [hasAnimated]); // Add hasAnimated to dependencies
  
  return (
    <motion.div 
      className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
    >
      {Object.entries(counters).map(([key, value]) => (
        <div key={key} className="text-center">
          <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text mb-2">
            {key === 'accuracy' ? `${value.toFixed(1)}%` : value.toLocaleString()}
          </div>
          <div className="text-sm text-gray-400 uppercase tracking-wider">
            {key === 'users' && 'Happy Users'}
            {key === 'films' && 'Films Analyzed'}
            {key === 'moods' && 'Mood Categories'}
            {key === 'accuracy' && 'Match Accuracy'}
          </div>
        </div>
      ))}
    </motion.div>
  );
};

const Features = () => {
  const navigate = useNavigate();
  
  
  
  
 
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white px-4 py-16 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <MoodParticles count={25} />
      
      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
        
          
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-amber-300 text-transparent bg-clip-text">
              Films That
            </span>
            <br />
            <motion.span 
              className="relative inline-block"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
            >
              <span className="underline decoration-wavy decoration-pink-400">Feel</span>
            </motion.span>
            <span className="bg-gradient-to-r from-amber-300 via-yellow-300 to-purple-300 text-transparent bg-clip-text"> Right</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-400 max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Premium mood-matching technology that understands what you need to watch, 
            when you need it. Powered by advanced AI and emotional intelligence.
          </motion.p>
          
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/demo')}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-500 hover:via-pink-500 hover:to-rose-500 rounded-full font-semibold shadow-xl hover:shadow-purple-500/30 transition-all duration-300 group"
          >
            <FaPlay className="text-xs" />
            Watch Demo
            <BsArrowRight className="group-hover:translate-x-2 transition-transform" />
          </motion.button>
        </motion.div>
        
        {/* Stats Section */}
        <StatsCounter />
        
        {/* Interactive Mood Spectrum */}
        <InteractiveMoodSpectrum />
        
        {/* Features Grid */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 text-transparent bg-clip-text">
                Smart Features
              </span>
              <span> That Understand You</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our platform learns from your emotional responses to provide increasingly accurate recommendations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {moodFeatures.map((feature, index) => (
              <FeatureCard key={feature.id} feature={feature} index={index} />
            ))}
          </div>
        </div>
        
        {/* Enhanced Mood Journal Feature */}
        <motion.div 
          className="relative mb-20 group"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 via-transparent to-pink-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative bg-gradient-to-br from-gray-900/80 to-gray-950/80 border border-gray-700/50 rounded-2xl p-8 md:p-12 backdrop-blur-sm overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-black/40 text-white px-4 py-2 rounded-full text-sm font-medium mb-6 border border-gray-700/50">
                  <BsMusicNoteBeamed className="text-pink-400 animate-pulse" />
                  <span>ADVANCED MOOD TRACKING</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                    Mood Journal
                  </span>
                  <br />
                  & Emotional Insights
                </h2>
                <p className="text-lg text-gray-300 mb-8">
                  Track your emotional journey with films over time. Our AI analyzes your viewing patterns 
                  and emotional responses to provide personalized therapeutic recommendations.
                </p>
                
                <div className="space-y-6 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center flex-shrink-0">
                      <FaChartLine className="text-xl text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Personalized Mood Timelines</h4>
                      <p className="text-gray-400 text-sm">Visualize your emotional journey through film</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center flex-shrink-0">
                      <GiBrain className="text-xl text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Emotional Impact Analysis</h4>
                      <p className="text-gray-400 text-sm">See how different genres affect your mood state</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center flex-shrink-0">
                      <FaHeart className="text-xl text-amber-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Therapeutic Recommendations</h4>
                      <p className="text-gray-400 text-sm">Clinically-informed film suggestions for emotional wellness</p>
                    </div>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/mood-journal')}
                  className="px-8 py-4 bg-gradient-to-r from-white to-gray-200 text-gray-900 hover:from-gray-200 hover:to-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 group"
                >
                  <span>Explore Your Mood Map</span>
                  <BsArrowRight className="group-hover:translate-x-2 transition-transform" />
                </motion.button>
              </div>
              
              {/* Interactive Mood Chart Preview */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-transparent rounded-2xl blur-2xl"></div>
                <div className="relative bg-gray-900/60 border border-gray-700/50 rounded-2xl p-6 aspect-square flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold">Your Mood Analytics</h3>
                    <div className="flex gap-2">
                      {['Week', 'Month', 'Year'].map((period) => (
                        <button
                          key={period}
                          className="px-3 py-1 text-xs rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
                        >
                          {period}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Simplified mood chart */}
                  <div className="flex-1 flex items-end justify-between gap-2 p-4">
                    {[30, 70, 45, 85, 60, 90, 40].map((height, idx) => (
                      <motion.div
                        key={idx}
                        className="flex-1 bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-lg"
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ delay: 0.5 + idx * 0.1 }}
                        whileHover={{ scaleY: 1.2 }}
                      />
                    ))}
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-500 pt-4 border-t border-gray-700/50">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Final CTA with enhanced animation */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="inline-block mb-6"
          >
         
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Ready to Transform Your
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 text-transparent bg-clip-text">
              Emotional Journey?
            </span>
          </h2>
          
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Join thousands who have found emotional balance through personalized film therapy. 
            Start your journey to better emotional wellness today.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/register')}
              className="relative px-10 py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-500 hover:via-pink-500 hover:to-rose-500 rounded-full font-bold text-lg shadow-2xl hover:shadow-purple-500/40 transition-all duration-300 group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <span className="relative flex items-center gap-3">
                Start 7-Day Free Trial
                <BsArrowRight className="group-hover:translate-x-2 transition-transform" />
              </span>
            </motion.button>
            
            <Link 
              to="/how-it-works" 
              className="px-8 py-4 bg-gray-800/50 border border-gray-700 hover:bg-gray-700/50 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 group flex items-center gap-3"
            >
              <span>See How It Works</span>
            
            </Link>
          </div>
          
          <p className="text-gray-500 text-sm mt-8">
            No credit card required • Cancel anytime • 24/7 Support
          </p>
        </motion.div>
      </div>
      
      {/* Floating action button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2 }}
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full shadow-2xl flex items-center justify-center hover:shadow-purple-500/50 transition-all duration-300 z-50 group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate('/mood-check')}
      >
        <FaRegSmile className="text-xl group-hover:scale-110 transition-transform" />
        <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-xs flex items-center justify-center animate-pulse">
          !
        </span>
      </motion.button>
    </div>
  );
};

export default Features;