import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Sparkles, Crown, Zap, Star, ArrowRight } from "lucide-react";

const lightStyles = `
  .pricing-page {
    background: #fdfbf9;
    min-height: 100vh;
    padding-top: 80px;
  }

  .pricing-hero {
    padding: 80px 20px 40px;
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
    margin: 0 auto 2rem;
    line-height: 1.7;
  }

  .accent-text {
    background: linear-gradient(135deg, #7c3aed, #ec4899);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* Billing Toggle */
  .billing-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-bottom: 60px;
  }

  .billing-option {
    font-size: 0.9375rem;
    font-weight: 500;
    color: #64748b;
    transition: color 0.3s ease;
  }

  .billing-option.active {
    color: #1a1a2e;
  }

  .toggle-switch {
    width: 56px;
    height: 28px;
    background: #e5e7eb;
    border-radius: 14px;
    position: relative;
    cursor: pointer;
    transition: background 0.3s ease;
  }

  .toggle-switch.active {
    background: #7c3aed;
  }

  .toggle-knob {
    width: 22px;
    height: 22px;
    background: white;
    border-radius: 50%;
    position: absolute;
    top: 3px;
    left: 3px;
    transition: transform 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .toggle-switch.active .toggle-knob {
    transform: translateX(28px);
  }

  .save-badge {
    background: #dcfce7;
    color: #16a34a;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
  }

  /* Pricing Cards */
  .pricing-section {
    padding: 0 20px 80px;
    max-width: 1100px;
    margin: 0 auto;
  }

  .pricing-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }

  .pricing-card {
    background: white;
    border-radius: 24px;
    padding: 40px 32px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
    border: 2px solid transparent;
    transition: all 0.3s ease;
    position: relative;
  }

  .pricing-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
  }

  .pricing-card.popular {
    border-color: #7c3aed;
    box-shadow: 0 8px 30px rgba(124, 58, 237, 0.15);
  }

  .popular-badge {
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #7c3aed, #ec4899);
    color: white;
    padding: 6px 20px;
    border-radius: 20px;
    font-size: 0.8125rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .popular-badge svg {
    width: 14px;
    height: 14px;
  }

  .plan-icon {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
  }

  .plan-icon.free {
    background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
    color: #10b981;
  }

  .plan-icon.pro {
    background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
    color: #7c3aed;
  }

  .plan-icon.premium {
    background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
    color: #f59e0b;
  }

  .plan-icon svg {
    width: 28px;
    height: 28px;
  }

  .plan-name {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1a1a2e;
    margin-bottom: 8px;
  }

  .plan-desc {
    font-size: 0.9375rem;
    color: #64748b;
    margin-bottom: 24px;
  }

  .plan-price {
    display: flex;
    align-items: baseline;
    gap: 4px;
    margin-bottom: 8px;
  }

  .price-currency {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1a1a2e;
  }

  .price-amount {
    font-size: 3rem;
    font-weight: 700;
    color: #1a1a2e;
    line-height: 1;
  }

  .price-period {
    font-size: 0.9375rem;
    color: #64748b;
    margin-bottom: 24px;
  }

  .plan-features {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 32px;
  }

  .plan-feature {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 0.9375rem;
    color: #374151;
  }

  .plan-feature svg {
    width: 18px;
    height: 18px;
    color: #10b981;
    flex-shrink: 0;
  }

  .plan-button {
    width: 100%;
    padding: 14px;
    border-radius: 12px;
    font-weight: 600;
    font-size: 1rem;
    text-align: center;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.3s ease;
  }

  .plan-button.primary {
    background: #7c3aed;
    color: white;
    border: none;
  }

  .plan-button.primary:hover {
    background: #6d28d9;
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(124, 58, 237, 0.35);
  }

  .plan-button.secondary {
    background: white;
    color: #1a1a2e;
    border: 1.5px solid #e5e7eb;
  }

  .plan-button.secondary:hover {
    border-color: #7c3aed;
    color: #7c3aed;
    background: #faf5ff;
  }

  /* FAQ Section */
  .faq-section {
    padding: 80px 20px;
    background: linear-gradient(180deg, #faf8f6 0%, #fdfbf9 100%);
  }

  .faq-header {
    text-align: center;
    max-width: 600px;
    margin: 0 auto 48px;
  }

  .faq-title {
    font-size: 2rem;
    font-weight: 700;
    color: #1a1a2e;
    margin-bottom: 1rem;
  }

  .faq-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    max-width: 900px;
    margin: 0 auto;
  }

  .faq-item {
    background: white;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
  }

  .faq-question {
    font-size: 1rem;
    font-weight: 600;
    color: #1a1a2e;
    margin-bottom: 8px;
  }

  .faq-answer {
    font-size: 0.9375rem;
    color: #64748b;
    line-height: 1.6;
  }

  @media (max-width: 900px) {
    .pricing-grid {
      grid-template-columns: 1fr;
      max-width: 400px;
      margin: 0 auto;
    }
    .faq-grid {
      grid-template-columns: 1fr;
    }
  }
`;

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: "Free",
      desc: "Perfect for getting started",
      monthlyPrice: 0,
      annualPrice: 0,
      icon: <Star />,
      iconClass: "free",
      features: [
        "Basic mood recommendations",
        "5 movies per day",
        "Basic search",
        "Watch history (30 days)",
        "Community access"
      ],
      buttonText: "Get Started",
      buttonClass: "secondary",
      popular: false
    },
    {
      name: "Pro",
      desc: "For serious movie lovers",
      monthlyPrice: 9.99,
      annualPrice: 7.99,
      icon: <Sparkles />,
      iconClass: "pro",
      features: [
        "Advanced AI recommendations",
        "Unlimited movies",
        "Full search & filters",
        "Unlimited watch history",
        "Movie diary & ratings",
        "Analytics dashboard",
        "Priority support"
      ],
      buttonText: "Start Free Trial",
      buttonClass: "primary",
      popular: true
    },
    {
      name: "Premium",
      desc: "For the ultimate experience",
      monthlyPrice: 19.99,
      annualPrice: 14.99,
      icon: <Crown />,
      iconClass: "premium",
      features: [
        "Everything in Pro",
        "Early access features",
        "Exclusive collections",
        "Group watching rooms",
        "Custom mood creation",
        "API access",
        "Dedicated support"
      ],
      buttonText: "Start Free Trial",
      buttonClass: "secondary",
      popular: false
    }
  ];

  const faqs = [
    {
      q: "Can I cancel anytime?",
      a: "Yes, you can cancel your subscription at any time. No questions asked."
    },
    {
      q: "Is there a free trial?",
      a: "Yes! Pro and Premium plans come with a 14-day free trial."
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept all major credit cards, PayPal, and Apple Pay."
    },
    {
      q: "Can I switch plans later?",
      a: "Absolutely! You can upgrade or downgrade your plan at any time."
    }
  ];

  return (
    <>
      <style>{lightStyles}</style>
      <div className="pricing-page">
        {/* Hero Section */}
        <section className="pricing-hero">
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Simple, Transparent <span className="accent-text">Pricing</span>
          </motion.h1>
          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Choose the perfect plan for your movie discovery journey.
          </motion.p>

          {/* Billing Toggle */}
          <motion.div
            className="billing-toggle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className={`billing-option ${!isAnnual ? 'active' : ''}`}>Monthly</span>
            <div
              className={`toggle-switch ${isAnnual ? 'active' : ''}`}
              onClick={() => setIsAnnual(!isAnnual)}
            >
              <div className="toggle-knob"></div>
            </div>
            <span className={`billing-option ${isAnnual ? 'active' : ''}`}>Annual</span>
            {isAnnual && <span className="save-badge">Save 20%</span>}
          </motion.div>
        </section>

        {/* Pricing Cards */}
        <section className="pricing-section">
          <div className="pricing-grid">
            {plans.map((plan, i) => (
              <motion.div
                key={i}
                className={`pricing-card ${plan.popular ? 'popular' : ''}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                {plan.popular && (
                  <div className="popular-badge">
                    <Sparkles />
                    Most Popular
                  </div>
                )}
                <div className={`plan-icon ${plan.iconClass}`}>
                  {plan.icon}
                </div>
                <h3 className="plan-name">{plan.name}</h3>
                <p className="plan-desc">{plan.desc}</p>
                <div className="plan-price">
                  <span className="price-currency">$</span>
                  <span className="price-amount">
                    {isAnnual ? plan.annualPrice : plan.monthlyPrice}
                  </span>
                </div>
                <p className="price-period">
                  {plan.monthlyPrice === 0 ? "Free forever" : `per month, billed ${isAnnual ? 'annually' : 'monthly'}`}
                </p>
                <div className="plan-features">
                  {plan.features.map((feature, j) => (
                    <div key={j} className="plan-feature">
                      <Check />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <Link
                  to={plan.monthlyPrice === 0 ? "/register" : "/payment"}
                  className={`plan-button ${plan.buttonClass}`}
                >
                  {plan.buttonText}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq-section">
          <div className="faq-header">
            <motion.h2
              className="faq-title"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Frequently Asked Questions
            </motion.h2>
          </div>
          <div className="faq-grid">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                className="faq-item"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <h4 className="faq-question">{faq.q}</h4>
                <p className="faq-answer">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default Pricing;