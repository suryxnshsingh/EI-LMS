import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Timer, AlertCircle, ArrowLeft, ArrowRight, Send, Loader2, Menu, XCircle } from 'lucide-react';

const BASE_URL = `${import.meta.env.VITE_API_URL}`;

function QuizAttempt() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [attemptId, setAttemptId] = useState(null);
  const [attemptedQuestions, setAttemptedQuestions] = useState(new Set());
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const token = Cookies.get("token");
        const response = await axios.get(`${BASE_URL}/api/quiz/student/${quizId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setQuiz(response.data);
        setTimeLeft(response.data.timeLimit * 60); // Convert minutes to seconds
        
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
  }, [quizId, navigate]);

  // Timer effect
  useEffect(() => {
    if (!timeLeft) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(); // Auto-submit when time runs out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

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

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const token = Cookies.get("token");
      
      // Format answers for submission
      const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        ...answer
      }));

      const response = await axios.post(
        `${BASE_URL}/api/quiz/student/${quizId}/submit`,
        {
          attemptId,
          answers: formattedAnswers
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate(`/students/tests/result/${response.data.id}`);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const renderQuestion = () => {
    if (!quiz || !quiz.questions || !quiz.questions[currentQuestion]) return null;

    const question = quiz.questions[currentQuestion];
    
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
                <span className="text-lg font-medium">{option.text}</span>
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
                       focus:border-violet-500 dark:focus:border-violet-400 outline-none transition-colors"
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
                       resize-none min-h-[200px]"
              placeholder="Enter your answer"
            />
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Quiz Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{quiz.title}</h1>
              <p className="text-gray-600 dark:text-gray-400">{quiz.description}</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-medium text-gray-700 dark:text-gray-300">
                Total Marks: {quiz.maxMarks}
              </div>
            </div>
          </div>
        </div>

        {/* Progress and Timer Bar */}
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

        {/* Question Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-start gap-4">
            <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900 text-violet-600 dark:text-violet-400 font-bold">
              {currentQuestion + 1}
            </span>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {quiz.questions[currentQuestion].text}
                </h2>
                <span className="ml-4 px-3 py-1 bg-violet-100 dark:bg-violet-900 text-violet-600 dark:text-violet-400 rounded-full text-sm font-medium">
                  {quiz.questions[currentQuestion].marks} marks
                </span>
              </div>
              
              {quiz.questions[currentQuestion].imageUrl && (
                <img
                  src={`${BASE_URL}${quiz.questions[currentQuestion].imageUrl}`}
                  alt="Question"
                  className="mb-6 max-h-64 object-contain rounded-lg border border-gray-200 dark:border-gray-700"
                />
              )}
              {renderQuestion()}
            </div>
          </div>
        </div>

        {/* Navigation */}
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
              onClick={handleSubmit}
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
  );
}

export default QuizAttempt;
