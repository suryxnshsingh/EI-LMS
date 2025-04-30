import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SubCard from '../ui/subcard';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { motion } from 'framer-motion';
import { Bot, ArrowRight, BarChart3, Book, Clock, Award, X, ChevronUp, ChevronDown, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import 'katex/dist/katex.min.css'; // Import KaTeX CSS
import { InlineMath, BlockMath } from 'react-katex'; // Import KaTeX React components

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen text-black dark:text-white">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black dark:border-white"></div>
    </div>
  );
};

const Error = ({ error }) => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center flex-col items-center h-screen text-black dark:text-white text-2xl">
      <div>{error}</div>
      <div>
        <button
          onClick={() => {
            localStorage.clear();
            navigate("/signin");
          }}
          className="bg-purple-500 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-xl my-5"
        >
          Re-Login
        </button>
      </div>
    </div>
  );
};

const Dash = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChatButton, setShowChatButton] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'bot',
      message: "Hi there! I'm your academic AI assistant. How can I help you with your studies today?"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [stats, setStats] = useState({
    totalCourses: 0,
    assignments: 0,
    upcomingTests: 0,
    attendancePercentage: 0
  });
  const navigate = useNavigate();
  
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

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const baseURL = import.meta.env.VITE_API_URL;
        const headers = {
          Authorization: `Bearer ${Cookies.get('token')}`
        };

        // Fetch enrolled courses
        const coursesResponse = await axios.get(`${baseURL}/api/enrollment/enrollments/my-courses`, {
          headers
        });

        // Transform course data
        const courses = coursesResponse.data
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
        
        setEnrolledCourses(courses);
        
        // Get all courseIds for fetching related data
        const courseIds = courses.map(course => course.id);
        
        // Fetch pending assignments data
        let assignmentsCount = 0;
        if (courseIds.length > 0) {
          const assignmentsPromises = courseIds.map(courseId => 
            axios.get(`${baseURL}/api/assignment/by-course/${courseId}`, { headers })
              .catch(err => {
                console.error(`Error fetching assignments for course ${courseId}:`, err);
                return { data: [] };
              })
          );
          
          const assignmentsResponses = await Promise.all(assignmentsPromises);
          
          // Count assignments that haven't been submitted yet
          assignmentsCount = assignmentsResponses
            .flatMap(response => response.data)
            .filter(assignment => {
              const deadline = new Date(assignment.deadline);
              const now = new Date();
              return deadline > now && !assignment.submitted;
            }).length;
        }
        
        // Fetch upcoming tests data
        let upcomingTestsCount = 0;
        try {
          const quizResponse = await axios.get(`${baseURL}/api/quiz/student/available`, { headers });
          // Filter quizzes that are upcoming (start date is in the future)
          upcomingTestsCount = quizResponse.data
            .filter(quiz => {
              const quizDate = new Date(quiz.scheduledFor);
              const now = new Date();
              return quizDate > now;
            }).length;
        } catch (err) {
          console.error('Error fetching tests:', err);
          // Continue execution even if tests can't be fetched
        }
        
        // Fetch attendance data using the correct endpoint
        let attendancePercentage = 0;
        try {
          // Get the user ID from Cookies
          const userId = Cookies.get('userId');
          
          if (userId) {
            // Call the student attendance history endpoint
            const attendanceResponse = await axios.get(
              `${baseURL}/api/attendance/students/${userId}/attendance-history`, 
              { headers }
            );
            
            // Extract the percentage from the stats
            attendancePercentage = attendanceResponse.data?.stats?.percentage 
              ? parseFloat(attendanceResponse.data.stats.percentage)
              : 0;
              
            console.log('Attendance data:', {
              totalClasses: attendanceResponse.data?.stats?.totalClasses,
              totalPresent: attendanceResponse.data?.stats?.totalPresent,
              percentage: attendancePercentage
            });
          }
        } catch (err) {
          console.error('Error fetching attendance history:', err);
          // Continue execution even if attendance data can't be fetched
        }
        
        console.log('Dashboard Data:', {
          courses: courses.length,
          assignments: assignmentsCount,
          tests: upcomingTestsCount,
          attendance: {
            percentage: attendancePercentage
          }
        });
        
        // Update stats with real data
        setStats({
          totalCourses: courses.length,
          assignments: assignmentsCount,
          upcomingTests: upcomingTestsCount,
          attendancePercentage: attendancePercentage
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.response?.data?.message || 'Failed to fetch dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const toggleChat = () => {
    setChatOpen(!chatOpen);
  };
  
  const toggleShowAllCourses = () => {
    setShowAllCourses(!showAllCourses);
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
      const baseURL = import.meta.env.VITE_API_URL;
      
      // Send the message to the AI endpoint
      const response = await axios.post(`${baseURL}/api/supra/ask`, {
        question: userMessage
      });
      
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

  if (loading) return <Loading />;
  if (error) return <Error error={error} />;

  // Determine courses to display based on toggle state
  const coursesToDisplay = showAllCourses ? enrolledCourses : enrolledCourses.slice(0, 6);

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

        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <motion.div 
            whileHover={{ scale: 1.03 }}
            className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-neutral-700"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Courses</p>
                <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{stats.totalCourses}</h3>
              </div>
              <span className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <Book className="h-5 w-5 text-blue-500" />
              </span>
            </div>
            <div className="mt-4 text-xs font-medium text-gray-500 dark:text-gray-400">
              {stats.totalCourses > 0 ? "View all courses" : "Enroll in courses"}
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.03 }}
            className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-neutral-700"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Assignments</p>
                <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{stats.assignments}</h3>
              </div>
              <span className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                <Clock className="h-5 w-5 text-purple-500" />
              </span>
            </div>
            <div className="mt-4 text-xs font-medium text-purple-500 dark:text-purple-400">
              {stats.assignments > 0 ? `${stats.assignments} assignments due soon` : "No pending assignments"}
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.03 }}
            className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-neutral-700"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Upcoming Tests</p>
                <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{stats.upcomingTests}</h3>
              </div>
              <span className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
                <BarChart3 className="h-5 w-5 text-amber-500" />
              </span>
            </div>
            <div className="mt-4 text-xs font-medium text-amber-500 dark:text-amber-400">
              {stats.upcomingTests > 0 ? `${stats.upcomingTests} tests this week` : "No upcoming tests"}
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.03 }}
            className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-neutral-700"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Attendance</p>
                <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{stats.attendancePercentage}%</h3>
              </div>
              <span className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg">
                <Award className="h-5 w-5 text-green-500" />
              </span>
            </div>
            <div className="mt-4 flex items-center">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    stats.attendancePercentage >= 85 ? 'bg-green-500' : 
                    stats.attendancePercentage >= 75 ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  style={{width: `${stats.attendancePercentage}%`}}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="mb-10"
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Quick Access</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link to="/students/attendance">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-br from-purple-500 to-purple-700 text-white p-4 rounded-xl flex flex-col items-center text-center shadow-md"
              >
                <Award className="h-6 w-6 mb-2" />
                <span className="text-sm font-medium">Attendance</span>
              </motion.div>
            </Link>
            <Link to="/students/tests">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-br from-amber-500 to-amber-700 text-white p-4 rounded-xl flex flex-col items-center text-center shadow-md"
              >
                <BarChart3 className="h-6 w-6 mb-2" />
                <span className="text-sm font-medium">Tests & Quizzes</span>
              </motion.div>
            </Link>
            <Link to="/students/managecourses">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-4 rounded-xl flex flex-col items-center text-center shadow-md"
              >
                <Book className="h-6 w-6 mb-2" />
                <span className="text-sm font-medium">Course Management</span>
              </motion.div>
            </Link>
            <Link to="/students/ai-chatbot">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-br from-green-500 to-green-700 text-white p-4 rounded-xl flex flex-col items-center text-center shadow-md"
              >
                <Bot className="h-6 w-6 mb-2" />
                <span className="text-sm font-medium">AI Assistant</span>
              </motion.div>
            </Link>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <div className='flex justify-between mb-4 items-center'>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">My Courses</h2>
            {enrolledCourses.length > 6 && (
              <button 
                onClick={toggleShowAllCourses}
                className="text-purple-600 dark:text-purple-400 text-sm font-medium hover:underline flex items-center"
              >
                {showAllCourses ? (
                  <>Show less <ChevronUp className="h-4 w-4 ml-1" /></>
                ) : (
                  <>Show all ({enrolledCourses.length}) <ChevronDown className="h-4 w-4 ml-1" /></>
                )}
              </button>
            )}
          </div>
          
          {enrolledCourses.length === 0 ? (
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-8 text-center border border-gray-100 dark:border-neutral-700">
              <p className="text-xl pb-6 text-gray-600 dark:text-gray-400">No enrolled courses yet.</p>
              <Link 
                to='/students/managecourses' 
                className='bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors'
              >
                Manage Courses
              </Link>
            </div>
          ) : (
            <>
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {coursesToDisplay.map((course) => (
                  <motion.div key={course.id} whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                    <SubCard 
                      id={course.id}
                      code={course.code} 
                      name={course.name} 
                    />
                  </motion.div>
                ))}
              </div>
              
              {!showAllCourses && enrolledCourses.length > 6 && (
                <motion.button
                  onClick={toggleShowAllCourses}
                  className="mt-6 mx-auto bg-white dark:bg-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-700 text-purple-600 dark:text-purple-400 font-medium py-3 px-6 rounded-xl border border-gray-200 dark:border-neutral-700 shadow-sm transition-colors flex items-center"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Show all {enrolledCourses.length} courses</span>
                  <ChevronDown className="ml-2 h-4 w-4" />
                </motion.button>
              )}
            </>
          )}
        </motion.div>
      </motion.div>
      
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