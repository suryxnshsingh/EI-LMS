import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ClipboardList, Timer, GraduationCap, ArrowRight, Loader2 } from 'lucide-react';

const BASE_URL = `${import.meta.env.VITE_API_URL}`;

function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const token = Cookies.get("token");
        const [quizzesResponse, attemptsResponse] = await Promise.all([
          axios.get(`${BASE_URL}/api/quiz/student/available`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${BASE_URL}/api/quiz/student/history`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        // Get array of attempted quiz IDs
        const attemptedQuizIds = new Set(
          attemptsResponse.data.attempts.map(attempt => attempt.quizId)
        );

        // Filter out quizzes that have been attempted
        const availableQuizzes = quizzesResponse.data.filter(
          quiz => !attemptedQuizIds.has(quiz.id)
        );

        setQuizzes(availableQuizzes);
      } catch (err) {
        setError('Failed to load quizzes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const getQuizStatus = (quiz) => {
    const now = new Date();
    const scheduledTime = quiz.scheduledFor ? new Date(quiz.scheduledFor) : null;

    if (scheduledTime) {
      if (now < scheduledTime) {
        return {
          label: "Scheduled",
          color: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300"
        };
      }
    }
    return {
      label: "Available",
      color: "text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300"
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-gray-600 dark:text-gray-300" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Available Quizzes</h1>
      
      {error && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-100">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => {
          const status = getQuizStatus(quiz);
          return (
            <div
              key={quiz.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-6">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                  {status.label}
                </span>
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold mb-2 dark:text-white">
                      {quiz.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {quiz.description}
                    </p>
                  </div>
                  <ClipboardList className="w-6 h-6 text-blue-500" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Timer className="w-4 h-4 mr-2" />
                    <span>{quiz.timeLimit} minutes</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    <span>{quiz.Course[0]?.name || 'No course specified'}</span>
                  </div>
                </div>

                {quiz.scheduledFor && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Scheduled for: {new Date(quiz.scheduledFor).toLocaleString()}
                  </div>
                )}

                <button
                  onClick={() => navigate(`/student/quiz/${quiz.id}`)}
                  className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                >
                  Start Quiz
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {quizzes.length === 0 && !error && (
        <div className="text-center py-12">
          <ClipboardList className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300">
            No quizzes available
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Check back later for new quizzes
          </p>
        </div>
      )}
    </div>
  );
}

export default QuizList;
