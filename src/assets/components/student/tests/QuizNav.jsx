import React from 'react';
import { Sun, Moon, Loader2, Send } from 'lucide-react';

function Stat({ label, value }) {
  return (
    <div>
      <dt className="text-sm text-gray-500 dark:text-gray-400">{label}</dt>
      <dd className="text-base font-medium text-gray-900 dark:text-gray-100">{value}</dd>
    </div>
  );
}

const QuizNav = ({ quiz, currentQuestion, setCurrentQuestion, attemptedQuestions, handleSubmitClick, submitting, theme, toggleTheme }) => {
  return (
    <aside className="fixed right-0 top-0 flex h-screen w-80 flex-col border-l border-gray-200 dark:border-gray-800 divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900">
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-6 p-4">
          {/* Quiz Info Section */}
          <section className="rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 py-2 px-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Test Info</h2>
              <button
                onClick={toggleTheme}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
                aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            </div>
            <dl className="space-y-2 px-4 py-2">
              <Stat label="Title" value={quiz.title} />
              <Stat label="Description" value={quiz.description} />
              <Stat label="Max Marks" value={quiz.maxMarks} />
            </dl>
          </section>

          {/* Progress Section */}
          <section className='bg-gray-50 dark:bg-gray-800 rounded-lg divide-y divide-gray-200 dark:divide-gray-700'>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white px-4 py-2">Test Progress</h2>
            <dl className="grid grid-cols-3 gap-4 px-4 py-2">
              <Stat label="Questions" value={quiz.questions.length} />
              <Stat label="Answered" value={attemptedQuestions.size} />
              <Stat label="Remaining" value={quiz.questions.length - attemptedQuestions.size} />
            </dl>
          </section>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="space-y-4 p-4">
        <div className="flex justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-violet-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Attempted</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-gray-200 dark:bg-gray-700" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Not attempted</span>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {quiz.questions.map((question, index) => (
            <button
              key={question.id}
              onClick={() => setCurrentQuestion(index)}
              className={`
                flex h-10 w-10 items-center justify-center rounded-lg text-base font-medium transition-all duration-200
                ${
                  currentQuestion === index
                    ? "ring-2 ring-violet-500 ring-offset-2 dark:ring-violet-400 dark:ring-offset-gray-900"
                    : ""
                }
                ${
                  attemptedQuestions.has(question.id)
                    ? "bg-violet-500 text-white hover:bg-violet-600 dark:bg-violet-600 dark:hover:bg-violet-700"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                }
              `}
              aria-label={`Question ${index + 1}${attemptedQuestions.has(question.id) ? " (Attempted)" : ""}`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <button
          onClick={handleSubmitClick}
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3 font-medium text-white shadow-lg shadow-indigo-200/50 transition-all duration-200 hover:from-violet-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 dark:shadow-none"
        >
          {submitting ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>Submit Quiz</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};

export default QuizNav;
