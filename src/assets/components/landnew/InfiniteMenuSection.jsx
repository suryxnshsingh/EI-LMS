import React from 'react';
import InfiniteMenu from './InfiniteMenu/InfiniteMenu';

const InfiniteMenuSection = () => {
  // Define menu items for your EI-LMS features with professional content
  const items = [
    {
      image: '/land/features/Student.jpeg',
      link: '/courses',
      title: 'Student\nPortal',
      description: 'Advanced learning hub for E&I students with digital resources'
    },
    {
      image: '/land/features/Attendance.jpeg',
      link: '/attendance',
      title: 'Smart\nAttendance',
      description: 'Auto-tracking system with lab presence verification'
    },
    {
      image: '/land/features/Simulator.jpeg',
      link: '/simulator',
      title: 'Circuit\nSimulator',
      description: 'Virtual lab for designing and testing electronic circuits'
    },
    {
      image: '/land/features/Reports.jpeg',
      link: '/analytics',
      title: 'Advanced\nAnalytics',
      description: 'Real-time insights and detailed learning progress reports'
    },
    {
      image: '/land/features/Chatbot.jpeg',
      link: '/assistant',
      title: 'AI\nAssistant',
      description: 'Smart support for circuit designs and lab experiments'
    }
  ];

  return (
    <section className="py-20 bg-black relative font-['Chakra_Petch']">
      {/* Section header */}
      <div className="container mx-auto px-4 mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center bg-gradient-to-r from-blue-300 to-cyan-200 bg-clip-text text-transparent font-['Chakra_Petch']">
          Electronics & Instrumentation Hub
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-center text-lg font-['Chakra_Petch']">
          Explore our specialized tools designed for the next generation of electronics engineers
        </p>
      </div>
      
      {/* InfiniteMenu component with fixed height */}
      <div className="container mx-auto px-4" style={{ height: '600px', position: 'relative' }}>
        <InfiniteMenu items={items}/>
      </div>
    </section>
  );
};

export default InfiniteMenuSection;
