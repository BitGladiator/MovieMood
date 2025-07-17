import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";

import emailjs from "emailjs-com";
import { StarIcon } from "lucide-react";

export default function Home() {
  const isLoggedIn = localStorage.getItem("token"); // or use context/auth state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("");
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

  return (
    <div className="text-white bg-gradient-to-br from-black via-gray-900 to-gray-800 font-sans">
      {/* Hero Section */}

      <section className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center px-6 py-16">
        {/* VIGNETTE OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900/80 to-black z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.05)_0%,_transparent_70%)] z-0 pointer-events-none" />

        {/* POSTER WALL (LAYERED) */}
        <div className="absolute top-0 left-0 w-full h-full z-0 grid grid-cols-4 gap-6 opacity-10 blur-[2px] p-10 pointer-events-none">
          {[
            "https://i1.wp.com/www.shutterstock.com/blog/wp-content/uploads/sites/5/2024/03/Dune-movie-poster.jpg?ssl=1",
            "https://cdn.prod.website-files.com/6009ec8cda7f305645c9d91b/66a4263d01a185d5ea22eeec_6408f6e7b5811271dc883aa8_batman-min.png",
            "https://www.washingtonpost.com/graphics/2019/entertainment/oscar-nominees-movie-poster-design/img/black-panther-web.jpg",
            "https://cdn11.bigcommerce.com/s-ydriczk/images/stencil/1500x1500/products/90301/98769/the-creator-original-movie-poster-one-sheet-final-style-buy-now-at-starstills__81077.1697644483.jpg?c=2",
          ]
            .flatMap((url) => [url, url]) // duplicate to fill wall
            .map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`poster-${i}`}
                className="w-full h-full object-cover rounded-lg shadow-xl"
              />
            ))}
        </div>

        {/* MAIN CONTENT */}
        <div className="relative z-10 text-center max-w-3xl">
          {/* Logo + Title */}
          <div className="flex flex-col items-center justify-center space-y-4">
            {/* <img
              src="/Blue_White_Modern_Simple_Film_Production_Logo-removebg-preview.png"
              alt="MovieMood Logo"
              className="w-28 md:w-36 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            /> */}
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent tracking-tight drop-shadow-lg">
              Welcome to MovieMood
            </h1>
          </div>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-gray-300 mt-4 italic max-w-xl mx-auto">
            <span className="border-b-2 border-purple-500 pb-1">
              Smart film picks
            </span>{" "}
            tailored to your vibe.
          </p>

          {/* CTA BUTTONS */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-5">
            <Link
              to="/register"
              className="px-8 py-3 rounded-xl font-semibold text-lg bg-white/10 backdrop-blur-md border border-white/30 hover:bg-white/20 hover:shadow-[0_0_20px_rgba(192,132,252,0.6)] transition duration-300"
            >
              🎬 Try Free for 30 Days
            </Link>
            <Link
              to="/login"
              className="px-8 py-3 rounded-xl font-semibold text-lg border border-white/20 hover:border-white/40 hover:shadow-md transition duration-300"
            >
              Sign In
            </Link>
          </div>

          {/* Marquee */}
          <div className="mt-12 w-full overflow-hidden relative">
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black to-transparent z-10" />
            <div className="flex animate-marquee whitespace-nowrap">
              {[
                "🔥 Trending Now",
                "Dune: Part Two",
                "Oppenheimer",
                "The Batman",
                "Everything Everywhere All at Once",
                "Top Gun: Maverick",
              ].map((item, i) => (
                <span
                  key={i}
                  className="text-gray-400 mx-6 text-lg font-medium hover:text-white transition"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* SCROLL INDICATOR */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
          <div className="animate-bounce w-6 h-10 border-2 border-gray-500 rounded-full flex justify-center items-start p-1">
            <div className="w-1 h-2 bg-gray-400 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* About Us */}
      <section className="py-24 px-6 text-center bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto z-10 relative">
          <h2 className="text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 drop-shadow-md">
            Discover Movies That Match Your Mood
          </h2>

          <p className="text-lg text-gray-300 mb-8 leading-relaxed">
            At <span className="font-semibold text-white">MovieMood</span>, we
            believe movies are more than entertainment — they’re emotional
            journeys. Whether you're feeling nostalgic, adventurous,
            heartbroken, or just bored, our AI-powered platform finds the
            perfect film for your vibe.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-sm sm:text-base text-gray-300">
            <div className="bg-white/5 border border-white/10 backdrop-blur-sm px-6 py-4 rounded-xl shadow-lg hover:shadow-purple-500/20 transition">
              Over{" "}
              <span className="font-bold text-white">
                10,000+ curated titles
              </span>
            </div>
            <div className="bg-white/5 border border-white/10 backdrop-blur-sm px-6 py-4 rounded-xl shadow-lg hover:shadow-purple-500/20 transition">
              {" "}
              <span className="font-bold text-white">
                AI-powered mood detection
              </span>
            </div>
            <div className="bg-white/5 border border-white/10 backdrop-blur-sm px-6 py-4 rounded-xl shadow-lg hover:shadow-purple-500/20 transition">
              {" "}
              <span className="font-bold text-white">
                Trusted by 50K+ movie lovers
              </span>
            </div>
            <div className="bg-white/5 border border-white/10 backdrop-blur-sm px-6 py-4 rounded-xl shadow-lg hover:shadow-purple-500/20 transition">
              Personalized for{" "}
              <span className="font-bold text-white">
                every mood, genre, and region
              </span>
            </div>
          </div>
        </div>

        {/* Soft glowing backdrop */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[80vw] h-[60vh] bg-purple-500/10 rounded-full blur-[120px] z-0"></div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-gradient-to-b from-gray-800 via-black to-gray-900 text-center text-white relative overflow-hidden">
        <h2 className="text-5xl font-extrabold mb-14 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 drop-shadow-md">
          Experience Next-Level Movie Discovery
        </h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto z-10 relative">
          {[
            {
              icon: "🎭",
              title: "Mood-Based Search",
              desc: "Feeling happy, nostalgic, or just mellow? Let your mood guide your movie journey with our emotion-aware algorithm.",
            },
            {
              icon: "⭐",
              title: "Watchlist & Favorites",
              desc: "Curate your own movie universe — save titles, mark favorites, and build the ultimate watchlist.",
            },
            {
              icon: "📊",
              title: "Smart Stats & Insights",
              desc: "Track your viewing trends, genre preferences, and discover what kind of movie buff you really are.",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="group relative bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 hover:border-purple-500 shadow-lg hover:shadow-purple-700/30 transition-all duration-300"
            >
              <div className="text-5xl mb-5 transition-transform duration-300 group-hover:scale-110 drop-shadow-sm">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-semibold text-indigo-200 mb-3 tracking-tight">
                {feature.title}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {feature.desc}
              </p>

              {/* Glow ring */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/10 via-transparent to-indigo-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Soft ambient glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[80vw] h-[40vh] bg-purple-500/10 rounded-full blur-[120px] z-0"></div>
      </section>

      {/* Mood Grid */}
      <section className="py-24 px-6 bg-gradient-to-b from-black via-gray-900 to-black text-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h2 className="text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-400">
            Explore by Mood
          </h2>
          <p className="text-gray-400 mb-14 text-lg max-w-xl mx-auto">
            Whether you're feeling upbeat, chill, or in the mood for a scare —
            discover films that match your vibe instantly.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => {
              const moods = [
                "Happy",
                "Romantic",
                "Adventurous",
                "Thrilling",
                "Mysterious",
                "Scary",
                "Chill",
                "Animated",
              ];
              const mood = moods[i];
              const img = [
                "https://imageio.forbes.com/specials-images/imageserve/67a8c84d705931ff13bba70a/960x0.jpg",
                "https://a.storyblok.com/f/112937/568x464/88ccff84c5/10_most_romantic_cities_hero-1.jpg",
                "https://static.wixstatic.com/media/44afc8_731e38d2c15143c0a8a61e295e7cca48~mv2.jpg",
                "https://variety.com/wp-content/uploads/2025/06/Yanuni.jpg?w=1000&h=667&crop=1",
                "https://static.vecteezy.com/system/resources/thumbnails/023/435/978/small_2x/mysterious-man-wearing-black-hoodie-standing-against-dark-background-hacker-crime-and-cyber-security-concept-photo.jpg",
                "https://t3.ftcdn.net/jpg/04/51/92/42/360_F_451924229_keUXrv7zEK4xiXqi7WdYVKYv9dTd8wR5.jpg",
                "https://asiaiplaw.com/storage/media/image/article/7eb532aef980c36170c0b4426f082b87/banner/939314105ce8701e67489642ef4d49e8/conversions/Picture1-extra_large.jpg",
                "https://hips.hearstapps.com/hmg-prod/images/index-bestanimated-1658187303.jpg",
              ][i];
              return (
                <div
                  key={mood}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 backdrop-blur-sm hover:border-purple-500 transition-all shadow-lg hover:shadow-purple-600/30"
                >
                  <img
                    src={img}
                    alt={mood}
                    className="w-full h-64 object-cover filter brightness-[0.7] group-hover:brightness-100 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent flex items-end p-4">
                    <h3 className="text-xl font-semibold text-indigo-200 group-hover:text-white transition duration-300">
                      {mood}
                    </h3>
                  </div>
                  {/* Glow ring */}
                  <div className="absolute inset-0 rounded-2xl bg-purple-500/10 blur-xl opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none"></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ambient Light Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[60vh] bg-purple-500/10 rounded-full blur-[120px] z-0"></div>
      </section>

      {/* Contact */}
      <section className="relative py-24 px-6 bg-gradient-to-b from-gray-900 to-black text-white overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] bg-indigo-500/10 blur-[150px] z-0"></div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-400 mb-6">
            Contact Us
          </h2>
          <p className="text-gray-400 mb-12 text-lg">
            Have questions, feedback, or just want to say hi? We’d love to hear
            from you.
          </p>

          <form
            className="space-y-6 text-left bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10 shadow-lg"
            onSubmit={handleSubmit}
          >
            <div>
              <label className="block mb-2 text-sm text-indigo-200">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm text-indigo-200">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm text-indigo-200">
                Message
              </label>
              <textarea
                name="message"
                rows="5"
                placeholder="Write your message..."
                value={formData.message}
                onChange={handleChange}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition duration-300 rounded-lg font-semibold text-white shadow-md hover:shadow-indigo-500/30"
            >
               Send Message
            </button>

            {status && (
              <p className="text-indigo-300 mt-4 text-sm text-center animate-fade-in">
                {status}
              </p>
            )}
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} MovieMood. All rights reserved.
      </footer>
    </div>
  );
}
