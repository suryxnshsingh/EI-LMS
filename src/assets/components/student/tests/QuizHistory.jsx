import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ClipboardCheck, Loader2 } from 'lucide-react';

const BASE_URL = `${import.meta.env.VITE_API_URL}`;

function QuizHistory() {
  const [attempts, setAttempts] = useState([]);
  const [missedQuizzes, setMissedQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = Cookies.get("token");
        const response = await axios.get(`${BASE_URL}/api/quiz/student/history`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAttempts(response.data.attempts);
        setMissedQuizzes(response.data.missedQuizzes);
      } catch (error) {
        console.error('Failed to fetch history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const renderAttemptCard = (attempt) => (
    <div key={attempt.id} className="bg-white dark:bg-neutral-800 rounded-lg shadow-md border border-gray-200 dark:border-neutral-700 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold dark:text-white">{attempt.quiz.title}</h2>
              <span className="px-2 py-1 text-sm rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400">
                Completed
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Submitted on: {new Date(attempt.submittedAt).toLocaleString()}
            </p>
            {attempt.quiz.Course?.map(course => (
              <p key={course.id} className="text-sm text-gray-500 dark:text-gray-400">
                Course: {course.name}
              </p>
            ))}
          </div>
          <div className="text-xl font-bold text-green-600 dark:text-green-400">
            MM : {attempt.quiz.maxMarks}
          </div>
        </div>
      </div>
    </div>
  );

  const renderMissedCard = (quiz) => (
    <div key={quiz.id} className="bg-white dark:bg-neutral-800 rounded-lg shadow-md border border-gray-200 dark:border-neutral-700 overflow-hidden hover:shadow-lg transition-shadow duration-300 opacity-75">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold dark:text-white">{quiz.title}</h2>
              <span className="px-2 py-1 text-sm rounded-full bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400">
                Missed
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Scheduled for: {new Date(quiz.scheduledFor).toLocaleString()}
            </p>
            {quiz.Course?.map(course => (
              <p key={course.id} className="text-sm text-gray-500 dark:text-gray-400">
                Course: {course.name}
              </p>
            ))}
          </div>
          <div className="text-lg text-red-500 dark:text-red-400">
            Not Attempted
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-gray-600 dark:text-gray-300" />
      </div>
    );
  }

  return (
    <div className="p-5 md:p-10 w-full mr-0 md:mr-14">
      <h1 className="text-4xl font-semibold text-gray-900 dark:text-white mb-10">Test History</h1>
      
      {attempts.length > 0 || missedQuizzes.length > 0 ? (
        <div className="space-y-8">
          {/* Completed Quizzes Section */}
          {attempts.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 dark:text-white">Completed Tests</h2>
              <div className="space-y-4">
                {attempts.map(renderAttemptCard)}
              </div>
            </div>
          )}

          {/* Missed Quizzes Section */}
          {missedQuizzes.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 dark:text-white">Missed Tests</h2>
              <div className="space-y-4">
                {missedQuizzes.map(renderMissedCard)}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-52 w-1/2 flex flex-col items-center justify-center mx-auto">
          <ClipboardCheck className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300">
            No Test History Yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            You haven't attempted any tests yet. Check available tests to get started!
          </p>
          <button
            onClick={() => navigate('/students/tests/available')}
            className="mt-4 w-fit flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            View Available Tests
          </button>
        </div>
      )}
    </div>
  );
}

export default QuizHistory;