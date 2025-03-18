import React from 'react'
import { TextHoverEffect } from '../ui/text-hover-effect'
import { motion } from "framer-motion";
import Footer from '../ui/footer';
import { TabsDemo } from '../ui/tabsDemo';

const Landnew = () => {
  return (
    <div className="relative dark bg-transparent text-white">
      <TabsDemo/>
    <div className="absolute inset-0 z-[-1] bg-black overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="absolute -left-1/4 top-1/4 h-1/3 w-96 rounded-full bg-cyan-500/50 blur-[120px]"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute -right-1/4 top-1/2 h-96 w-1/2 rounded-full bg-violet-500/50 blur-[200px]"
      />
    </div>
    <div className="px-36 flex items-center justify-center">
      <TextHoverEffect text="LMS" />
    </div>
    <Footer/>
  </div>
  )
}

export default Landnew