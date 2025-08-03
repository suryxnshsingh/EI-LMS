import { cn } from "../../../utils/cn";
import { useState, useRef } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useNavigate } from "react-router-dom";

export function Navbar() {
  const [activeLink, setActiveLink] = useState('/');
  const [isScrolled, setIsScrolled] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();
  
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 100) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/#about', label: 'About' },
    { href: '/#faculty', label: 'Faculty' },
    { href: '/#contact', label: 'Contact' },
  ];

  const handleLinkClick = (href, e) => {
    e.preventDefault();
    setActiveLink(href);
    // Add your navigation logic here if using React Router
    // navigate(href);
  };
  
    const handleSignIn = () => {
      navigate('/signin');
    };

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
      <motion.nav 
        ref={ref}
        className="w-full max-w-3xl"
        animate={{
          maxWidth: isScrolled ? "500px" : "768px",
          y: isScrolled ? 10 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
      >
        <motion.div 
          className={cn(
            "bg-black/20 border border-violet-500/20 rounded-full shadow-lg transition-all duration-300 backdrop-blur-md",
            isScrolled && "bg-black/30 border-violet-400/30 backdrop-blur-xl"
          )}
          animate={{
            padding: isScrolled ? "10px 16px" : "10px 16px",
            boxShadow: isScrolled
              ? "0 0 24px rgba(139, 92, 246, 0.15), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(139, 92, 246, 0.2), 0 0 4px rgba(139, 92, 246, 0.08)"
              : "0 4px 24px rgba(139, 92, 246, 0.1)",
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        >
          <div className="flex items-center justify-between gap-1">
            <motion.a 
              href="/" 
              className="relative text-sm font-medium text-white/90 rounded-full transition-all duration-300 flex-shrink-0"
              onClick={(e) => handleLinkClick('/', e)}
              animate={{
                fontSize: "16px",
                padding: "10px 20px",
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
            >
              <span className="font-bold tracking-wide">EI LMS</span>
            </motion.a>
            
            <div className="h-6 w-px bg-violet-500/20 mx-2 flex-shrink-0" />
            
            <div className="md:flex items-center gap-1 flex-1 justify-center hidden">
              {navLinks.slice(1).map((link) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative text-sm font-medium text-white/80 rounded-full transition-all duration-300 hover:text-violet-200",
                    "group",
                    activeLink === link.href && "text-violet-300"
                  )}
                  onClick={(e) => handleLinkClick(link.href, e)}
                  animate={{
                    fontSize: "15px",
                    padding: "8px 14px",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <span className="relative z-10">{link.label}</span>
                  <span className={cn(
                    "absolute inset-0 rounded-full bg-violet-500/0 group-hover:bg-violet-500/20 transition-all duration-300",
                    activeLink === link.href ? "bg-violet-500/15" : ""
                  )} />
                  <span className={cn(
                    "absolute inset-1 rounded-full bg-violet-400/0 scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300",
                    activeLink === link.href ? "bg-violet-400/10 opacity-100 scale-100" : ""
                  )} />
                </motion.a>
              ))}
            </div>
            
            <div className="h-6 w-px bg-violet-500/20 mx-2 flex-shrink-0" />
            
            <motion.a 
              href="/signin" 
              className="relative text-sm font-medium text-white/90 rounded-full transition-all duration-300 bg-gradient-to-r from-violet-600/20 to-purple-600/20 hover:from-violet-500/30 hover:to-purple-500/30 border border-violet-500/30 hover:border-violet-400/50 flex-shrink-0"
              onClick={(e) => handleLinkClick('/signin', e)}
              animate={{
                fontSize: "15px",
                padding: "8px 12px",
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
            >
              <span onClick={handleSignIn} className="font-medium">Sign In</span>
            </motion.a>
          </div>
        </motion.div>
      </motion.nav>
    </div>
  );
}
