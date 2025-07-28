import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Clock, ChevronRight } from "lucide-react";

export default function Contacts() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setFormData({ name: "", email: "", message: "" });
      
      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    }, 1500);
  };

  const contactMethods = [
    {
      icon: <Mail className="w-6 h-6 text-purple-400" />,
      title: "Email Us",
      description: "Our team will get back to you within 24 hours",
      value: "support@moviemood.com",
      action: "mailto:support@moviemood.com"
    },
    {
      icon: <Phone className="w-6 h-6 text-blue-400" />,
      title: "Call Us",
      description: "Mon-Fri from 9am to 5pm",
      value: "+1 (555) 123-4567",
      action: "tel:+15551234567"
    },
    {
      icon: <MapPin className="w-6 h-6 text-pink-400" />,
      title: "Visit Us",
      description: "Come say hello at our office",
      value: "123 Cinema Lane, Hollywood, CA 90210",
      action: "https://maps.google.com"
    }
  ];

  return (
    <div className="bg-gray-950 text-gray-100 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-gray-950 to-black z-0" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Have questions or feedback? We'd love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 bg-gray-900/50">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {contactMethods.map((method, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 hover:border-purple-500/30 transition-all"
              >
                <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center mb-4">
                  {method.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{method.title}</h3>
                <p className="text-gray-400 mb-4">{method.description}</p>
                <a
                  href={method.action}
                  className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors"
                >
                  {method.value} <ChevronRight className="w-4 h-4 ml-1" />
                </a>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(168,85,247,0.1)_0%,_transparent_70%)] z-0" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="md:flex">
              {/* Form Side */}
              <div className="md:w-1/2 p-8 md:p-12">
                <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
                
                {submitStatus === "success" ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6"
                  >
                    <div className="flex items-center">
                      <Check className="w-5 h-5 text-green-400 mr-2" />
                      <span>Your message has been sent successfully!</span>
                    </div>
                  </motion.div>
                ) : null}

                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">
                        Your Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows="5"
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        required
                      ></textarea>
                    </div>

                    <div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-purple-500/30 flex items-center justify-center"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5 mr-2" />
                            Send Message
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Info Side */}
              <div className="md:w-1/2 bg-gradient-to-br from-purple-900/20 to-gray-900 p-8 md:p-12 flex flex-col">
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                  <p className="text-gray-400">
                    Fill out the form or use our contact details to get in touch with our team.
                  </p>
                </div>

                <div className="space-y-6 mt-auto">
                  <div className="flex items-start">
                    <Clock className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium mb-1">Working Hours</h4>
                      <p className="text-gray-400 text-sm">
                        Monday - Friday: 9:00 AM - 6:00 PM<br />
                        Saturday: 10:00 AM - 4:00 PM<br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Mail className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium mb-1">Email Us</h4>
                      <p className="text-gray-400 text-sm">
                        General: hello@moviemood.com<br />
                        Support: support@moviemood.com
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-900/30">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Headquarters</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Visit us at our Hollywood office for a personalized experience
            </p>
          </div>
          
          <div className="aspect-w-16 aspect-h-9 bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
            {/* Replace with your actual map embed */}
            <div className="w-full h-96 flex items-center justify-center bg-gradient-to-br from-purple-900/20 to-gray-900">
              <MapPin className="w-12 h-12 text-pink-400" />
              <span className="sr-only">Map placeholder</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}