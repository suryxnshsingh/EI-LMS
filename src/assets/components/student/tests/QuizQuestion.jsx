import React from 'react';
import { XCircle } from 'lucide-react';

const BASE_URL = `${import.meta.env.VITE_API_URL}`;

const QuizQuestion = ({ quiz, currentQuestion, answers, handleAnswer, handleClearAnswer, handleImageClick }) => {
  const question = quiz.questions[currentQuestion];

  const renderQuestion = () => {
    switch (question.type) {
      case 'SINGLE_MCQ':
      case 'MULTI_MCQ':
        return (
          <div className="space-y-4">
            <div className="flex justify-end mb-2">
              <button
                onClick={handleClearAnswer}
                className="flex items-center px-3 py-1 text-sm text-red-500 hover:text-red-700 
                         dark:text-red-400 dark:hover:text-red-300 transition-colors"
              >
                <XCircle className="w-4 h-4 mr-1" />
                Clear Selection
              </button>
            </div>
            {question.options && question.options.map((option) => (
              <label 
                key={option.id} 
                className={`flex items-center p-6 rounded-xl transition-all duration-200 
                  ${(answers[question.id]?.selectedOptions || []).includes(option.id)
                    ? 'bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-lg shadow-indigo-200 dark:shadow-none transform scale-[1.02]'
                    : 'bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 hover:border-violet-200 dark:hover:border-violet-900'
                  } cursor-pointer`}
              >
                <input
                  type={question.type === 'SINGLE_MCQ' ? 'radio' : 'checkbox'}
                  name={`question-${question.id}`}
                  checked={(answers[question.id]?.selectedOptions || []).includes(option.id)}
                  onChange={(e) => {
                    if (question.type === 'SINGLE_MCQ') {
                      handleAnswer({ selectedOptions: [option.id] });
                    } else {
                      const currentSelected = answers[question.id]?.selectedOptions || [];
                      const newSelected = e.target.checked
                        ? [...currentSelected, option.id]
                        : currentSelected.filter(id => id !== option.id);
                      handleAnswer({ selectedOptions: newSelected });
                    }
                  }}
                  className="w-5 h-5 mr-4 accent-violet-500"
                />
                <span className="text-lg font-medium dark:text-white">{option.text}</span>
              </label>
            ))}
          </div>
        );

      case 'NUMERICAL':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-100 dark:border-gray-700">
            <div className="flex justify-end mb-2">
              <button
                onClick={handleClearAnswer}
                className="flex items-center px-3 py-1 text-sm text-red-500 hover:text-red-700 
                         dark:text-red-400 dark:hover:text-red-300 transition-colors"
              >
                <XCircle className="w-4 h-4 mr-1" />
                Clear Input
              </button>
            </div>
            <input
              type="number"
              step="any"
              value={answers[question.id]?.textAnswer || ''}
              onChange={(e) => handleAnswer({ textAnswer: e.target.value })}
              className="w-full p-4 text-lg bg-transparent border-b-2 border-gray-200 dark:border-gray-600 
                       focus:border-violet-500 dark:focus:border-violet-400 outline-none transition-colors dark:text-white"
              placeholder="Enter your numerical answer"
            />
          </div>
        );

      case 'DESCRIPTIVE':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-100 dark:border-gray-700">
            <div className="flex justify-end mb-2">
              <button
                onClick={handleClearAnswer}
                className="flex items-center px-3 py-1 text-sm text-red-500 hover:text-red-700 
                         dark:text-red-400 dark:hover:text-red-300 transition-colors"
              >
                <XCircle className="w-4 h-4 mr-1" />
                Clear Text
              </button>
            </div>
            <textarea
              value={answers[question.id]?.textAnswer || ''}
              onChange={(e) => handleAnswer({ textAnswer: e.target.value })}
              className="w-full p-4 text-lg bg-transparent border-2 border-gray-200 dark:border-gray-600 rounded-lg
                       focus:border-violet-500 dark:focus:border-violet-400 outline-none transition-colors
                       resize-none min-h-[200px] dark:text-white"
              placeholder="Enter your answer"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
      <div className="flex items-start gap-4">
        <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900 text-violet-600 dark:text-violet-400 font-bold">
          {currentQuestion + 1}
        </span>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {question.text}
            </h2>
            <span className="ml-4 px-3 py-1 bg-violet-100 dark:bg-violet-900 text-violet-600 dark:text-violet-400 rounded-full text-sm whitespace-nowrap font-medium">
              {question.marks} marks
            </span>
          </div>
          
          {question.imageUrl && (
            <img
              src={`${BASE_URL}${question.imageUrl}`}
              alt="Question"
              className="mb-6 max-h-64 object-contain rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer"
              onClick={() => handleImageClick(`${BASE_URL}${question.imageUrl}`)}
            />
          )}
          {renderQuestion()}
        </div>
      </div>
    </div>
  );
};

export default QuizQuestion;
