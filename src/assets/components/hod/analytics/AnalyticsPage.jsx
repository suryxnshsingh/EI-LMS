import React from 'react';
import { BarChart2 } from 'lucide-react';

const AnalyticsPage = () => {
  return (
    <div className='w-full h-screen flex flex-col justify-center items-center space-y-6'>
      <div className='flex flex-col items-center space-y-4'>
        <BarChart2 className='h-16 w-16 text-gray-900 dark:text-white' />
        <div className='text-4xl font-semibold text-gray-900 dark:text-white'>
          Analytics dashboard is under development
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
