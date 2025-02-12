import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { GraduationCap, ArrowRight, Loader2, Clock, Hourglass, FlaskConical } from 'lucide-react';

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
        const response = await axios.get(`${BASE_URL}/api/quiz/student/available`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Server now returns properly filtered quizzes
        setQuizzes(response.data);
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

  const requestFullScreen = () => {
    const docElm = document.documentElement;
    if (docElm.requestFullscreen) {
      docElm.requestFullscreen();
    } else if (docElm.mozRequestFullScreen) { // Firefox
      docElm.mozRequestFullScreen();
    } else if (docElm.webkitRequestFullScreen) { // Chrome, Safari and Opera
      docElm.webkitRequestFullScreen();
    } else if (docElm.msRequestFullscreen) { // IE/Edge
      docElm.msRequestFullscreen();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-gray-600 dark:text-gray-300" />
      </div>
    );
  }

  return (
    <div className="p-5 md:p-10 w-full mr-0 md:mr-14">
      <h1 className="text-4xl font-semibold text-gray-900 dark:text-white mb-10">Available Tests</h1>
      
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
              className="bg-white dark:bg-neutral-800 rounded-lg shadow-md border border-gray-200 dark:border-neutral-700 overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                  {status.label}
                </span>
                <div className="flex items-start justify-between mt-2">
                  <div>
                    <h2 className="text-xl font-semibold mb-2 dark:text-white">
                      {quiz.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {quiz.description}
                    </p>
                  </div>
                  <FlaskConical className="w-6 h-6 text-blue-500" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Hourglass className="w-4 h-4 mr-2" />
                    <span>{quiz.timeLimit} minutes</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    <span>{quiz.Course[0]?.name || 'No course specified'}</span>
                  </div>
                  {quiz.scheduledFor && (
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>Scheduled for: {new Date(quiz.scheduledFor).toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    requestFullScreen();
                    navigate(`/student/quiz/${quiz.id}`);
                  }}
                  className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                >
                  Start Test
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {quizzes.length === 0 && !error && (
        <div className="text-center py-52">
          <FlaskConical className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300">
            No tests available
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Check back later for new tests
          </p>
        </div>
      )}
    </div>
  );
}

export default QuizList;
