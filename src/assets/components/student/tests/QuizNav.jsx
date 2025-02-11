import React from 'react';
import { Sun, Moon, Loader2, Send } from 'lucide-react';

const QuizNav = ({ quiz, currentQuestion, setCurrentQuestion, attemptedQuestions, handleSubmitClick, submitting, theme, toggleTheme }) => {
  const getQuestionStatus = (index) => {
    const questionId = quiz.questions[index].id;
    if (attemptedQuestions.has(questionId)) {
      return "bg-green-500 text-white";
    }
    return "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300";
  };

  return (
    <div className="w-1/4 h-screen fixed right-0 top-0 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-y-auto flex flex-col justify-between">
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4 dark:text-white">Quiz Details</h3>
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="font-medium mb-2 dark:text-white">Quiz Summary</h4>
          <div className="space-y-2 text-sm">
            <p className="text-gray-600 dark:text-gray-300">
              Questions: {quiz?.questions.length}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Answered: {attemptedQuestions.size}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Remaining: {quiz?.questions.length - attemptedQuestions.size}
            </p>
          </div>
        </div>
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="font-medium mb-2 dark:text-white">Quiz Info</h4>
          <div className="space-y-2 text-sm">
            <p className="text-gray-600 dark:text-gray-300">
              Title: {quiz?.title}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Description: {quiz?.description}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Max Marks: {quiz?.maxMarks}
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className="mt-4 p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      <div className="mt-auto p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Attempted</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 dark:bg-gray-700 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Not attempted</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-4">
          {quiz?.questions.map((question, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`w-10 h-10 rounded-lg flex items-center justify-center text-base font-medium transition-all duration-200
                ${currentQuestion === index 
                  ? 'ring-2 ring-violet-500 dark:ring-violet-400' 
                  : ''
                }
                ${attemptedQuestions.has(question.id)
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }
                hover:bg-opacity-90`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <button
          onClick={handleSubmitClick}
          disabled={submitting}
          className="w-full px-4 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500
                   text-white font-medium rounded-lg shadow-lg shadow-indigo-200 dark:shadow-none
                   disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {submitting ? (
            <Loader2 className="w-5 h-5 mx-auto animate-spin" />
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Send className="w-4 h-4" />
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default QuizNav;
