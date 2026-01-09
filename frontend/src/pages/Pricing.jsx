import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// SVG Icons
const FilmIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
  </svg>
);

const ZapIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const CrownIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const SparkleIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const PlayIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const GemIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
  </svg>
);

export default function PremiumPricing() {
  const plans = [
    {
      name: "Essential",
      price: "Free",
      description: "For the occasional viewer",
      icon: <FilmIcon />,
      features: [
        "5 personalized recommendations weekly",
        "Basic mood-based filtering",
        "Watchlist (20 films limit)",
        "Standard video quality",
        "Community access",
      ],
      cta: "Start Free",
      popular: false,
      color: "from-slate-500 to-slate-700",
      accent: "border-slate-700",
    },
    {
      name: "Cinephile",
      price: "$14.99",
      description: "For the discerning film enthusiast",
      icon: <ZapIcon />,
      features: [
        "Unlimited AI recommendations",
        "Advanced mood & genre filters",
        "Unlimited watchlists & collections",
        "HD & 4K streaming",
        "Personal viewing statistics",
        "Priority customer support",
        "Ad-free experience",
      ],
      cta: "Start 14-Day Trial",
      popular: true,
      color: "from-violet-600 to-indigo-600",
      accent: "border-violet-500/50",
      highlight: true,
    },
    {
      name: "Connoisseur",
      price: "$29.99",
      description: "Ultimate cinematic journey",
      icon: <CrownIcon />,
      features: [
        "Everything in Cinephile",
        "8K & HDR streaming",
        "Personal film curator",
        "Early feature access",
        "Exclusive director content",
        "VIP 24/7 support",
        "Offline downloads",
        "Film festival highlights",
        "Behind-the-scenes access",
      ],
      cta: "Get Premium",
      popular: false,
      color: "from-amber-500 to-orange-500",
      accent: "border-amber-500/30",
      link: "/payment"
    },
  ];

  const features = [
    {
      name: "AI-Powered Recommendations",
      tiers: { Essential: true, Cinephile: true, Connoisseur: true },
    },
    {
      name: "Advanced Mood Analysis",
      tiers: { Essential: false, Cinephile: true, Connoisseur: true },
    },
    {
      name: "4K & HDR Streaming",
      tiers: { Essential: false, Cinephile: true, Connoisseur: true },
    },
    {
      name: "8K & Dolby Vision",
      tiers: { Essential: false, Cinephile: false, Connoisseur: true },
    },
    {
      name: "Unlimited Watchlists",
      tiers: { Essential: false, Cinephile: true, Connoisseur: true },
    },
    {
      name: "Offline Viewing",
      tiers: { Essential: false, Cinephile: false, Connoisseur: true },
    },
    {
      name: "Personal Film Curator",
      tiers: { Essential: false, Cinephile: false, Connoisseur: true },
    },
    {
      name: "Exclusive Content",
      tiers: { Essential: false, Cinephile: false, Connoisseur: true },
    },
    {
      name: "VIP Support",
      tiers: { Essential: false, Cinephile: true, Connoisseur: true },
    },
  ];

  const benefits = [
    {
      icon: <SparkleIcon />,
      title: "AI That Understands Your Taste",
      description: "Our algorithm learns your preferences to deliver perfect matches"
    },
    {
      icon: <PlayIcon />,
      title: "Highest Quality Streaming",
      description: "Experience cinema-quality visuals with 8K HDR support"
    },
    {
      icon: <GemIcon />,
      title: "Exclusive Content",
      description: "Access director's cuts, interviews, and festival exclusives"
    },
    {
      icon: <StarIcon />,
      title: "Personal Curation",
      description: "Get personalized lists from our expert film curators"
    }
  ];

  return (
    <div className="bg-black text-gray-100 min-h-screen font-sans antialiased">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-950" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse delay-1000" />
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-40 pb-28 overflow-hidden">
        <div className="container mx-auto px-6 relative z-20">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
             
              <h1 className="text-6xl md:text-7xl font-bold mb-8">
                <span className="bg-gradient-to-r from-gray-100 via-gray-300 to-gray-100 bg-clip-text text-transparent">
                  Elevate Your
                </span>
                <br />
                <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
                  Film Journey
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                Discover a world where every film finds its perfect viewer. 
                Advanced AI meets cinematic excellence.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="relative py-20">
        <div className="container mx-auto px-6 relative z-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mb-24">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="relative p-8 bg-gradient-to-br from-gray-900/50 to-gray-950/50 border border-gray-800/50 rounded-2xl backdrop-blur-sm hover:border-violet-500/30 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                  <div className="relative z-10">
                    <div className="inline-flex p-3 rounded-xl bg-gradient-to-r from-violet-500/10 to-indigo-500/10 border border-violet-500/20 mb-6">
                      <div className="text-violet-400">{benefit.icon}</div>
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-200">{benefit.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pricing Tiers */}
          <div className="relative">
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
              <div className="px-6 py-3 rounded-full bg-gradient-to-r from-violet-600/20 to-pink-600/20 border border-violet-500/30 backdrop-blur-sm">
                <span className="text-sm font-medium bg-gradient-to-r from-violet-300 to-pink-300 bg-clip-text text-transparent">
                  SELECT YOUR TIER
                </span>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  whileHover={{ y: -15 }}
                  className={`relative ${plan.highlight ? 'lg:-mt-8' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                      <div className="px-6 py-2 rounded-full bg-gradient-to-r from-violet-600 to-pink-600 shadow-lg shadow-violet-500/30">
                        <span className="text-xs font-bold tracking-wider text-white">RECOMMENDED</span>
                      </div>
                    </div>
                  )}

                  <div className={`relative h-full rounded-3xl overflow-hidden border ${plan.accent} 
                    ${plan.popular ? 'shadow-2xl shadow-violet-500/20' : 'shadow-lg shadow-black/30'}`}>
                    
                    <div className={`absolute inset-0 bg-gradient-to-b ${plan.popular ? 'from-gray-900 to-black' : 'from-gray-900/90 to-black'}`} />
                    
                    {plan.popular && (
                      <div className="absolute inset-0">
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-transparent to-pink-500/5" />
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
                      </div>
                    )}

                    <div className="relative p-8 h-full flex flex-col">
                      {/* Header */}
                      <div className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${plan.color} flex items-center justify-center shadow-lg`}>
                            <div className="text-white">{plan.icon}</div>
                          </div>
                          {plan.popular && (
                            <div className="px-3 py-1 rounded-full bg-gradient-to-r from-violet-600/20 to-pink-600/20 border border-violet-500/30">
                              <span className="text-xs font-medium text-violet-300">POPULAR</span>
                            </div>
                          )}
                        </div>
                        
                        <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                        <p className="text-gray-400">{plan.description}</p>
                      </div>

                      {/* Price */}
                      <div className="mb-8">
                        <div className="flex items-baseline">
                          <span className="text-5xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
                            {plan.price}
                          </span>
                          {plan.price !== "Free" && (
                            <span className="ml-2 text-gray-400">/month</span>
                          )}
                        </div>
                        {plan.price !== "Free" && (
                          <p className="text-sm text-gray-500 mt-2">Billed annually: ${parseFloat(plan.price.slice(1)) * 12 * 0.85}</p>
                        )}
                      </div>

                      {/* Features */}
                      <div className="flex-grow mb-8">
                        <ul className="space-y-4">
                          {plan.features.map((feature, i) => (
                            <li key={i} className="flex items-start">
                              <div className="mt-1 mr-3">
                                <CheckIcon />
                              </div>
                              <span className="text-gray-300">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* CTA Button */}
                      <Link
                        to={plan.link || "/register"}
                        className={`mt-auto py-4 px-6 rounded-xl font-semibold text-center transition-all duration-300
                          ${plan.popular 
                            ? 'bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700 shadow-lg hover:shadow-violet-500/40' 
                            : 'bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 border border-gray-700 hover:border-gray-600'
                          }`}
                      >
                        {plan.cta}
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/20 to-transparent" />
        <div className="container mx-auto px-6 relative z-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                  Comprehensive
                </span>{" "}
                <span className="text-gray-200">Feature Comparison</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Detailed breakdown of what each tier offers for your cinematic journey
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800/50 rounded-3xl overflow-hidden backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800/50">
                      <th className="text-left py-6 px-8 font-medium text-gray-400 text-lg">
                        Features
                      </th>
                      <th className="py-6 px-8 font-medium text-slate-400 text-center">Essential</th>
                      <th className="py-6 px-8 font-medium text-violet-400 text-center">Cinephile</th>
                      <th className="py-6 px-8 font-medium text-amber-400 text-center">Connoisseur</th>
                    </tr>
                  </thead>
                  <tbody>
                    {features.map((feature, index) => (
                      <tr 
                        key={feature.name} 
                        className={`border-b border-gray-800/30 ${index % 2 === 0 ? 'bg-gray-900/20' : ''}`}
                      >
                        <td className="py-5 px-8 font-medium text-gray-300">
                          {feature.name}
                        </td>
                        <td className="py-5 px-8 text-center">
                          {feature.tiers.Essential ? (
                            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-500/20">
                              <CheckIcon className="text-green-400" />
                            </div>
                          ) : (
                            <span className="text-gray-600">—</span>
                          )}
                        </td>
                        <td className="py-5 px-8 text-center">
                          {feature.tiers.Cinephile ? (
                            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-500/20">
                              <CheckIcon className="text-green-400" />
                            </div>
                          ) : (
                            <span className="text-gray-600">—</span>
                          )}
                        </td>
                        <td className="py-5 px-8 text-center">
                          {feature.tiers.Connoisseur ? (
                            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-500/20">
                              <CheckIcon className="text-green-400" />
                            </div>
                          ) : (
                            <span className="text-gray-600">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-28">
        <div className="container mx-auto px-6 relative z-20">
          <div className="max-w-4xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-purple-600/10 to-pink-600/10" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.1)_0%,_transparent_70%)]" />
              
              <div className="relative p-12 text-center">
               
                
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
                    Begin Your
                  </span>{" "}
                  <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
                    Premium Experience
                  </span>
                </h2>
                
                <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                  Join thousands of film enthusiasts who have transformed their viewing experience. 
                  Start with a 14-day free trial of our Cinephile tier.
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link
                    to="/register"
                    className="group relative px-10 py-5 rounded-xl font-bold text-lg overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-pink-600 group-hover:from-violet-700 group-hover:to-pink-700 transition-all duration-300" />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-pink-500 animate-pulse" />
                    </div>
                    <span className="relative flex items-center justify-center gap-3">
                      <SparkleIcon />
                      Start 14-Day Premium Trial
                    </span>
                  </Link>
                  
                  <Link
                    to="/contact"
                    className="px-10 py-5 rounded-xl font-bold text-lg border border-gray-700 hover:border-gray-600 bg-gray-900/50 hover:bg-gray-800/50 backdrop-blur-sm transition-all duration-300"
                  >
                    Schedule Demo
                  </Link>
                </div>
                
                <p className="mt-8 text-sm text-gray-500">
                  No credit card required • Cancel anytime • 30-day money-back guarantee
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <div className="relative py-8 border-t border-gray-900">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-500 text-sm">
            All prices are in USD. Taxes may apply. Annual billing includes 15% discount.
            <br className="hidden sm:block" />
            © {new Date().getFullYear()} MovieMood. All cinematic rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}