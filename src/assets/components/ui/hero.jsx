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
            className="group relative w-60 transform rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-2 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:from-violet-500 hover:to-purple-500 hover:shadow-xl hover:shadow-violet-500/60 shadow-lg shadow-violet-600/40"
          >
            <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-violet-400/60 via-purple-500/50 to-violet-400/60 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative">Get Started</span>
          </button>
          <button className="w-60 transform rounded-lg border border-violet-500/30 bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-violet-950/50 hover:border-violet-400/50 hover:shadow-lg hover:shadow-violet-500/20">
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
          className="relative z-10 mt-20"
        >
          {/* Asymmetric ambient glow effects */}
          <div className="absolute -top-12 -left-16 h-48 w-64 rounded-full bg-violet-500/20 blur-[100px]"></div>
          <div className="absolute -bottom-10 -right-20 h-56 w-72 rounded-full bg-purple-500/18 blur-[120px]"></div>
          <div className="absolute top-1/4 -left-12 h-36 w-48 rounded-full bg-violet-400/15 blur-[80px]"></div>
          <div className="absolute bottom-1/3 -right-10 h-40 w-52 rounded-full bg-indigo-500/12 blur-[100px]"></div>
          
          {/* Top area glow effects */}
          <div className="absolute -top-8 -right-12 h-40 w-56 rounded-full bg-violet-400/18 blur-[90px]"></div>
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 h-32 w-48 rounded-full bg-purple-400/16 blur-[85px]"></div>
          <div className="absolute -top-14 -left-8 h-36 w-44 rounded-full bg-violet-300/14 blur-[95px]"></div>
          <div className="absolute -top-16 -right-6 h-44 w-60 rounded-full bg-purple-300/12 blur-[110px]"></div>
          <div className="absolute -top-12 left-1/4 h-28 w-40 rounded-full bg-violet-500/15 blur-[75px]"></div>
          <div className="absolute -top-18 right-1/4 h-32 w-44 rounded-full bg-indigo-400/13 blur-[105px]"></div>
          
          {/* Additional top-right focused glow */}
          <div className="absolute -top-20 -right-8 h-52 w-68 rounded-full bg-violet-500/16 blur-[130px]"></div>
          <div className="absolute -top-6 -right-16 h-36 w-50 rounded-full bg-purple-400/14 blur-[85px]"></div>
          <div className="absolute -top-14 -right-2 h-40 w-56 rounded-full bg-violet-300/12 blur-[100px]"></div>
          
          {/* Main container */}
          <div className="relative rounded-3xl border border-violet-500/20 bg-gradient-to-br from-neutral-900 to-violet-950/30 p-4 shadow-2xl shadow-violet-500/20">
            <div className="relative w-full overflow-hidden rounded-xl border-2 border-transparent bg-gradient-to-b from-violet-500/50 via-purple-500/40 to-violet-500/50">
              <div className="rounded-xl bg-neutral-900 overflow-hidden">
                <img
                  src="/land/dashboard.png"
                  alt="LMS Dashboard preview"
                  className="aspect-[16/9] h-auto w-full object-cover"
                  height={1000}
                  width={1000}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}