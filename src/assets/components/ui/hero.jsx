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
  
  // Mobile performance detection - disable beams on very low-end devices
  const [mobilePerformanceMode, setMobilePerformanceMode] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth < 768;
      setIsMobile(isMobileDevice);
      
      // Check for low-end mobile devices
      if (isMobileDevice) {
        const isLowEnd = (
          navigator.hardwareConcurrency <= 2 || // 2 or fewer CPU cores
          navigator.deviceMemory <= 2 ||        // 2GB or less RAM
          /Android.*[2-4]\./.test(navigator.userAgent) // Old Android versions
        );
        setMobilePerformanceMode(isLowEnd);
      }
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
      initialX: -500,
      translateX: 0,
      initialY: -400,
      translateY: 800,
      duration: 5.5,
      repeatDelay: 6,
      delay: 0,
      className: "h-8",
    },
    {
      initialX: -350,
      translateX: 0,
      initialY: -350,
      translateY: 750,
      duration: 6,
      repeatDelay: 6,
      delay: 1,
      className: "h-10",
    },
    {
      initialX: -200,
      translateX: 0,
      initialY: -380,
      translateY: 780,
      duration: 5.8,
      repeatDelay: 6,
      delay: 2,
      className: "h-9",
    },
    {
      initialX: -50,
      translateX: 0,
      initialY: -420,
      translateY: 820,
      duration: 6.2,
      repeatDelay: 6,
      delay: 3,
      className: "h-11",
    },
    {
      initialX: 50,
      translateX: 0,
      initialY: -360,
      translateY: 760,
      duration: 5.6,
      repeatDelay: 6,
      delay: 4,
      className: "h-8",
    },
    {
      initialX: 200,
      translateX: 0,
      initialY: -390,
      translateY: 790,
      duration: 6.1,
      repeatDelay: 6,
      delay: 5,
      className: "h-10",
    },
    {
      initialX: 350,
      translateX: 0,
      initialY: -340,
      translateY: 740,
      duration: 5.9,
      repeatDelay: 6,
      delay: 0.5,
      className: "h-9",
    },
    {
      initialX: 500,
      translateX: 0,
      initialY: -410,
      translateY: 810,
      duration: 5.7,
      repeatDelay: 6,
      delay: 1.5,
      className: "h-11",
    },
    {
      initialX: -400,
      translateX: 0,
      initialY: -370,
      translateY: 770,
      duration: 6.3,
      repeatDelay: 6,
      delay: 2.5,
      className: "h-8",
    },
    {
      initialX: -250,
      translateX: 0,
      initialY: -330,
      translateY: 730,
      duration: 5.4,
      repeatDelay: 6,
      delay: 3.5,
      className: "h-12",
    },
    {
      initialX: -100,
      translateX: 0,
      initialY: -450,
      translateY: 850,
      duration: 6.4,
      repeatDelay: 6,
      delay: 4.5,
      className: "h-7",
    },
    {
      initialX: 100,
      translateX: 0,
      initialY: -320,
      translateY: 720,
      duration: 5.3,
      repeatDelay: 6,
      delay: 5.5,
      className: "h-10",
    },
    {
      initialX: 250,
      translateX: 0,
      initialY: -400,
      translateY: 800,
      duration: 6.5,
      repeatDelay: 6,
      delay: 0.8,
      className: "h-9",
    },
    {
      initialX: 400,
      translateX: 0,
      initialY: -360,
      translateY: 760,
      duration: 5.2,
      repeatDelay: 6,
      delay: 1.8,
      className: "h-8",
    },
  ];

  // Optimized beams for mobile - 8 beams, no collision detection
  const mobileBeams = [
    {
      initialX: -250,
      translateX: 0,
      initialY: -350,
      translateY: 650,
      duration: 7,
      repeatDelay: 8,
      delay: 0,
      className: "h-6",
    },
    {
      initialX: -150,
      translateX: 0,
      initialY: -320,
      translateY: 620,
      duration: 7.5,
      repeatDelay: 8,
      delay: 1,
      className: "h-8",
    },
    {
      initialX: -80,
      translateX: 0,
      initialY: -380,
      translateY: 680,
      duration: 7.2,
      repeatDelay: 8,
      delay: 2,
      className: "h-7",
    },
    {
      initialX: -20,
      translateX: 0,
      initialY: -340,
      translateY: 640,
      duration: 7.8,
      repeatDelay: 8,
      delay: 3,
      className: "h-6",
    },
    {
      initialX: 20,
      translateX: 0,
      initialY: -360,
      translateY: 660,
      duration: 7.3,
      repeatDelay: 8,
      delay: 4,
      className: "h-7",
    },
    {
      initialX: 80,
      translateX: 0,
      initialY: -330,
      translateY: 630,
      duration: 7.6,
      repeatDelay: 8,
      delay: 5,
      className: "h-8",
    },
    {
      initialX: 150,
      translateX: 0,
      initialY: -370,
      translateY: 670,
      duration: 7.1,
      repeatDelay: 8,
      delay: 6,
      className: "h-6",
    },
    {
      initialX: 250,
      translateX: 0,
      initialY: -350,
      translateY: 650,
      duration: 7.4,
      repeatDelay: 8,
      delay: 7,
      className: "h-7",
    },
  ];

  const currentBeams = isMobile ? mobileBeams : beams;
  const shouldShowBeams = BEAMS_ENABLED && !mobilePerformanceMode;

  return (
    <div ref={parentRef} className="relative mx-auto my-10 flex flex-col items-center justify-center px-4 overflow-hidden md:overflow-visible">
      {/* Collision Beams - Optimized for mobile */}
      {shouldShowBeams && currentBeams.map((beam, index) => (
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
          className="relative z-10 mt-8 flex items-center justify-center px-4"
        >
          <motion.button 
            onClick={handleGetStarted}
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative px-8 py-3 rounded-full bg-gradient-to-r from-violet-600/20 to-purple-600/20 hover:from-violet-500/30 hover:to-purple-500/30 border border-violet-500/30 hover:border-violet-400/50 text-white font-medium text-lg transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/25"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-400/0 via-violet-300/10 to-purple-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative flex items-center gap-2">
              Get Started
              <svg 
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </motion.button>
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
    // Skip collision detection entirely on mobile for better performance
    if (isMobile) return;
    
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

    // Only run collision detection on desktop
    const animationInterval = setInterval(checkCollision, 50);

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
          ease: isMobile ? "linear" : "linear",
          delay: beamOptions.delay || 0,
          repeatDelay: beamOptions.repeatDelay || 0,
        }}
        className={`absolute left-1/2 top-0 m-auto w-px rounded-full bg-gradient-to-b from-transparent via-violet-500 to-purple-500 opacity-80 ${beamOptions.className || "h-10"}`}
        style={{
          // Force hardware acceleration on mobile
          willChange: isMobile ? "transform" : "auto",
          transform: isMobile ? "translateZ(0)" : "none",
          backfaceVisibility: isMobile ? "hidden" : "visible",
          perspective: isMobile ? "1000px" : "none",
        }}
      />
      <AnimatePresence>
        {!isMobile && collision.detected && collision.coordinates && (
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
  const particleCount = isMobile ? 3 : 20;
  const spans = Array.from({ length: particleCount }, (_, index) => ({
    id: index,
    initialX: 0,
    initialY: 0,
    directionX: Math.floor(Math.random() * (isMobile ? 40 : 80) - (isMobile ? 20 : 40)),
    directionY: Math.floor(Math.random() * (isMobile ? -30 : -50) - 10),
  }));

  return (
    <div {...props} className={`absolute z-50 h-2 w-2 ${props.className}`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ 
          duration: isMobile ? 1 : 1.5, 
          ease: "easeOut" 
        }}
        className={`absolute -inset-x-10 top-0 m-auto h-2 w-10 rounded-full bg-gradient-to-r from-transparent via-violet-500 to-transparent ${isMobile ? 'blur-sm' : 'blur-sm'}`}
        style={{
          // Mobile optimization
          willChange: isMobile ? "transform, opacity" : "auto",
          transform: isMobile ? "translateZ(0)" : "none",
        }}
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
          transition={{ 
            duration: isMobile ? Math.random() * 1 + 0.5 : Math.random() * 1.5 + 0.5, 
            ease: "easeOut" 
          }}
          className="absolute h-1 w-1 rounded-full bg-gradient-to-b from-violet-500 to-purple-500"
          style={{
            // Mobile optimization
            willChange: isMobile ? "transform, opacity" : "auto",
            transform: isMobile ? "translateZ(0)" : "none",
          }}
        />
      ))}
    </div>
  );
};