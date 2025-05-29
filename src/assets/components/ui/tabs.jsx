import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../../../utils/cn";

const Tabs = ({
  tabs: propTabs,
  containerClassName,
  activeTabClassName,
  tabClassName,
  contentClassName,
}) => {
  const [active, setActive] = useState(propTabs[0]);
  const [tabs, setTabs] = useState(propTabs);
  const [hovering, setHovering] = useState(false);

  const moveSelectedTabToTop = (idx) => {
    const newTabs = [...propTabs];
    const selectedTab = newTabs.splice(idx, 1);
    newTabs.unshift(selectedTab[0]);
    setTabs(newTabs);
    setActive(newTabs[0]);
  };

  return (
    <>
      <div
        className={cn(
          "flex flex-row items-center justify-center relative overflow-auto sm:overflow-visible no-visible-scrollbar max-w-full w-full mb-8",
          containerClassName
        )}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {/* Tab buttons container */}
        <div className="relative flex items-center gap-1 p-1 rounded-xl bg-white/5 backdrop-blur-2xl border border-white/10">
          {propTabs.map((tab, idx) => (
            <motion.button
              key={tab.title}
              onClick={() => moveSelectedTabToTop(idx)}
              className={cn(
                "relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                active.value === tab.value 
                  ? "text-white" 
                  : "text-white/60 hover:text-white/80",
                tabClassName
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Active tab background */}
              {active.value === tab.value && (
                <motion.div
                  layoutId="activeTab"
                  transition={{ 
                    type: "spring", 
                    bounce: 0.2, 
                    duration: 0.6 
                  }}
                  className={cn(
                    "absolute inset-0 bg-white/10 rounded-lg",
                    activeTabClassName
                  )}
                />
              )}

              <span className="relative z-10">{tab.title}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <FadeInDiv
        tabs={tabs}
        active={active}
        key={active.value}
        hovering={hovering}
        className={cn("", contentClassName)}
      />
    </>
  );
};

const FadeInDiv = ({ className, tabs, active, hovering }) => {
  const isActive = (tab) => {
    return tab.value === tabs[0].value;
  };

  return (
    <div className="relative w-full h-full">
      {tabs.map((tab, idx) => (
        <motion.div
          key={tab.value}
          layoutId={tab.value}
          style={{
            scale: 1 - idx * 0.03,
            top: hovering ? idx * -20 : 0,
            zIndex: tabs.length - idx,
            opacity: idx < 3 ? 1 - idx * 0.2 : 0,
          }}
          animate={{
            y: isActive(tab) ? [0, -5, 0] : 0,
          }}
          transition={{
            duration: 0.5,
            ease: "easeInOut",
            y: { duration: 3, repeat: Infinity }
          }}
          className={cn("w-full h-full absolute top-0 left-0", className)}
        >
          {tab.content}
        </motion.div>
      ))}
    </div>
  );
};

export { Tabs, FadeInDiv };
