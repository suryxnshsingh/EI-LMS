import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SubCard from '../ui/subcard';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { motion } from 'framer-motion';
import { 
  Bot, ArrowRight, BarChart3, Book, Clock, Award, X, ChevronUp, 
  ChevronDown, Loader2, RefreshCw, Bell, AlertTriangle 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import 'katex/dist/katex.min.css'; // Import KaTeX CSS
import { InlineMath, BlockMath } from 'react-katex'; // Import KaTeX React components

// Reusable loading skeletons for each card type
const StatCardSkeleton = ({ color }) => {
  const colorClasses = {
    blue: "bg-blue-100/40 dark:bg-blue-900/20",
    purple: "bg-purple-100/40 dark:bg-purple-900/20",
    amber: "bg-amber-100/40 dark:bg-amber-900/20",
    green: "bg-green-100/40 dark:bg-green-900/20"
  };
  
  return (
    <motion.div 
      className="relative overflow-hidden bg-white dark:bg-neutral-800 rounded-xl shadow p-6 border border-gray-100 dark:border-neutral-700"
      initial={{ opacity: 0.6 }}
      animate={{ opacity: [0.6, 0.8, 0.6] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="absolute -right-12 -top-12 w-24 h-24 rounded-full bg-gray-100/50 dark:bg-gray-700/20"></div>
      <div className="absolute right-0 bottom-0 w-16 h-16 rounded-full bg-gray-100/30 dark:bg-gray-700/10"></div>
      <div className="relative flex justify-between items-start">
        <div className="w-full">
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
          <div className="h-8 w-16 bg-gray-300 dark:bg-gray-600 rounded-md"></div>
        </div>
        <div className={`rounded-lg w-10 h-10 ${colorClasses[color] || "bg-gray-200 dark:bg-gray-700"}`}></div>
      </div>
      <div className="mt-4 flex items-center">
        <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </motion.div>
  );
};

// Specialized attendance card skeleton
const AttendanceCardSkeleton = () => {
  return (
    <motion.div 
      className="relative overflow-hidden bg-white dark:bg-neutral-800 rounded-xl shadow p-6 border border-gray-100 dark:border-neutral-700"
      initial={{ opacity: 0.6 }}
      animate={{ opacity: [0.6, 0.8, 0.6] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="absolute -right-12 -top-12 w-24 h-24 rounded-full bg-gray-100/50 dark:bg-gray-700/20"></div>
      <div className="absolute right-0 bottom-0 w-16 h-16 rounded-full bg-gray-100/30 dark:bg-gray-700/10"></div>
      <div className="relative flex justify-between items-start">
        <div>
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
          <div className="h-8 w-16 bg-gray-300 dark:bg-gray-600 rounded-md"></div>
        </div>
        <div className="rounded-lg w-10 h-10 bg-gray-200 dark:bg-gray-700"></div>
      </div>
      <div className="mt-6 flex flex-col space-y-2">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5"></div>
        <div className="w-full flex justify-between">
          <div className="h-3 w-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-3 w-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-3 w-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </motion.div>
  );
};

// Quick access button skeleton
const QuickAccessSkeleton = () => {
  return (
    <motion.div 
      className="relative overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 p-5 rounded-xl flex flex-col items-center text-center shadow-md"
      initial={{ opacity: 0.6 }}
      animate={{ opacity: [0.6, 0.8, 0.6] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="rounded-full bg-gray-300 dark:bg-gray-600 h-7 w-7 mb-3"></div>
      <div className="w-16 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
    </motion.div>
  );
};

// Notices section skeleton
const NoticesSkeleton = () => {
  return (
    <motion.div 
      className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow p-6 border border-gray-100 dark:border-neutral-700"
      initial={{ opacity: 0.6 }}
      animate={{ opacity: [0.6, 0.8, 0.6] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="relative flex flex-col items-center justify-center min-h-[160px] text-center max-w-md mx-auto">
        <div className="bg-gray-200 dark:bg-gray-700 rounded-full p-4 w-16 h-16 mb-4"></div>
        <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-48 mb-3"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-72 mb-2"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
      </div>
    </motion.div>
  );
};

// Error component for individual card errors
const CardError = ({ message, onRetry }) => {
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow p-6 border border-red-200 dark:border-red-900 flex flex-col items-center justify-center text-center">
      <AlertTriangle className="h-8 w-8 text-red-500 mb-2" />
      <p className="text-gray-800 dark:text-gray-200 text-sm mb-3">{message || "Failed to load data"}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
        >
          <RefreshCw className="h-3 w-3 mr-1.5" />
          Retry
        </button>
      )}
    </div>
  );
};

const Dash = () => {
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_URL;
  const userId = Cookies.get('userId');
  const authHeaders = {
    Authorization: `Bearer ${Cookies.get('token')}`
  };
  
  // State variables for each section
  const [coursesData, setCoursesData] = useState({
    isLoading: true,
    error: null,
    data: { count: 0 }
  });
  
  const [assignmentsData, setAssignmentsData] = useState({
    isLoading: true,
    error: null,
    data: { count: 0 }
  });
  
  const [testsData, setTestsData] = useState({
    isLoading: true,
    error: null,
    data: { count: 0 }
  });
  
  const [attendanceData, setAttendanceData] = useState({
    isLoading: true,
    error: null,
    data: { percentage: 0 }
  });
  
  // Chat state variables
  const [showChatButton, setShowChatButton] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'bot',
      message: "Hi there! I'm your academic AI assistant. How can I help you with your studies today?"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  // Fetch courses data
  const fetchCoursesData = async () => {
    setCoursesData({ ...coursesData, isLoading: true, error: null });
    try {
      const response = await axios.get(
        `${baseURL}/api/enrollment/enrollments/my-courses`, 
        { headers: authHeaders }
      );
      
      const courses = response.data
        .filter(enrollment => enrollment.status === 'ACCEPTED')
        .map(enrollment => {
          const course = enrollment.course || {};
          return {
            id: enrollment.courseId,
            name: course.name,
            code: course.courseCode,
            teacher: `${course.teacher?.firstName} ${course.teacher?.lastName}`,
            session: course.session,
            semester: course.semester
          };
        });
        
      setCoursesData({
        isLoading: false,
        error: null,
        data: { 
          courses,
          count: courses.length,
          courseIds: courses.map(course => course.id)
        }
      });
      
      // After courses are loaded, fetch assignments since they depend on course IDs
      fetchAssignmentsData(courses.map(course => course.id));
      
    } catch (err) {
      console.error('Error fetching courses:', err);
      setCoursesData({
        isLoading: false,
        error: err.response?.data?.message || 'Failed to load courses',
        data: { count: 0 }
      });
    }
  };
  
  // Fetch assignments data
  const fetchAssignmentsData = async (courseIds = []) => {
    if (!courseIds.length && coursesData.data?.courseIds) {
      courseIds = coursesData.data.courseIds;
    }
    
    if (!courseIds.length) {
      setAssignmentsData({
        isLoading: false,
        error: null,
        data: { count: 0 }
      });
      return;
    }
    
    setAssignmentsData({ ...assignmentsData, isLoading: true, error: null });
    
    try {
      const assignmentsPromises = courseIds.map(courseId => 
        axios.get(`${baseURL}/api/assignment/by-course/${courseId}`, { headers: authHeaders })
          .catch(err => {
            console.error(`Error fetching assignments for course ${courseId}:`, err);
            return { data: [] };
          })
      );
      
      const assignmentsResponses = await Promise.all(assignmentsPromises);
      
      // Count assignments that haven't been submitted yet
      const assignments = assignmentsResponses
        .flatMap(response => response.data)
        .filter(assignment => {
          const deadline = new Date(assignment.deadline);
          const now = new Date();
          return deadline > now && !assignment.submitted;
        });
      
      setAssignmentsData({
        isLoading: false,
        error: null,
        data: { 
          assignments,
          count: assignments.length 
        }
      });
    } catch (err) {
      console.error('Error fetching assignments:', err);
      setAssignmentsData({
        isLoading: false,
        error: err.response?.data?.message || 'Failed to load assignments',
        data: { count: 0 }
      });
    }
  };
  
  // Fetch tests data
  const fetchTestsData = async () => {
    setTestsData({ ...testsData, isLoading: true, error: null });
    
    try {
      const response = await axios.get(
        `${baseURL}/api/quiz/student/available`, 
        { headers: authHeaders }
      );
      
      // Filter quizzes that are upcoming (start date is in the future)
      const upcomingTests = response.data
        .filter(quiz => {
          const quizDate = new Date(quiz.scheduledFor);
          const now = new Date();
          return quizDate > now;
        });
      
      setTestsData({
        isLoading: false,
        error: null,
        data: { 
          tests: upcomingTests,
          count: upcomingTests.length 
        }
      });
    } catch (err) {
      console.error('Error fetching tests:', err);
      setTestsData({
        isLoading: false,
        error: err.response?.data?.message || 'Failed to load tests',
        data: { count: 0 }
      });
    }
  };
  
  // Fetch attendance data
  const fetchAttendanceData = async () => {
    if (!userId) {
      setAttendanceData({
        isLoading: false,
        error: 'User ID not found',
        data: { percentage: 0 }
      });
      return;
    }
    
    setAttendanceData({ ...attendanceData, isLoading: true, error: null });
    
    try {
      const response = await axios.get(
        `${baseURL}/api/attendance/students/${userId}/attendance-history`, 
        { headers: authHeaders }
      );
      
      // Extract the percentage from the stats
      const percentage = response.data?.stats?.percentage 
        ? parseFloat(response.data.stats.percentage)
        : 0;
        
      setAttendanceData({
        isLoading: false,
        error: null,
        data: { 
          stats: response.data?.stats,
          percentage
        }
      });
    } catch (err) {
      console.error('Error fetching attendance:', err);
      setAttendanceData({
        isLoading: false,
        error: err.response?.data?.message || 'Failed to load attendance data',
        data: { percentage: 0 }
      });
    }
  };
  
  // Initialize data loading when component mounts
  useEffect(() => {
    fetchCoursesData();
    fetchTestsData();
    fetchAttendanceData();
    // Note: fetchAssignmentsData is called after courses are loaded
  }, []);

  const toggleChat = () => {
    setChatOpen(!chatOpen);
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    
    const userMessage = chatInput.trim();
    setChatInput('');
    
    // Add user message to chat
    setChatMessages(prev => [...prev, {
      sender: 'user',
      message: userMessage
    }]);
    
    // Set typing indicator
    setIsTyping(true);
    
    try {
      // Send the message to the AI endpoint with Authorization header
      const response = await axios.post(
        `${baseURL}/api/supra/ask`,
        { question: userMessage },
        {
          headers: {
            'Authorization': `Bearer ${Cookies.get('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      // Add AI response to chat
      setChatMessages(prev => [...prev, {
        sender: 'bot',
        message: response.data.response
      }]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      setChatMessages(prev => [...prev, {
        sender: 'bot',
        message: "Sorry, I'm having trouble connecting right now. Please try again later or visit the full chatbot page."
      }]);
    } finally {
      setIsTyping(false);
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const goToFullChatWithQuestion = () => {
    // Only navigate with input if there's actual text
    if (chatInput.trim()) {
      // Store the current question in localStorage to retrieve it on the chat page
      localStorage.setItem('pendingChatQuestion', chatInput.trim());
    }
    navigate('/students/ai-chatbot');
  };
  
  // Formats text with markdown-like syntax and renders LaTeX
  const renderMessage = (content) => {
    // Split the content into segments of normal text and LaTeX formulas
    const segments = [];
    let currentText = '';
    let i = 0;
    
    // Process the content to extract LaTeX formulas
    while (i < content.length) {
      // Detect block LaTeX formula: \[formula\]
      if (content.slice(i, i + 2) === '\\[' && content.indexOf('\\]', i + 2) !== -1) {
        const end = content.indexOf('\\]', i + 2);
        if (currentText) {
          segments.push({ type: 'text', content: currentText });
          currentText = '';
        }
        segments.push({ type: 'block-math', content: content.slice(i + 2, end) });
        i = end + 2;
      } 
      // Detect inline LaTeX formula: \(formula\)
      else if (content.slice(i, i + 2) === '\\(' && content.indexOf('\\)', i + 2) !== -1) {
        const end = content.indexOf('\\)', i + 2);
        if (currentText) {
          segments.push({ type: 'text', content: currentText });
          currentText = '';
        }
        // Clean up any double escaping in the LaTeX
        let formula = content.slice(i + 2, end).replace(/\\\(/g, '(').replace(/\\\)/g, ')');
        segments.push({ type: 'inline-math', content: formula });
        i = end + 2;
      }
      // Also support the $ and $$ syntax
      else if (content.slice(i, i + 1) === '$' && content.slice(i + 1, i + 2) !== '$' && content.indexOf('$', i + 1) !== -1) {
        const end = content.indexOf('$', i + 1);
        if (currentText) {
          segments.push({ type: 'text', content: currentText });
          currentText = '';
        }
        segments.push({ type: 'inline-math', content: content.slice(i + 1, end) });
        i = end + 1;
      }
      else if (content.slice(i, i + 2) === '$$' && content.indexOf('$$', i + 2) !== -1) {
        const end = content.indexOf('$$', i + 2);
        if (currentText) {
          segments.push({ type: 'text', content: currentText });
          currentText = '';
        }
        segments.push({ type: 'block-math', content: content.slice(i + 2, end) });
        i = end + 2;
      } else {
        currentText += content[i];
        i++;
      }
    }
    
    if (currentText) {
      segments.push({ type: 'text', content: currentText });
    }
    
    return segments.map((segment, index) => {
      if (segment.type === 'inline-math') {
        try {
          return <InlineMath key={index} math={segment.content} />;
        } catch (err) {
          console.error('KaTeX error:', err);
          return <code key={index}>\({segment.content}\)</code>;
        }
      }
      
      if (segment.type === 'block-math') {
        try {
          return <BlockMath key={index} math={segment.content} />;
        } catch (err) {
          console.error('KaTeX error:', err);
          return <pre key={index}><code>\[{segment.content}\]</code></pre>;
        }
      }
      
      // For text segments, just return the content
      return <span key={index}>{segment.content}</span>;
    });
  };

  return (
    <div className="w-full md:mr-16 pb-16">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="px-4 md:px-10"
      >
        <motion.div 
          variants={itemVariants}
          className="mb-8 mt-4"
        >
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Welcome back, {Cookies.get('firstName')}!
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Here's an overview of your academic progress
          </p>
        </motion.div>

        {/* Stats cards grid */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {/* Courses Card */}
          {coursesData.isLoading ? (
            <StatCardSkeleton color="blue" />
          ) : coursesData.error ? (
            <CardError 
              message={coursesData.error} 
              onRetry={fetchCoursesData} 
            />
          ) : (
            <motion.div 
              whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.1)" }}
              className="relative overflow-hidden bg-white dark:bg-neutral-800 rounded-xl shadow p-6 border border-gray-100 dark:border-neutral-700 group"
            >
              <div className="absolute -right-12 -top-12 w-24 h-24 rounded-full bg-blue-100/50 dark:bg-blue-900/20 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="absolute right-0 bottom-0 w-16 h-16 rounded-full bg-blue-100/30 dark:bg-blue-900/10 group-hover:scale-150 transition-transform duration-700 delay-100"></div>
              <div className="relative flex justify-between items-start">
                <div>
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Total Courses</p>
                  <h3 className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">{coursesData.data.count}</h3>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg shadow-inner flex items-center justify-center transform transition-transform group-hover:rotate-12">
                  <Book className="h-5 w-5 text-blue-500" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs font-medium text-blue-500 dark:text-blue-400 relative">
                {coursesData.data.count > 0 ? (
                  <Link to="/students/courses" className="flex items-center hover:underline">
                    <span>View all courses</span>
                    <ArrowRight className="h-3.5 w-3.5 ml-1 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                ) : (
                  <Link to="/students/managecourses" className="flex items-center hover:underline">
                    <span>Enroll in courses</span>
                    <ArrowRight className="h-3.5 w-3.5 ml-1 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
              </div>
            </motion.div>
          )}

          {/* Assignments Card */}
          {assignmentsData.isLoading ? (
            <StatCardSkeleton color="purple" />
          ) : assignmentsData.error ? (
            <CardError 
              message={assignmentsData.error} 
              onRetry={() => fetchAssignmentsData(coursesData.data.courseIds)} 
            />
          ) : (
            <motion.div 
              whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(168, 85, 247, 0.1)" }}
              className="relative overflow-hidden bg-white dark:bg-neutral-800 rounded-xl shadow p-6 border border-gray-100 dark:border-neutral-700 group"
            >
              <div className="absolute -right-12 -top-12 w-24 h-24 rounded-full bg-purple-100/50 dark:bg-purple-900/20 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="absolute right-0 bottom-0 w-16 h-16 rounded-full bg-purple-100/30 dark:bg-purple-900/10 group-hover:scale-150 transition-transform duration-700 delay-100"></div>
              <div className="relative flex justify-between items-start">
                <div>
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Pending Assignments</p>
                  <h3 className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">{assignmentsData.data.count}</h3>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg shadow-inner flex items-center justify-center transform transition-transform group-hover:rotate-12">
                  <Clock className="h-5 w-5 text-purple-500" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <div className="text-xs font-medium text-purple-500 dark:text-purple-400 flex items-center">
                  {assignmentsData.data.count > 0 ? (
                    <Link to="/students/managecourses" className="flex items-center hover:underline">
                      <span>{assignmentsData.data.count} assignments due soon</span>
                      <ArrowRight className="h-3.5 w-3.5 ml-1 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                  ) : (
                    <span>No pending assignments</span>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Tests Card */}
          {testsData.isLoading ? (
            <StatCardSkeleton color="amber" />
          ) : testsData.error ? (
            <CardError 
              message={testsData.error} 
              onRetry={fetchTestsData} 
            />
          ) : (
            <motion.div 
              whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(245, 158, 11, 0.1)" }}
              className="relative overflow-hidden bg-white dark:bg-neutral-800 rounded-xl shadow p-6 border border-gray-100 dark:border-neutral-700 group"
            >
              <div className="absolute -right-12 -top-12 w-24 h-24 rounded-full bg-amber-100/50 dark:bg-amber-900/20 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="absolute right-0 bottom-0 w-16 h-16 rounded-full bg-amber-100/30 dark:bg-amber-900/10 group-hover:scale-150 transition-transform duration-700 delay-100"></div>
              <div className="relative flex justify-between items-start">
                <div>
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Upcoming Tests</p>
                  <h3 className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">{testsData.data.count}</h3>
                </div>
                <div className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-lg shadow-inner flex items-center justify-center transform transition-transform group-hover:rotate-12">
                  <BarChart3 className="h-5 w-5 text-amber-500" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <div className="text-xs font-medium text-amber-500 dark:text-amber-400 flex items-center">
                  {testsData.data.count > 0 ? (
                    <Link to="/students/tests" className="flex items-center hover:underline">
                      <span>{testsData.data.count} tests this week</span>
                      <ArrowRight className="h-3.5 w-3.5 ml-1 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                  ) : (
                    <span>No upcoming tests</span>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Attendance Card */}
          {attendanceData.isLoading ? (
            <AttendanceCardSkeleton />
          ) : attendanceData.error ? (
            <CardError 
              message={attendanceData.error} 
              onRetry={fetchAttendanceData} 
            />
          ) : (
            <motion.div 
              whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.1)" }}
              className="relative overflow-hidden bg-white dark:bg-neutral-800 rounded-xl shadow p-6 border border-gray-100 dark:border-neutral-700 group"
            >
              <div className="absolute -right-12 -top-12 w-24 h-24 rounded-full bg-green-100/50 dark:bg-green-900/20 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="absolute right-0 bottom-0 w-16 h-16 rounded-full bg-green-100/30 dark:bg-green-900/10 group-hover:scale-150 transition-transform duration-700 delay-100"></div>
              <div className="relative flex justify-between items-start">
                <div>
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Attendance</p>
                  <h3 className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">{attendanceData.data.percentage}%</h3>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg shadow-inner flex items-center justify-center transform transition-transform group-hover:rotate-12">
                  <Award className="h-5 w-5 text-green-500" />
                </div>
              </div>
              <div className="mt-6 flex flex-col space-y-2">
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`h-2.5 rounded-full relative ${
                      attendanceData.data.percentage >= 85 ? 'bg-gradient-to-r from-green-400 to-green-500' : 
                      attendanceData.data.percentage >= 75 ? 'bg-gradient-to-r from-amber-300 to-amber-500' : 'bg-gradient-to-r from-red-400 to-red-500'
                    }`}
                    style={{width: `${attendanceData.data.percentage}%`}}
                  >
                    <div className="absolute -inset-y-full right-0 w-2 bg-white/20 skew-x-12 animate-shimmer"></div>
                  </div>
                </div>
                <div className="w-full flex justify-between text-xs">
                  <span className="text-red-500">0%</span>
                  <span className="text-amber-500">50%</span>
                  <span className="text-green-500">100%</span>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Quick Access Section */}
        <motion.div 
          variants={itemVariants}
          className="mb-10"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Quick Access</h2>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-neutral-700 px-2 py-1 rounded-full">
              Frequently Used
            </span>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
            <Link to="/students/attendance">
              <motion.div 
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-700 text-white p-5 rounded-xl flex flex-col items-center text-center shadow-md shadow-purple-500/10 group"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-white/10 rounded-full"></div>
                <Award className="h-7 w-7 mb-3 z-10" />
                <span className="text-sm font-medium">Attendance</span>
              </motion.div>
            </Link>
            
            <Link to="/students/tests">
              <motion.div 
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="relative overflow-hidden bg-gradient-to-br from-amber-500 to-amber-700 text-white p-5 rounded-xl flex flex-col items-center text-center shadow-md shadow-amber-500/10 group"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-white/10 rounded-full"></div>
                <BarChart3 className="h-7 w-7 mb-3 z-10" />
                <span className="text-sm font-medium">Tests & Quizzes</span>
              </motion.div>
            </Link>
            
            <Link to="/students/managecourses">
              <motion.div 
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-700 text-white p-5 rounded-xl flex flex-col items-center text-center shadow-md shadow-blue-500/10 group"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-white/10 rounded-full"></div>
                <Book className="h-7 w-7 mb-3 z-10" />
                <span className="text-sm font-medium">Course Management</span>
              </motion.div>
            </Link>
            
            <Link to="/students/ai-chatbot">
              <motion.div 
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="relative overflow-hidden bg-gradient-to-br from-green-500 to-green-700 text-white p-5 rounded-xl flex flex-col items-center text-center shadow-md shadow-green-500/10 group"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-white/10 rounded-full"></div>
                <Bot className="h-7 w-7 mb-3 z-10" />
                <span className="text-sm font-medium">AI Assistant</span>
              </motion.div>
            </Link>
            
            <Link to="/students/courses">
              <motion.div 
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="relative overflow-hidden bg-gradient-to-br from-pink-500 to-pink-700 text-white p-5 rounded-xl flex flex-col items-center text-center shadow-md shadow-pink-500/10 group"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-white/10 rounded-full"></div>
                <Book className="h-7 w-7 mb-3 z-10" />
                <span className="text-sm font-medium">Access Courses</span>
              </motion.div>
            </Link>
          </div>
        </motion.div>

        {/* Notices Section */}
        <motion.div 
          variants={itemVariants}
          className="mb-10"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Announcements & Notices</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-xs flex items-center font-medium text-purple-500 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
            >
              <span>View All</span>
              <ArrowRight className="h-3 w-3 ml-1" />
            </motion.button>
          </div>
          
          {/* Notifications card with layered design */}
          <div className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-neutral-800 dark:to-neutral-900 rounded-xl shadow p-6 border border-gray-100 dark:border-neutral-700">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100/20 dark:bg-purple-900/10 rounded-full blur-xl transform translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-100/20 dark:bg-blue-900/10 rounded-full blur-xl transform -translate-x-12 translate-y-12"></div>
            
            {/* Coming soon message with improved design */}
            <div className="relative flex flex-col items-center justify-center min-h-[160px] text-center max-w-md mx-auto">
              <div className="bg-white dark:bg-neutral-800 rounded-full p-4 shadow-md mb-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="text-purple-500 dark:text-purple-400"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                </motion.div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Notifications Coming Soon
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Important department announcements and updates will appear here. Check back soon!
              </p>
              
              {/* Example notice items (visually hidden with opacity-0, but showing structure) */}
              <div className="absolute opacity-0 pointer-events-none w-full max-w-md">
                <div className="flex items-start p-4 mb-3 bg-white dark:bg-neutral-800 rounded-lg border-l-4 border-blue-500 shadow-sm">
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium text-gray-900 dark:text-white">Class Rescheduled</h4>
                      <span className="text-xs text-gray-500">2h ago</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Digital Signal Processing class moved to Room EI-305</p>
                  </div>
                </div>
                
                <div className="flex items-start p-4 mb-3 bg-white dark:bg-neutral-800 rounded-lg border-l-4 border-purple-500 shadow-sm">
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium text-gray-900 dark:text-white">Assignment Deadline</h4>
                      <span className="text-xs text-gray-500">1d ago</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Embedded Systems final project due date extended</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Chat button */}
      {showChatButton && (
        <motion.div 
          className="fixed bottom-6 right-6 z-50"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, type: "spring" }}
        >
          <motion.button
            onClick={toggleChat}
            className={`flex items-center justify-center p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full text-white shadow-lg hover:shadow-xl`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {chatOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <>
                <Bot className="h-6 w-6" />
              </>
            )}
          </motion.button>
          
          {!chatOpen && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 }}
              className="absolute right-16 top-2 bg-white dark:bg-neutral-800 text-gray-800 dark:text-white px-3 py-1 rounded-lg shadow-sm text-sm whitespace-nowrap"
            >
              Ask AI Assistant
            </motion.div>
          )}
        </motion.div>
      )}
      
      {/* Chat panel */}
      <motion.div
        className={`fixed bottom-24 right-6 w-80 sm:w-96 bg-white dark:bg-neutral-800 rounded-xl shadow-xl z-40 overflow-hidden border border-gray-200 dark:border-neutral-700`}
        initial={{ opacity: 0, y: 50, scale: 0.8 }}
        animate={{ 
          opacity: chatOpen ? 1 : 0,
          y: chatOpen ? 0 : 50,
          scale: chatOpen ? 1 : 0.8,
          pointerEvents: chatOpen ? "auto" : "none"
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-neutral-700">
          <div className="flex items-center">
            <span className="p-1.5 bg-purple-100 dark:bg-purple-900/50 rounded-md mr-2">
              <Bot className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </span>
            <h3 className="font-semibold text-gray-800 dark:text-white">AI Assistant</h3>
          </div>
          <div className="flex">
            <button 
              onClick={goToFullChatWithQuestion}
              className="p-1 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-full text-gray-600 dark:text-gray-300"
              title="Open full chat"
            >
              <ChevronUp className="h-4 w-4" />
            </button>
            <button 
              onClick={toggleChat}
              className="p-1 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-full text-gray-600 dark:text-gray-300 ml-1"
              title="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="h-64 overflow-y-auto p-4 bg-gray-50 dark:bg-neutral-900 text-sm" id="chatMessages">
          {chatMessages.map((msg, index) => (
            <div key={index} className={`flex items-start mb-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
              {msg.sender === 'bot' && (
                <div className="h-6 w-6 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-2 flex-shrink-0">
                  <Bot className="h-3 w-3 text-purple-500" />
                </div>
              )}
              <div className={`rounded-lg p-2 text-sm max-w-[85%] ${
                msg.sender === 'user' 
                  ? 'bg-purple-500 text-white ml-2' 
                  : 'bg-white dark:bg-neutral-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-neutral-700'
              }`}>
                {renderMessage(msg.message)}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex items-start mb-3">
              <div className="h-6 w-6 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-2 flex-shrink-0">
                <Bot className="h-3 w-3 text-purple-500" />
              </div>
              <div className="bg-white dark:bg-neutral-800 rounded-lg p-2 text-gray-800 dark:text-gray-200 shadow-sm border border-gray-100 dark:border-neutral-700">
                <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
              </div>
            </div>
          )}
        </div>
        <div className="p-3 border-t border-gray-200 dark:border-neutral-700">
          <div className="flex items-center">
            <input 
              type="text" 
              placeholder="Type your question..."
              className="flex-1 p-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button 
              onClick={handleSendMessage}
              className="p-2 ml-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isTyping || !chatInput.trim()}
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dash;