import React from "react";
import { motion } from "framer-motion";
import { FaGavel, FaBalanceScale, FaShieldAlt, FaUserLock, FaFileContract } from "react-icons/fa";
import { GiScrollQuill, GiJusticeStar } from "react-icons/gi";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100 px-4 py-16 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Gradient mesh */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute w-[1500px] h-[1500px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/30 via-transparent to-transparent -top-1/2 -left-1/2 animate-float-slow"></div>
          <div className="absolute w-[1200px] h-[1200px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/20 via-transparent to-transparent -bottom-1/3 -right-1/3 animate-float-reverse-slow"></div>
        </div>
        
        {/* Floating particles */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            initial={{
              opacity: 0,
              scale: 0.5,
              x: Math.random() * 100,
              y: Math.random() * 100
            }}
            animate={{
              opacity: [0, 0.8, 0],
              scale: [0.5, 1.2, 0.5],
              x: Math.random() * 100,
              y: Math.random() * 100
            }}
            transition={{
              duration: 10 + Math.random() * 20,
              repeat: Infinity,
              repeatType: "reverse",
              delay: Math.random() * 5
            }}
            style={{
              width: `${Math.random() * 5 + 2}px`,
              height: `${Math.random() * 5 + 2}px`,
              background: `rgba(255, 255, 255, ${Math.random() * 0.5})`,
              boxShadow: `0 0 ${Math.random() * 15 + 5}px ${Math.random() * 5 + 2}px rgba(255, 255, 255, 0.5)`
            }}
          />
        ))}
      </div>

      {/* Main content container */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-5xl mx-auto relative z-10 bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 shadow-2xl shadow-purple-500/20 rounded-3xl p-8 sm:p-10 overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/10 rounded-full filter blur-xl"></div>
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-indigo-500/10 rounded-full filter blur-xl"></div>
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex p-5 rounded-xl bg-gradient-to-br from-indigo-900/30 to-purple-900/30 mb-6 border border-indigo-500/20"
          >
            <GiScrollQuill className="text-5xl text-indigo-400" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 text-transparent bg-clip-text mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            The legal agreement between you and Cinematic. Please read carefully.
          </p>
        </div>

        {/* Terms sections */}
        <div className="space-y-12">
          {/* Section 1 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800/50 rounded-xl p-8 border border-gray-700/30 backdrop-blur-sm relative overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-indigo-500/10 rounded-full filter blur-lg"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-5 mb-6">
                <div className="p-4 bg-indigo-600/20 rounded-xl border border-indigo-500/20">
                  <FaFileContract className="text-indigo-400 text-2xl" />
                </div>
                <h2 className="text-2xl font-semibold text-indigo-100">Acceptance of Terms</h2>
              </div>
              <div className="space-y-4 text-gray-300 pl-20">
                <p>
                  By accessing or using the Cinematic service, you agree to be bound by these Terms of Service. 
                  If you disagree with any part of the terms, you may not access the service.
                </p>
                <p>
                  We reserve the right to modify these terms at any time. Your continued use of the service 
                  constitutes acceptance of those changes.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Section 2 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800/50 rounded-xl p-8 border border-gray-700/30 backdrop-blur-sm relative overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-purple-500/10 rounded-full filter blur-lg"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-5 mb-6">
                <div className="p-4 bg-purple-600/20 rounded-xl border border-purple-500/20">
                  <FaUserLock className="text-purple-400 text-2xl" />
                </div>
                <h2 className="text-2xl font-semibold text-purple-100">User Responsibilities</h2>
              </div>
              <div className="space-y-4 text-gray-300 pl-20">
                <p>
                  You agree to use the service only for lawful purposes and in accordance with these Terms.
                </p>
                <ul className="space-y-3 pl-5 list-disc">
                  <li>You must be at least 13 years old to use this service</li>
                  <li>You are responsible for maintaining the confidentiality of your account</li>
                  <li>You agree not to engage in unauthorized use, copying, or distribution of content</li>
                  <li>You will not use the service to violate any laws or infringe on others' rights</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Section 3 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-800/50 rounded-xl p-8 border border-gray-700/30 backdrop-blur-sm relative overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-pink-500/10 rounded-full filter blur-lg"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-5 mb-6">
                <div className="p-4 bg-pink-600/20 rounded-xl border border-pink-500/20">
                  <FaShieldAlt className="text-pink-400 text-2xl" />
                </div>
                <h2 className="text-2xl font-semibold text-pink-100">Intellectual Property</h2>
              </div>
              <div className="space-y-4 text-gray-300 pl-20">
                <p>
                  The service and its original content, features, and functionality are owned by Cinematic 
                  and are protected by international copyright, trademark, and other intellectual property laws.
                </p>
                <p>
                  You may not modify, publish, transmit, reverse engineer, or create derivative works 
                  from any portion of the service without express written permission.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Section 4 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-800/50 rounded-xl p-8 border border-gray-700/30 backdrop-blur-sm relative overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-amber-500/10 rounded-full filter blur-lg"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-5 mb-6">
                <div className="p-4 bg-amber-600/20 rounded-xl border border-amber-500/20">
                  <FaGavel className="text-amber-400 text-2xl" />
                </div>
                <h2 className="text-2xl font-semibold text-amber-100">Limitation of Liability</h2>
              </div>
              <div className="space-y-4 text-gray-300 pl-20">
                <p>
                  In no event shall Cinematic, nor its directors, employees, partners, agents, suppliers, 
                  or affiliates, be liable for any indirect, incidental, special, consequential or punitive 
                  damages resulting from your use of the service.
                </p>
                <p>
                  We do not warrant that the service will be uninterrupted, timely, secure, or error-free.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Section 5 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gray-800/50 rounded-xl p-8 border border-gray-700/30 backdrop-blur-sm relative overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-blue-500/10 rounded-full filter blur-lg"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-5 mb-6">
                <div className="p-4 bg-blue-600/20 rounded-xl border border-blue-500/20">
                  <GiJusticeStar className="text-blue-400 text-2xl" />
                </div>
                <h2 className="text-2xl font-semibold text-blue-100">Governing Law</h2>
              </div>
              <div className="space-y-4 text-gray-300 pl-20">
                <p>
                  These Terms shall be governed and construed in accordance with the laws of the State of 
                  California, United States, without regard to its conflict of law provisions.
                </p>
                <p>
                  Any disputes arising from these Terms will be resolved through binding arbitration in 
                  San Francisco, California, rather than in court.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Section 6 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gray-800/50 rounded-xl p-8 border border-gray-700/30 backdrop-blur-sm relative overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-emerald-500/10 rounded-full filter blur-lg"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-5 mb-6">
                <div className="p-4 bg-emerald-600/20 rounded-xl border border-emerald-500/20">
                  <FaBalanceScale className="text-emerald-400 text-2xl" />
                </div>
                <h2 className="text-2xl font-semibold text-emerald-100">Changes to Terms</h2>
              </div>
              <div className="space-y-4 text-gray-300 pl-20">
                <p>
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
                  If a revision is material, we will provide at least 30 days' notice prior to any new terms 
                  taking effect.
                </p>
                <p>
                  By continuing to access or use our service after those revisions become effective, you agree 
                  to be bound by the revised terms.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Last updated */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center text-gray-500 text-sm pt-8 border-t border-gray-800/50"
          >
            Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </motion.div>
        </div>
      </motion.div>

      {/* Floating decorative elements */}
      <div className="fixed top-1/4 left-10 -translate-y-1/2 w-40 h-40 bg-purple-600/10 rounded-full filter blur-3xl opacity-30 animate-float-slow z-0"></div>
      <div className="fixed bottom-1/3 right-10 translate-y-1/2 w-60 h-60 bg-amber-600/10 rounded-full filter blur-3xl opacity-30 animate-float-reverse-slow z-0"></div>

      {/* Animation keyframes */}
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