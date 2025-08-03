import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";

export function HeroSectionOne() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const parentRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // Toggle this to enable/disable beams for performance testing
  const BEAMS_ENABLED = true;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleGetStarted = () => {
    navigate('/signin');
  };

  const beams = [
    {
      initialX: -600,
      translateX: 0,
      initialY: -400,
      translateY: 800,
      duration: 6,
      repeatDelay: 4,
      delay: 1,
      className: "h-8",
    },
    {
      initialX: -480,
      translateX: 0,
      initialY: -300,
      translateY: 700,
      duration: 5,
      repeatDelay: 6,
      delay: 2.5,
      className: "h-12",
    },
    {
      initialX: -360,
      translateX: 0,
      initialY: -350,
      translateY: 750,
      duration: 7,
      repeatDelay: 5,
      delay: 0.5,
      className: "h-6",
    },
    {
      initialX: -240,
      translateX: 0,
      initialY: -280,
      translateY: 680,
      duration: 4.5,
      repeatDelay: 7,
      delay: 3,
      className: "h-10",
    },
    {
      initialX: -120,
      translateX: 0,
      initialY: -420,
      translateY: 820,
      duration: 6.5,
      repeatDelay: 4,
      delay: 1.5,
      className: "h-14",
    },
    {
      initialX: 0,
      translateX: 0,
      initialY: -380,
      translateY: 780,
      duration: 5.5,
      repeatDelay: 8,
      delay: 4,
      className: "h-8",
    },
    {
      initialX: 120,
      translateX: 0,
      initialY: -320,
      translateY: 720,
      duration: 5.2,
      repeatDelay: 6,
      delay: 0.8,
      className: "h-9",
    },
    {
      initialX: 240,
      translateX: 0,
      initialY: -450,
      translateY: 850,
      duration: 6.8,
      repeatDelay: 5,
      delay: 2.2,
      className: "h-11",
    },
    {
      initialX: 360,
      translateX: 0,
      initialY: -360,
      translateY: 760,
      duration: 4.8,
      repeatDelay: 7,
      delay: 3.8,
      className: "h-7",
    },
    {
      initialX: 480,
      translateX: 0,
      initialY: -390,
      translateY: 790,
      duration: 5.8,
      repeatDelay: 4,
      delay: 1.2,
      className: "h-13",
    },
    {
      initialX: 600,
      translateX: 0,
      initialY: -340,
      translateY: 740,
      duration: 6.2,
      repeatDelay: 6,
      delay: 2.8,
      className: "h-10",
    },
    {
      initialX: -180,
      translateX: 0,
      initialY: -410,
      translateY: 810,
      duration: 5.6,
      repeatDelay: 8,
      delay: 4.5,
      className: "h-8",
    },
    {
      initialX: 180,
      translateX: 0,
      initialY: -330,
      translateY: 730,
      duration: 6.4,
      repeatDelay: 5.5,
      delay: 3.2,
      className: "h-9",
    },
    {
      initialX: -540,
      translateX: 0,
      initialY: -370,
      translateY: 770,
      duration: 5.9,
      repeatDelay: 7.5,
      delay: 1.8,
      className: "h-11",
    },
    {
      initialX: 540,
      translateX: 0,
      initialY: -440,
      translateY: 840,
      duration: 7.1,
      repeatDelay: 4.5,
      delay: 2.1,
      className: "h-7",
    },
    {
      initialX: -420,
      translateX: 0,
      initialY: -290,
      translateY: 690,
      duration: 5.3,
      repeatDelay: 6.8,
      delay: 3.5,
      className: "h-12",
    },
    {
      initialX: 420,
      translateX: 0,
      initialY: -480,
      translateY: 880,
      duration: 6.7,
      repeatDelay: 4.2,
      delay: 1.7,
      className: "h-6",
    },
    {
      initialX: -300,
      translateX: 0,
      initialY: -310,
      translateY: 710,
      duration: 4.9,
      repeatDelay: 7.3,
      delay: 2.9,
      className: "h-15",
    },
    {
      initialX: 300,
      translateX: 0,
      initialY: -350,
      translateY: 750,
      duration: 5.1,
      repeatDelay: 6.1,
      delay: 4.2,
      className: "h-9",
    },
    {
      initialX: -60,
      translateX: 0,
      initialY: -400,
      translateY: 800,
      duration: 5.7,
      repeatDelay: 5.8,
      delay: 1.4,
      className: "h-11",
    },
    {
      initialX: 60,
      translateX: 0,
      initialY: -270,
      translateY: 670,
      duration: 6.3,
      repeatDelay: 7.1,
      delay: 3.7,
      className: "h-8",
    },
  ];

  // Reduced beams for mobile performance - only 3 beams instead of 21
  const mobileBeams = [
    {
      initialX: -200,
      translateX: 0,
      initialY: -400,
      translateY: 800,
      duration: 7,
      repeatDelay: 8,
      delay: 1,
      className: "h-8",
    },
    {
      initialX: 0,
      translateX: 0,
      initialY: -380,
      translateY: 780,
      duration: 6.5,
      repeatDelay: 9,
      delay: 3,
      className: "h-10",
    },
    {
      initialX: 200,
      translateX: 0,
      initialY: -350,
      translateY: 750,
      duration: 6.8,
      repeatDelay: 8.5,
      delay: 2,
      className: "h-9",
    },
  ];

  const currentBeams = isMobile ? mobileBeams : beams;

  return (
    <div ref={parentRef} className="relative mx-auto my-10 flex flex-col items-center justify-center px-4 overflow-hidden md:overflow-visible">
      {/* Collision Beams - Optimized for mobile */}
      {BEAMS_ENABLED && currentBeams.map((beam, index) => (
        <CollisionBeam
          key={index + "beam-idx"}
          beamOptions={beam}
          containerRef={containerRef}
          parentRef={parentRef}
          isMobile={isMobile}
        />
      ))}
      
      <div className="pt-2 pb-10 md:pb-20">
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="mb-2">
            {"Department of"
              .split(" ")
              .map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, filter: isMobile ? "blur(0px)" : "blur(4px)", y: isMobile ? 5 : 10 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  transition={{
                    duration: isMobile ? 0.2 : 0.3,
                    delay: index * (isMobile ? 0.05 : 0.1),
                    ease: "easeInOut",
                  }}
                  className="mr-2 inline-block text-lg font-normal text-neutral-400 md:text-xl lg:text-2xl"
                >
                  {word}
                </motion.span>
              ))}
          </div>
          <h1 className="text-xl font-bold text-slate-300 sm:text-2xl md:text-4xl lg:text-7xl">
            {"Electronics and Instrumentation Engg."
              .split(" ")
              .map((word, index) => (
                <motion.span
                  key={index + 2}
                  initial={{ opacity: 0, filter: isMobile ? "blur(0px)" : "blur(4px)", y: isMobile ? 5 : 10 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  transition={{
                    duration: isMobile ? 0.2 : 0.3,
                    delay: (index + 2) * (isMobile ? 0.05 : 0.1),
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
          className="relative z-10 mx-auto max-w-xl py-4 text-center text-base sm:text-lg font-normal text-neutral-400 px-4"
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
          className="relative z-10 mt-8 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 px-4"
        >
          <button 
            onClick={handleGetStarted}
            className="group relative w-full sm:w-60 max-w-xs transform rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-2 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:from-violet-500 hover:to-purple-500 hover:shadow-xl hover:shadow-violet-500/60 shadow-lg shadow-violet-600/40"
          >
            <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-violet-400/60 via-purple-500/50 to-violet-400/60 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative">Get Started</span>
          </button>
          <button className="w-full sm:w-60 max-w-xs transform rounded-lg border border-violet-500/30 bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-violet-950/50 hover:border-violet-400/50 hover:shadow-lg hover:shadow-violet-500/20">
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
          className="relative z-10 mt-20 px-2 md:px-12 xl:px-0"
        >
          {/* Asymmetric glow effects - organic and uneven, no top glow */}
          {/* Stronger left side glow */}
          <div className="absolute top-1/4 -left-8 h-44 w-60 sm:h-64 sm:w-80 sm:-left-16 rounded-[60%] bg-violet-500/18 blur-[140px] rotate-12"></div>
          <div className="absolute top-1/3 -left-12 h-36 w-52 sm:h-52 sm:w-72 sm:-left-20 rounded-[70%] bg-purple-400/14 blur-[120px] -rotate-6"></div>
          
          {/* Enhanced bottom glow */}
          <div className="absolute -bottom-12 -left-6 h-40 w-56 sm:h-60 sm:w-80 sm:-left-12 sm:-bottom-16 rounded-[65%] bg-purple-500/16 blur-[160px] rotate-8"></div>
          <div className="absolute -bottom-8 -right-6 h-36 w-52 sm:h-56 sm:w-72 sm:-right-12 sm:-bottom-12 rounded-[65%] bg-purple-500/12 blur-[150px] rotate-6"></div>
          <div className="absolute bottom-1/4 -right-10 h-32 w-48 sm:h-48 sm:w-64 sm:-right-16 rounded-[55%] bg-indigo-400/10 blur-[130px] -rotate-12"></div>
          
          {/* Enhanced right side glow */}
          <div className="absolute top-1/2 -right-8 h-36 w-52 sm:h-52 sm:w-68 sm:-right-14 rounded-[60%] bg-violet-400/12 blur-[120px] rotate-[20deg]"></div>
          <div className="absolute bottom-1/3 -right-4 h-28 w-40 sm:h-40 sm:w-56 sm:-right-8 rounded-[75%] bg-purple-300/10 blur-[110px] -rotate-[25deg]"></div>
          
          {/* Larger screen enhancements - more dramatic asymmetry, no top glow */}
          <div className="hidden md:block absolute top-1/3 -left-12 h-72 w-88 rounded-[85%] bg-violet-500/15 blur-[200px] rotate-[18deg]"></div>
          <div className="hidden md:block absolute -bottom-20 -right-16 h-56 w-80 rounded-[70%] bg-purple-400/12 blur-[180px] -rotate-[22deg]"></div>
          <div className="hidden lg:block absolute bottom-1/4 -left-20 h-64 w-80 rounded-[90%] bg-violet-300/14 blur-[220px] rotate-[30deg]"></div>
          <div className="hidden lg:block absolute top-1/2 -right-12 h-48 w-68 rounded-[80%] bg-indigo-400/10 blur-[160px] -rotate-[15deg]"></div>
          
          {/* Organic outer glow layers - irregular and flowing, enhanced intensity */}
          <div className="absolute -inset-8 rounded-[40px] bg-gradient-to-br from-violet-500/20 via-transparent via-purple-500/16 to-violet-400/18 blur-xl transform rotate-1"></div>
          <div className="absolute -inset-12 rounded-[50px] bg-gradient-to-tl from-transparent via-violet-400/14 via-purple-400/12 to-violet-300/16 blur-2xl transform -rotate-2"></div>
          <div className="absolute -inset-16 rounded-[60px] bg-gradient-to-br from-violet-300/12 via-purple-300/8 via-transparent to-violet-200/14 blur-3xl transform rotate-1"></div>
          <div className="absolute -inset-20 rounded-[70px] bg-gradient-to-tl from-violet-200/10 via-transparent via-purple-200/8 to-violet-100/12 blur-[140px] transform -rotate-1"></div>
          
          {/* Collision target at the top border of image container */}
          <div
            ref={containerRef}
            className="absolute top-0 left-0 w-full h-1 pointer-events-none z-20"
          />
          
          {/* Main container */}
          <div className="relative rounded-3xl border border-violet-500/25 bg-gradient-to-br from-neutral-900 to-violet-950/15 p-2 sm:p-4 shadow-2xl shadow-violet-500/20">
            <div className="relative w-full overflow-hidden rounded-xl border-2 border-violet-500/30 bg-gradient-to-b from-violet-500/15 via-purple-500/12 to-violet-500/15">
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

const CollisionBeam = React.forwardRef(({ parentRef, containerRef, beamOptions = {}, isMobile = false }, ref) => {
  const beamRef = useRef(null);
  const [collision, setCollision] = useState({
    detected: false,
    coordinates: null,
  });
  const [beamKey, setBeamKey] = useState(0);
  const [cycleCollisionDetected, setCycleCollisionDetected] = useState(false);

  useEffect(() => {
    const checkCollision = () => {
      if (
        beamRef.current &&
        containerRef.current &&
        parentRef.current &&
        !cycleCollisionDetected
      ) {
        const beamRect = beamRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        const parentRect = parentRef.current.getBoundingClientRect();

        // Check if beam reaches the top border of the image container
        if (beamRect.bottom >= containerRect.top) {
          const relativeX =
            beamRect.left - parentRect.left + beamRect.width / 2;
          const relativeY = beamRect.bottom - parentRect.top;

          setCollision({
            detected: true,
            coordinates: {
              x: relativeX,
              y: relativeY,
            },
          });
          setCycleCollisionDetected(true);
        }
      }
    };

    // Less frequent collision checking on mobile for better performance
    const animationInterval = setInterval(checkCollision, isMobile ? 150 : 50);

    return () => clearInterval(animationInterval);
  }, [cycleCollisionDetected, containerRef, isMobile]);

  useEffect(() => {
    if (collision.detected && collision.coordinates) {
      setTimeout(() => {
        setCollision({ detected: false, coordinates: null });
        setCycleCollisionDetected(false);
      }, 2000);

      setTimeout(() => {
        setBeamKey((prevKey) => prevKey + 1);
      }, 2000);
    }
  }, [collision]);

  return (
    <>
      <motion.div
        key={beamKey}
        ref={beamRef}
        animate="animate"
        initial={{
          translateY: beamOptions.initialY || "-400px",
          translateX: beamOptions.initialX || "0px",
          rotate: beamOptions.rotate || 0,
        }}
        variants={{
          animate: {
            translateY: beamOptions.translateY || "800px",
            translateX: beamOptions.initialX || "0px",
            rotate: beamOptions.rotate || 0,
          },
        }}
        transition={{
          duration: beamOptions.duration || 6,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
          delay: beamOptions.delay || 0,
          repeatDelay: beamOptions.repeatDelay || 0,
        }}
        className={`absolute left-1/2 top-0 m-auto w-px rounded-full bg-gradient-to-b from-transparent via-violet-500 to-purple-500 opacity-80 ${beamOptions.className || "h-10"}`}
      />
      <AnimatePresence>
        {collision.detected && collision.coordinates && (
          <Explosion
            key={`${collision.coordinates.x}-${collision.coordinates.y}`}
            className=""
            style={{
              left: `${collision.coordinates.x}px`,
              top: `${collision.coordinates.y}px`,
              transform: "translate(-50%, -50%)",
            }}
            isMobile={isMobile}
          />
        )}
      </AnimatePresence>
    </>
  );
});

CollisionBeam.displayName = "CollisionBeam";

const Explosion = ({ isMobile = false, ...props }) => {
  // Significantly reduce explosion particles on mobile for better performance
  const particleCount = isMobile ? 5 : 20;
  const spans = Array.from({ length: particleCount }, (_, index) => ({
    id: index,
    initialX: 0,
    initialY: 0,
    directionX: Math.floor(Math.random() * 80 - 40),
    directionY: Math.floor(Math.random() * -50 - 10),
  }));

  return (
    <div {...props} className={`absolute z-50 h-2 w-2 ${props.className}`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute -inset-x-10 top-0 m-auto h-2 w-10 rounded-full bg-gradient-to-r from-transparent via-violet-500 to-transparent blur-sm"
      />
      {spans.map((span) => (
        <motion.span
          key={span.id}
          initial={{ x: span.initialX, y: span.initialY, opacity: 1 }}
          animate={{
            x: span.directionX,
            y: span.directionY,
            opacity: 0,
          }}
          transition={{ duration: Math.random() * 1.5 + 0.5, ease: "easeOut" }}
          className="absolute h-1 w-1 rounded-full bg-gradient-to-b from-violet-500 to-purple-500"
        />
      ))}
    </div>
  );
};