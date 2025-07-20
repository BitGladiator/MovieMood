import React from 'react';
import { motion } from 'framer-motion';
import { FaRegSmile, FaRegLaughSquint, FaRegSadTear, FaRegAngry, FaHeart, FaRegMoon, FaRegSun } from 'react-icons/fa';
import { GiBrain, GiNightSleep, GiPartyPopper } from 'react-icons/gi';
import { BsLightningCharge, BsMusicNoteBeamed } from 'react-icons/bs';

const moodFeatures = [
  {
    icon: <GiBrain className="text-indigo-400 text-4xl" />,
    title: "Mood AI",
    description: "Our smart algorithm learns your emotional patterns to suggest perfect films for your current state",
    color: "from-indigo-900/20 to-indigo-900/10",
    mood: "All Moods"
  },
  {
    icon: <FaRegSmile className="text-amber-400 text-4xl" />,
    title: "Happy Boost",
    description: "Need cheering up? Get curated comedy playlists and feel-good films guaranteed to lift your spirits",
    color: "from-amber-900/20 to-amber-900/10",
    mood: "Happy"
  },
  {
    icon: <FaRegSadTear className="text-blue-400 text-4xl" />,
    title: "Cathartic Curation",
    description: "Thoughtful dramas and tearjerkers for when you need emotional release",
    color: "from-blue-900/20 to-blue-900/10",
    mood: "Sad"
  },
  {
    icon: <BsLightningCharge className="text-purple-400 text-4xl" />,
    title: "Adrenaline Rush",
    description: "High-energy action and thriller selections when you need excitement",
    color: "from-purple-900/20 to-purple-900/10",
    mood: "Energetic"
  },
  {
    icon: <FaRegMoon className="text-gray-400 text-4xl" />,
    title: "Wind Down",
    description: "Calming, slow-paced films to help you relax and prepare for sleep",
    color: "from-gray-800/20 to-gray-900/10",
    mood: "Tired"
  },
  {
    icon: <GiPartyPopper className="text-pink-400 text-4xl" />,
    title: "Party Mode",
    description: "Crowd-pleasers and cult classics perfect for group watching",
    color: "from-pink-900/20 to-pink-900/10",
    mood: "Social"
  }
];

const Features = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white px-4 py-16 relative overflow-hidden">
      {/* Mood particle background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => {
          const moods = ['😊', '😢', '😡', '🤪', '😴', '🧠'];
          return (
            <motion.div
              key={i}
              className="absolute text-4xl opacity-10"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, Math.random() > 0.5 ? 40 : -40],
                x: [0, Math.random() > 0.5 ? 30 : -30],
                rotate: [0, Math.random() * 360]
              }}
              transition={{
                duration: 15 + Math.random() * 30,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            >
              {moods[Math.floor(Math.random() * moods.length)]}
            </motion.div>
          );
        })}
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
            <FaHeart className="text-red-400" />
            <span>YOUR MOOD MATTERS</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-amber-300 text-transparent bg-clip-text mb-6">
            Films That <span className="underline decoration-wavy decoration-pink-400">Feel</span> Right
          </h1>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Premium mood-matching technology that understands what you need to watch, when you need it.
          </p>
        </motion.div>

        {/* Mood Spectrum Visualization */}
        <motion.div 
          className="mb-20 bg-gray-800/50 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Your Mood Spectrum</h2>
          <div className="h-4 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 mb-8 relative overflow-hidden">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-white/20 backdrop-blur-sm"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, delay: 0.5 }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-400 px-2">
            <span className="flex items-center gap-2"><FaRegAngry /> Tense</span>
            <span className="flex items-center gap-2"><FaRegLaughSquint /> Joyful</span>
            <span className="flex items-center gap-2"><FaRegSadTear /> Melancholy</span>
            <span className="flex items-center gap-2"><FaRegSun /> Energized</span>
            <span className="flex items-center gap-2"><GiNightSleep /> Sleepy</span>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {moodFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ y: -10 }}
              className={`bg-gradient-to-br ${feature.color} border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm shadow-xl hover:shadow-purple-500/20 transition-all duration-300 overflow-hidden relative h-full`}
            >
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
              <div className="relative z-10 h-full flex flex-col">
                <div className="mb-6">
                  <div className="w-16 h-16 flex items-center justify-center rounded-xl bg-gray-800/50 border border-gray-700/50 mb-4">
                    {feature.icon}
                  </div>
                  <div className="inline-block bg-black/30 text-xs px-3 py-1 rounded-full border border-gray-700/50 mb-2">
                    {feature.mood}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 mb-6 flex-grow">{feature.description}</p>
                <div className="mt-auto">
                  <div className="h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent w-full mb-4"></div>
                  <button className="text-sm text-white hover:text-purple-300 transition-colors flex items-center gap-1 w-full justify-end">
                    Learn more
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mood Journal Feature */}
        <motion.div 
          className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-2xl p-8 md:p-12 mb-20 backdrop-blur-sm relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-black/30 text-white px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-gray-700/50">
                <BsMusicNoteBeamed className="text-pink-400" />
                <span>NEW MOOD TRACKING</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Mood Journal & Insights</h2>
              <p className="text-lg text-gray-300 mb-6">
                Track your emotional journey with films over time. See how different movies affect your mood and discover patterns in your viewing habits.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <div className="mt-1 w-2 h-2 bg-pink-400 rounded-full flex-shrink-0"></div>
                  <span>Personalized mood timelines</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 w-2 h-2 bg-purple-400 rounded-full flex-shrink-0"></div>
                  <span>Emotional impact analysis</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 w-2 h-2 bg-amber-400 rounded-full flex-shrink-0"></div>
                  <span>Therapeutic viewing recommendations</span>
                </li>
              </ul>
              <button className="px-6 py-3 bg-white text-gray-900 hover:bg-gray-200 rounded-full font-semibold transition-colors flex items-center gap-2">
                Explore Your Mood Map
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl blur-xl"></div>
              <div className="relative bg-gray-900/80 border border-gray-700/50 rounded-xl p-4 aspect-video flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">📊</div>
                  <p className="text-gray-400">Your personalized mood analytics</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Feel Better Through Film?</h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Join MovieMood Premium today and discover how the right film at the right time can transform your mood.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-full font-semibold shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
            >
              Start Your 7-Day Free Trial
            </motion.button>
            <button className="px-8 py-4 bg-gray-800/50 border border-gray-700 hover:bg-gray-700/50 rounded-full font-medium shadow-lg transition-all duration-300">
              Learn How It Works
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Features;