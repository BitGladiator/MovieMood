import React, { useState } from "react";
import { Link } from "react-router-dom";
import emailjs from "emailjs-com";

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("");

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
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative overflow-hidden bg-black">
        <div className="absolute w-96 h-96 bg-pink-500 rounded-full opacity-20 filter blur-3xl animate-blob top-20 left-10 z-0"></div>
        <div className="absolute w-96 h-96 bg-indigo-500 rounded-full opacity-20 filter blur-3xl animate-blob animation-delay-2000 top-64 right-0 z-0"></div>
        <div className="absolute w-96 h-96 bg-purple-600 rounded-full opacity-20 filter blur-3xl animate-blob animation-delay-4000 bottom-0 left-1/3 z-0"></div>

        <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 text-transparent bg-clip-text z-10 animate-fade-in-up">
          Welcome to MovieMood
        </h1>

        <p className="text-lg md:text-2xl text-gray-300 mt-4 max-w-2xl z-10 animate-fade-in">
          Discover and track movies by your mood — smart, personal, and fun.
        </p>

        <div className="mt-10 flex gap-6 z-10">
          <Link
            to="/register"
            className="bg-indigo-600 hover:bg-indigo-700 hover:scale-105 transition transform duration-300 text-white px-6 py-3 rounded-full text-lg shadow-md"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="bg-white text-black hover:bg-gray-200 hover:scale-105 transition transform duration-300 px-6 py-3 rounded-full text-lg shadow-md"
          >
            Login
          </Link>
        </div>
      </section>

      {/* About Us */}
      <section className="py-20 px-6 text-center bg-gray-900">
        <h2 className="text-4xl font-bold mb-4 text-indigo-300">About Us</h2>
        <p className="text-gray-400 max-w-3xl mx-auto">
          MovieMood was born out of a love for cinema and emotions. We believe
          movies are more than genres — they’re experiences. This app helps you
          discover films that resonate with how you feel right now.
        </p>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-gradient-to-b from-gray-800 to-black text-center">
        <h2 className="text-4xl font-bold mb-10 text-indigo-300">Features</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {["🎭", "⭐", "📊"].map((icon, i) => (
            <div
              key={i}
              className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 shadow hover:shadow-xl transition"
            >
              <div className="text-4xl mb-4">{icon}</div>
              <h3 className="text-xl font-semibold text-indigo-200 mb-2">
                {
                  [
                    "Mood-Based Search",
                    "Watchlist & Favorites",
                    "Track Your Stats",
                  ][i]
                }
              </h3>
              <p className="text-gray-400 text-sm">
                {
                  [
                    "Find movies that match your current mood — sad, happy, excited, or chill.",
                    "Easily save movies you want to watch or love the most.",
                    "See how many movies you've watched and explore your top genres.",
                  ][i]
                }
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Mood Grid */}
      <section className="py-20 bg-black text-white px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-indigo-400 mb-6">
            Explore by Mood 🎭
          </h2>
          <p className="text-gray-400 mb-12">
            Discover movies based on your current mood. Pick a vibe and dive in.
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
                  className="group relative overflow-hidden rounded-xl shadow-lg transform hover:scale-105 transition"
                >
                  <img
                    src={img}
                    alt={mood}
                    className="w-full h-64 object-cover filter brightness-75 group-hover:brightness-100 transition"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex items-end">
                    <h3 className="text-lg font-semibold text-indigo-200">
                      {mood}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 px-6 bg-gradient-to-b from-gray-900 to-black text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-indigo-400 mb-4">
            Contact Us
          </h2>
          <p className="text-gray-400 mb-10">
            Have questions, feedback, or just want to say hi? Drop us a message
            below!
          </p>

          <form className="space-y-6 text-left" onSubmit={handleSubmit}>
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
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 transition duration-300 rounded-lg font-semibold text-white"
            >
              Send Message
            </button>
            {status && (
              <p className="text-indigo-300 mt-4 text-sm text-center">
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
