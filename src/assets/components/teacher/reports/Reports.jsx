import React from 'react';
import { FileText, ExternalLink } from 'lucide-react';

const Reports = () => {
  return (
    <div className='w-full h-screen flex flex-col justify-center items-center space-y-6'>
      <div className='flex flex-col items-center space-y-4'>
        <FileText className='h-16 w-16 text-gray-900 dark:text-white' />
        <div className='text-4xl font-semibold text-gray-900 dark:text-white'>
          CO/PO reports are still under development
        </div>
        <div className='text-md text-gray-900 dark:text-white'>
          (You may need to create a new account to access the reports, if you haven't already)
        </div>
      </div>
      <a 
        href="https://ei-deprecated.vercel.app/signin" 
        target="_blank" 
        rel="noopener noreferrer" 
        className='inline-flex items-center px-4 py-2 text-lg font-medium rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-300 dark:hover:bg-blue-700 transition-colors'
      >
        <ExternalLink className='h-5 w-5 mr-2' />
        Visit this link to access reports
      </a>
    </div>
  );
};

export default Reports;