import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import {
  Search,
  Heart,
  BarChart2,
  BookOpen,
  Users,
  Sparkles,
  Brain,
  Zap,
  Clock,
  Film,
  Target,
  Palette,
  Star,
  TrendingUp,
  Play
} from 'lucide-react';

// Light Theme Styles
const lightStyles = `
  .features-page {
    background: #fdfbf9;
    min-height: 100vh;
    padding-top: 80px;
  }

  .features-hero {
    padding: 80px 20px;
    text-align: center;
    background: linear-gradient(180deg, #fdfbf9 0%, #fef5f0 50%, #faf5ff 100%);
  }

  .features-hero-title {
    font-size: clamp(2.5rem, 5vw, 3.5rem);
    font-weight: 700;
    color: #1a1a2e;
    line-height: 1.2;
    margin-bottom: 1rem;
  }

  .features-hero-subtitle {
    font-size: 1.25rem;
    color: #64748b;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.7;
  }

  .accent-text {
    background: linear-gradient(135deg, #7c3aed, #ec4899);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .features-section {
    padding: 80px 20px;
    background: #fdfbf9;
  }

  .features-section-alt {
    padding: 80px 20px;
    background: linear-gradient(180deg, #faf8f6 0%, #fdfbf9 100%);
  }

  .section-header {
    text-align: center;
    max-width: 700px;
    margin: 0 auto 60px;
  }

  .section-title {
    font-size: clamp(2rem, 4vw, 2.75rem);
    font-weight: 700;
    color: #1a1a2e;
    line-height: 1.2;
    margin-bottom: 1rem;
  }

  .section-subtitle {
    font-size: 1.125rem;
    color: #64748b;
    line-height: 1.7;
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .feature-card {
    background: white;
    border-radius: 20px;
    padding: 32px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
    border: 1px solid rgba(0, 0, 0, 0.04);
    transition: all 0.3s ease;
  }

  .feature-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
  }

  .feature-icon-wrapper {
    width: 64px;
    height: 64px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
  }

  .feature-icon-wrapper.purple {
    background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
  }

  .feature-icon-wrapper.pink {
    background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%);
  }

  .feature-icon-wrapper.blue {
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  }

  .feature-icon-wrapper.orange {
    background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
  }

  .feature-icon-wrapper.green {
    background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  }

  .feature-icon-wrapper.amber {
    background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  }

  .feature-icon-wrapper svg {
    width: 28px;
    height: 28px;
  }

  .feature-icon-wrapper.purple svg { color: #7c3aed; }
  .feature-icon-wrapper.pink svg { color: #ec4899; }
  .feature-icon-wrapper.blue svg { color: #3b82f6; }
  .feature-icon-wrapper.orange svg { color: #f97316; }
  .feature-icon-wrapper.green svg { color: #10b981; }
  .feature-icon-wrapper.amber svg { color: #f59e0b; }

  .feature-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1a1a2e;
    margin-bottom: 12px;
  }

  .feature-desc {
    font-size: 0.9375rem;
    color: #64748b;
    line-height: 1.6;
  }

  .feature-stats {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 16px;
    padding: 6px 12px;
    background: #f8fafc;
    border-radius: 20px;
    font-size: 0.8125rem;
    color: #64748b;
  }

  .feature-stats svg {
    width: 14px;
    height: 14px;
    color: #10b981;
  }

  /* Stats Section */
  .stats-section {
    padding: 60px 20px;
    background: linear-gradient(135deg, #faf5ff 0%, #fdf2f8 50%, #fef5f0 100%);
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    max-width: 1000px;
    margin: 0 auto;
  }

  .stat-card {
    text-align: center;
    padding: 24px;
  }

  .stat-value {
    font-size: 2.5rem;
    font-weight: 700;
    color: #7c3aed;
    line-height: 1;
    margin-bottom: 8px;
  }

  .stat-label {
    font-size: 0.9375rem;
    color: #64748b;
  }

  /* CTA Section */
  .cta-section {
    padding: 100px 20px;
    text-align: center;
    background: linear-gradient(135deg, #faf5ff 0%, #fdf2f8 50%, #fef5f0 100%);
  }

  .cta-title {
    font-size: clamp(2rem, 4vw, 2.75rem);
    font-weight: 700;
    color: #1a1a2e;
    margin-bottom: 1rem;
  }

  .cta-subtitle {
    font-size: 1.125rem;
    color: #64748b;
    margin-bottom: 2rem;
  }

  .cta-buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.875rem 2rem;
    background: #7c3aed;
    color: white;
    font-weight: 600;
    font-size: 1rem;
    border-radius: 9999px;
    text-decoration: none;
    transition: all 0.3s ease;
    box-shadow: 0 4px 14px rgba(124, 58, 237, 0.35);
  }

  .btn-primary:hover {
    background: #6d28d9;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(124, 58, 237, 0.4);
  }

  .btn-secondary {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.875rem 2rem;
    background: white;
    color: #1a1a2e;
    font-weight: 600;
    font-size: 1rem;
    border-radius: 9999px;
    text-decoration: none;
    border: 1.5px solid #e2e8f0;
    transition: all 0.3s ease;
  }

  .btn-secondary:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
    transform: translateY(-2px);
  }

  @media (max-width: 1024px) {
    .features-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 640px) {
    .features-grid {
      grid-template-columns: 1fr;
    }
    .stats-grid {
      grid-template-columns: 1fr 1fr;
    }
  }
`;

const Features = () => {
  const mainFeatures = [
    {
      icon: <Brain />,
      title: "Mood AI Detection",
      desc: "Our smart algorithm learns your emotional patterns to suggest perfect films for your current state of mind.",
      color: "purple",
      stats: "98% accuracy"
    },
    {
      icon: <Search />,
      title: "Smart Search",
      desc: "Find movies by mood, genre, era, or even specific scenes. Our search understands natural language.",
      color: "blue",
      stats: "1M+ movies indexed"
    },
    {
      icon: <Heart />,
      title: "Personalized Collections",
      desc: "Curate watchlists that adapt to your evolving tastes and viewing history over time.",
      color: "pink",
      stats: "500K+ collections"
    },
    {
      icon: <BarChart2 />,
      title: "Viewing Analytics",
      desc: "Discover your viewing patterns with beautiful data visualizations and insights.",
      color: "orange",
      stats: "50+ metrics"
    },
    {
      icon: <BookOpen />,
      title: "Movie Diary",
      desc: "Track every movie you watch, record your thoughts, ratings, and emotional journey.",
      color: "green",
      stats: "10M+ entries"
    },
    {
      icon: <Users />,
      title: "Community Picks",
      desc: "Discover what others with similar tastes are watching and share your favorites.",
      color: "amber",
      stats: "200K+ users"
    },
  ];

  const advancedFeatures = [
    {
      icon: <Sparkles />,
      title: "AI Recommendations",
      desc: "Get personalized suggestions based on your mood, time of day, and viewing history.",
      color: "purple"
    },
    {
      icon: <Target />,
      title: "Mood Matching",
      desc: "Tell us how you feel, and we'll find the perfect movie to match or change your mood.",
      color: "pink"
    },
    {
      icon: <Clock />,
      title: "Watch Time Optimization",
      desc: "Get suggestions based on how much time you have available to watch.",
      color: "blue"
    },
    {
      icon: <Palette />,
      title: "Visual Themes",
      desc: "Customize your experience with beautiful themes that match your personality.",
      color: "orange"
    },
    {
      icon: <Zap />,
      title: "Quick Picks",
      desc: "Can't decide? Get instant recommendations with our one-tap quick pick feature.",
      color: "amber"
    },
    {
      icon: <Star />,
      title: "Curated Lists",
      desc: "Access hand-picked collections curated by film experts and critics.",
      color: "green"
    },
  ];

  const stats = [
    { value: "1M+", label: "Movies Indexed" },
    { value: "200K+", label: "Active Users" },
    { value: "98%", label: "Match Accuracy" },
    { value: "50+", label: "Mood Categories" },
  ];

  return (
    <>
      <style>{lightStyles}</style>
      <div className="features-page">
        {/* Hero Section */}
        <section className="features-hero">
          <motion.h1
            className="features-hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Powerful Features for<br /><span className="accent-text">Movie Discovery</span>
          </motion.h1>
          <motion.p
            className="features-hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Everything you need to discover, track, and enjoy movies that perfectly match your mood.
          </motion.p>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="stats-grid">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                className="stat-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Main Features */}
        <section className="features-section">
          <div className="section-header">
            <motion.h2
              className="section-title"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Core <span className="accent-text">Features</span>
            </motion.h2>
            <motion.p
              className="section-subtitle"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              The essential tools that make MovieMood your perfect movie companion
            </motion.p>
          </div>

          <div className="features-grid">
            {mainFeatures.map((feature, i) => (
              <motion.div
                key={i}
                className="feature-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className={`feature-icon-wrapper ${feature.color}`}>
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.desc}</p>
                <div className="feature-stats">
                  <TrendingUp />
                  <span>{feature.stats}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Advanced Features */}
        <section className="features-section-alt">
          <div className="section-header">
            <motion.h2
              className="section-title"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Advanced <span className="accent-text">Capabilities</span>
            </motion.h2>
            <motion.p
              className="section-subtitle"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Take your movie experience to the next level
            </motion.p>
          </div>

          <div className="features-grid">
            {advancedFeatures.map((feature, i) => (
              <motion.div
                key={i}
                className="feature-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className={`feature-icon-wrapper ${feature.color}`}>
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <motion.h2
            className="cta-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Ready to Get Started?
          </motion.h2>
          <motion.p
            className="cta-subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Join thousands of movie lovers discovering films that match their mood.
          </motion.p>
          <motion.div
            className="cta-buttons"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link to="/register" className="btn-primary">
              Start Free Trial
            </Link>
            <Link to="/demo" className="btn-secondary">
              <Play className="w-4 h-4" />
              Watch Demo
            </Link>
          </motion.div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};

export default Features;