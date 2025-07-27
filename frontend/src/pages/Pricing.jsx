import React from "react";
import { Link } from "react-router-dom";
import { Film, Star, Check, Zap, Gem, Crown } from "lucide-react";
import { motion } from "framer-motion";

export default function Pricing() {
  const plans = [
    {
      name: "Basic",
      price: "Free",
      description: "Perfect for casual movie watchers",
      icon: <Film className="w-6 h-6" />,
      features: [
        "5 mood-based recommendations per week",
        "Basic search functionality",
        "Limited watchlist (up to 20 films)",
        "Standard film details",
      ],
      cta: "Get Started",
      popular: false,
      color: "from-gray-400 to-gray-600",
    },
    {
      name: "Pro",
      price: "$9.99",
      description: "For serious film enthusiasts",
      icon: <Zap className="w-6 h-6" />,
      features: [
        "Unlimited mood-based recommendations",
        "Advanced search filters",
        "Unlimited watchlists",
        "Detailed analytics",
        "Priority support",
        "HD streaming quality",
      ],
      cta: "Start Free Trial",
      popular: true,
      color: "from-purple-500 to-pink-500",
    },
    {
      name: "Premium",
      price: "$19.99",
      description: "The ultimate cinematic experience",
      icon: <Crown className="w-6 h-6" />,
      features: [
        "All Pro features",
        "4K/HDR streaming quality",
        "Personalized curator",
        "Early access to new features",
        "Exclusive content",
        "VIP support",
        "Offline downloads",
      ],
      cta: "Start Free Trial",
      popular: false,
      color: "from-amber-400 to-orange-500",
    },
  ];

  const features = [
    {
      name: "Mood-Based Recommendations",
      tiers: {
        Basic: true,
        Pro: true,
        Premium: true,
      },
    },
    {
      name: "Unlimited Watchlists",
      tiers: {
        Basic: false,
        Pro: true,
        Premium: true,
      },
    },
    {
      name: "Advanced Analytics",
      tiers: {
        Basic: false,
        Pro: true,
        Premium: true,
      },
    },
    {
      name: "4K/HDR Streaming",
      tiers: {
        Basic: false,
        Pro: false,
        Premium: true,
      },
    },
    {
      name: "Offline Downloads",
      tiers: {
        Basic: false,
        Pro: false,
        Premium: true,
      },
    },
    {
      name: "Personalized Curator",
      tiers: {
        Basic: false,
        Pro: false,
        Premium: true,
      },
    },
    {
      name: "Priority Support",
      tiers: {
        Basic: false,
        Pro: true,
        Premium: true,
      },
    },
  ];

  return (
    <div className="bg-gray-950 text-gray-100 min-h-screen font-sans antialiased">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-950 to-black z-0" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://assets-global.website-files.com/5f16d3f9836eec5a40b7456/63f5d5b5f5e4e50a1b4a9a0e_hero-grid-pattern.svg')] bg-repeat opacity-50"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-800/50 border border-gray-700 mb-6">
                <span className="text-xs font-semibold tracking-wider text-purple-400 uppercase">
                  Simple, transparent pricing
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-100 via-gray-300 to-gray-400 bg-clip-text text-transparent leading-tight mb-6">
                Choose Your Perfect Plan
              </h1>
              <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto">
                Whether you're a casual viewer or a film connoisseur, we have a
                plan that fits your needs.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.03)_0%,_transparent_70%)] z-0" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className={`relative rounded-2xl overflow-hidden border ${
                  plan.popular
                    ? "border-purple-500/50 shadow-lg shadow-purple-500/20"
                    : "border-gray-800"
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-4 py-1 rounded-bl-lg rounded-tr-lg">
                    MOST POPULAR
                  </div>
                )}
                <div
                  className={`p-8 bg-gradient-to-br ${
                    plan.popular ? "from-gray-900 to-gray-950" : "from-gray-900/80 to-gray-950"
                  }`}
                >
                  <div className="flex items-center mb-4">
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-r ${plan.color} flex items-center justify-center mr-4`}
                    >
                      {plan.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{plan.name}</h3>
                      <p className="text-gray-400 text-sm">{plan.description}</p>
                    </div>
                  </div>

                  <div className="my-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.price !== "Free" && (
                      <span className="text-gray-400">/month</span>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/register"
                    className={`block text-center py-3 px-6 rounded-lg font-medium transition-all ${
                      plan.popular
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-purple-500/30"
                        : "bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-16 bg-gray-900/50 border-y border-gray-800">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Detailed
              </span>{" "}
              Feature Comparison
            </h2>
            <p className="text-gray-400">
              See how our plans stack up against each other
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-4 px-6 font-medium text-gray-400">
                    Features
                  </th>
                  <th className="py-4 px-6 font-medium text-gray-400">Basic</th>
                  <th className="py-4 px-6 font-medium text-purple-400">Pro</th>
                  <th className="py-4 px-6 font-medium text-amber-400">
                    Premium
                  </th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr
                    key={feature.name}
                    className={`border-b border-gray-800 ${
                      index % 2 === 0 ? "bg-gray-900/30" : ""
                    }`}
                  >
                    <td className="py-4 px-6 font-medium">{feature.name}</td>
                    <td className="py-4 px-6 text-center">
                      {feature.tiers.Basic ? (
                        <Check className="w-5 h-5 text-green-400 mx-auto" />
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {feature.tiers.Pro ? (
                        <Check className="w-5 h-5 text-green-400 mx-auto" />
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {feature.tiers.Premium ? (
                        <Check className="w-5 h-5 text-green-400 mx-auto" />
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                  Frequently
                </span>{" "}
                Asked Questions
              </h2>
              <p className="text-gray-400">
                Everything you need to know about our plans
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  question: "Can I switch plans later?",
                  answer:
                    "Absolutely! You can upgrade or downgrade your plan at any time from your account settings. Changes will be prorated based on your billing cycle.",
                },
                {
                  question: "Do you offer annual billing?",
                  answer:
                    "Yes! We offer 15% discount for annual billing. You can choose annual billing when signing up or from your account settings.",
                },
                {
                  question: "Is there a free trial?",
                  answer:
                    "Our Pro and Premium plans come with a 14-day free trial. No credit card required to start the trial.",
                },
                {
                  question: "What payment methods do you accept?",
                  answer:
                    "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and in some regions, Apple Pay and Google Pay.",
                },
                {
                  question: "Can I cancel anytime?",
                  answer:
                    "Yes, you can cancel your subscription at any time. There are no cancellation fees, and you'll continue to have access until the end of your billing period.",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors"
                >
                  <h3 className="text-lg font-semibold mb-2">{item.question}</h3>
                  <p className="text-gray-400">{item.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center bg-gray-900/50 border border-gray-800 rounded-2xl p-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
              <Star className="w-4 h-4 text-purple-400 mr-2" />
              <span className="text-xs font-semibold tracking-wider text-purple-400 uppercase">
                Ready to get started?
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Join thousands of film lovers who found their perfect movie match
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Start your 14-day free trial today. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/register"
                className="px-8 py-4 rounded-xl font-semibold text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/40"
              >
                Start Free Trial
              </Link>
              <Link
                to="/contact"
                className="px-8 py-4 rounded-xl font-semibold text-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 transition-all duration-300 shadow-lg"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}