import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { CheckCircle, XCircle, AlertTriangle, Clock, ArrowLeft, Loader2, Home } from 'lucide-react';

const BASE_URL = `${import.meta.env.VITE_API_URL}`;

function QuizResult() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const token = Cookies.get("token");
        const response = await axios.get(`${BASE_URL}/api/quiz/student/attempt/${attemptId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setResult(response.data);
      } catch (error) {
        console.error('Failed to fetch result:', error);
        navigate('/students/tests/history');
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [attemptId, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const percentage = (result.score / result.quiz.maxMarks) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8 flex items-center justify-between">
        <button 
          onClick={() => navigate('/students/tests')}
          className="flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </button>
        <button
          onClick={() => navigate('/students/tests/history')}
          className="flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
        >
          <Home className="w-5 h-5 mr-2" />
          View History
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 dark:text-white">{result.quiz.title}</h1>
          <p className="text-gray-600 dark:text-gray-400">Quiz Completed</p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="w-48 h-48 relative">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="3"
                className="dark:stroke-gray-600"
              />
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={percentage >= 60 ? "#10B981" : "#EF4444"}
                strokeWidth="3"
                strokeDasharray={`${percentage}, 100`}
                className="transform -rotate-90 origin-center"
              />
              <text
                x="18"
                y="20.35"
                className="text-5xl font-bold"
                textAnchor="middle"
                fill={percentage >= 60 ? "#10B981" : "#EF4444"}
              >
                {Math.round(percentage)}%
              </text>
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400 mb-1">Score</p>
            <p className="text-2xl font-bold dark:text-white">
              {result.score} / {result.quiz.maxMarks}
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400 mb-1">Time Taken</p>
            <p className="text-2xl font-bold dark:text-white">
              {Math.floor((new Date(result.submittedAt) - new Date(result.startedAt)) / 60000)} mins
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Detailed Analysis</h2>
          {result.answers.map((answer) => (
            <div key={answer.id} className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium dark:text-white">{answer.question.text}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {answer.isCorrect ? (
                      <span className="text-green-600 dark:text-green-400 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1" /> Correct
                      </span>
                    ) : (
                      <span className="text-red-600 dark:text-red-400 flex items-center">
                        <XCircle className="w-4 h-4 mr-1" /> Incorrect
                      </span>
                    )}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold dark:text-white">
                    {answer.score} / {answer.question.marks}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default QuizResult;
