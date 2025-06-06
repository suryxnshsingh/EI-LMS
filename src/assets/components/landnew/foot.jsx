import React from 'react'
import { TextHoverEffect } from '../ui/text-hover-effect'
import { motion } from "framer-motion";
import Footer from '../ui/footer';

const FooterFull = () => {
  return (
    <div className="relative dark text-white w-full bg-black">

      {/* Background Effects */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="absolute -left-1/4 top-1/4 h-1/3 w-96 rounded-full bg-cyan-500/30 blur-[120px]"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute -right-1/4 top-1/2 h-96 w-1/2 rounded-full bg-violet-500/30 blur-[200px]"
        />
      </div>

      {/* Hero Section with Text Effect */}
      <div className="relative z-10 h-fit flex items-center justify-center py-0">
        <TextHoverEffect text="LMS" />
      </div>

      {/* Footer with higher z-index to ensure links are clickable */}
      <div className="relative z-20">
        <Footer/>
      </div>
    </div>
  )
}

export default FooterFull;