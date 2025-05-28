import React from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

export function HeroSectionOne() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/signin');
  };

  return (
    <div className="relative mx-auto my-10 flex max-w-7xl flex-col items-center justify-center">
      <div className="pt-2 pb-10 md:pb-20">
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="mb-2">
            {"Department of"
              .split(" ")
              .map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.1,
                    ease: "easeInOut",
                  }}
                  className="mr-2 inline-block text-lg font-normal text-neutral-400 md:text-xl lg:text-2xl"
                >
                  {word}
                </motion.span>
              ))}
          </div>
          <h1 className="text-2xl font-bold text-slate-300 md:text-4xl lg:text-7xl">
            {"Electronics and Instrumentation Engg."
              .split(" ")
              .map((word, index) => (
                <motion.span
                  key={index + 2}
                  initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: (index + 2) * 0.1,
                    ease: "easeInOut",
                  }}
                  className="mr-2 inline-block"
                >
                  {word}
                </motion.span>
              ))}
          </h1>
        </div>
        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 0.8,
          }}
          className="relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal text-neutral-400"
        >
          Your all-in-one Learning Management System to manage courses, attendance, assignments, tests, resources, reports and doubts.
        </motion.p>
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 1,
          }}
          className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <button 
            onClick={handleGetStarted}
            className="w-60 transform rounded-lg bg-white px-6 py-2 font-medium text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-200"
          >
            Get Started
          </button>
          <button className="w-60 transform rounded-lg border border-gray-700 bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-900">
            Learn More
          </button>
        </motion.div>
        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.3,
            delay: 1.2,
          }}
          className="relative z-10 mt-20 rounded-3xl border border-neutral-800 bg-neutral-900 p-4 shadow-md"
        >
          <div className="w-full overflow-hidden rounded-xl border border-gray-700">
            <img
              src="/land/dashboard.png"
              alt="LMS Dashboard preview"
              className="aspect-[16/9] h-auto w-full object-cover"
              height={1000}
              width={1000}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}