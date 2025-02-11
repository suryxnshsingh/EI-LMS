import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ClipboardCheck, Clock, AlertCircle, Loader2 } from 'lucide-react';

const BASE_URL = `${import.meta.env.VITE_API_URL}`;

function QuizHistory() {
  const [attempts, setAttempts] = useState([]);
  const [missedQuizzes, setMissedQuizzes] = useState([]); // Add this line
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = Cookies.get("token");
        const response = await axios.get(`${BASE_URL}/api/quiz/student/history`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAttempts(response.data.attempts); // Update this line
        setMissedQuizzes(response.data.missedQuizzes); // Add this line
      } catch (error) {
        console.error('Failed to fetch history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const renderAttemptCard = (attempt) => (
    <div key={attempt.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
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
        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
          {attempt.score}/{attempt.quiz.maxMarks}
        </div>
      </div>
    </div>
  );

  const renderMissedCard = (quiz) => (
    <div key={quiz.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 opacity-75">
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
  );

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <Loader2 className="w-8 h-8 animate-spin" />
    </div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Quiz History</h1>
      
      {attempts.length > 0 || missedQuizzes?.length > 0 ? (
        <div className="space-y-8">
          {/* Completed Quizzes Section */}
          {attempts.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 dark:text-white">Completed Quizzes</h2>
              <div className="space-y-4">
                {attempts.map(renderAttemptCard)}
              </div>
            </div>
          )}

          {/* Missed Quizzes Section */}
          {missedQuizzes?.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 dark:text-white">Missed Quizzes</h2>
              <div className="space-y-4">
                {missedQuizzes.map(renderMissedCard)}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <ClipboardCheck className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
            No Quiz History Yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            You haven't attempted any quizzes yet. Check available quizzes to get started!
          </p>
          <button
            onClick={() => navigate('/students/tests/available')}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            View Available Quizzes
          </button>
        </div>
      )}
    </div>
  );
}

export default QuizHistory;