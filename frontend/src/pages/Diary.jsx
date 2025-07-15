import { useEffect, useState } from "react";
import { auth, db, collection, query, where, getDocs } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { deleteDoc, doc } from "firebase/firestore";
import { toast } from "react-hot-toast";
import EntryCard from "../components/EntryCard";
import EntryModal from "../components/EntryModal";

import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
export default function Diary() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, "diary"),
          where("uid", "==", currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const results = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEntries(results);
      } catch (err) {
        console.error("Failed to fetch diary entries:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "diary", id));
      setEntries(entries.filter((entry) => entry.id !== id));
      toast.success("Entry deleted!");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete entry.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin mb-6" />
        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-transparent bg-clip-text animate-pulse">
          Loading Your Diary...
        </h2>
        <p className="mt-2 text-gray-400 text-sm italic">
          Fetching data from the Finder 🎬
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute -top-1/3 -left-1/4 w-[800px] h-[800px] bg-purple-900/20 blur-[150px] rounded-full animate-float-slow pointer-events-none"></div>
        <div className="absolute -bottom-1/3 -right-1/4 w-[800px] h-[800px] bg-blue-900/20 blur-[150px] rounded-full animate-float-slow-reverse pointer-events-none"></div>
        
        {/* Floating particles */}
        {[...Array(30)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-10"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `twinkle ${3 + Math.random() * 5}s infinite ${Math.random() * 2}s`
            }}
          />
        ))}
  
        {/* Main content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-2xl mx-auto text-center p-8 md:p-12 backdrop-blur-lg bg-gradient-to-br from-gray-900/80 to-gray-950/80 rounded-3xl border border-gray-800/50 shadow-2xl"
        >
          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/10 rounded-full filter blur-xl"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full filter blur-xl"></div>
          
          {/* Animated movie icon */}
          <motion.div
            animate={{
              y: [0, -15, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-6xl md:text-7xl mb-6"
          >
            🎬
          </motion.div>
          
          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-purple-500 to-blue-500 mb-6 leading-tight"
          >
            Unlock Your Cinematic Universe
          </motion.h1>
          
          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-gray-300 mb-8 max-w-lg mx-auto"
          >
            Log in to access your personalized movie diary, track your watch history, and discover new favorites.
          </motion.p>
          
          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link
              to="/login"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 border border-gray-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Create Account
            </Link>
          </motion.div>
        </motion.div>
  
        {/* Animation keyframes */}
        <style jsx global>{`
          @keyframes float-slow {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(10px, 10px); }
          }
          @keyframes float-slow-reverse {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(-10px, -10px); }
          }
          @keyframes twinkle {
            0%, 100% { opacity: 0.1; }
            50% { opacity: 0.5; }
          }
        `}</style>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-300 flex flex-col items-center justify-center p-8">
        <div className="text-7xl animate-bounce mb-4">🎯</div>
        <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-green-400 to-lime-400 bg-clip-text text-transparent mb-3">
          No Movies in Your Diary
        </h2>
        <p className="text-lg text-gray-400 text-center max-w-md">
          Browse and add movies
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 relative">
    {/* Animated background elements */}
    <div className="absolute -top-20 -left-20 w-80 h-80 bg-purple-900/20 blur-[100px] rounded-full animate-float-slow pointer-events-none"></div>
    <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-indigo-900/20 blur-[100px] rounded-full animate-float-slow-reverse pointer-events-none"></div>
  
    {/* Diary entries grid */}
    <motion.div 
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mx-auto max-w-7xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.1 }}
    >
      {entries.map((entry) => (
        <motion.div
          key={entry.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <EntryCard
            entry={entry}
            onClick={setSelectedEntry}
            onDelete={handleDelete}
          />
        </motion.div>
      ))}
    </motion.div>
  
    {/* Modal with enhanced animation */}
    <AnimatePresence>
      {selectedEntry && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-lg flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative max-w-4xl w-full"
          >
            <EntryModal
              entry={selectedEntry}
              onClose={() => setSelectedEntry(null)}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  
    {/* Animation keyframes */}
    <style jsx global>{`
      @keyframes float-slow {
        0%, 100% { transform: translate(0, 0); }
        50% { transform: translate(10px, 10px); }
      }
      @keyframes float-slow-reverse {
        0%, 100% { transform: translate(0, 0); }
        50% { transform: translate(-10px, -10px); }
      }
    `}</style>
  </div>
  );
}
