import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useAnimation, useInView, AnimatePresence } from 'framer-motion';
import { 
  FaRegSmile, FaFilm, FaHeart, FaBrain, FaMoon, FaMagic, 
  FaRobot, FaChevronRight, FaPlay, FaChartLine, FaUsers,
  FaSearch, FaFilter, FaStar, FaLightbulb, FaMicrophone,
  FaCamera, FaKeyboard, FaArrowRight, FaRegClock
} from 'react-icons/fa';
import { 
  GiFilmSpool, GiBrain, GiFilmProjector, GiFilmStrip,
  GiTearTracks, GiLaughing, GiSpinningSword, GiSleepingBag
} from 'react-icons/gi';
import { 
  BsEmojiFrown, BsEmojiSmile, BsLightningCharge, BsStars,
  BsArrowRight, BsGraphUp, BsShieldCheck, BsCameraVideo
} from 'react-icons/bs';
import { TbMoodCheck, TbBrain } from 'react-icons/tb';
import { HiSparkles, HiChartBar } from 'react-icons/hi';

const HowitWorks = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [hoveredExample, setHoveredExample] = useState(null);
  const [showDemo, setShowDemo] = useState(false);
  const [aiAnalysisProgress, setAiAnalysisProgress] = useState(0);

  const stepRefs = useRef([]);
  const controls = useAnimation();

  const steps = [
    {
      icon: <FaRegSmile className="text-pink-400 text-3xl" />,
      title: "1. Express Your Mood",
      description: "Share how you're feeling through multiple intuitive methods. Our AI understands your emotional state from text, voice, or facial expression.",
      color: "from-pink-900/20 to-rose-900/10",
      borderColor: "border-pink-500/30",
      animation: "👆",
      details: [
        "Text-based mood description",
        "Voice emotion analysis",
        "Facial expression detection",
        "Quick mood emoji selection"
      ],
      methods: [
        { icon: <FaKeyboard />, label: "Text Input", color: "text-blue-400" },
        { icon: <FaMicrophone />, label: "Voice", color: "text-green-400" },
        { icon: <FaCamera />, label: "Camera", color: "text-purple-400" },
        { icon: <BsEmojiSmile />, label: "Emoji", color: "text-yellow-400" }
      ]
    },
    {
      icon: <GiBrain className="text-purple-400 text-3xl" />,
      title: "2. AI Mood Analysis", 
      description: "Our advanced neural network analyzes 78 emotional factors and patterns to deeply understand your psychological state in real-time.",
      color: "from-purple-900/20 to-indigo-900/10",
      borderColor: "border-purple-500/30",
      animation: "🧠",
      details: [
        "Real-time emotional pattern recognition",
        "Psychological state assessment",
        "Mood intensity calibration",
        "Contextual understanding"
      ],
      stats: "98.7% accuracy"
    },
    {
      icon: <FaFilm className="text-amber-400 text-3xl" />,
      title: "3. Smart Cinematic Matching",
      description: "We scan through 50,000+ films, analyzing emotional tones, pacing, themes, and cinematic elements to find your perfect match.",
      color: "from-amber-900/20 to-yellow-900/10",
      borderColor: "border-amber-500/30",
      animation: "🎬",
      details: [
        "Emotional tone analysis",
        "Pacing and rhythm matching",
        "Thematic relevance scoring",
        "Cinematic element alignment"
      ],
      stats: "50K+ films analyzed"
    },
    {
      icon: <FaHeart className="text-red-400 text-3xl" />,
      title: "4. Personalized Results",
      description: "Receive 3-5 expertly curated recommendations with mood transformation goals and emotional impact predictions.",
      color: "from-red-900/20 to-rose-900/10",
      borderColor: "border-red-500/30",
      animation: "💖",
      details: [
        "Mood enhancement suggestions",
        "Therapeutic film categories",
        "Emotional journey planning",
        "Watch-time optimization"
      ],
      stats: "Personalized for you"
    }
  ];

  const moodExamples = [
    {
      mood: "Feeling Down",
      icon: <BsEmojiFrown className="text-blue-400 text-2xl" />,
      recommendation: "Uplifting comedies or inspiring dramas",
      color: "from-blue-900/30 to-cyan-900/10",
      borderColor: "border-blue-500/30",
      movies: ["The Pursuit of Happyness", "Little Miss Sunshine", "Good Will Hunting"],
      effect: "Boost mood by 60%"
    },
    {
      mood: "Stressed Out",
      icon: <FaMoon className="text-indigo-400 text-2xl" />,
      recommendation: "Calming nature documentaries or slow cinema",
      color: "from-indigo-900/30 to-violet-900/10",
      borderColor: "border-indigo-500/30",
      movies: ["My Octopus Teacher", "Samsara", "Chef's Table"],
      effect: "Reduce stress by 45%"
    },
    {
      mood: "Bored",
      icon: <BsLightningCharge className="text-amber-400 text-2xl" />,
      recommendation: "High-energy action or mind-bending sci-fi",
      color: "from-amber-900/30 to-orange-900/10",
      borderColor: "border-amber-500/30",
      movies: ["Mad Max: Fury Road", "Inception", "John Wick"],
      effect: "Increase excitement by 70%"
    },
    {
      mood: "Happy",
      icon: <BsEmojiSmile className="text-green-400 text-2xl" />,
      recommendation: "Feel-good musicals or adventure films",
      color: "from-green-900/30 to-emerald-900/10",
      borderColor: "border-green-500/30",
      movies: ["La La Land", "The Grand Budapest Hotel", "Paddington"],
      effect: "Enhance joy by 40%"
    },
    {
      mood: "Anxious",
      icon: <GiSleepingBag className="text-teal-400 text-2xl" />,
      recommendation: "Soothing animations or comforting classics",
      color: "from-teal-900/30 to-cyan-900/10",
      borderColor: "border-teal-500/30",
      movies: ["Spirited Away", "The Princess Bride", "Amélie"],
      effect: "Calm nerves by 55%"
    },
    {
      mood: "Angry",
      icon: <GiSpinningSword className="text-rose-400 text-2xl" />,
      recommendation: "Cathartic dramas or intense thrillers",
      color: "from-rose-900/30 to-red-900/10",
      borderColor: "border-rose-500/30",
      movies: ["Fight Club", "The Dark Knight", "Whiplash"],
      effect: "Release tension by 65%"
    }
  ];

  const techFeatures = [
    {
      title: "Emotional AI Engine",
      description: "Advanced neural network trained on 1M+ emotional responses",
      icon: <TbBrain className="text-2xl text-purple-400" />,
      stats: "98.7% accuracy"
    },
    {
      title: "Film Analysis Database",
      description: "50,000+ films analyzed across 12 emotional dimensions",
      icon: <GiFilmStrip className="text-2xl text-amber-400" />,
      stats: "12 dimensions"
    },
    {
      title: "Real-time Processing",
      description: "Instant mood analysis and recommendations in under 2 seconds",
      icon: <FaRegClock className="text-2xl text-blue-400" />,
      stats: "< 2s response"
    },
    {
      title: "Personalization Engine",
      description: "Learns from your preferences to improve recommendations over time",
      icon: <FaUsers className="text-2xl text-green-400" />,
      stats: "Adaptive learning"
    }
  ];

  // Simulate AI analysis progress
  useEffect(() => {
    const interval = setInterval(() => {
      setAiAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const StepCard = ({ step, index }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });
    const cardControls = useAnimation();

    useEffect(() => {
      if (isInView) {
        cardControls.start('visible');
      }
    }, [isInView, cardControls]);

    const variants = {
      hidden: { opacity: 0, y: 50 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: {
          duration: 0.6,
          delay: index * 0.2,
          ease: "easeOut"
        }
      }
    };

    return (
      <motion.div
        ref={ref}
        variants={variants}
        initial="hidden"
        animate={cardControls}
        whileHover={{ 
          y: -15,
          scale: 1.02,
          transition: { duration: 0.3 }
        }}
        onClick={() => setActiveStep(index)}
        className={`relative bg-gradient-to-br ${step.color} border ${step.borderColor} rounded-2xl p-6 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer h-full group overflow-hidden ${
          activeStep === index ? 'ring-2 ring-white/20' : ''
        }`}
      >
        {/* Animated background */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/5 to-transparent"></div>
        
        {/* Step number */}
        <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/30 border border-gray-700/50 flex items-center justify-center text-sm font-bold">
          {index + 1}
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-black/30 border border-gray-700/50 group-hover:scale-110 transition-transform duration-300">
              {step.icon}
            </div>
            <h3 className="text-2xl font-bold">{step.title}</h3>
          </div>
          
          <p className="text-gray-400 mb-6">{step.description}</p>
          
          {/* Details list */}
          <div className="space-y-2 mb-6">
            {step.details.map((detail, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                <div className="w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                <span>{detail}</span>
              </div>
            ))}
          </div>
          
          {/* Stats or methods */}
          {step.stats && (
            <div className="inline-flex items-center gap-2 bg-black/40 text-xs px-3 py-1 rounded-full border border-gray-700/50">
              <BsStars className="text-amber-400" />
              <span>{step.stats}</span>
            </div>
          )}
          
          {step.methods && (
            <div className="flex flex-wrap gap-2 mt-4">
              {step.methods.map((method, idx) => (
                <div key={idx} className={`flex items-center gap-1 px-2 py-1 rounded-lg bg-black/30 ${method.color}`}>
                  {method.icon}
                  <span className="text-xs">{method.label}</span>
                </div>
              ))}
            </div>
          )}
          
          {/* Animated emoji */}
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-4xl mt-6 opacity-20 group-hover:opacity-100 transition-opacity"
          >
            {step.animation}
          </motion.div>
        </div>
      </motion.div>
    );
  };

  const InteractiveDemo = () => {
    const [demoStep, setDemoStep] = useState(0);
    const [inputText, setInputText] = useState('');
    const [showAnalysis, setShowAnalysis] = useState(false);

    const demoSteps = [
      {
        title: "Describe your mood",
        placeholder: "E.g., 'Feeling stressed after work...'",
        icon: <FaKeyboard className="text-blue-400" />
      },
      {
        title: "AI analyzing...",
        placeholder: "Processing emotional patterns...",
        icon: <GiBrain className="text-purple-400 animate-pulse" />
      },
      {
        title: "Finding matches",
        placeholder: "Scanning film database...",
        icon: <FaSearch className="text-amber-400" />
      },
      {
        title: "Recommendations ready!",
        placeholder: "Perfect films found for you",
        icon: <FaHeart className="text-red-400" />
      }
    ];

    const handleNextStep = () => {
      if (demoStep < 3) {
        setDemoStep(demoStep + 1);
        if (demoStep === 0) {
          setShowAnalysis(true);
        }
      } else {
        navigate('/mood-check');
      }
    };

    return (
      <div className="bg-gray-900/60 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <FaPlay className="text-purple-400" />
            Interactive Demo
          </h3>
          <button
            onClick={() => setShowDemo(false)}
            className="text-gray-400 hover:text-white"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          {/* Progress bar */}
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-600 via-pink-600 to-red-600"
              initial={{ width: 0 }}
              animate={{ width: `${(demoStep / 3) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Current step */}
          <div className="flex items-center gap-3 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
            <div className="p-2 rounded-lg bg-black/30">
              {demoSteps[demoStep].icon}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold mb-1">{demoSteps[demoStep].title}</h4>
              {demoStep === 0 ? (
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={demoSteps[demoStep].placeholder}
                  className="w-full bg-transparent border-b border-gray-600 focus:border-purple-500 focus:outline-none py-1"
                />
              ) : (
                <p className="text-gray-400">{demoSteps[demoStep].placeholder}</p>
              )}
            </div>
          </div>

          {/* AI Analysis Animation */}
          {showAnalysis && (
            <div className="p-4 bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-lg border border-purple-500/30">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-300">AI Analysis Progress</span>
                <span className="text-sm font-medium">{aiAnalysisProgress}%</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${aiAnalysisProgress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="grid grid-cols-4 gap-2 mt-3 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  <span>Emotion</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                  <span>Intensity</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-pink-400"></div>
                  <span>Context</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span>Pattern</span>
                </div>
              </div>
            </div>
          )}

          {/* Action button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNextStep}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2"
          >
            {demoStep < 3 ? 'Continue' : 'Try for Real'}
            <FaArrowRight />
          </motion.button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white px-4 py-16 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[800px] h-[800px] bg-purple-900/10 rounded-full blur-3xl -top-1/2 -left-1/4 animate-pulse"></div>
        <div className="absolute w-[600px] h-[600px] bg-pink-900/10 rounded-full blur-3xl -bottom-1/4 -right-1/4 animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {[...Array(20)].map((_, i) => {
          const size = 20 + Math.random() * 40;
          const duration = 20 + Math.random() * 40;
          return (
            <motion.div
              key={i}
              className="absolute text-3xl opacity-5"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                fontSize: `${size}px`
              }}
              animate={{
                y: [0, Math.random() > 0.5 ? 100 : -100],
                x: [0, Math.random() > 0.5 ? 50 : -50],
                rotate: Math.random() > 0.5 ? [0, 360] : [0, -360]
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear"
              }}
            >
              <GiFilmSpool />
            </motion.div>
          );
        })}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05, rotate: [-1, 1, -1] }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-white px-6 py-3 rounded-full text-sm font-medium mb-8 border border-purple-500/20 shadow-lg backdrop-blur-sm"
          >
            <HiSparkles className="text-amber-400 animate-pulse" />
            <span>HOW MOVIEMOOD WORKS</span>
            <HiSparkles className="text-amber-400 animate-pulse" />
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-amber-300 text-transparent bg-clip-text">
              Emotional Intelligence
            </span>
            <br />
            <span className="text-white">Meets </span>
            <span className="bg-gradient-to-r from-amber-300 via-yellow-300 to-purple-300 text-transparent bg-clip-text">Cinematic Magic</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-400 max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Discover how our AI transforms your emotional state into perfectly matched film recommendations
            using cutting-edge technology and deep cinematic understanding.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDemo(true)}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-500 hover:via-pink-500 hover:to-rose-500 rounded-full font-semibold shadow-xl hover:shadow-purple-500/30 transition-all duration-300 flex items-center gap-3 group"
            >
              <FaPlay className="text-xs" />
              Try Interactive Demo
              <BsArrowRight className="group-hover:translate-x-2 transition-transform" />
            </motion.button>
            
            <button
              onClick={() => navigate('/mood-check')}
              className="px-8 py-4 bg-gray-800/50 border border-gray-700 hover:bg-gray-700/50 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 group"
            >
              <TbMoodCheck className="text-purple-400" />
              Check Your Mood
              <FaArrowRight className="group-hover:translate-x-2 transition-transform text-sm" />
            </button>
          </motion.div>
        </motion.div>

        {/* Interactive Demo */}
        <AnimatePresence>
          {showDemo && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-16"
            >
              <InteractiveDemo />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Process Steps */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 text-transparent bg-clip-text">
                The 4-Step Process
              </span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              From mood expression to perfect film recommendation - here's how our intelligent system works
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <StepCard key={index} step={step} index={index} />
            ))}
          </div>
        </div>

        {/* Technology Features */}
        <motion.div 
          className="mb-24 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl p-8 md:p-12 backdrop-blur-sm relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl"></div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 bg-black/40 text-white px-4 py-2 rounded-full text-sm font-medium mb-6 border border-gray-700/50">
                <FaRobot className="text-purple-400" />
                <span>POWERFUL TECHNOLOGY</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                  Advanced AI Engine
                </span>
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                Our proprietary system combines emotional intelligence with cinematic expertise
                to deliver personalized recommendations with unprecedented accuracy.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                {techFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-gray-900/30 rounded-xl border border-gray-700/30 hover:border-purple-500/30 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-black/30">
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold">{feature.title}</h4>
                        <div className="text-xs text-gray-400 mt-1">{feature.stats}</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-transparent rounded-2xl blur-2xl"></div>
              <div className="relative bg-gray-900/60 border border-gray-700/50 rounded-2xl p-6 aspect-square flex flex-col items-center justify-center">
                <div className="text-center mb-8">
                  <div className="text-6xl mb-4">🔬</div>
                  <h3 className="text-xl font-bold mb-2">Real-time Analysis</h3>
                  <p className="text-gray-400">Visualizing AI processing</p>
                </div>
                
                {/* Animated processing visualization */}
                <div className="w-full space-y-4">
                  {['Emotion Detection', 'Pattern Analysis', 'Film Matching', 'Optimization'].map((label, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">{label}</span>
                        <span className="text-purple-400 font-medium">{85 + idx * 5}%</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${85 + idx * 5}%` }}
                          transition={{ delay: 0.5 + idx * 0.2, duration: 1 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Mood Examples Grid */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              See <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">Real Examples</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Discover how different moods translate into perfectly matched film recommendations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {moodExamples.map((example, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                onMouseEnter={() => setHoveredExample(index)}
                onMouseLeave={() => setHoveredExample(null)}
                className={`bg-gradient-to-br ${example.color} border ${example.borderColor} rounded-2xl p-6 backdrop-blur-sm transition-all duration-300 overflow-hidden relative h-full group`}
              >
                {/* Hover effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/5 to-transparent"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-black/30">
                        {example.icon}
                      </div>
                      <h4 className="text-xl font-semibold">{example.mood}</h4>
                    </div>
                    <div className="px-3 py-1 bg-black/40 rounded-full text-sm font-medium border border-gray-700/50">
                      {example.effect}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-sm text-gray-400 mb-2">We recommend:</p>
                    <p className="font-medium text-lg">{example.recommendation}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-sm text-gray-400">Example films:</p>
                    <div className="space-y-2">
                      {example.movies.map((movie, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + idx * 0.1 }}
                          className="flex items-center gap-3 p-3 bg-black/20 rounded-lg hover:bg-black/30 transition-colors"
                        >
                          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"></div>
                          <span className="text-sm">{movie}</span>
                          <div className="ml-auto text-xs px-2 py-1 bg-purple-600/20 rounded">
                            {90 - idx * 5}%
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
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
            <div className="text-6xl">🎯</div>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Ready to Experience
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 text-transparent bg-clip-text">
              Mood-Perfect Films?
            </span>
          </h2>
          
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Join thousands who have discovered the perfect film for every mood moment.
            Your emotional journey starts here.
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
                Start Your Journey Free
                <BsArrowRight className="group-hover:translate-x-2 transition-transform" />
              </span>
            </motion.button>
            
            <button
              onClick={() => navigate('/mood-check')}
              className="px-8 py-4 bg-gray-800/50 border border-gray-700 hover:bg-gray-700/50 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 group flex items-center gap-3"
            >
              <TbMoodCheck className="text-purple-400" />
              <span>Try Mood Check First</span>
              <HiSparkles className="text-amber-400 group-hover:rotate-180 transition-transform" />
            </button>
          </div>
          
          <p className="text-gray-500 text-sm mt-8">
            No credit card required • Instant mood analysis • Personalized for you
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default HowitWorks;