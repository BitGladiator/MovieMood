import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

import emailjs from "emailjs-com";
import {
  StarIcon,
  Film,
  Heart,
  Search,
  BarChart2,
  ChevronDown,
  X,
  TrendingUp,
  Users,
  Sparkles,
  Play,
  Zap,
  Clock,
  Palette,
  Brain,
  BookOpen,
  Target,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Theme-aware Styles
const lightThemeStyles = `
  /* Global Light Theme Styles */
  .light-theme-page {
    background: var(--bg-primary);
    color: var(--text-primary);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }

  /* Hero Section */
  .grovix-hero {
    min-height: 100vh;
    background: linear-gradient(180deg, 
      var(--bg-primary) 0%, 
      var(--bg-secondary) 25%,
      var(--bg-tertiary) 75%,
      var(--bg-primary) 100%
    );
    position: relative;
    overflow: hidden;
    padding-top: 80px;
  }

  .grovix-hero::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(ellipse 80% 50% at 50% 100%, rgba(255, 200, 180, 0.3), transparent),
      radial-gradient(ellipse 60% 40% at 0% 50%, rgba(255, 220, 220, 0.25), transparent),
      radial-gradient(ellipse 60% 40% at 100% 50%, rgba(230, 210, 255, 0.25), transparent);
    pointer-events: none;
  }

  .hero-content {
    position: relative;
    z-index: 10;
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
    padding: 60px 20px 40px;
  }

  .hero-headline {
    font-size: clamp(2.5rem, 6vw, 4rem);
    font-weight: 700;
    color: #1a1a2e;
    line-height: 1.15;
    margin-bottom: 1.5rem;
    letter-spacing: -0.02em;
  }

  .hero-description {
    font-size: 1.125rem;
    color: #64748b;
    max-width: 600px;
    margin: 0 auto 2.5rem;
    line-height: 1.7;
  }

  .hero-buttons {
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

  /* Floating Cards */
  .floating-card {
    position: absolute;
    background: white;
    border-radius: 16px;
    padding: 20px 24px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.8);
  }

  .floating-card-left {
    left: 5%;
    top: 35%;
    transform: rotate(-8deg);
  }

  .floating-card-right {
    right: 5%;
    top: 40%;
    transform: rotate(6deg);
  }

  .card-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.75rem;
    color: #64748b;
    margin-bottom: 8px;
  }

  .card-label-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #f97316;
  }

  .card-value {
    font-size: 2rem;
    font-weight: 700;
    color: #1a1a2e;
    line-height: 1.2;
  }

  .card-trend {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.75rem;
    color: #10b981;
    margin-top: 6px;
  }

  /* Trusted By Section */
  .trusted-section {
    padding: 60px 20px;
    text-align: center;
    background: linear-gradient(180deg, #f5f3ff 0%, #faf8f6 100%);
  }

  .trusted-label {
    font-size: 0.875rem;
    color: #64748b;
    margin-bottom: 2rem;
    letter-spacing: 0.05em;
  }

  .trusted-logos {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 2rem 3rem;
    max-width: 1000px;
    margin: 0 auto;
  }

  .trusted-logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.25rem;
    font-weight: 700;
    color: #1a1a2e;
    opacity: 0.7;
    transition: opacity 0.3s ease;
  }

  .trusted-logo:hover {
    opacity: 1;
  }

  /* Light Section Base */
  .light-section {
    padding: 100px 20px;
    background: #fdfbf9;
  }

  .light-section-alt {
    padding: 100px 20px;
    background: linear-gradient(180deg, #faf8f6 0%, #fdfbf9 100%);
  }

  .section-header {
    text-align: center;
    max-width: 700px;
    margin: 0 auto 60px;
  }

  .section-title {
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 700;
    color: #1a1a2e;
    line-height: 1.2;
    margin-bottom: 1rem;
  }

  .section-title-accent {
    background: linear-gradient(135deg, #7c3aed, #ec4899);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .section-subtitle {
    font-size: 1.125rem;
    color: #64748b;
    line-height: 1.7;
  }

  /* Why Choose Section - Grid with center laptop */
  .why-choose-grid {
    display: grid;
    grid-template-columns: 1fr 1.5fr 1fr;
    gap: 30px;
    max-width: 1200px;
    margin: 0 auto;
    align-items: center;
  }

  .why-card {
    background: white;
    border-radius: 20px;
    padding: 30px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
    border: 1px solid rgba(0, 0, 0, 0.04);
    text-align: center;
    transition: all 0.3s ease;
  }

  .why-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
  }

  .why-card-number {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    font-weight: 600;
    color: white;
    margin-bottom: 16px;
  }

  .why-card-number.purple { background: #7c3aed; }
  .why-card-number.orange { background: #f97316; }

  .why-card-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1a1a2e;
    line-height: 1.4;
  }

  .center-image {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .center-image img {
    max-width: 100%;
    height: auto;
    border-radius: 16px;
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.15);
  }

  /* Feature Cards Grid */
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

  .feature-card.large {
    grid-column: span 1;
  }

  .feature-icon-box {
    width: 100%;
    height: 120px;
    background: linear-gradient(135deg, #faf5ff 0%, #fdf2f8 100%);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
  }

  .feature-icon-box svg {
    width: 48px;
    height: 48px;
    color: #7c3aed;
  }

  .feature-card-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1a1a2e;
    margin-bottom: 12px;
    text-align: center;
  }

  .feature-card-desc {
    font-size: 0.9375rem;
    color: #64748b;
    line-height: 1.6;
    text-align: center;
  }

  /* Two Column Features */
  .features-two-col {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    max-width: 800px;
    margin: 40px auto 0;
  }

  /* Mood Cards Grid */
  .mood-cards-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .mood-card {
    position: relative;
    border-radius: 20px;
    overflow: hidden;
    aspect-ratio: 3/4;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
  }

  .mood-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
  }

  .mood-card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  .mood-card:hover img {
    transform: scale(1.05);
  }

  .mood-card-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.7) 100%);
    display: flex;
    align-items: flex-end;
    padding: 24px;
  }

  .mood-card-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: white;
  }

  /* Testimonials */
  .testimonials-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .testimonial-card {
    background: white;
    border-radius: 20px;
    padding: 32px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
    border: 1px solid rgba(0, 0, 0, 0.04);
  }

  .testimonial-stars {
    display: flex;
    gap: 4px;
    margin-bottom: 16px;
  }

  .testimonial-stars svg {
    width: 18px;
    height: 18px;
    color: #fbbf24;
    fill: #fbbf24;
  }

  .testimonial-text {
    font-size: 1rem;
    color: #374151;
    line-height: 1.7;
    margin-bottom: 24px;
  }

  .testimonial-author {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .testimonial-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
  }

  .testimonial-name {
    font-weight: 600;
    color: #1a1a2e;
    font-size: 0.9375rem;
  }

  .testimonial-role {
    font-size: 0.8125rem;
    color: #64748b;
  }

  /* CTA Section */
  .cta-section {
    padding: 100px 20px;
    background: linear-gradient(135deg, #faf5ff 0%, #fdf2f8 50%, #fef5f0 100%);
    text-align: center;
  }

  .cta-content {
    max-width: 700px;
    margin: 0 auto;
  }

  .cta-title {
    font-size: clamp(2rem, 4vw, 2.75rem);
    font-weight: 700;
    color: #1a1a2e;
    line-height: 1.2;
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

  /* Contact Section */
  .contact-section {
    padding: 100px 20px;
    background: #fdfbf9;
  }

  .contact-form {
    max-width: 700px;
    margin: 0 auto;
    background: white;
    border-radius: 24px;
    padding: 48px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
    border: 1px solid rgba(0, 0, 0, 0.04);
  }

  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 20px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .form-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
  }

  .form-input {
    padding: 14px 16px;
    border: 1.5px solid #e5e7eb;
    border-radius: 12px;
    font-size: 1rem;
    color: #1a1a2e;
    background: #fafafa;
    transition: all 0.3s ease;
  }

  .form-input:focus {
    outline: none;
    border-color: #7c3aed;
    background: white;
    box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.1);
  }

  .form-input.error {
    border-color: #ef4444;
  }

  .form-textarea {
    min-height: 140px;
    resize: vertical;
  }

  .form-error {
    font-size: 0.8125rem;
    color: #ef4444;
  }

  .form-submit {
    width: 100%;
    padding: 16px;
    background: #7c3aed;
    color: white;
    font-weight: 600;
    font-size: 1rem;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .form-submit:hover:not(:disabled) {
    background: #6d28d9;
    transform: translateY(-1px);
  }

  .form-submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .form-status {
    text-align: center;
    margin-top: 16px;
    font-size: 0.9375rem;
  }

  .form-status.success {
    color: #10b981;
  }

  .form-status.error {
    color: #ef4444;
  }

  /* Footer */
  .light-footer {
    padding: 60px 20px 40px;
    background: white;
    border-top: 1px solid #f1f5f9;
  }

  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
  }

  .footer-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
    flex-wrap: wrap;
    gap: 20px;
  }

  .footer-logo {
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
  }

  .footer-logo-icon {
    width: 32px;
    height: 32px;
    color: #7c3aed;
  }

  .footer-logo-text {
    font-size: 1.25rem;
    font-weight: 700;
    background: linear-gradient(135deg, #7c3aed, #ec4899);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .footer-links {
    display: flex;
    gap: 32px;
    flex-wrap: wrap;
  }

  .footer-link {
    font-size: 0.9375rem;
    color: #64748b;
    text-decoration: none;
    transition: color 0.3s ease;
  }

  .footer-link:hover {
    color: #7c3aed;
  }

  .footer-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 24px;
    border-top: 1px solid #f1f5f9;
    flex-wrap: wrap;
    gap: 16px;
  }

  .footer-copyright {
    font-size: 0.875rem;
    color: #94a3b8;
  }

  .footer-socials {
    display: flex;
    gap: 24px;
  }

  .footer-social {
    font-size: 0.875rem;
    color: #64748b;
    text-decoration: none;
    transition: color 0.3s ease;
  }

  .footer-social:hover {
    color: #7c3aed;
  }

  /* Responsive */
  @media (max-width: 1024px) {
    .floating-card {
      display: none;
    }

    .why-choose-grid {
      grid-template-columns: 1fr;
      gap: 20px;
    }

    .center-image {
      order: -1;
      margin-bottom: 20px;
    }

    .features-grid {
      grid-template-columns: 1fr 1fr;
    }

    .mood-cards-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .testimonials-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    .hero-buttons {
      flex-direction: column;
      align-items: center;
    }

    .btn-primary,
    .btn-secondary {
      width: 100%;
      max-width: 280px;
      justify-content: center;
    }

    .features-grid {
      grid-template-columns: 1fr;
    }

    .features-two-col {
      grid-template-columns: 1fr;
    }

    .form-grid {
      grid-template-columns: 1fr;
    }

    .footer-top {
      flex-direction: column;
      text-align: center;
    }

    .footer-links {
      justify-content: center;
    }

    .footer-bottom {
      flex-direction: column;
      text-align: center;
    }
  }
`;

export default function Home() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [modalTriggered, setModalTriggered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [modalDismissed, setModalDismissed] = useState(
    localStorage.getItem("authModalDismissed") === "true"
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      if (!user && !modalTriggered && window.scrollY > window.innerHeight * 0.5) {
        setShowAuthModal(true);
        setModalTriggered(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [user, modalTriggered]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && showAuthModal) {
        setShowAuthModal(false);
        setModalDismissed(true);
        localStorage.setItem("authModalDismissed", "true");
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [showAuthModal]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#fdfbf9' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (
      !import.meta.env.VITE_EMAILJS_SERVICE_ID ||
      !import.meta.env.VITE_EMAILJS_TEMPLATE_ID ||
      !import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    ) {
      setStatus("Email service not configured. Please contact support.");
      return;
    }

    setIsSubmitting(true);
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
          setErrors({});
          setTimeout(() => setStatus(""), 5000);
        },
        (err) => {
          console.error(err);
          setStatus("Failed to send message. Please try again.");
          setTimeout(() => setStatus(""), 5000);
        }
      )
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  // Trusted By logos
  const trustedLogos = [
    { name: "Netflix" },
    { name: "IMDb" },
    { name: "Letterboxd" },
    { name: "TMDb" },
    { name: "JustWatch" },
    { name: "Rotten" },
  ];

  // Why Choose features
  const whyChooseFeatures = [
    { number: "01", color: "purple", title: "Smart mood detection, no guesswork required" },
    { number: "02", color: "orange", title: "Designed to grow with your taste" },
    { number: "03", color: "orange", title: "Integrates with your favorite streaming platforms" },
    { number: "04", color: "purple", title: "Private & secure viewing history" },
  ];

  // Main Features
  const mainFeatures = [
    {
      icon: <Search />,
      title: "Mood-Based Discovery",
      desc: "Find movies that match exactly how you're feeling. Our AI understands emotions.",
    },
    {
      icon: <BarChart2 />,
      title: "Viewing Analytics",
      desc: "Get instant insights with beautiful visualizations of your watching patterns.",
    },
    {
      icon: <Sparkles />,
      title: "Smart Recommendations",
      desc: "Personalized suggestions that learn and adapt to your unique preferences.",
    },
  ];

  const additionalFeatures = [
    {
      icon: <BookOpen />,
      title: "Movie Diary",
      desc: "Track every movie you watch and record your thoughts and ratings.",
    },
    {
      icon: <Users />,
      title: "Community Picks",
      desc: "Discover what others are watching and share your favorites.",
    },
  ];

  // Mood categories
  const moods = [
    { name: "Euphoric", image: "https://images.saatchiart.com/saatchi/1504541/art/8541472/7605330-HSC00001-7.jpg" },
    { name: "Romantic", image: "https://i.pinimg.com/736x/98/a1/93/98a19354e5a152e14df648bce1e28a5d.jpg" },
    { name: "Adventurous", image: "https://www.mensjournal.com/.image/t_share/MTk2MTM3MzIwNzEwMjg0ODA1/alex-honnold-jimmy-chin.jpg" },
    { name: "Thoughtful", image: "https://media.licdn.com/dms/image/v2/D4E12AQFHTwC2C_1xVQ/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1728212879699?e=2147483647&v=beta&t=BnU2zRirg_MU_ALfrSga-zB6QXsz0FthuOV428dtwE4" },
    { name: "Nostalgic", image: "https://www.shutterstock.com/blog/wp-content/uploads/sites/5/2022/07/nostalgia-photos-cover.jpg?w=1250&h=1120&crop=1" },
    { name: "Thrilled", image: "https://www.shutterstock.com/image-photo/brutal-man-automatic-gun-his-600nw-2010947468.jpg" },
    { name: "Chilled", image: "https://wallpapercave.com/wp/wp9867122.jpg" },
    { name: "Whimsical", image: "https://www.slaphappylarry.com/wp-content/uploads/2020/04/Milo-Winter-1888-%E2%80%93-1956.jpg" },
  ];

  // Testimonials
  const testimonials = [
    {
      text: "MovieMood completely changed how I discover films. The mood-based recommendations are scarily accurate!",
      name: "Sarah J.",
      role: "Film Critic",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    },
    {
      text: "Finally, an app that understands that sometimes I want something uplifting and other times something deep.",
      name: "Michael R.",
      role: "Movie Enthusiast",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    },
    {
      text: "The analytics feature is incredible. I love seeing my viewing patterns visualized so beautifully.",
      name: "Emily K.",
      role: "Content Creator",
      avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    },
  ];

  return (
    <>
      <style>{lightThemeStyles}</style>

      <div className="light-theme-page">
        {/* Auth Modal */}
        <AnimatePresence>
          {showAuthModal && (
            <motion.div
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setShowAuthModal(false);
                  setModalDismissed(true);
                  localStorage.setItem("authModalDismissed", "true");
                }
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
              >
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="text-center mb-6">
                  <Film className="w-12 h-12 mx-auto text-purple-500 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Join MovieMood</h3>
                  <p className="text-gray-500">Get personalized movie recommendations based on your mood.</p>
                </div>
                <div className="flex flex-col gap-4">
                  <Link
                    to="/register"
                    className="btn-primary justify-center"
                    onClick={() => setShowAuthModal(false)}
                  >
                    Create Account
                  </Link>
                  <Link
                    to="/login"
                    className="btn-secondary justify-center"
                    onClick={() => setShowAuthModal(false)}
                  >
                    Sign In
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Section */}
        <section className="grovix-hero">
          <motion.div
            className="floating-card floating-card-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="card-label">
              <span className="card-label-dot"></span>
              <span>Movies Discovered</span>
            </div>
            <div className="card-value">1,54,325</div>
            <div className="card-trend">
              <TrendingUp className="w-3 h-3" />
              <span>+15% Since Last Year</span>
            </div>
          </motion.div>

          <motion.div
            className="floating-card floating-card-right"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="card-label">
              <span className="card-label-dot" style={{ background: '#7c3aed' }}></span>
              <span>Happy Users</span>
            </div>
            <div className="card-value">2349</div>
            <div className="card-trend">
              <TrendingUp className="w-3 h-3" />
              <span>+8% Since Last Year</span>
            </div>
          </motion.div>

          <div className="hero-content">
            <motion.h1
              className="hero-headline"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Discover Movies That<br />Match Your Mood.
            </motion.h1>

            <motion.p
              className="hero-description"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              MovieMood is the intelligent movie discovery platform that helps you find
              perfect films based on how you feel, track your viewing journey, and explore
              curated collections.
            </motion.p>

            <motion.div
              className="hero-buttons"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link to="/register" className="btn-primary">
                Get Started
              </Link>
              <Link to="/demo" className="btn-secondary">
                <Play className="w-4 h-4" />
                Free Trial
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Trusted By Section */}
        <section className="trusted-section">
          <p className="trusted-label">Trusted by Movie Lovers Worldwide</p>
          <div className="trusted-logos">
            {trustedLogos.map((logo, i) => (
              <motion.div
                key={i}
                className="trusted-logo"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 0.7, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <span>{logo.icon}</span>
                <span>{logo.name}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Why Choose MovieMood Section */}
        <section className="light-section">
          <div className="section-header">
            <motion.h2
              className="section-title"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Why Movie Lovers<br />Choose <span className="section-title-accent">MovieMood</span>
            </motion.h2>
          </div>

          <div className="why-choose-grid" style={{ padding: '0 20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {whyChooseFeatures.slice(0, 2).map((feature, i) => (
                <motion.div
                  key={i}
                  className="why-card"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div className={`why-card-number ${feature.color}`}>{feature.number}</div>
                  <h3 className="why-card-title">{feature.title}</h3>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="center-image"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img
                src="dash.png"
                alt="MovieMood Dashboard"
                style={{ borderRadius: '16px', boxShadow: '0 30px 60px rgba(0,0,0,0.15)' }}
              />
            </motion.div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {whyChooseFeatures.slice(2, 4).map((feature, i) => (
                <motion.div
                  key={i}
                  className="why-card"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div className={`why-card-number ${feature.color}`}>{feature.number}</div>
                  <h3 className="why-card-title">{feature.title}</h3>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* What You Can Do Section */}
        <section className="light-section-alt">
          <div className="section-header">
            <motion.h2
              className="section-title"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              What You Can Do<br />With <span className="section-title-accent">MovieMood</span>
            </motion.h2>
          </div>

          <div className="features-grid" style={{ padding: '0 20px' }}>
            {mainFeatures.map((feature, i) => (
              <motion.div
                key={i}
                className="feature-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="feature-icon-box">
                  {feature.icon}
                </div>
                <h3 className="feature-card-title">{feature.title}</h3>
                <p className="feature-card-desc">{feature.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="features-two-col" style={{ padding: '0 20px' }}>
            {additionalFeatures.map((feature, i) => (
              <motion.div
                key={i}
                className="feature-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              >
                <div className="feature-icon-box">
                  {feature.icon}
                </div>
                <h3 className="feature-card-title">{feature.title}</h3>
                <p className="feature-card-desc">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Mood Categories Section */}
        <section className="light-section">
          <div className="section-header">
            <motion.h2
              className="section-title"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Find Films for<br /><span className="section-title-accent">Every Emotion</span>
            </motion.h2>
            <motion.p
              className="section-subtitle"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Our mood detection matches you with perfect cinematic experiences
            </motion.p>
          </div>

          <div className="mood-cards-grid" style={{ padding: '0 20px' }}>
            {moods.map((mood, i) => (
              <motion.div
                key={i}
                className="mood-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <img src={mood.image} alt={mood.name} loading="lazy" />
                <div className="mood-card-overlay">
                  <h3 className="mood-card-title">{mood.name}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="light-section-alt">
          <div className="section-header">
            <motion.h2
              className="section-title"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Loved by<br /><span className="section-title-accent">Film Lovers</span>
            </motion.h2>
            <motion.p
              className="section-subtitle"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Don't just take our word for it
            </motion.p>
          </div>

          <div className="testimonials-grid" style={{ padding: '0 20px' }}>
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
                className="testimonial-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="testimonial-stars">
                  {[...Array(5)].map((_, j) => (
                    <StarIcon key={j} />
                  ))}
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <div className="testimonial-author">
                  <img src={testimonial.avatar} alt={testimonial.name} className="testimonial-avatar" />
                  <div>
                    <div className="testimonial-name">{testimonial.name}</div>
                    <div className="testimonial-role">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-content">
            <motion.h2
              className="cta-title"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Ready to Transform<br /><span className="section-title-accent">Your Movie Nights?</span>
            </motion.h2>
            <motion.p
              className="cta-subtitle"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Join thousands of cinephiles who never struggle to pick a movie again.
            </motion.p>
            <motion.div
              className="cta-buttons"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Link to="/register" className="btn-primary">
                Start Your Free Trial
              </Link>
              <Link to="/demo" className="btn-secondary">
                See Live Demo
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="contact-section">
          <div className="section-header">
            <motion.h2
              className="section-title"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="section-title-accent">Get in Touch</span><br />With Us
            </motion.h2>
          </div>

          <motion.form
            className="contact-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  placeholder="Your name"
                />
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="your@email.com"
                />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className={`form-input form-textarea ${errors.message ? 'error' : ''}`}
                placeholder="How can we help you?"
              />
              {errors.message && <span className="form-error">{errors.message}</span>}
            </div>
            <button type="submit" disabled={isSubmitting} className="form-submit">
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sending...
                </>
              ) : (
                "Send Message"
              )}
            </button>
            {status && (
              <p className={`form-status ${status.includes("success") ? "success" : "error"}`}>
                {status}
              </p>
            )}
          </motion.form>
        </section>

        {/* Footer */}
        <footer className="light-footer">
          <div className="footer-content">
            <div className="footer-top">
              <Link to="/" className="footer-logo">
                <Film className="footer-logo-icon" />
                <span className="footer-logo-text">MovieMood</span>
              </Link>
              <div className="footer-links">
                <Link to="/privacy" className="footer-link">Privacy Policy</Link>
                <Link to="/terms" className="footer-link">Terms of Service</Link>
                <Link to="/contact" className="footer-link">Contact</Link>
              </div>
            </div>
            <div className="footer-bottom">
              <p className="footer-copyright">
                © {new Date().getFullYear()} MovieMood. All rights reserved.
              </p>
              <div className="footer-socials">
                <a href="https://twitter.com/moviemood" target="_blank" rel="noopener noreferrer" className="footer-social">Twitter</a>
                <a href="https://instagram.com/moviemood" target="_blank" rel="noopener noreferrer" className="footer-social">Instagram</a>
                <a href="https://facebook.com/moviemood" target="_blank" rel="noopener noreferrer" className="footer-social">Facebook</a>
                <a href="https://linkedin.com/company/moviemood" target="_blank" rel="noopener noreferrer" className="footer-social">LinkedIn</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
