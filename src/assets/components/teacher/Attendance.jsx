import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Loader2, RotateCw, BookUser } from 'lucide-react';

const BASE_URL = 'http://localhost:8080';

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

  // Create attendance session
  const createAttendanceSession = async (courseId, teacherId, date, duration) => {
    setCreatingSession(true);
    try {
      await axios.post(`${BASE_URL}/api/attendance/attendance`, {
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
    }
  }, [selectedCourse]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-900 dark:text-white" />
      </div>
    );
  }

  return (
    <div className="w-full m-10">
      <div className="container p-4 space-y-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-semibold text-gray-900 dark:text-white">Attendance</h1>
            <button
              onClick={handleRefresh}
              disabled={refreshing || buttonLoading.refresh}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-neutral-800 dark:text-gray-300 dark:hover:bg-neutral-700 transition-colors disabled:opacity-50"
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
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <select
                value={selectedCourseForSession?.id || ''}
                onChange={(e) => {
                  const course = courses.find(course => course.id === parseInt(e.target.value));
                  setSelectedCourseForSession(course);
                }}
                className="px-3 py-2 rounded-lg bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-gray-300"
              >
                <option value="" disabled>Select Course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>{course.name}</option>
                ))}
              </select>
              <button
                onClick={() => createAttendanceSession(selectedCourseForSession.id, selectedCourseForSession.teacherId, new Date().toISOString(), 60)}
                disabled={creatingSession || !selectedCourseForSession}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-300 dark:hover:bg-blue-700 transition-colors disabled:opacity-50"
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
              <div className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white">
                {selectedCourse.name} <p className="hidden md:block">({selectedCourse.courseCode})</p>
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
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          Attendance ID: {session.id}
                        </span>
                        <span className="text-sm ml-2 text-gray-600 dark:text-gray-400">
                          Created Date: {new Date(session.createdAt).toLocaleString()}
                        </span>
                        <span className="text-sm ml-2 text-gray-600 dark:text-gray-400">
                          Modified Date: {session.updatedAt ? new Date(session.updatedAt).toLocaleString() : 'N/A'}
                        </span>
                      </div>
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
    </div>
  );
};

export default Attendance;