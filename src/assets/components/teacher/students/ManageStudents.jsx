import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, Check, X, Users, BookUser, RotateCw, Trash2 } from 'lucide-react';
import Cookies from 'js-cookie';
import StudentAttendanceDialog from './StudentAttendanceDialog';

const BASE_URL = `${import.meta.env.VITE_API_URL}`;

const ManageStudentsPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState({ courses: null, enrollments: null });
  const [activeTab, setActiveTab] = useState(0);
  const [buttonLoading, setButtonLoading] = useState({ refresh: false, enrollments: {} });
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Fetch teacher courses with enrollments (both pending and accepted)
  const fetchCoursesWithEnrollments = async () => {
    try {
      setError({ courses: null, enrollments: null });
      
      const courseResponse = await axios.get(`${BASE_URL}/api/courses/teacher-courses`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`
        }
      });
      
      const coursesData = courseResponse.data;
      
      // For each course, fetch enrolled students
      const coursesWithEnrollments = await Promise.all(
        coursesData.map(async (course) => {
          try {
            const enrolledResponse = await axios.get(`${BASE_URL}/api/courses/courses/${course.id}`, {
              headers: { Authorization: `Bearer ${Cookies.get("token")}` }
            });
            
            return {
              ...course,
              enrolledStudents: enrolledResponse.data.enrollments || [],
              pendingEnrollments: [] // Initialize with empty array, will be populated later
            };
          } catch (err) {
            console.error(`Failed to fetch enrollments for course ${course.id}:`, err);
            return {
              ...course,
              enrolledStudents: [],
              pendingEnrollments: []
            };
          }
        })
      );
      
      // Fetch pending enrollments separately
      const pendingResponse = await axios.get(`${BASE_URL}/api/enrollment/enrollments/pending`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`
        }
      });
      
      const pendingEnrollments = pendingResponse.data;
      
      // Map pending enrollments to their respective courses
      const updatedCourses = coursesWithEnrollments.map((course) => ({
        ...course,
        pendingEnrollments: pendingEnrollments.filter(
          (enrollment) => enrollment.course.courseCode === course.courseCode
        )
      }));
      
      setCourses(updatedCourses);
      return updatedCourses;
    } catch (err) {
      setError((prev) => ({
        ...prev,
        courses: err.response?.data?.message || "Failed to fetch courses and enrollments"
      }));
      return [];
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setButtonLoading((prev) => ({ ...prev, refresh: true }));
    setRefreshing(true);
    await fetchCoursesWithEnrollments();
    setRefreshing(false);
    setButtonLoading((prev) => ({ ...prev, refresh: false }));
  };

  const handleEnrollmentStatus = async (enrollmentId, status) => {
    setButtonLoading((prev) => ({
      ...prev,
      enrollments: { ...prev.enrollments, [enrollmentId]: true }
    }));
    
    try {
      // Get the enrollment details before updating to identify which course it belongs to
      const enrollmentToUpdate = courses.flatMap(course => 
        course.pendingEnrollments
      ).find(enrollment => enrollment.id === enrollmentId);
      
      if (!enrollmentToUpdate) {
        throw new Error("Enrollment not found");
      }
      
      // Update the enrollment status
      await axios.put(
        `${BASE_URL}/api/enrollment/enrollments/${enrollmentId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`
          }
        }
      );

      // Update local state to immediately reflect the change
      const updatedCourses = courses.map(course => {
        // If this is the course that contains the enrollment being updated
        if (course.courseCode === enrollmentToUpdate.course.courseCode) {
          // Remove from pending
          const updatedPendingEnrollments = course.pendingEnrollments.filter(
            enrollment => enrollment.id !== enrollmentId
          );
          
          // If accepted, add to enrolled students
          let updatedEnrolledStudents = [...course.enrolledStudents];
          if (status === 'ACCEPTED') {
            updatedEnrolledStudents.push({
              ...enrollmentToUpdate,
              status: 'ACCEPTED'
            });
          }
          
          return {
            ...course,
            pendingEnrollments: updatedPendingEnrollments,
            enrolledStudents: updatedEnrolledStudents
          };
        }
        return course;
      });
      
      setCourses(updatedCourses);
      
      // Still refresh data from server to ensure consistency
      await fetchCoursesWithEnrollments();
    } catch (err) {
      console.error("Error updating enrollment status:", err);
      setError((prev) => ({
        ...prev,
        enrollments: err.response?.data?.message || "Failed to update enrollment status"
      }));
      
      // Refresh data to ensure UI is in sync with backend
      await fetchCoursesWithEnrollments();
    } finally {
      setButtonLoading((prev) => ({
        ...prev,
        enrollments: { ...prev.enrollments, [enrollmentId]: false }
      }));
    }
  };

  const handleRemoveStudent = async (enrollmentId) => {
    if (!confirm('Are you sure you want to remove this student from the course?')) {
      return;
    }
    
    setButtonLoading((prev) => ({
      ...prev,
      enrollments: { ...prev.enrollments, [enrollmentId]: true }
    }));
    
    try {
      // First find which course and student this enrollment belongs to
      let enrollmentToRemove = null;
      let courseWithEnrollment = null;
      
      for (const course of courses) {
        const enrollment = course.enrolledStudents.find(e => e.id === enrollmentId);
        if (enrollment) {
          enrollmentToRemove = enrollment;
          courseWithEnrollment = course;
          break;
        }
      }
      
      if (!enrollmentToRemove || !courseWithEnrollment) {
        throw new Error("Could not find the enrollment to remove");
      }
      
      // Send the request to reject/remove the student
      await axios.put(
        `${BASE_URL}/api/enrollment/enrollments/${enrollmentId}/status`,
        { status: 'REJECTED' },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`
          }
        }
      );
      
      // Update local state immediately to reflect the change
      const updatedCourses = courses.map(course => {
        if (course.id === courseWithEnrollment.id) {
          return {
            ...course,
            enrolledStudents: course.enrolledStudents.filter(
              enrollment => enrollment.id !== enrollmentId
            )
          };
        }
        return course;
      });
      
      setCourses(updatedCourses);
      
      // Refresh data to ensure consistency
      await fetchCoursesWithEnrollments();
    } catch (err) {
      console.error("Error removing student:", err);
      setError((prev) => ({
        ...prev,
        enrollments: err.response?.data?.message || "Failed to remove student from course"
      }));
      
      // Refresh to ensure UI is in sync with backend
      await fetchCoursesWithEnrollments();
    } finally {
      setButtonLoading((prev) => ({
        ...prev,
        enrollments: { ...prev.enrollments, [enrollmentId]: false }
      }));
    }
  };

  // Initial data load
  useEffect(() => {
    fetchCoursesWithEnrollments();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-900 dark:text-white" />
      </div>
    );
  }

  return (
    <div className="w-full m-2 md:m-10">
      <div className="container p-4 space-y-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-semibold text-gray-900 dark:text-white">Manage Students</h1>
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

        {error.courses && (
          <div className="border px-4 py-3 rounded mb-4 bg-red-50 border-red-200 text-red-700 dark:bg-red-900 dark:border-red-800 dark:text-red-200">
            {error.courses}
          </div>
        )}

        <div className="flex overflow-x-auto space-x-2 mb-6">
          {courses.map((course, index) => (
            <button
              key={course.id}
              onClick={() => setActiveTab(index)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === index
                  ? 'bg-gray-200 text-black dark:bg-neutral-700 dark:text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-neutral-800 dark:text-gray-300 dark:hover:bg-neutral-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <BookUser className="h-4 w-4" />
                {course.name}
                {course.pendingEnrollments?.length > 0 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-red-500 rounded-full">
                    {course.pendingEnrollments.length}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>

        {courses[activeTab] && (
          <div className="rounded-lg bg-white dark:bg-neutral-800 shadow-md dark:shadow-none">

            <div className="border-b px-6 py-4 border-gray-200 dark:border-neutral-700">
              <div className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white">
                <Users className="h-5 w-5" />
                {courses[activeTab].name} <p className="hidden md:block">({courses[activeTab].courseCode})</p>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {courses[activeTab].pendingEnrollments?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Pending Enrollments</h3>
                  <div className="rounded-lg bg-yellow-50 border border-yellow-100 dark:bg-yellow-900/30 dark:border-yellow-800">
                    {courses[activeTab].pendingEnrollments.map((enrollment) => (
                      <div
                        key={enrollment.id}
                        className="flex md:flex-row flex-col items-center justify-between p-4 border-b last:border-0 dark:border-yellow-800/30"
                      >
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {enrollment.student.firstName} {enrollment.student.lastName}
                          </span>
                          <span className="text-sm ml-2 text-gray-600 dark:text-gray-400">
                            ({enrollment.student.enrollmentNumber})
                          </span>
                        </div>
                        <div className="space-x-2 space-y-2">
                          <button
                            className="inline-flex items-center px-3 py-1.5 border border-green-500 text-green-500 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/30 rounded text-sm font-medium transition-colors disabled:opacity-50"
                            onClick={() => handleEnrollmentStatus(enrollment.id, 'ACCEPTED')}
                            disabled={buttonLoading.enrollments[enrollment.id]}
                          >
                            {buttonLoading.enrollments[enrollment.id] ? (
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                              <Check className="h-4 w-4 mr-1" />
                            )}
                            Accept
                          </button>
                          <button
                            className="inline-flex items-center px-3 py-1.5 border border-red-500 text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded text-sm font-medium transition-colors disabled:opacity-50"
                            onClick={() => handleEnrollmentStatus(enrollment.id, 'REJECTED')}
                            disabled={buttonLoading.enrollments[enrollment.id]}
                          >
                            {buttonLoading.enrollments[enrollment.id] ? (
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                              <X className="h-4 w-4 mr-1" />
                            )}
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Enrolled Students</h3>
                {courses[activeTab].enrolledStudents?.filter((e) => e.status === 'ACCEPTED').length > 0 ? (
                  <div className="space-y-2">
                    {courses[activeTab].enrolledStudents
                      .filter((enrollment) => enrollment.status === 'ACCEPTED')
                      .map((enrollment) => (
                        <div
                          key={enrollment.student.enrollmentNumber}
                          className="flex items-center justify-between p-4 rounded border bg-gray-50 border-gray-100 dark:bg-neutral-700 dark:border-neutral-600"
                        >
                          <div>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {enrollment.student.firstName} {enrollment.student.lastName}
                            </span>
                            <span className="text-sm ml-2 text-gray-600 dark:text-gray-400">
                              ({enrollment.student.enrollmentNumber})
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setSelectedStudent({
                                id: enrollment.studentId,
                                firstName: enrollment.student.firstName,
                                lastName: enrollment.student.lastName,
                                enrollmentNumber: enrollment.student.enrollmentNumber
                              })}
                              className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-gray-300 hover:dark:bg-neutral-800 rounded"
                            >
                              Check Details
                            </button>
                            <button
                              onClick={() => handleRemoveStudent(enrollment.id)}
                              disabled={buttonLoading.enrollments[enrollment.id]}
                              className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-gray-300 hover:dark:bg-neutral-800 rounded inline-flex items-center"
                            >
                              {buttonLoading.enrollments[enrollment.id] ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    No students currently enrolled
                  </p>
                )}
              </div>

              {error.enrollments && (
                <div className="border px-4 py-3 rounded mt-4 bg-red-50 border-red-200 text-red-700 dark:bg-red-900 dark:border-red-800 dark:text-red-200">
                  {error.enrollments}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {selectedStudent && (
        <StudentAttendanceDialog
          student={selectedStudent}
          courseId={courses[activeTab].id}
          courseName={courses[activeTab].name}
          session={courses[activeTab].session}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  );
};

export default ManageStudentsPage;