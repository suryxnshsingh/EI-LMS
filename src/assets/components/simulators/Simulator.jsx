import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CanvasRevealEffect } from "../ui/canvas-reveal-effect";

export function Simulator() {
  return (
    <div className="w-full h-full m-10 mb-20 -left-10 md:m-20 flex flex-col">
      <h1 className="text-4xl font-bold chakra-petch-bold pb-10 md:pb-20 text-center ">Simulators</h1>
      
      {/* IITB VLabs Banner Card */}
      <BannerCard 
        title="IIT Bombay Virtual Labs" 
        icon={<IITBIcon />} 
        link="https://iitb.vlabs.co.in"
      >
        <CanvasRevealEffect
          animationSpeed={3}
          containerClassName="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 dark:bg-gradient-to-r dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900"
          colors={[
            [59, 130, 246],  // Blue
            [99, 102, 241],  // Indigo
            [139, 92, 246],  // Purple
          ]}
          dotSize={2}
        />
      </BannerCard>
      
      <div className="mx-auto max-w-5xl flex flex-row flex-wrap justify-center items-start gap-10 mt-12">
        <Card title="Digital Simulator" icon={<CircuitIcon />} link="https://circuitverse.org/simulator">
          <CanvasRevealEffect animationSpeed={5.1} containerClassName="bg-emerald-900 dark:bg-black" />
        </Card>
        <Card title="Circuit Simulator" icon={<CircuitBoardIcon />} link='https://eilms.vercel.app/circuit'>
          <CanvasRevealEffect
            animationSpeed={5}
            containerClassName="bg-purple-900 dark:bg-black"
            colors={[
              [59, 130, 246],
              [139, 92, 246],
            ]}
            dotSize={3} />
        </Card>
        <Card title="Spice Simulator" icon={<AceternityIcon />} link='https://eilms.vercel.app/spice'>
          <CanvasRevealEffect
            animationSpeed={5}
            containerClassName="bg-pink-900 dark:bg-black"
            colors={[
              [236, 72, 153],
              [232, 121, 249],
            ]}
            dotSize={3} />
        </Card>
        <Card title="Matlab Simulator" icon={<MatlabIcon />} link='https://www.mycompiler.io/new/octave'>
          <CanvasRevealEffect
            animationSpeed={5}
            containerClassName="bg-black"
            colors={[[125, 211, 252]]} 
            dotSize={4}/>
        </Card>
        <Card 
          title="VHDL/Verilog" 
          icon={<HDLIcon />} 
          link='https://www.edaplayground.com/' 
          infoText={`Instructions to use VHDL/Verilog Simulation:\n\n1. When the page opens, log in (necessary to run, save and share your code.)\n2. Select “VHDL” under Language, then write your design (design.vhd) and testbench (testbench.vhd) in their respective panels.\n3. Fill the Top Entity with your testbench entity name and select "GHDL 3.0.0" in "Tools and Silmulators".\n4. Enable “Open EPWave after run” under the simulator options,\n5. Hit Run to simulate and view waveforms for all signals.`}
        >
          <CanvasRevealEffect
            animationSpeed={5}
            containerClassName="bg-sky-900" 
            colors={[
              [14, 165, 233], 
              [56, 189, 248],
            ]}
            dotSize={3} />
        </Card>
      </div>
    </div>
  );
}

const BannerCard = ({ title, subtitle, icon, children, link }) => {
  const [hovered, setHovered] = React.useState(false);

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="border border-black/[0.2] group/canvas-card flex items-center justify-center dark:border-white/[0.2] bg-white dark:bg-black relative w-full max-w-4xl h-32 md:h-48 cursor-pointer mb-8 mx-auto"
    >
      <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-black" />

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full w-full absolute inset-0">
            {children}
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="relative z-20 flex flex-col items-center justify-center w-full h-full px-6 py-4">
        <div className="flex-shrink-0 mb-3 group-hover/canvas-card:-translate-y-2 transition duration-200">
          {icon}
        </div>
        <div className="text-center">
          <h2 className="card-text dark:text-white text-2xl md:text-3xl text-black font-bold group-hover/canvas-card:text-white group-hover/canvas-card:-translate-y-2 transition duration-200">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm md:text-base opacity-0 group-hover/canvas-card:opacity-100 text-gray-600 dark:text-gray-300 group-hover/canvas-card:text-gray-200 transition duration-200 group-hover/canvas-card:-translate-y-1 mt-2">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </a>
  );
};

const Card = ({ title, icon, children, link, disabled, infoText }) => {
  const [hovered, setHovered] = React.useState(false);
  const [infoHovered, setInfoHovered] = React.useState(false);

  return (
    <a
      href={disabled ? undefined : link}
      target={disabled ? undefined : "_blank"}
      rel={disabled ? undefined : "noopener noreferrer"}
      onClick={disabled ? (e) => e.preventDefault() : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`border border-black/[0.2] group/canvas-card flex items-center justify-center dark:border-white/[0.2] bg-white dark:bg-black relative w-72 h-48 md:h-96 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
      <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-black" />

      {infoText && (
        <div className="absolute top-2 right-2 z-30">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onMouseEnter={() => setInfoHovered(true)}
            onMouseLeave={() => setInfoHovered(false)}
            onClick={(e) => {
              e.preventDefault(); // Prevent link navigation
              e.stopPropagation(); // Prevent card hover state from being affected
            }}
            className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none transition-colors duration-150"
            aria-label="More info"
          >
            <InfoIcon />
          </motion.button>
          <AnimatePresence>
            {infoHovered && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="absolute right-0 mt-2 w-80 p-4 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl shadow-2xl text-sm text-left text-black dark:text-white whitespace-pre-line"
                style={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 20px 40px -10px rgba(0, 0, 0, 0.15)" }}
              >
                <h4 className="font-semibold mb-2 text-md text-slate-800 dark:text-slate-200">Instructions:</h4>
                {infoText.split('\\\\n').map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full w-full absolute inset-0">
            {children}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="relative z-20">
        <div className="text-center group-hover/canvas-card:-translate-y-4 group-hover/canvas-card:opacity-0 transition duration-200 w-full mx-auto flex items-center justify-center">
          {icon}
        </div>
        <h2 className="card-text dark:text-white text-3xl opacity-0 group-hover/canvas-card:opacity-100 relative z-10 text-black mt-4 font-bold group-hover/canvas-card:text-white group-hover/canvas-card:-translate-y-2 transition duration-200">
          {title}
        </h2>
      </div>
    </a>
  );
};

const InfoIcon = () => (
  <svg className="h-5 w-5 text-black dark:text-white" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
  </svg>
);

const AceternityIcon = () => {
  return (
    <svg
      width="66"
      height="65"
      viewBox="0 0 66 65"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-10 w-10 text-black dark:text-white group-hover/canvas-card:text-white">
      <path
        d="M8 8.05571C8 8.05571 54.9009 18.1782 57.8687 30.062C60.8365 41.9458 9.05432 57.4696 9.05432 57.4696"
        stroke="currentColor"
        strokeWidth="15"
        strokeMiterlimit="3.86874"
        strokeLinecap="round"
        style={{ mixBlendMode: "darken" }} />
    </svg>
  );
};

const MatlabIcon = () => {
  return (
    <svg
      width="66"
      height="65"
      viewBox="0 0 32.00 32.00"
      xmlns="http://www.w3.org/2000/svg"
      fill="#000000"
      stroke="#000000"
      strokeWidth="1.152">
      <g id="SVGRepo_bgCarrier" strokeWidth="0"/>
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.32"/>
      <g id="SVGRepo_iconCarrier">
        <defs>
          <linearGradient id="a" x1="16.803" y1="16.631" x2="15.013" y2="22.411" gradientTransform="matrix(1, 0, 0, -1, 0, 32)" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#ffffff"/>
            <stop offset="0.23" stopColor="#ffffff"/>
            <stop offset="0.36" stopColor="#ffffff"/>
            <stop offset="0.51" stopColor="#ffffff"/>
            <stop offset="0.66" stopColor="#ffffff"/>
            <stop offset="0.84" stopColor="#ffffff"/>
          </linearGradient>
          <linearGradient id="b" x1="29.71" y1="18.983" x2="11.71" y2="14.563" gradientUnits="userSpaceOnUse">
            <stop offset="0.081" stopColor="#ffffff"/>
            <stop offset="0.189" stopColor="#ffffff"/>
            <stop offset="0.313" stopColor="#ffffff"/>
            <stop offset="0.421" stopColor="#ffffff"/>
            <stop offset="0.5" stopColor="#ffffff"/>
            <stop offset="0.58" stopColor="#ffffff"/>
            <stop offset="0.696" stopColor="#ffffff"/>
            <stop offset="0.833" stopColor="#ffffff"/>
            <stop offset="0.916" stopColor="#ffffff"/>
          </linearGradient>
        </defs>
        <title>file_type_matlab</title>
        <path d="M2,17.55l7.97-3.22a20.7,20.7,0,0,1,2.72-2.95c.66-.35,1.9-.16,4.17-2.98,2.2-2.75,2.9-5.1,3.93-5.1,1.63,0,2.83,3.52,4.65,8.85A115.629,115.629,0,0,0,30,24.12c-1.9-1.77-3.52-3.68-5.37-3.63-1.72.04-3.63,2.08-5.72,4.7-1.66,2.1-3.86,3.54-4.72,3.51,0,0-2.22-6.28-4.08-7.3a2.641,2.641,0,0,0-2.39.2L2,17.54Z" style={{ fill: "#ffffff" }}/>
        <path d="M19.8,4.02c-.67.9-1.48,2.55-2.94,4.38-2.27,2.82-3.5,2.63-4.17,2.98a19.674,19.674,0,0,0-2.72,2.95l3.3,2.41c2.8-3.82,4.3-7.96,5.47-10.64A13.579,13.579,0,0,1,19.8,4.02Z" style={{ fill: "url(#a)" }}/>
        <path d="M20.8,3.3c-2.18,0-3.67,11.48-11.72,17.89,2.26-.37,4.22,5.24,5.12,7.51,4-.68,7.2-8.33,10.43-8.21,1.85.07,3.47,1.86,5.37,3.63C25.66,15,23.63,3.3,20.8,3.3Z" style={{ fill: "url(#b)" }}/>
      </g>
    </svg>
  );
};

const HDLIcon = () => {
  return (
    <svg
      width="66"
      height="65"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-12 w-12 text-black dark:text-white group-hover/canvas-card:text-white"
    >
      <path
        d="M4 7V4H20V7L12 12L4 7Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 17H20V20H4V17Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 7L10 17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 7L14 17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const CircuitIcon = () => {
  return (
    <svg
      width="66"
      height="65"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-14 w-14 text-black dark:text-white group-hover/canvas-card:text-white">
      <path
        d="M8 3V6.18257M3 8H6.18257M3 12H6M3 16H6.18257M17.8174 8H21M18 12H21M17.8174 16H21M8 17.8174L8 21M12 3V6M12 18V21M16 3L16 6.18257M16 17.8174V21M10 14H10.01M14 14H14.01M14 10H14.01M10 10H10.01M10.8 18H13.2C14.8802 18 15.7202 18 16.362 17.673C16.9265 17.3854 17.3854 16.9265 17.673 16.362C18 15.7202 18 14.8802 18 13.2V10.8C18 9.11984 18 8.27976 17.673 7.63803C17.3854 7.07354 16.9265 6.6146 16.362 6.32698C15.7202 6 14.8802 6 13.2 6H10.8C9.11984 6 8.27976 6 7.63803 6.32698C7.07354 6.6146 6.6146 7.07354 6.32698 7.63803C6 8.27976 6 9.11984 6 10.8V13.2C6 14.8802 6 15.7202 6.32698 16.362C6.6146 16.9265 7.07354 17.3854 7.63803 17.673C8.27976 18 9.11984 18 10.8 18Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const CircuitBoardIcon = () => {
  return (
    <svg
      width="66"
      height="65"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className="h-10 w-10 text-black dark:text-white group-hover/canvas-card:text-white">
      <path d="M14.5 1h-13l-.5.5v13l.5.5h13l.5-.5v-13l-.5-.5zM14 14H5v-2h2.3c.3.6 1 1 1.7 1 1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2H4v3H2V2h2v2.3c-.6.3-1 1-1 1.7 0 1.1.9 2 2 2s2-.9 2-2h2c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2c-.7 0-1.4.4-1.7 1H6.7c-.3-.6-1-1-1.7-1V2h9v12zm-6-3c0-.6.4-1 1-1s1 .4 1 1-.4 1-1 1-1-.4-1-1zM5 5c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1zm6 0c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1z"/>
    </svg>
  );
};

const IITBIcon = () => {
  return (
    <img 
      src="/iitb.png" 
      alt="IIT Bombay Logo"
      className="h-16 w-16 md:h-20 md:w-20 object-contain group-hover/canvas-card:scale-110 transition-transform duration-200 invert dark:invert-0"
    />
  );
};

export const Icon = ({ className, ...rest }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
      {...rest}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  );
};