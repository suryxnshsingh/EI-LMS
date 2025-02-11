import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Clock, Book, FlaskConical, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = `${import.meta.env.VITE_API_URL}`;

const Tests = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newQuiz, setNewQuiz] = useState({
    title: '',
    description: '',
    timeLimit: 30,
    maxMarks: 0,
    courseIds: [],
    scheduledFor: ''  // new scheduledFor field (datetime-local string)
  });
  const [validationError, setValidationError] = useState(null);

  const initialTheme = Cookies.get("theme") || (document.documentElement.classList.contains("dark") ? "dark" : "light");
  const [localTheme, setLocalTheme] = useState(initialTheme);
  
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setLocalTheme(Cookies.get("theme") || (document.documentElement.classList.contains("dark") ? "dark" : "light"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const fetchTests = async () => {
    try {
      const token = Cookies.get("token");
      // Updated endpoint as per server routes: use /api/quiz/teacher/my-quizzes
      const response = await axios.get(`${BASE_URL}/api/quiz/teacher/my-quizzes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuizzes(response.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch tests:', err);
      setError('Failed to load tests');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/courses/teacher-courses`, {
        headers: { Authorization: `Bearer ${Cookies.get("token")}` }
      });
      console.log('Courses:', response.data);
      setCourses(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      setCourses([]);
    }
  };

  useEffect(() => {
    fetchTests();
    fetchCourses();
  }, [navigate]);

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get("token");
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Sending request with token:', token);
      console.log('Quiz data:', newQuiz);

      const response = await axios.post(
        `${BASE_URL}/api/quiz/teacher`, 
        newQuiz,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Quiz created:', response.data);
      setOpenDialog(false);
      setNewQuiz({ title: '', description: '', timeLimit: 30, maxMarks: 0, courseIds: [], scheduledFor: '' });
      fetchTests();
    } catch (error) {
      console.error('Failed to create quiz:', error.response?.data || error.message);
      setError(error.response?.data?.error || 'Failed to create quiz');
    }
  };

  const handleToggleStatus = async (quiz, e) => {
    e.stopPropagation();

    if (!quiz.isActive) {
      const totalQuestionMarks = quiz.questions.reduce((sum, q) => sum + q.marks, 0);
      
      if (totalQuestionMarks !== quiz.maxMarks) {
        setValidationError({
          quizId: quiz.id,
          message: `Cannot activate quiz: Sum of question marks (${totalQuestionMarks}) does not match quiz total marks (${quiz.maxMarks})`
        });
        return;
      }
    }

    try {
      const token = Cookies.get("token");
      await axios.patch(
        `${BASE_URL}/api/quiz/teacher/${quiz.id}/toggle-status`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setValidationError(null);
      fetchTests();
    } catch (error) {
      console.error('Failed to toggle quiz status:', error);
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        const token = Cookies.get("token");
        if (!token) {
          throw new Error('No authentication token found');
        }

        await axios.delete(
          `${BASE_URL}/api/quiz/teacher/${quizId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        fetchTests();
      } catch (error) {
        console.error('Failed to delete quiz:', error.response?.data || error.message);
        setError(error.response?.data?.error || 'Failed to delete quiz');
      }
    }
  };

  const getCoursesDisplay = (courses) => {
    if (!courses || courses.length === 0) return 'No courses';
    if (courses.length === 1) return courses[0].name;
    return `${courses[0].name} +${courses.length - 1}`;
  };

  const LoadingSpinner = () => {
    return (
      <div className="flex justify-center items-center h-[70svh]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-900 dark:text-white" />
      </div>
    );
  };

  return (
    <div className="w-full p-5 md:p-10">
      <div className="mb-10 flex flex-col md:flex-row justify-between w-full pr-20">
          <h1 className="text-4xl font-semibold text-gray-900 dark:text-white mb-2">
            Manage Tests
          </h1>
          <button
            onClick={() => setOpenDialog(true)}
            className="mt-4 md:mt-0 w-fit px-4 py-2 text-xl text-white border-2 border-neutral-200 dark:border-neutral-700 rounded-md bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-indigo-500 hover:to-violet-500 transition-colors duration-800"
          >
            <div className='flex items-center'><FlaskConical className='mr-2'/>Create New Test</div>
          </button>
      </div>
      {error && (
        <div className="alert alert-error text-red-600 mb-4 max-w-2xl mx-auto">
          {error}
        </div>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="flex flex-wrap gap-4 w-full">
          {Array.isArray(quizzes) && quizzes.map((quiz) => (
            <div 
              key={quiz.id} 
              className="relative"
            >
              {validationError?.quizId === quiz.id && (
                <div className="absolute -top-16 left-0 right-0 p-3 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-lg text-sm shadow-lg border border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{validationError.message}</span>
                  </div>
                </div>
              )}
              <div 
                className='w-96 p-4 bg-gray-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md cursor-pointer transition-shadow hover:shadow-lg hover:shadow-gray-400 dark:hover:shadow-neutral-800'
                onClick={() => navigate(`/teachers/test/${quiz.id}`)}
              >
                <div className="poppins-regular">
                  <div className="mb-4">
                    <h6 className="text-2xl font-bold mb-2">{quiz.title}</h6>
                    <p className="text-gray-600 dark:text-gray-300">{quiz.description}</p>
                  </div>
                  <div className="flex flex-col gap-0 mb-4">
                    <div className="chip flex items-center gap-2 py-1">
                      <Clock size={16} /> {quiz.timeLimit} mins
                    </div>
                    <div className="flex items-center w-fit gap-2 py-1">
                      <Book size={16} /> {getCoursesDisplay(quiz.Course)}
                    </div>
                  </div>
                  <div className="h-px bg-neutral-200 dark:bg-neutral-700 mb-2"></div>
                  <div className="flex justify-between items-center p-1">
                    <div className={`p-0.5 px-2 rounded-full cursor-pointer ${quiz.isActive ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}`} onClick={(e) => handleToggleStatus(quiz, e)}>
                      {quiz.isActive ? 'Active' : 'Inactive'}
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteQuiz(quiz.id); }} className="flex items-center gap-1 hover:bg-gray-300 hover:dark:bg-neutral-900 p-2 rounded text-red-600">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && Array.isArray(quizzes) && quizzes.length === 0 && (
        <div className="p-4 text-center bg-gray-100 dark:bg-gray-900 rounded-md max-w-lg mx-auto">
          <h6 className="text-lg font-bold mb-2">No quizzes available</h6>
          <p className="text-gray-600 dark:text-gray-300">Create your first quiz by clicking the 'Create New Quiz' button</p>
        </div>
      )}

      {openDialog && (
        <div className="fixed h-full w-full top-0 left-0 flex items-center justify-center rounded-tl-2xl z-50 poppins-regular backdrop-brightness-50 dark:backdrop-brightness-50 backdrop-blur-sm">
          <form className="max-w-md bg-white dark:bg-neutral-950 rounded-xl mx-4 p-2 w-full md:w-1/3 h-auto border-2 border-neutral-300 dark:border-neutral-700" onSubmit={handleCreateQuiz}>
            <div className="p-4">
              <div 
                className="flex justify-end text-white cursor-pointer"
                onClick={() => setOpenDialog(false)}
              >❌</div>
              
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  name="title"
                  className="block py-2.5 px-0 w-full text-lg text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                  placeholder=" "
                  value={newQuiz.title}
                  onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                  required
                />
                <label className="peer-focus:font-medium absolute text-lg text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  Quiz Title
                </label>
              </div>

              <div className="relative z-0 w-full mb-5 group">
                <textarea
                  name="description"
                  className="block py-2.5 px-0 w-full text-lg text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                  placeholder=" "
                  value={newQuiz.description}
                  onChange={(e) => setNewQuiz({ ...newQuiz, description: e.target.value })}
                  required
                ></textarea>
                <label className="peer-focus:font-medium absolute text-lg text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  Description
                </label>
              </div>

              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="number"
                  name="timeLimit"
                  className="block py-2.5 px-0 w-full text-lg text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                  placeholder=" "
                  value={newQuiz.timeLimit}
                  onChange={(e) => setNewQuiz({ ...newQuiz, timeLimit: parseInt(e.target.value) })}
                  required
                />
                <label className="peer-focus:font-medium absolute text-lg text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  Time Limit (minutes)
                </label>
              </div>

              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="number"
                  name="maxMarks"
                  className="block py-2.5 px-0 w-full text-lg text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                  placeholder=" "
                  value={newQuiz.maxMarks}
                  onChange={(e) => setNewQuiz({ ...newQuiz, maxMarks: parseFloat(e.target.value) })}
                  required
                />
                <label className="peer-focus:font-medium absolute text-lg text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  Maximum Marks
                </label>
              </div>

              <div className="relative z-0 w-full mb-5 group">
                <select
                  name="courseIds"
                  className="block py-2.5 px-0 w-full text-lg text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                  value={newQuiz.courseIds}
                  onChange={(e) => setNewQuiz({ ...newQuiz, courseIds: [e.target.value] })}
                  required
                >
                  <option value="" disabled>Select a course</option>
                  {Array.isArray(courses) && courses.length === 0 ? (
                    <option disabled>No courses available</option>
                  ) : (
                    courses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.name} ({course.courseCode} | Session: {course.session} | Semester: {course.semester})
                      </option>
                    ))
                  )}
                </select>
                <label className="peer-focus:font-medium absolute text-lg text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  Assign to Course
                </label>
              </div>

              <div className="flex flex-col mb-4">
                <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                  Scheduled For
                </label>
                <input
                  type="datetime-local"
                  name="scheduledFor"
                  value={newQuiz.scheduledFor}
                  onChange={(e) => setNewQuiz(prev => ({ ...prev, scheduledFor: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                           bg-white dark:bg-neutral-800 
                           text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                           focus:border-transparent outline-none
                           transition-colors duration-200"
                />
              </div>

              {error && <div className="text-red-500 mb-3">{error}</div>}
              
              <button
                type="submit"
                className="text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-lg w-full sm:w-auto px-5 py-2.5 mt-5 text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800"
              >
                Create Quiz
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Tests;