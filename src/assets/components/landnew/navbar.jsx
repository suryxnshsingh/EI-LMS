import { cn } from "../../../utils/cn";
import { useState } from "react";

export function Navbar() {
  const [activeLink, setActiveLink] = useState('/');

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/#', label: 'About' },
    { href: '/#', label: 'Faculty' },
    { href: '/#', label: 'Contact' },
  ];

  const handleLinkClick = (href, e) => {
    e.preventDefault();
    setActiveLink(href);
    // Add your navigation logic here if using React Router
    // navigate(href);
  };

  return (
    <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-black/20 backdrop-blur-md border border-white/10 rounded-full px-2 py-2 shadow-lg">
      <div className="flex items-center gap-1">
        <a 
          href="/" 
          className="relative px-4 py-2 text-sm font-medium text-white/90 rounded-full transition-all duration-300 mx-1"
          onClick={(e) => handleLinkClick('/', e)}
        >
          <span className="font-bold tracking-wide">EI LMS</span>
        </a>
        
        <div className="h-6 w-px bg-white/10 mx-1" />
        
        {navLinks.slice(1).map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={cn(
              "relative px-4 py-2 text-sm font-medium text-white/80 rounded-full transition-all duration-300 hover:text-white",
              "group",
              activeLink === link.href && "text-white"
            )}
            onClick={(e) => handleLinkClick(link.href, e)}
          >
            <span className="relative z-10">{link.label}</span>
            <span className={cn(
              "absolute inset-0 rounded-full bg-white/0 group-hover:bg-white/10 transition-all duration-300",
              activeLink === link.href ? "bg-white/10" : ""
            )} />
            <span className={cn(
              "absolute inset-1 rounded-full bg-white/0 scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300",
              activeLink === link.href ? "bg-white/5 opacity-100 scale-100" : ""
            )} />
          </a>
        ))}
        
        <div className="h-6 w-px bg-white/10 mx-1" />
        
        <a 
          href="/signin" 
          className="relative px-4 py-2 text-sm font-medium text-white/90 rounded-full transition-all duration-300 mx-1 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30"
          onClick={(e) => handleLinkClick('/signin', e)}
        >
          <span className="font-medium">Sign In</span>
        </a>
      </div>
    </nav>
  );
}
