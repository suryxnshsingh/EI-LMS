import React from 'react';
import { BookOpen } from 'lucide-react';

const CoursesPage = () => {
  return (
    <div className='w-full h-screen flex flex-col justify-center items-center space-y-6'>
      <div className='flex flex-col items-center space-y-4'>
        <BookOpen className='h-16 w-16 text-gray-900 dark:text-white' />
        <div className='text-4xl font-semibold text-gray-900 dark:text-white'>
          Courses management is under development
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
