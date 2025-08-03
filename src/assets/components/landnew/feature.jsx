import { cn } from "../../../utils/cn";
import { motion } from "motion/react";
import {
  BookOpen,
  Users,
  BarChart3,
  Clock,
  Award,
  Zap,
} from "lucide-react";

export function FeaturesSectionDemo() {
  const features = [
    {
      title: "Course Management",
      description:
        "Comprehensive course creation, content delivery, and student progress tracking.",
      icon: <BookOpen className="size-5" />,
    },
    {
      title: "Student Portal",
      description:
        "Intuitive interface for students to access courses, assignments, and resources.",
      icon: <Users className="size-5" />,
    },
    {
      title: "Analytics & Reports",
      description:
        "Real-time insights into student performance and course effectiveness.",
      icon: <BarChart3 className="size-5" />,
    },
    {
      title: "Attendance Tracking",
      description: "Automated attendance management with detailed reporting.",
      icon: <Clock className="size-5" />,
    },
    {
      title: "Assessment Tools",
      description: "Create quizzes, assignments, and automated grading systems.",
      icon: <Award className="size-5" />,
    },
    {
      title: "Virtual Labs",
      description:
        "Interactive circuit simulators and virtual laboratory experiences.",
      icon: <Zap className="size-5" />,
    },
  ];

  // Bento grid positioning function for rectangular layout
  const getBentoGridClass = (index) => {
    const positions = [
      // Course Management - large card top-left (2x2)
      "col-span-12 md:col-span-6 lg:col-span-6 row-span-1 lg:row-span-2",
      // Student Portal - top-right wide
      "col-span-12 md:col-span-6 lg:col-span-6 row-span-1",
      // Analytics & Reports - middle-right
      "col-span-12 md:col-span-6 lg:col-span-3 row-span-1",
      // Attendance Tracking - middle-right
      "col-span-12 md:col-span-6 lg:col-span-3 row-span-1",
      // Assessment Tools - bottom-left
      "col-span-12 md:col-span-6 lg:col-span-4 row-span-1",
      // Virtual Labs - bottom-right wide
      "col-span-12 md:col-span-6 lg:col-span-8 row-span-1"
    ];
    return positions[index] || "col-span-12 md:col-span-6 lg:col-span-4";
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section className="w-full py-20 md:py-32">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
        >
          <span className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium bg-violet-500/10 text-violet-500 dark:bg-violet-500/20 dark:text-violet-400">
            Features
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-300">Everything You Need for Modern Learning</h2>
          <p className="max-w-[800px] text-neutral-400 md:text-lg">
            Comprehensive tools designed specifically for Electronics & Instrumentation education.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-4 lg:gap-6 max-w-6xl mx-auto"
          style={{
            gridTemplateColumns: "repeat(12, 1fr)",
            gridTemplateRows: "repeat(4, minmax(180px, auto))"
          }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={feature.title} 
              variants={item}
              className={getBentoGridClass(index)}
            >
              <FeatureCard {...feature} index={index} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

const FeatureCard = ({
  title,
  description,
  icon,
  index
}) => {
  // Determine if this is a large card (Course Management)
  const isLargeCard = index === 0;
  const isWideCard = [1, 5].includes(index); // Student Portal, Virtual Labs
  
  return (
    <div className="group relative h-full min-h-[180px]">
      <div className="h-full overflow-hidden border border-violet-500/25 bg-gradient-to-br from-neutral-900 to-violet-950/15 backdrop-blur transition-all hover:shadow-lg hover:shadow-violet-500/20 rounded-xl">
        <div className={cn(
          "flex flex-col h-full transition-all duration-300",
          isLargeCard ? "p-6 lg:p-8" : "p-5 lg:p-6"
        )}>
          {/* Icon container with gradient background */}
          <div className={cn(
            "rounded-full bg-violet-500/10 dark:bg-violet-500/20 flex items-center justify-center text-violet-500 dark:text-violet-400 mb-3 group-hover:bg-violet-500/20 dark:group-hover:bg-violet-500/30 transition-colors duration-300",
            isLargeCard ? "size-12 lg:size-14" : "size-10"
          )}>
            <div className={isLargeCard ? "scale-125" : ""}>
              {icon}
            </div>
          </div>
          
          {/* Title */}
          <h3 className={cn(
            "font-bold mb-2 text-slate-300 group-hover:text-white transition-colors duration-300",
            isLargeCard ? "text-xl lg:text-2xl mb-3" : "text-lg lg:text-xl"
          )}>
            {title}
          </h3>
          
          {/* Description */}
          <p className={cn(
            "text-neutral-400 group-hover:text-neutral-300 transition-colors duration-300 flex-grow leading-relaxed",
            isLargeCard ? "text-base lg:text-lg" : "text-sm lg:text-base"
          )}>
            {description}
          </p>

          {/* Enhanced gradient for large cards */}
          {isLargeCard && (
            <div className="absolute top-0 right-0 w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-bl from-violet-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          )}

          {/* Subtle gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
