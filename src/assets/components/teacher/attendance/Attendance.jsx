import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Loader2, RotateCw, BookUser, QrCode, MoreVertical, Eye, EyeOff, X, Download } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useMediaQuery } from 'react-responsive';
import Responses from './Responses';
import AttendanceDownloadDialog from './AttendanceDownloadDialog';
import CryptoJS from 'crypto-js'; // Import CryptoJS

const BASE_URL = `${import.meta.env.VITE_API_URL}`;

const Attendance = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedCourseForSession, setSelectedCourseForSession] = useState(null);
  const [attendanceSessions, setAttendanceSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [creatingSession, setCreatingSession] = useState(false);
  const [togglingSession, setTogglingSession] = useState({});
  const [buttonLoading, setButtonLoading] = useState({ refresh: false, sessions: {} });
  const [qrCodeSession, setQrCodeSession] = useState(null); // QR code session
  const isSmallDevice = useMediaQuery({ maxWidth: 768 }); // Define media query for small devices
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [deletingSession, setDeletingSession] = useState({});
  const [showAttendanceId, setShowAttendanceId] = useState(false); // State to toggle attendance ID visibility
  const [showResponses, setShowResponses] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);

  const toggleDropdown = (id) => {
    setDropdownOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const deleteSession = async (id, teacherId) => {
    setDeletingSession((prev) => ({ ...prev, [id]: true }));
    try {
      console.log(`Deleting session ${id} for teacher ${teacherId}`);

      await axios.delete(`${BASE_URL}/api/attendance/attendance/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get("token")}`
        },
        data: {
          teacherId
        }
      });

      console.log(`Session ${id} deleted successfully`);

      fetchAttendanceSessions(selectedCourse.id);
    } catch (err) {
      console.error(`Failed to delete session ${id}:`, err);
      setError(err.response?.data?.message || "Failed to delete attendance session");
    } finally {
      setDeletingSession((prev) => ({ ...prev, [id]: false }));
    }
  };

  const viewResponses = (id) => {
    setSelectedSessionId(id);
    setShowResponses(true);
  };

  // Fetch teacher courses
  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/courses/teacher-courses`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`
        }
      });
      setCourses(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  // Fetch attendance sessions for a course
  const fetchAttendanceSessions = async (courseId) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/attendance/courses/${courseId}/attendance`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`
        }
      });
      const sortedSessions = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setAttendanceSessions(sortedSessions);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch attendance sessions");
    }
  };

  const encrypt = (text) => {
    return CryptoJS.AES.encrypt(text, 'secret-key').toString();
  };

  const decrypt = (ciphertext) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, 'secret-key');
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  // Create attendance session
  const createAttendanceSession = async (courseId, teacherId, date, duration) => {
    if (!selectedCourseForSession) {
      setError("No course selected for session");
      return;
    }
    setCreatingSession(true);
    try {
      const response = await axios.post(`${BASE_URL}/api/attendance/attendance`, {
        courseId,
        teacherId,
        date,
        duration
      }, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`
        }
      });
      fetchAttendanceSessions(courseId);
      setSelectedCourse(courses.find(course => course.id === courseId)); // Trigger the tab of the specific course
      setQrCodeSession(encrypt(response.data.id.toString())); // Encrypt the QR code session ID
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create attendance session");
    } finally {
      setCreatingSession(false);
    }
  };

  // Toggle attendance session status
  const toggleAttendanceSessionStatus = async (id, isActive) => {
    setTogglingSession((prev) => ({ ...prev, [id]: true }));
    try {
      await axios.patch(`${BASE_URL}/api/attendance/attendance/${id}/status`, {
        isActive
      }, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`
        }
      });
      fetchAttendanceSessions(selectedCourse.id);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to toggle attendance session status");
    } finally {
      setTogglingSession((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleRefresh = async () => {
    setButtonLoading((prev) => ({ ...prev, refresh: true }));
    setRefreshing(true);
    setError(null);
    await fetchCourses();
    if (selectedCourse) {
      await fetchAttendanceSessions(selectedCourse.id);
    }
    setRefreshing(false);
    setButtonLoading((prev) => ({ ...prev, refresh: false }));
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchAttendanceSessions(selectedCourse.id);
      setSelectedCourseForSession(selectedCourse); // Update selectedCourseForSession based on active tab
    }
  }, [selectedCourse]);

  const handleDeleteSession = (sessionId) => {
    const teacherId = selectedCourseForSession.teacherId;
    deleteSession(sessionId, teacherId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-900 dark:text-white" />
      </div>
    );
  }

  return (
    <div className="p-5 md:p-10 w-full">
      <div className="container p-4 space-y-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-semibold text-gray-900 dark:text-white">Attendance</h1>
            <button
              onClick={handleRefresh}
              disabled={refreshing || buttonLoading.refresh}
              className="inline-flex items-center px-3 py-1.5 transition-all text-sm font-medium rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-neutral-800 dark:text-gray-300 dark:hover:bg-neutral-700 disabled:opacity-50"
            >
              <RotateCw className={`h-4 w-4 mr-1.5 ${refreshing || buttonLoading.refresh ? 'animate-spin' : ''}`} />
              {refreshing || buttonLoading.refresh ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {error && (
          <div className="border px-4 py-3 rounded mb-4 bg-red-50 border-red-200 text-red-700 dark:bg-red-900 dark:border-red-800 dark:text-red-200">
            {error}
          </div>
        )}

        <div className="rounded-lg bg-white dark:bg-neutral-800 shadow-md dark:shadow-none p-6 space-y-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col justify-center md:flex-row md:items-center gap-4">
              <div className='flex justify-between items-center gap-4 w-full'>
                <QrCode size={30}/>
                <select
                  value={selectedCourseForSession?.id || ''}
                  onChange={(e) => {
                    const course = courses.find(course => course.id === parseInt(e.target.value));
                    setSelectedCourseForSession(course);
                  }}
                  className="px-3 py-2 rounded-lg text-start border border-gray-200 dark:border-neutral-700 bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-gray-300"
                >
                  <option value="" disabled>Select Course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>{course.name}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => createAttendanceSession(selectedCourseForSession.id, selectedCourseForSession.teacherId, new Date().toISOString(), 60)}
                disabled={creatingSession || !selectedCourseForSession}
                className="flex justify-center text-nowrap text-center items-center px-3 py-2 text-sm font-medium rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-300 dark:hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {creatingSession ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  'Create Attendance Session'
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="flex overflow-x-auto space-x-2 mb-6">
          {courses.map((course) => (
            <button
              key={course.id}
              onClick={() => setSelectedCourse(course)}
              className={`px-4 py-2 flex items-center rounded-lg whitespace-nowrap transition-colors ${
                selectedCourse?.id === course.id
                  ? 'bg-gray-200 text-black dark:bg-neutral-700 dark:text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-neutral-800 dark:text-gray-300 dark:hover:bg-neutral-700'
              }`}
            >
              <BookUser className="h-4 w-4 mr-1" />
              {course.name}
            </button>
          ))}
        </div>

        {selectedCourse && (
          <div className="rounded-lg bg-white dark:bg-neutral-800 shadow-md dark:shadow-none">
            <div className="border-b px-6 py-4 border-gray-200 dark:border-neutral-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white">
                  {selectedCourse.name} <p className="hidden md:block">({selectedCourse.courseCode})</p>
                </div>
                <button
                  onClick={() => setShowDownloadDialog(true)}
                  className="flex items-center px-3 py-1.5 text-sm font-medium rounded-lg bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-800 dark:text-green-300 dark:hover:bg-green-700 transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Excel
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {attendanceSessions.length > 0 ? (
                <div className="space-y-2">
                  {attendanceSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-4 rounded border bg-gray-50 border-gray-100 dark:bg-neutral-700 dark:border-neutral-600"
                    >
                      <div className='flex flex-col'>
                        <span className="font-medium text-gray-900 dark:text-white text-nowrap">
                          Attendance ID: {session.id}
                        </span>
                        <span className="text-sm ml-2 text-gray-600 dark:text-gray-400">
                          Created Date:<br/> {new Date(session.createdAt).toLocaleString()}
                        </span>
                        <span className="text-sm ml-2 text-gray-600 dark:text-gray-400">
                          Modified Date:<br/> {session.updatedAt ? new Date(session.updatedAt).toLocaleString() : 'N/A'}
                        </span>
                      </div>
                      <div className="flex flex-col md:flex-row items-center gap-2 mt-2 md:mt-0">
                        <button
                          onClick={() => toggleAttendanceSessionStatus(session.id, !session.isActive)}
                          disabled={togglingSession[session.id]}
                          className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg ${
                            session.isActive
                              ? 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-800 dark:text-red-300 dark:hover:bg-red-700'
                              : 'bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-800 dark:text-green-300 dark:hover:bg-green-700'
                          } transition-colors disabled:opacity-50`}
                        >
                          {togglingSession[session.id] ? (
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            session.isActive ? 'Deactivate' : 'Activate'
                          )}
                        </button>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setQrCodeSession(encrypt(session.id.toString())); // Encrypt the QR code session ID
                              setShowAttendanceId(false);
                            }} // Set QR code session
                            disabled={!session.isActive} // Disable if session is not active
                            className="inline-flex items-center p-1.5 text-sm font-medium rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-neutral-800 dark:text-gray-300 dark:hover:bg-neutral-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <QrCode/>
                          </button>
                          <div className="relative">
                            <button
                              onClick={() => toggleDropdown(session.id)}
                              className="inline-flex items-center p-1.5 text-sm font-medium rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-neutral-800 dark:text-gray-300 dark:hover:bg-neutral-900 transition-colors"
                            >
                              <MoreVertical />
                            </button>
                            {dropdownOpen[session.id] && (
                              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-lg shadow-xl z-10 divide-y divide-gray-100 dark:divide-neutral-500">
                                <button
                                  onClick={() => handleDeleteSession(session.id)}
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 rounded-t-lg dark:hover:bg-neutral-900"
                                  disabled={deletingSession[session.id]}
                                >
                                  {deletingSession[session.id] ? (
                                    <Loader2 className="h-4 w-4 text-center animate-spin" />
                                  ) : (
                                    'Delete Session'
                                  )}
                                </button>
                                <button
                                  onClick={() => viewResponses(session.id)}
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 rounded-b-lg dark:hover:bg-neutral-900"
                                >
                                  View Responses
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400">
                  No attendance sessions available
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {qrCodeSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
          <div className="bg-white rounded-lg shadow-lg px-6 pb-6 pt-2">
            <div className="flex justify-between items-center mb-3 pb-1 border-b-2 border-gray-200">
              <div className="flex items-center gap-2">
              
                <h2 className={`text-2xl text-nowrap font-semibold text-gray-900 text-center`}>
                    Attendance ID :
                </h2>
                <h2 className={`text-2xl text-nowrap font-semibold text-gray-900 text-center ${!showAttendanceId && 'blur-[5px]'}`}>
                   {decrypt(qrCodeSession)}
                </h2>
                <button
                  onClick={() => setShowAttendanceId(!showAttendanceId)}
                  className="text-gray-600 hover:text-gray-900 "
                >
                  {showAttendanceId ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                </button>
              </div>
              <button
              onClick={() => setQrCodeSession(null)}
              className="text-gray-600 hover:text-gray-900 flex w-full justify-end"
            >
              ❌
            </button>
            </div>
            <QRCodeSVG value={qrCodeSession} size={isSmallDevice ? 300 : 550} /> {/* Adjust size based on device */}
          </div>
        </div>
      )}

      {/* Responses Modal */}
      {showResponses && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-neutral-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Attendance Responses
              </h2>
              <button
                onClick={() => setShowResponses(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-4">
              <Responses 
                courseId={selectedCourse?.id} 
                attendanceId={selectedSessionId} 
              />
            </div>
          </div>
        </div>
      )}

      {showDownloadDialog && (
        <AttendanceDownloadDialog
          courseId={selectedCourse.id}
          courseName={selectedCourse.name}
          onClose={() => setShowDownloadDialog(false)}
        />
      )}
    </div>
  );
};

export default Attendance;