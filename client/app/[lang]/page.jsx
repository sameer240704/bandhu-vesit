"use client";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Brain,
  Heart,
  Users,
  Gamepad2,
  Mail,
  Phone,
  MessageCircle,
  ArrowRight,
  PlayCircle,
  Star,
  Award,
  Sparkles,
} from "lucide-react";
import Waves from "@/components/ui/waves";
import Navbar from "@/components/Home/Navbar";

const LandingPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const categories = [
    {
      title: "Motor Skills",
      icon: <Gamepad2 className="w-8 h-8" />,
      description:
        "Interactive games designed to improve hand-eye coordination and fine motor skills through engaging activities.",
      color: "from-blue-500 to-blue-600",
      stats: "15+ Games",
      features: [
        "Hand-eye Coordination",
        "Fine Motor Control",
        "Physical Response",
      ],
    },
    {
      title: "Emotional Learning",
      icon: <Heart className="w-8 h-8" />,
      description:
        "Games that help children understand and express emotions while building emotional resilience.",
      color: "from-red-500 to-red-600",
      stats: "12+ Games",
      features: ["Emotion Recognition", "Self-expression", "Empathy Building"],
    },
    {
      title: "Cognitive Development",
      icon: <Brain className="w-8 h-8" />,
      description:
        "Brain-training games that enhance memory, problem-solving, and critical thinking abilities.",
      color: "from-purple-500 to-purple-600",
      stats: "20+ Games",
      features: ["Memory Training", "Problem Solving", "Pattern Recognition"],
    },
    {
      title: "Social Skills",
      icon: <Users className="w-8 h-8" />,
      description:
        "Multiplayer games that promote social interaction, communication, and teamwork.",
      color: "from-green-500 to-green-600",
      stats: "10+ Games",
      features: ["Team Collaboration", "Communication", "Social Interaction"],
    },
  ];

  const stats = [
    {
      number: "1000+",
      label: "Happy Children",
      icon: <Star className="w-6 h-6" />,
    },
    {
      number: "50+",
      label: "Unique Games",
      icon: <Gamepad2 className="w-6 h-6" />,
    },
    {
      number: "95%",
      label: "Success Rate",
      icon: <Award className="w-6 h-6" />,
    },
    {
      number: "24/7",
      label: "Support",
      icon: <Sparkles className="w-6 h-6" />,
    },
  ];

  return (
    <div className="min-h-screen overflow-x-clip bg-gradient-to-br from-indigo-50 to-purple-50">
      <Waves
        lineColor="#B2A5FF"
        backgroundColor="#DAD2FF"
        waveSpeedX={0.07}
        waveSpeedY={0.05}
        waveAmpX={40}
        waveAmpY={20}
        friction={0.9}
        tension={0.01}
        maxCursorMove={120}
        xGap={12}
        yGap={36}
        className="fixed top-0 left-0 w-full h-full z-0"
      />

      <Navbar />

      {/* Hero Section */}
      <div>
        <motion.div
          className="relative pt-32 pb-40 px-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="max-w-7xl mx-auto text-center"
            variants={itemVariants}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block p-2 px-4 bg-white/30 backdrop-blur-sm rounded-full mb-6"
            >
              <span className="text-indigo-600 font-semibold flex items-center gap-2">
                <PlayCircle className="w-5 h-5" /> Start Your Learning Journey
                Today
              </span>
            </motion.div>

            <h1 className="text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Learning Through Play
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Transforming education through interactive games designed
              specifically for children with special needs. Make learning fun,
              engaging, and effective.
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-6 text-lg rounded-full hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
                onClick={() => (window.location.href = "#games")}
              >
                Explore Games <ArrowRight className="ml-2" />
              </Button>
              <Button
                variant="outline"
                className="px-8 py-6 text-lg rounded-full border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                onClick={() => (window.location.href = "#contact")}
              >
                Contact Us
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Stats Section */}
      <motion.div
        className="relative z-10 py-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center"
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    {stat.icon}
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-indigo-600 mb-2">
                  {stat.number}
                </h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Categories Section */}
      <motion.div
        id="games"
        className="relative z-10 py-20 px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-4xl font-bold text-center m-16 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
            variants={itemVariants}
          >
            Learning Categories
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category) => (
              <motion.div
                key={category.title}
                className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300"
                variants={itemVariants}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
              >
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${category.color} text-white flex items-center justify-center mb-6 shadow-lg`}
                >
                  {category.icon}
                </div>
                <span className="inline-block px-4 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-medium mb-4">
                  {category.stats}
                </span>
                <h3 className="text-xl font-bold mb-4">{category.title}</h3>
                <p className="text-gray-600 mb-6">{category.description}</p>
                <div className="space-y-2">
                  {category.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center text-gray-500"
                    >
                      <div className="w-2 h-2 rounded-full bg-indigo-400 mr-2" />
                      {feature}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Contact Section */}
      <motion.div
        id="contact"
        className="relative z-10 py-20 px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-12">
          <motion.h2
            className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
            variants={itemVariants}
          >
            Get in Touch
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div variants={itemVariants} className="space-y-8">
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-center p-4 bg-indigo-50 rounded-xl">
                  <Mail className="w-6 h-6 text-indigo-600 mr-4" />
                  <div>
                    <p className="font-medium">Email Us</p>
                    <p className="text-gray-600">support@eduplay.com</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-indigo-50 rounded-xl">
                  <Phone className="w-6 h-6 text-indigo-600 mr-4" />
                  <div>
                    <p className="font-medium">Call Us</p>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-indigo-50 rounded-xl">
                  <MessageCircle className="w-6 h-6 text-indigo-600 mr-4" />
                  <div>
                    <p className="font-medium">Live Chat</p>
                    <p className="text-gray-600">Available 24/7</p>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.form
              className="space-y-6"
              variants={itemVariants}
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="text"
                placeholder="Your Name"
                className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              <textarea
                placeholder="Your Message"
                rows={4}
                className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all">
                Send Message
              </Button>
            </motion.form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
