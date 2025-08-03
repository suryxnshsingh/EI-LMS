"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs } from "./tabs";

export function TabsDemo() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById('tabs-demo');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  const tabs = [
    {
      title: "Attendance",
      value: "attendance",
      content: (
        <TabContent 
          description="Track attendance in real-time"
          gradient="from-blue-600/20 via-blue-700/10 to-indigo-800/20"
        />
      ),
    },
    {
      title: "Quizzes",
      value: "quizzes",
      content: (
        <TabContent 
          description="Create and manage quizzes"
          gradient="from-emerald-600/20 via-teal-700/10 to-cyan-800/20"
        />
      ),
    },
    {
      title: "Assignments",
      value: "assignments",
      content: (
        <TabContent 
          description="Streamline assignment workflow"
          gradient="from-purple-600/20 via-violet-700/10 to-purple-800/20"
        />
      ),
    },
    {
      title: "Student Management",
      value: "student-management",
      content: (
        <TabContent 
          description="Complete student portal"
          gradient="from-orange-600/20 via-red-600/10 to-pink-700/20"
        />
      ),
    },
    {
      title: "Simulators",
      value: "simulators",
      content: (
        <TabContent 
          description="Interactive circuit simulators"
          gradient="from-cyan-600/20 via-teal-700/10 to-blue-800/20"
        />
      ),
    },
    {
      title: "HOD Panel",
      value: "hod-panel",
      content: (
        <TabContent 
          description="Department management tools"
          gradient="from-rose-600/20 via-pink-700/10 to-red-800/20"
        />
      ),
    },
    {
      title: "AI Doubt Solver",
      value: "ai-doubt-solver",
      content: (
        <TabContent 
          description="Instant AI-powered solutions"
          gradient="from-violet-600/20 via-indigo-700/10 to-purple-800/20"
        />
      ),
    },
  ];

  return (
    <div 
      id="tabs-demo"
      className="relative w-full py-16 overflow-hidden"
    >
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10"
      >
        {/* Section Header */}
        <div className="text-center mb-12 max-w-3xl mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-5xl font-bold text-white mb-4"
          >
            Everything in{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              One Platform
            </span>
          </motion.h2>
        </div>

        {/* Tabs Container */}
        <div className="h-[20rem] md:h-[35rem] [perspective:1000px] relative flex flex-col max-w-5xl mx-auto w-full items-start justify-start px-4">
          <Tabs tabs={tabs} />
        </div>
      </motion.div>
    </div>
  );
}

const TabContent = ({ description, gradient }) => {
  return (
    <div className={`w-full overflow-hidden relative h-full rounded-2xl bg-gradient-to-br ${gradient} border border-white/10 backdrop-blur-xl`}>
      {/* Content */}
      <div className="relative z-10 p-6 h-full flex flex-col">
        {/* Small text overlay */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-4"
        >
          <p className="text-sm md:text-base text-white/80 font-medium">
            {description}
          </p>
        </motion.div>
        
        {/* Dashboard Preview - takes majority of space */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex-1 relative"
        >
          <div className="relative overflow-hidden rounded-xl border border-white/20 backdrop-blur-2xl bg-white/5 h-full">
            <img
              src="/land/dashboard.png"
              alt="Dashboard Preview"
              className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const DummyContent = () => {
  return (
    <img
      src="/land/dashboard.png"
      alt="dummy image"
      className="object-cover object-left-top h-[60%] md:h-[90%] absolute -bottom-10 inset-x-0 w-[90%] rounded-xl mx-auto"
    />
  );
};
