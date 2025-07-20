import React from 'react';
import { motion } from 'framer-motion';
import { FaRegSmile, FaRegCompass, FaFilm, FaHeart, FaBrain, FaMoon, FaMagic } from 'react-icons/fa';
import { GiFilmSpool, GiBrain } from 'react-icons/gi';
import { BsEmojiFrown, BsEmojiSmile, BsLightningCharge } from 'react-icons/bs';

const HowitWorks = () => {
  const steps = [
    {
      icon: <FaRegSmile className="text-pink-500 text-3xl" />,
      title: "1. Set Your Mood",
      description: "Tell us how you're feeling or let our AI detect your mood through facial analysis or text input.",
      color: "bg-pink-900/20",
      animation: "👆"
    },
    {
      icon: <GiBrain className="text-purple-500 text-3xl" />,
      title: "2. Mood Analysis",
      description: "Our AI evaluates 50+ emotional factors to understand exactly what kind of film experience you need.",
      color: "bg-purple-900/20",
      animation: "🧠"
    },
    {
      icon: <FaFilm className="text-amber-500 text-3xl" />,
      title: "3. Smart Matching",
      description: "We scan thousands of films, analyzing emotional tones, pacing, and themes to find your perfect match.",
      color: "bg-amber-900/20",
      animation: "🎬"
    },
    {
      icon: <FaHeart className="text-red-500 text-3xl" />,
      title: "4. Personalized Results",
      description: "Get 3-5 curated recommendations tailored to either enhance or transform your current mood.",
      color: "bg-red-900/20",
      animation: "💖"
    }
  ];

  const moodExamples = [
    {
      mood: "Feeling Down",
      icon: <BsEmojiFrown className="text-blue-400 text-2xl" />,
      recommendation: "Uplifting comedies or inspiring dramas",
      color: "from-blue-900/30 to-blue-900/10"
    },
    {
      mood: "Stressed Out",
      icon: <FaMoon className="text-indigo-400 text-2xl" />,
      recommendation: "Calming nature documentaries or slow cinema",
      color: "from-indigo-900/30 to-indigo-900/10"
    },
    {
      mood: "Bored",
      icon: <BsLightningCharge className="text-amber-400 text-2xl" />,
      recommendation: "High-energy action or mind-bending sci-fi",
      color: "from-amber-900/30 to-amber-900/10"
    },
    {
      mood: "Happy",
      icon: <BsEmojiSmile className="text-green-400 text-2xl" />,
      recommendation: "Feel-good musicals or adventure films",
      color: "from-green-900/30 to-green-900/10"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white px-4 py-16 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[800px] h-[800px] bg-purple-900/10 rounded-full blur-3xl -top-1/2 -left-1/4 animate-float-slow"></div>
        <div className="absolute w-[600px] h-[600px] bg-pink-900/10 rounded-full blur-3xl -bottom-1/4 -right-1/4 animate-float-reverse-slow"></div>
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl opacity-5"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() > 0.5 ? 40 : -40],
              rotate: Math.random() > 0.5 ? [0, 360] : [0, -360]
            }}
            transition={{
              duration: 15 + Math.random() * 30,
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear"
            }}
          >
            <GiFilmSpool />
          </motion.div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-lg"
          >
            <FaMagic className="text-yellow-300" />
            <span>MOOD MAGIC</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-amber-300 text-transparent bg-clip-text mb-6">
            How MovieMood Works
          </h1>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            We combine emotional intelligence with cinematic knowledge to find films that resonate with how you feel right now.
          </p>
        </motion.div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ y: -10 }}
              className={`${step.color} border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm h-full flex flex-col`}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-black/30 border border-gray-700/50">
                  {step.icon}
                </div>
                <h3 className="text-2xl font-bold">{step.title}</h3>
              </div>
              <p className="text-gray-400 mb-6 flex-grow">{step.description}</p>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-4xl self-end opacity-20"
              >
                {step.animation}
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Mood Examples */}
        <motion.div 
          className="mb-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">Real Mood</span> Examples
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {moodExamples.map((example, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                className={`bg-gradient-to-br ${example.color} border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm h-full`}
              >
                <div className="flex items-center gap-3 mb-4">
                  {example.icon}
                  <h4 className="text-xl font-semibold">{example.mood}</h4>
                </div>
                <div className="pl-9">
                  <p className="text-sm text-gray-400 mb-2">We might recommend:</p>
                  <p className="font-medium">{example.recommendation}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Science Section */}
        <motion.div 
          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl p-8 md:p-12 mb-20 backdrop-blur-sm relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-black/30 text-white px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-gray-700/50">
                <FaBrain className="text-purple-400" />
                <span>THE SCIENCE BEHIND IT</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">Emotional Resonance Technology</h2>
              <p className="text-lg text-gray-300 mb-6">
                Our proprietary system analyzes films across 12 emotional dimensions and 8 cinematic factors to match your current psychological state.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 w-2 h-2 bg-pink-400 rounded-full flex-shrink-0"></div>
                  <span>Mood-adaptive recommendation engine</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 w-2 h-2 bg-purple-400 rounded-full flex-shrink-0"></div>
                  <span>Psychological impact scoring</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 w-2 h-2 bg-amber-400 rounded-full flex-shrink-0"></div>
                  <span>Therapeutic film categorization</span>
                </li>
              </ul>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl blur-xl"></div>
              <div className="relative bg-gray-900/80 border border-gray-700/50 rounded-xl p-6 aspect-video flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🔬</div>
                  <p className="text-gray-400">Emotional film analysis matrix</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Find Your Perfect Mood Match?</h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Discover how the right film at the right time can transform your emotional state.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-full font-semibold shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
            >
              Get Started - It's Free
            </motion.button>
            <button className="px-8 py-4 bg-gray-800/50 border border-gray-700 hover:bg-gray-700/50 rounded-full font-medium shadow-lg transition-all duration-300">
              How We Analyze Moods
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HowitWorks;