import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Timer, Loader2, Send, ArrowLeft, ArrowRight, X, AlertTriangle, Maximize2 } from 'lucide-react';
import QuizQuestion from './QuizQuestion';
import QuizNav from './QuizNav';
import ConfirmDialog from './ConfirmDialog';
import { useQuizTimer } from '../../../../hooks/useQuizTimer';

const BASE_URL = `${import.meta.env.VITE_API_URL}`;

function QuizAttempt() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [attemptId, setAttemptId] = useState(null);
  const [attemptedQuestions, setAttemptedQuestions] = useState(new Set());
  const [showNav, setShowNav] = useState(false);
  const [theme, setTheme] = useState(document.documentElement.classList.contains("dark") ? "dark" : "light");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showFullScreenWarning, setShowFullScreenWarning] = useState(false);
  const [countdown, setCountdown] = useState(10); // Changed from 15 to 10
  const [warningCount, setWarningCount] = useState(0);
  const [isWindowFocused, setIsWindowFocused] = useState(true);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
      Cookies.set("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      Cookies.set("theme", "light");
    }
  };

  // Add effect to sync with app theme
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const token = Cookies.get("token");
        const response = await axios.get(`${BASE_URL}/api/quiz/student/${quizId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setQuiz(response.data);
        
        // Start the quiz attempt
        const attemptResponse = await axios.post(
          `${BASE_URL}/api/quiz/student/${quizId}/start`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAttemptId(attemptResponse.data.id);
      } catch (error) {
        console.error('Error fetching quiz:', error);
        navigate('/students/tests/available');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();

    const handleFullScreenChange = () => {
      if (!document.fullscreenElement) {
        handleSecurityViolation();
      }
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    document.addEventListener('mozfullscreenchange', handleFullScreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullScreenChange);
    document.addEventListener('msfullscreenchange', handleFullScreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullScreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullScreenChange);
      document.removeEventListener('msfullscreenchange', handleFullScreenChange);
    };
  }, [quizId, navigate, warningCount]); // Ensure dependencies are correct

  useEffect(() => {
    if (showFullScreenWarning && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (showFullScreenWarning && countdown === 0) {
      // Auto-submit when countdown reaches zero
      handleForcedSubmit();
    }
  }, [showFullScreenWarning, countdown]);

  useEffect(() => {
    if (countdown === 0) {
      requestFullScreen();
    }
  }, [countdown]);

  // Move handleSubmit declaration before useQuizTimer hook
  const handleSubmit = async () => {
    try {
      stopTimer(); // Stop the timer before submission
      console.log('Submitting quiz...'); // Debug log
      setSubmitting(true);
      const token = Cookies.get("token");
      
      const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        ...answer
      }));

      console.log('Sending submission request...'); // Debug log
      await axios.post(
        `${BASE_URL}/api/quiz/student/${quizId}/submit`,
        {
          attemptId,
          answers: formattedAnswers
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Submission successful, navigating...'); // Debug log
      navigate('/students/tests/thank-you'); // Changed navigation to thank you page
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  // Now we can use handleSubmit in the hook
  const { timeLeft, stopTimer } = useQuizTimer(
    quiz?.timeLimit || 0,
    handleSubmit
  );

  // Centralize the violation check
  const checkViolationAndSubmit = (newCount) => {
    console.log(`Checking violation count: ${newCount}`);
    if (newCount >= 3) {
      console.log('Third violation - force submitting');
      handleForcedSubmit();
      return true; // Indicates quiz was submitted
    }
    return false; // Indicates quiz continues
  };

  // Add this new function to handle forced submission
  const handleForcedSubmit = () => {
    console.log('Forcing quiz submission...');
    stopTimer(); // Stop the timer before forced submission
    const token = Cookies.get("token");
    const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
      questionId,
      ...answer
    }));

    // Submit synchronously
    axios.post(
      `${BASE_URL}/api/quiz/student/${quizId}/submit`,
      {
        attemptId,
        answers: formattedAnswers
      },
      { headers: { Authorization: `Bearer ${token}` } }
    ).then(() => {
      navigate('/students/tests/thank-you');
    }).catch(error => {
      console.error('Force submit failed:', error);
    });
  };

  // Update security violation handler
  const handleSecurityViolation = () => {
    // Check current warning count before incrementing
    if (warningCount >= 2) { // Third violation (0-based count)
      handleForcedSubmit();
      return;
    }

    // Show warning and increment count
    setShowFullScreenWarning(true);
    setCountdown(10);
    setWarningCount(prev => prev + 1);
  };

  // Update focus/blur handler
  useEffect(() => {
    const handleFocus = () => setIsWindowFocused(true);
    const handleBlur = () => {
      setIsWindowFocused(false);
      const newCount = warningCount + 1;
      console.log(`Blur violation #${newCount}`);
      
      if (!checkViolationAndSubmit(newCount)) {
        setWarningCount(newCount);
        setShowFullScreenWarning(true);
        setCountdown(10);
      }
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, [warningCount, answers, attemptId, navigate]);

  const handleAnswer = (answer) => {
    const questionId = quiz.questions[currentQuestion].id;
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
    setAttemptedQuestions(prev => new Set(prev.add(questionId)));
  };

  const handleClearAnswer = () => {
    const questionId = quiz.questions[currentQuestion].id;
    setAnswers(prev => {
      const newAnswers = { ...prev };
      delete newAnswers[questionId];
      return newAnswers;
    });
    setAttemptedQuestions(prev => {
      const newSet = new Set(prev);
      newSet.delete(questionId);
      return newSet;
    });
  };

  const getQuestionStatus = (index) => {
    const questionId = quiz.questions[index].id;
    if (attemptedQuestions.has(questionId)) {
      return "bg-green-500 text-white";
    }
    return "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300";
  };

  const handleSubmitClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = () => {
    setShowConfirmDialog(false);
    handleSubmit();
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const handleCloseImage = () => {
    setSelectedImage(null);
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
    setShowFullScreenWarning(false);
  };

  // Update warning dialog content
  const getWarningMessage = () => {
    // warningCount is now accurate (0, 1, or 2)
    const remainingWarnings = 2 - warningCount;
    
    if (remainingWarnings > 0) {
      return `Please re-enter full screen mode to continue the quiz. You have ${countdown} seconds to comply.\n\nWarning 1/2 - 1 remaining before automatic submission`;
    }
    return `Final warning! Quiz will be automatically submitted in ${countdown} seconds if you don't return to full-screen mode.`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {showFullScreenWarning && (
        <div className="fixed inset-0 bg-red-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full mx-4 text-center">
            <AlertTriangle className="w-12 h-12 mx-auto text-red-600 mb-4" />
            <h3 className="text-xl font-semibold mb-4 dark:text-white">Security Warning</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 whitespace-pre-line">
              {getWarningMessage()}
            </p>
            <div className="flex justify-center">
              <button
                onClick={requestFullScreen}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg hover:from-red-500 hover:to-red-700 transition-colors duration-200 flex items-center justify-center"
              >
                <Maximize2 className="w-5 h-5 mr-2" />
                Re-enter Full Screen
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="w-4/5 pr-4">
        <div className="max-w-4xl mx-auto py-8 px-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-2 ${
                  timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-violet-600 dark:text-violet-400'
                }`}>
                  <Timer className="w-6 h-6" />
                  <span className="text-2xl font-bold">{formatTime(timeLeft)}</span>
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  Question {currentQuestion + 1} of {quiz.questions.length}
                </div>
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                {attemptedQuestions.size} answered
              </div>
            </div>
            <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="absolute h-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-300"
                style={{ width: `${(attemptedQuestions.size / quiz.questions.length) * 100}%` }}
              />
            </div>
          </div>

          <QuizQuestion
            quiz={quiz}
            currentQuestion={currentQuestion}
            answers={answers}
            handleAnswer={handleAnswer}
            handleClearAnswer={handleClearAnswer}
            handleImageClick={handleImageClick}
          />

          <div className="flex justify-between">
            <button
              onClick={() => setCurrentQuestion(prev => prev - 1)}
              disabled={currentQuestion === 0}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                currentQuestion === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-violet-600 hover:bg-violet-50 dark:bg-gray-800 dark:text-violet-400 dark:hover:bg-gray-700'
              }`}
            >
              <ArrowLeft className="w-5 h-5 inline mr-2" />
              Previous
            </button>

            {currentQuestion === quiz.questions.length - 1 ? (
              <button
                onClick={handleSubmitClick}
                disabled={submitting}
                className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500
                         text-white font-medium rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none
                         disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {submitting ? (
                  <Loader2 className="w-5 h-5 inline mr-2 animate-spin" />
                ) : (
                  <Send className="w-5 h-5 inline mr-2" />
                )}
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestion(prev => prev + 1)}
                className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500
                         text-white font-medium rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all duration-200"
              >
                Next
                <ArrowRight className="w-5 h-5 inline ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>

      <QuizNav
        quiz={quiz}
        currentQuestion={currentQuestion}
        setCurrentQuestion={setCurrentQuestion}
        attemptedQuestions={attemptedQuestions}
        handleSubmitClick={handleSubmitClick}
        submitting={submitting}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <ConfirmDialog
        showConfirmDialog={showConfirmDialog}
        setShowConfirmDialog={setShowConfirmDialog}
        handleConfirmSubmit={handleConfirmSubmit}
        attemptedQuestions={attemptedQuestions}
        quiz={quiz}
      />

      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={handleCloseImage}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage}
              alt="Enlarged"
              className="max-w-full max-h-full"
            />
            <button
              onClick={handleCloseImage}
              className="absolute top-2 right-2 text-white bg-black bg-opacity-75 hover:bg-opacity-25 rounded-full p-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuizAttempt;
