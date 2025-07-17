import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import emailjs from "emailjs-com";
import {
  StarIcon,
  Film,
  Heart,
  Search,
  BarChart2,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const isLoggedIn = localStorage.getItem("token");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isLoggedIn) {
    return <Navigate to="/dashboard" />;
  }

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("Sending...");

    emailjs
      .send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formData,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          setStatus("Message sent successfully!");
          setFormData({ name: "", email: "", message: "" });
        },
        (err) => {
          console.error(err);
          setStatus("Failed to send message. Try again.");
        }
      );
  };
  const profileImages = [
    "https://randomuser.me/api/portraits/women/1.jpg",
    "https://randomuser.me/api/portraits/men/2.jpg",
    "https://randomuser.me/api/portraits/women/3.jpg",
    "https://randomuser.me/api/portraits/men/4.jpg",
    "https://randomuser.me/api/portraits/women/5.jpg",
  ];
  const features = [
    {
      icon: <Search className="w-8 h-8" />,
      title: "Mood-Based Search",
      desc: "Our AI understands emotions and recommends films that resonate with your current state of mind.",
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Personalized Collections",
      desc: "Curate watchlists that adapt to your evolving tastes and viewing history.",
    },
    {
      icon: <BarChart2 className="w-8 h-8" />,
      title: "Insightful Analytics",
      desc: "Discover your viewing patterns with beautiful data visualizations.",
    },
  ];

  const moods = [
    {
      name: "Euphoric",
      color: "from-yellow-400 to-amber-500",
      image:
        "https://images.saatchiart.com/saatchi/1504541/art/8541472/7605330-HSC00001-7.jpg",
    },
    {
      name: "Romantic",
      color: "from-pink-500 to-rose-600",
      image:
        "https://i.pinimg.com/736x/98/a1/93/98a19354e5a152e14df648bce1e28a5d.jpg",
    },
    {
      name: "Adventurous",
      color: "from-emerald-400 to-teal-600",
      image:
        "https://www.mensjournal.com/.image/t_share/MTk2MTM3MzIwNzEwMjg0ODA1/alex-honnold-jimmy-chin.jpg",
    },
    {
      name: "Thoughtful",
      color: "from-blue-400 to-indigo-600",
      image:
        "https://media.licdn.com/dms/image/v2/D4E12AQFHTwC2C_1xVQ/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1728212879699?e=2147483647&v=beta&t=BnU2zRirg_MU_ALfrSga-zB6QXsz0FthuOV428dtwE4",
    },
    {
      name: "Nostalgic",
      color: "from-purple-400 to-violet-600",
      image:
        "https://www.shutterstock.com/blog/wp-content/uploads/sites/5/2022/07/nostalgia-photos-cover.jpg?w=1250&h=1120&crop=1",
    },
    {
      name: "Thrilled",
      color: "from-red-500 to-orange-600",
      image:
        "https://www.shutterstock.com/image-photo/brutal-man-automatic-gun-his-600nw-2010947468.jpg",
    },
    {
      name: "Chilled",
      color: "from-cyan-400 to-sky-600",
      image: "https://wallpapercave.com/wp/wp9867122.jpg",
    },
    {
      name: "Whimsical",
      color: "from-fuchsia-400 to-purple-600",
      image:
        "https://www.slaphappylarry.com/wp-content/uploads/2020/04/Milo-Winter-1888-%E2%80%93-1956.jpg",
    },
  ];

  return (
    <div className="bg-gray-950 text-gray-100 font-sans antialiased">
      {/* Floating Navigation */}
      {/* <motion.nav 
        className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? "py-3 bg-gray-900/90 backdrop-blur-md border-b border-gray-800" : "py-5 bg-transparent"}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Film className="w-6 h-6 text-purple-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              MovieMood
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/features" className="text-gray-300 hover:text-white transition-colors">Features</Link>
            <Link to="/how-it-works" className="text-gray-300 hover:text-white transition-colors">How It Works</Link>
            <Link to="/pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</Link>
            <Link to="/about" className="text-gray-300 hover:text-white transition-colors">About</Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              to="/login" 
              className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
            >
              Sign In
            </Link>
            <Link 
              to="/register" 
              className="px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-purple-500/30"
            >
              Get Started
            </Link>
          </div>
        </div>
      </motion.nav> */}

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-950 to-black z-0" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://assets-global.website-files.com/5f16d3f9836eec5a40b7456/63f5d5b5f5e4e50a1b4a9a0e_hero-grid-pattern.svg')] bg-repeat opacity-50"></div>
        </div>

        {/* Floating movie frames */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-xl border border-gray-800/50 shadow-lg overflow-hidden"
            style={{
              width: `${Math.random() * 100 + 150}px`,
              height: `${Math.random() * 100 + 200}px`,
              left: `${Math.random() * 80 + 10}%`,
              top: `${Math.random() * 80 + 10}%`,
              rotate: `${Math.random() * 20 - 10}deg`,
            }}
            initial={{ opacity: 0, y: 50 }}
            animate={{
              opacity: 0.4,
              y: 0,
              transition: {
                duration: 1,
                delay: i * 0.2,
                repeat: Infinity,
                repeatType: "reverse",
                repeatDelay: 3,
                ease: "easeInOut",
              },
            }}
          >
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900"></div>
          </motion.div>
        ))}

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-800/50 border border-gray-700 mb-6">
                <span className="text-xs font-semibold tracking-wider text-purple-400 uppercase">
                  Now in beta
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-gray-100 via-gray-300 to-gray-400 bg-clip-text text-transparent leading-tight mb-6">
                Movies that <span className="text-white">feel right</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-10">
                Discover perfect films for your mood with our AI-powered
                recommendation engine.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Link
                to="/register"
                className="px-8 py-4 rounded-xl font-semibold text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/40 flex items-center justify-center space-x-2"
              >
                <span>Start Free Trial</span>
                <ChevronDown className="w-5 h-5 animate-bounce" />
              </Link>
              <Link
                to="/demo"
                className="px-8 py-4 rounded-xl font-semibold text-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 transition-all duration-300 shadow-lg flex items-center justify-center space-x-2"
              >
                <span>See How It Works</span>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="mt-16 flex items-center justify-center space-x-6 text-gray-500"
            >
              <div className="flex -space-x-2">
                {profileImages.map((src, i) => (
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
                    <StarIcon
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
                <span>Trusted by 50K+ cinephiles</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scrolling indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-8 h-12 border-2 border-gray-600 rounded-full flex justify-center items-start p-1">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-1"></div>
          </div>
        </motion.div>
      </section>

      {/* Logo Cloud */}
      <section className="py-16 bg-gray-900/50 border-y border-gray-800">
        <div className="container mx-auto px-6">
          <p className="text-center text-gray-500 text-sm uppercase tracking-wider mb-10">
            Featured in
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-8">
            {[
              "Netflix",
              "Variety",
              "IMDb",
              "Rotten Tomatoes",
              "The Verge",
              "IndieWire",
            ].map((brand, i) => (
              <motion.div
                key={i}
                className="text-gray-400 hover:text-white transition-colors text-2xl font-bold opacity-70 hover:opacity-100"
                whileHover={{ scale: 1.05 }}
              >
                {brand}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900/80 to-gray-950 z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.03)_0%,_transparent_70%)] z-0" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Elevate
              </span>{" "}
              your movie nights
            </motion.h2>
            <motion.p
              className="text-xl text-gray-400"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Intelligent features designed for true film enthusiasts
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className="w-14 h-14 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6 text-purple-400">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mood Explorer */}
      <section className="py-28 relative overflow-hidden bg-gradient-to-b from-gray-950 to-black">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://assets-global.website-files.com/5f16d3f9836eec5a40b7456/63f5d5b5f5e4e50a1b4a9a0e_hero-grid-pattern.svg')] bg-repeat opacity-50"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Find films for{" "}
              <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                every emotion
              </span>
            </motion.h2>
            <motion.p
              className="text-xl text-gray-400"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Our mood detection matches you with perfect cinematic experiences
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {moods.map((mood, i) => (
              <motion.div
                key={i}
                className="group relative overflow-hidden rounded-xl aspect-[3/4]"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
                <div className="absolute inset-0 bg-gradient-to-br via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />
                <img
                  src={mood.image}
                  alt={mood.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-0 left-0 p-6 z-30">
                  <h3 className="text-2xl font-bold text-white">{mood.name}</h3>
                  <p className="text-gray-300 text-sm mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {Math.floor(Math.random() * 50 + 50)} hand-picked films
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-28 relative overflow-hidden bg-gray-900/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(168,85,247,0.1)_0%,_transparent_70%)] z-0" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Loved by{" "}
              <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                film lovers
              </span>
            </motion.h2>
            <motion.p
              className="text-xl text-gray-400"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Don't just take our word for it
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, j) => (
                    <StarIcon
                      key={j}
                      className="w-5 h-5 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-300 mb-6">
                  "MovieMood completely changed how I discover films. The
                  mood-based recommendations are scarily accurate - it's like it
                  knows me better than I know myself!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden mr-4">
                    <img
                      src="https://media.istockphoto.com/id/1437816897/photo/business-woman-manager-or-human-resources-portrait-for-career-success-company-we-are-hiring.jpg?s=612x612&w=0&k=20&c=tyLvtzutRh22j9GqSGI33Z4HpIwv9vL_MZw_xOE19NQ="
                      alt="Profile"
                      className="h-full w-full object-cover object-center"
                    />
                  </div>

                  <div>
                    <h4 className="font-medium">Sarah J.</h4>
                    <p className="text-sm text-gray-500">Film Critic</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        <div className="absolute inset-0 bg-[url('https://assets-global.website-files.com/5f16d3f9836eec5a40b7456/63f5d5b5f5e4e50a1b4a9a0e_hero-grid-pattern.svg')] bg-repeat opacity-10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(168,85,247,0.15)_0%,_transparent_70%)] z-0"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Ready to transform{" "}
              <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                your movie nights?
              </span>
            </motion.h2>
            <motion.p
              className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Join thousands of cinephiles who never struggle to pick a movie
              again.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Link
                to="/register"
                className="px-8 py-4 rounded-xl font-semibold text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/40"
              >
                Start Your Free Trial
              </Link>
              <Link
                to="/demo"
                className="px-8 py-4 rounded-xl font-semibold text-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 transition-all duration-300 shadow-lg"
              >
                See Live Demo
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-900/50 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-10 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Get in touch
              </span>{" "}
              with us
            </motion.h2>

            <form
              onSubmit={handleSubmit}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-lg"
            >
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-semibold text-white transition-all duration-300 shadow-md hover:shadow-purple-500/30"
              >
                Send Message
              </button>
              {status && (
                <p
                  className={`mt-4 text-center ${
                    status.includes("success")
                      ? "text-green-400"
                      : "text-pink-400"
                  }`}
                >
                  {status}
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-6 md:mb-0">
              <Film className="w-6 h-6 text-purple-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                MovieMood
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-sm">
              <Link
                to="/privacy"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                to="/faq"
                className="text-gray-400 hover:text-white transition-colors"
              >
                FAQ
              </Link>
              <Link
                to="/blog"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Blog
              </Link>
              <Link
                to="/careers"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Careers
              </Link>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} MovieMood. All rights reserved.
            </p>
            <div className="flex space-x-6">
              {["Twitter", "Instagram", "Facebook", "LinkedIn"].map(
                (social, i) => (
                  <a
                    key={i}
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label={social}
                  >
                    {social}
                  </a>
                )
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
