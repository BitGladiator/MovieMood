import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Film,
  Search,
  Heart,
  Play,
  Sparkles,
  Brain,
  BarChart2,
  BookOpen,
  ArrowRight,
  Check,
  Users,
  Clock
} from 'lucide-react';

const lightStyles = `
  .howitworks-page {
    background: #fdfbf9;
    min-height: 100vh;
    padding-top: 80px;
  }

  .howitworks-hero {
    padding: 80px 20px;
    text-align: center;
    background: linear-gradient(180deg, #fdfbf9 0%, #fef5f0 50%, #faf5ff 100%);
  }

  .hero-title {
    font-size: clamp(2.5rem, 5vw, 3.5rem);
    font-weight: 700;
    color: #1a1a2e;
    line-height: 1.2;
    margin-bottom: 1rem;
  }

  .hero-subtitle {
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

  .steps-section {
    padding: 80px 20px;
    background: #fdfbf9;
    max-width: 1000px;
    margin: 0 auto;
  }

  .step-item {
    display: flex;
    gap: 40px;
    margin-bottom: 60px;
    align-items: flex-start;
  }

  .step-item:last-child {
    margin-bottom: 0;
  }

  .step-number {
    flex-shrink: 0;
    width: 64px;
    height: 64px;
    border-radius: 20px;
    background: linear-gradient(135deg, #7c3aed, #ec4899);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: 700;
    color: white;
  }

  .step-content {
    flex: 1;
  }

  .step-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1a1a2e;
    margin-bottom: 12px;
  }

  .step-desc {
    font-size: 1.0625rem;
    color: #64748b;
    line-height: 1.7;
    margin-bottom: 20px;
  }

  .step-features {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  .step-feature {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: white;
    border-radius: 10px;
    font-size: 0.875rem;
    color: #374151;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }

  .step-feature svg {
    width: 16px;
    height: 16px;
    color: #10b981;
  }

  .step-image {
    flex-shrink: 0;
    width: 300px;
    height: 200px;
    border-radius: 16px;
    background: linear-gradient(135deg, #faf5ff 0%, #fdf2f8 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  }

  .step-image svg {
    width: 64px;
    height: 64px;
    color: #7c3aed;
  }

  /* Features Grid Section */
  .features-section {
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
    max-width: 1000px;
    margin: 0 auto;
  }

  .feature-card {
    background: white;
    border-radius: 20px;
    padding: 32px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
    border: 1px solid rgba(0, 0, 0, 0.04);
    text-align: center;
    transition: all 0.3s ease;
  }

  .feature-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
  }

  .feature-icon {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
  }

  .feature-icon svg {
    width: 24px;
    height: 24px;
    color: #7c3aed;
  }

  .feature-title {
    font-size: 1.125rem;
    font-weight: 700;
    color: #1a1a2e;
    margin-bottom: 8px;
  }

  .feature-desc {
    font-size: 0.9375rem;
    color: #64748b;
    line-height: 1.6;
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
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
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

  @media (max-width: 900px) {
    .step-item {
      flex-direction: column;
    }
    .step-image {
      width: 100%;
      order: -1;
    }
    .features-grid {
      grid-template-columns: 1fr;
    }
  }
`;

const HowitWorks = () => {
  const steps = [
    {
      number: "1",
      title: "Tell Us How You Feel",
      desc: "Start by sharing your current mood. Whether you're feeling adventurous, romantic, nostalgic, or need something to lift your spirits - we've got you covered.",
      icon: <Brain />,
      features: ["8+ mood categories", "Natural language input", "Quick mood picker"]
    },
    {
      number: "2",
      title: "Get Personalized Recommendations",
      desc: "Our AI analyzes your mood, viewing history, and preferences to suggest movies that are perfect for right now. Each recommendation is tailored just for you.",
      icon: <Sparkles />,
      features: ["AI-powered matching", "Learns your taste", "98% satisfaction rate"]
    },
    {
      number: "3",
      title: "Watch & Track",
      desc: "Enjoy your movie and keep track of everything you watch. Rate films, write reviews, and build your personal movie diary. Your viewing journey, documented.",
      icon: <Play />,
      features: ["Movie diary", "Personal ratings", "Watch history"]
    },
    {
      number: "4",
      title: "Discover & Explore",
      desc: "Dive deeper into curated collections, explore trending films, and discover hidden gems. The more you watch, the better our recommendations become.",
      icon: <Search />,
      features: ["Curated collections", "Trending films", "Hidden gems"]
    }
  ];

  const features = [
    { icon: <Brain />, title: "Smart AI", desc: "Learns your preferences over time" },
    { icon: <Heart />, title: "Mood Matching", desc: "Perfect movies for every feeling" },
    { icon: <BarChart2 />, title: "Analytics", desc: "Insights into your viewing habits" },
    { icon: <BookOpen />, title: "Movie Diary", desc: "Track and remember every film" },
    { icon: <Users />, title: "Community", desc: "Connect with fellow movie lovers" },
    { icon: <Clock />, title: "Time-Based", desc: "Suggestions based on available time" },
  ];

  return (
    <>
      <style>{lightStyles}</style>
      <div className="howitworks-page">
        {/* Hero Section */}
        <section className="howitworks-hero">
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            How <span className="accent-text">MovieMood</span> Works
          </motion.h1>
          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Discover the perfect movie for any mood in four simple steps.
          </motion.p>
        </section>

        {/* Steps Section */}
        <section className="steps-section">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              className="step-item"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="step-number">{step.number}</div>
              <div className="step-content">
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
                <div className="step-features">
                  {step.features.map((feature, j) => (
                    <div key={j} className="step-feature">
                      <Check />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="step-image">
                {step.icon}
              </div>
            </motion.div>
          ))}
        </section>

        {/* Features Grid */}
        <section className="features-section">
          <div className="section-header">
            <motion.h2
              className="section-title"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Everything You <span className="accent-text">Need</span>
            </motion.h2>
            <motion.p
              className="section-subtitle"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Powerful features designed for movie lovers
            </motion.p>
          </div>

          <div className="features-grid">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                className="feature-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="feature-icon">{feature.icon}</div>
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
            Join thousands of movie lovers discovering their perfect films.
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
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/features" className="btn-secondary">
              View Features
            </Link>
          </motion.div>
        </section>
      </div>
    </>
  );
};

export default HowitWorks;