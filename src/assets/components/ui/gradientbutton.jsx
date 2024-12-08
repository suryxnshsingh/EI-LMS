import React from 'react';
import { ChevronRight } from 'lucide-react';

const GradientButton = ({ 
  children, 
  onClick, 
  className = '',
  icon: Icon = ChevronRight // Default icon
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        group
        relative
        px-6
        py-3
        rounded-lg
        border
        border-slate-300
        dark:border-neutral-700
        bg-gradient-to-r 
        from-violet-600 
        to-indigo-600
        overflow-hidden
        transition-all
        duration-300
        hover:border-transparent
        ${className}
      `}
    >
      {/* Gradient background that slides up on hover */}
      <div className="
        absolute 
        inset-0 
        bg-gradient-to-r 
        from-violet-600 
        to-indigo-600
        translate-y-[100%] 
        group-hover:translate-y-[0%] 
        transition-transform 
        duration-300"
      />

      {/* Button content container */}
      <div className="
        relative 
        z-10 
        flex 
        items-center 
        gap-2
      ">
        {/* Text content */}
        <span className="
          font-medium 
          text-slate-950 
          dark:text-neutral-200 
          group-hover:text-white 
          transition-colors 
          duration-300"
        >
          {children}
        </span>

        {/* Icon */}
        <Icon className="
          w-4 
          h-4 
          text-violet-600 
          group-hover:text-white 
          transition-colors 
          duration-300
          group-hover:translate-x-1
          transition-transform"
        />
      </div>
    </button>
  );
};

export default GradientButton;