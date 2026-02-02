import React from "react";
import { motion } from "framer-motion";
import { FaLock, FaShieldAlt, FaUserShield, FaDatabase } from "react-icons/fa";
import { GiSpy } from "react-icons/gi";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100 px-4 py-12 md:py-16 relative overflow-hidden">
    
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[1200px] h-[1200px] bg-gradient-to-br from-purple-900/20 via-indigo-900/10 to-transparent blur-[150px] rounded-full -top-1/2 -left-1/4 animate-float-slow"></div>
        <div className="absolute w-[800px] h-[800px] bg-gradient-to-br from-amber-900/10 via-rose-900/10 to-transparent blur-[120px] rounded-full -bottom-1/4 -right-1/4 animate-float-reverse-slow"></div>
      </div>

    
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0] }}
            transition={{
              duration: 3 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              boxShadow: `0 0 ${Math.random() * 10 + 5}px ${Math.random() * 5 + 2}px rgba(255, 255, 255, 0.5)`
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-4xl mx-auto relative z-10 bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 shadow-2xl shadow-purple-500/20 rounded-3xl p-8 sm:p-10 overflow-hidden"
      >
       
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex p-4 rounded-xl bg-gradient-to-br from-purple-900/30 to-blue-900/20 mb-6"
          >
            <FaLock className="text-4xl text-purple-400" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-300 via-blue-300 to-pink-300 text-transparent bg-clip-text mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Your data security is our top priority. Here's how we protect your information.
          </p>
        </div>

      
        <div className="space-y-10">
        
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/30 backdrop-blur-sm"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-600/20 rounded-lg">
                <FaShieldAlt className="text-blue-400 text-xl" />
              </div>
              <h2 className="text-2xl font-semibold text-blue-100">Data Collection</h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <p>
                We collect only the information necessary to provide and improve our services. 
                This includes:
              </p>
              <ul className="space-y-2 pl-5 list-disc">
                <li>Account information (name, email, profile picture)</li>
                <li>Movie preferences and watch history</li>
                <li>Device information for compatibility</li>
                <li>Usage data to improve our service</li>
              </ul>
              <p>
                We never sell your personal data to third parties. All data collection 
                complies with GDPR and CCPA regulations.
              </p>
            </div>
          </motion.div>


          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/30 backdrop-blur-sm"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-600/20 rounded-lg">
                <FaUserShield className="text-purple-400 text-xl" />
              </div>
              <h2 className="text-2xl font-semibold text-purple-100">Data Protection</h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <p>
                We implement industry-standard security measures to protect your information:
              </p>
              <ul className="space-y-2 pl-5 list-disc">
                <li>End-to-end encryption for all data transmissions</li>
                <li>Regular security audits and penetration testing</li>
                <li>Two-factor authentication options</li>
                <li>Secure server infrastructure with firewalls</li>
              </ul>
              <p>
                Our security protocols are continuously updated to address emerging threats.
              </p>
            </div>
          </motion.div>

       
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/30 backdrop-blur-sm"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-pink-600/20 rounded-lg">
                <GiSpy className="text-pink-400 text-xl" />
              </div>
              <h2 className="text-2xl font-semibold text-pink-100">Third Parties</h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <p>
                We work with trusted third-party services that adhere to strict privacy standards:
              </p>
              <ul className="space-y-2 pl-5 list-disc">
                <li>Firebase for authentication and database services</li>
                <li>Google Analytics for anonymous usage statistics</li>
                <li>Cloudflare for content delivery and security</li>
              </ul>
              <p>
                These services only receive the minimum data required to perform their functions.
              </p>
            </div>
          </motion.div>

        
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/30 backdrop-blur-sm"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-amber-600/20 rounded-lg">
                <FaDatabase className="text-amber-400 text-xl" />
              </div>
              <h2 className="text-2xl font-semibold text-amber-100">Your Rights</h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <p>
                You have full control over your personal data:
              </p>
              <ul className="space-y-2 pl-5 list-disc">
                <li>Right to access and download your data</li>
                <li>Right to request deletion of your data</li>
                <li>Right to correct inaccurate information</li>
                <li>Right to opt-out of data processing</li>
              </ul>
              <p>
                To exercise these rights, please contact our privacy team at privacy@cinematic.com.
              </p>
            </div>
          </motion.div>

          {/* Last updated */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center text-gray-500 text-sm"
          >
            Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </motion.div>
        </div>
      </motion.div>

    
      <div className="fixed top-1/4 left-10 -translate-y-1/2 w-40 h-40 bg-purple-600/10 rounded-full filter blur-3xl opacity-30 animate-float-slow z-0"></div>
      <div className="fixed bottom-1/3 right-10 translate-y-1/2 w-60 h-60 bg-amber-600/10 rounded-full filter blur-3xl opacity-30 animate-float-reverse-slow z-0"></div>

    
      <style jsx global>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-30px) translateX(20px); }
        }
        @keyframes float-reverse-slow {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(30px) translateX(-20px); }
        }
      `}</style>
    </div>
  );
}