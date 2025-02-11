import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Home } from 'lucide-react';

function ThankYou() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="max-w-md w-full p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg text-center">
        <CheckCircle2 className="w-16 h-16 mx-auto text-green-500 mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Thank You!
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Your quiz has been successfully submitted. Your results will be available in the test history section.
        </p>
        <button
          onClick={() => navigate('/students/tests')}
          className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg hover:from-violet-500 hover:to-indigo-500 transition-all duration-200 flex items-center justify-center mx-auto"
        >
          <Home className="w-5 h-5 mr-2" />
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default ThankYou;
