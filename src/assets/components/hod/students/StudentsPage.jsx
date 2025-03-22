import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, Search, Filter, RefreshCw, Eye, Calendar, Download, ChevronRight } from 'lucide-react';
import Cookies from 'js-cookie';

const BASE_URL = `${import.meta.env.VITE_API_URL}`;

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [mockMode, setMockMode] = useState(false); // Use mock data if API isn't ready yet
  const [loadingAttendance, setLoadingAttendance] = useState({});
  const [exportingReport, setExportingReport] = useState({});

  const fetchStudents = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from the real API endpoint
      try {
        const response = await axios.get(`${BASE_URL}/api/hod/students`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`
          }
        });
        
        setStudents(response.data);
        setFilteredStudents(response.data);
        setMockMode(false);
      } catch (apiError) {
        console.warn('API not available, using mock data:', apiError);
        setMockMode(true);
        
        // If the API call failed, use mock data
        const mockStudents = [
          { id: 1, firstName: 'John', lastName: 'Doe', enrollmentNumber: '0901EI201020', attendance: '85%' },
          { id: 2, firstName: 'Jane', lastName: 'Smith', enrollmentNumber: '0901EI201021', attendance: '92%' },
          { id: 3, firstName: 'Michael', lastName: 'Johnson', enrollmentNumber: '0901EI201022', attendance: '78%' },
          { id: 4, firstName: 'Emily', lastName: 'Williams', enrollmentNumber: '0901EI201023', attendance: '90%' },
          { id: 5, firstName: 'Robert', lastName: 'Brown', enrollmentNumber: '0901EI201024', attendance: '65%' },
          { id: 6, firstName: 'Sarah', lastName: 'Davis', enrollmentNumber: '0901EI201025', attendance: '88%' },
          { id: 7, firstName: 'William', lastName: 'Miller', enrollmentNumber: '0901EI201026', attendance: '95%' },
          { id: 8, firstName: 'Olivia', lastName: 'Wilson', enrollmentNumber: '0901EI201027', attendance: '80%' },
          { id: 9, firstName: 'James', lastName: 'Moore', enrollmentNumber: '0901EI201028', attendance: '72%' },
          { id: 10, firstName: 'Sophia', lastName: 'Taylor', enrollmentNumber: '0901EI201029', attendance: '89%' },
        ];

        setStudents(mockStudents);
        setFilteredStudents(mockStudents);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError(err.message || 'Failed to fetch students');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    // Filter students when search term or filter changes
    let result = students;
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(student => 
        student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.enrollmentNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredStudents(result);
  }, [searchTerm, students]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchStudents();
    setRefreshing(false);
  };

  const handleViewAttendance = async (student) => {
    try {
      // Set loading state for this specific student
      setLoadingAttendance(prev => ({ ...prev, [student.id]: true }));
      
      if (!mockMode) {
        // In real mode, fetch detailed student data from API
        const response = await axios.get(`${BASE_URL}/api/hod/students/${student.id}`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`
          }
        });
        setSelectedStudent(response.data);
      } else {
        // In mock mode, create mock data with multiple courses
        // Adding slight delay to simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockStudentDetail = {
          student: {
            id: student.id,
            firstName: student.firstName,
            lastName: student.lastName,
            enrollmentNumber: student.enrollmentNumber || 'N/A',
            email: 'student@example.com'
          },
          enrollments: [
            { id: 1, courseId: 101, courseName: 'Digital Electronics', courseCode: 'EI301', semester: '5', status: 'ACCEPTED' },
            { id: 2, courseId: 102, courseName: 'Control Systems', courseCode: 'EI302', semester: '5', status: 'ACCEPTED' },
            { id: 3, courseId: 103, courseName: 'Microprocessors', courseCode: 'EI303', semester: '5', status: 'ACCEPTED' }
          ],
          attendance: [
            { courseName: 'Digital Electronics', courseCode: 'EI301', present: 12, total: 15, percentage: '80%' },
            { courseName: 'Control Systems', courseCode: 'EI302', present: 8, total: 10, percentage: '80%' },
            { courseName: 'Microprocessors', courseCode: 'EI303', present: 9, total: 12, percentage: '75%' }
          ]
        };
        setSelectedStudent(mockStudentDetail);
      }
    } catch (err) {
      console.error('Error fetching student details:', err);
      // Still set the student so we can show something in mock mode
      const mockErrorStudent = {
        student: {
          id: student.id,
          firstName: student.firstName,
          lastName: student.lastName,
          enrollmentNumber: student.enrollmentNumber || 'N/A',
          email: 'error@example.com'
        },
        enrollments: [],
        attendance: []
      };
      setSelectedStudent(mockErrorStudent);
    } finally {
      // Clear loading state for this student
      setLoadingAttendance(prev => ({ ...prev, [student.id]: false }));
    }
  };

  const handleExportReport = async (student) => {
    try {
      setExportingReport(prev => ({ ...prev, [student.id]: true }));
      
      if (!mockMode) {
        // In real mode, request report from API
        const response = await axios.get(`${BASE_URL}/api/hod/students/${student.id}/report`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
          responseType: 'blob', // Important for file download
        });
        
        // Create download link and click it
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${student.firstName}_${student.lastName}_attendance_report.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        // In mock mode, simulate delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Export report for student:', student);
        alert('Report export simulated in mock mode');
      }
    } catch (err) {
      console.error('Error exporting report:', err);
      alert('Failed to export report. Please try again.');
    } finally {
      setExportingReport(prev => ({ ...prev, [student.id]: false }));
    }
  };

  if (loading && !refreshing) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-900 dark:text-white" />
      </div>
    );
  }

  return (
    <div className="w-full m-4 md:m-10">
      <div className="container p-4 space-y-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-semibold text-gray-900 dark:text-white">Students</h1>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-neutral-800 dark:text-gray-300 dark:hover:bg-neutral-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-1.5 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {error && (
          <div className="border px-4 py-3 rounded mb-4 bg-red-50 border-red-200 text-red-700 dark:bg-red-900 dark:border-red-800 dark:text-red-200">
            {error}
          </div>
        )}

        {mockMode && (
          <div className="border px-4 py-3 rounded mb-4 bg-yellow-50 border-yellow-200 text-yellow-700 dark:bg-yellow-900 dark:border-yellow-800 dark:text-yellow-200">
            Using mock data. The actual HOD API endpoint may not be available yet.
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or enrollment number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
              <thead className="bg-gray-50 dark:bg-neutral-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Enrollment Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Overall Attendance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-neutral-700">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {student.firstName} {student.lastName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-300">
                          {student.enrollmentNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm ${
                          parseInt(student.attendance) >= 85 
                            ? 'text-green-600 dark:text-green-400' 
                            : parseInt(student.attendance) >= 75 
                              ? 'text-yellow-600 dark:text-yellow-400'
                              : 'text-red-600 dark:text-red-400'
                        }`}>
                          {student.attendance}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleViewAttendance(student)}
                          disabled={loadingAttendance[student.id]}
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 dark:text-blue-300 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 transition-colors mr-2 disabled:opacity-70"
                        >
                          {loadingAttendance[student.id] ? (
                            <>
                              <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                              Loading...
                            </>
                          ) : (
                            <>
                              <Eye className="h-3.5 w-3.5 mr-1" />
                              View Attendance
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleExportReport(student)}
                          disabled={exportingReport[student.id]}
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 dark:text-green-300 dark:bg-green-900/30 dark:hover:bg-green-800/50 transition-colors disabled:opacity-70"
                        >
                          {exportingReport[student.id] ? (
                            <>
                              <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                              Exporting...
                            </>
                          ) : (
                            <>
                              <Download className="h-3.5 w-3.5 mr-1" />
                              Export Report
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      No students found matching the search criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedStudent && (
        <StudentDetailDialog
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          mockMode={mockMode}
        />
      )}
    </div>
  );
};

const StudentDetailDialog = ({ student, onClose, mockMode }) => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [exportingCourseReport, setExportingCourseReport] = useState(false);
  
  // Calculate overall attendance across all courses
  const calculateOverallAttendance = () => {
    if (!student.attendance || student.attendance.length === 0) {
      return { present: 0, total: 0, percentage: '0%' };
    }
    
    const totalPresent = student.attendance.reduce((sum, course) => sum + course.present, 0);
    const totalClasses = student.attendance.reduce((sum, course) => sum + course.total, 0);
    const overallPercentage = totalClasses > 0 
      ? `${Math.round((totalPresent / totalClasses) * 100)}%` 
      : '0%';
    
    return {
      present: totalPresent,
      total: totalClasses,
      percentage: overallPercentage
    };
  };
  
  const overallAttendance = calculateOverallAttendance();

  const handleExportCourseReport = async () => {
    if (!selectedCourse) return;
    
    try {
      setExportingCourseReport(true);
      
      if (!mockMode) {
        // In real mode, request course-specific report from API
        const response = await axios.get(
          `${BASE_URL}/api/hod/students/${student.student.id}/courses/${selectedCourse.courseId}/report`, 
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
            responseType: 'blob', // Important for file download
          }
        );
        
        // Create download link and click it
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${student.student.firstName}_${student.student.lastName}_${selectedCourse.courseCode}_report.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        // In mock mode, simulate delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Export course report:', {student: student.student, course: selectedCourse});
        alert('Course report export simulated in mock mode');
      }
    } catch (err) {
      console.error('Error exporting course report:', err);
      alert('Failed to export course report. Please try again.');
    } finally {
      setExportingCourseReport(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 w-[80vw] md:w-[60vw] h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {student.student.firstName} {student.student.lastName}
            </h2>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span className="mr-3">Enrollment: {student.student.enrollmentNumber || 'N/A'}</span>
              {student.student.email && (
                <span className="mr-3">Email: {student.student.email}</span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {mockMode && (
          <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded p-4 mb-4 text-yellow-800 dark:text-yellow-200">
            <p className="font-medium">Mock Data Mode</p>
            <p className="text-sm mt-1">
              The detailed view for students is in mock mode. API integration pending.
            </p>
          </div>
        )}
        
        {/* Overall Attendance Summary */}
        <div className="mb-6 p-4 bg-gray-50 dark:bg-neutral-900 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Overall Attendance</h3>
            <button
              onClick={handleExportCourseReport}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 dark:text-green-300 dark:bg-green-900/30 dark:hover:bg-green-800/50 transition-colors"
            >
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Export Overall Report
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow-sm">
              <div className="text-sm text-gray-500 dark:text-gray-400">Present</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{overallAttendance.present}</div>
            </div>
            <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow-sm">
              <div className="text-sm text-gray-500 dark:text-gray-400">Total Classes</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{overallAttendance.total}</div>
            </div>
            <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow-sm">
              <div className="text-sm text-gray-500 dark:text-gray-400">Attendance Percentage</div>
              <div className={`text-2xl font-bold ${
                parseInt(overallAttendance.percentage) >= 85 
                  ? 'text-green-600 dark:text-green-400' 
                  : parseInt(overallAttendance.percentage) >= 75 
                    ? 'text-yellow-600 dark:text-yellow-400'
                    : 'text-red-600 dark:text-red-400'
              }`}>
                {overallAttendance.percentage}
              </div>
              {parseInt(overallAttendance.percentage) < 75 && (
                <div className="mt-1 text-xs text-red-600 dark:text-red-400">
                  Attendance below 75% threshold
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left side - Course list */}
          <div className="md:col-span-1 bg-gray-50 dark:bg-neutral-900 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Enrolled Courses</h3>
            
            {student.enrollments && student.enrollments.length > 0 ? (
              <div className="space-y-2">
                {student.enrollments
                  .filter(enrollment => enrollment.status === 'ACCEPTED') // Only show ACCEPTED enrollments
                  .map((enrollment) => (
                    <div 
                      key={enrollment.id}
                      onClick={() => setSelectedCourse(enrollment)}
                      className={`p-3 rounded-lg cursor-pointer flex justify-between items-center ${
                        selectedCourse && selectedCourse.id === enrollment.id
                          ? 'bg-blue-100 dark:bg-blue-900/30 border-l-4 border-blue-500'
                          : 'bg-white dark:bg-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-700'
                      }`}
                    >
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{enrollment.courseName}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{enrollment.courseCode}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Semester: {enrollment.semester}</div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No courses found.</p>
            )}
          </div>
          
          {/* Right side - Attendance details */}
          <div className="md:col-span-2">
            {selectedCourse ? (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Attendance for {selectedCourse.courseName}
                  </h3>
                  <button
                    onClick={handleExportCourseReport}
                    disabled={exportingCourseReport}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 dark:text-green-300 dark:bg-green-900/30 dark:hover:bg-green-800/50 transition-colors disabled:opacity-70"
                  >
                    {exportingCourseReport ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                        Exporting...
                      </>
                    ) : (
                      <>
                        <Download className="h-3.5 w-3.5 mr-1.5" />
                        Export Course Report
                      </>
                    )}
                  </button>
                </div>
                
                {/* Get attendance for this specific course */}
                {(() => {
                  const courseAttendance = student.attendance.find(
                    a => a.courseCode === selectedCourse.courseCode
                  );
                  
                  if (courseAttendance) {
                    return (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow-sm">
                            <div className="text-sm text-gray-500 dark:text-gray-400">Present</div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">{courseAttendance.present}</div>
                          </div>
                          <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow-sm">
                            <div className="text-sm text-gray-500 dark:text-gray-400">Total Classes</div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">{courseAttendance.total}</div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow-sm">
                          <div className="text-sm text-gray-500 dark:text-gray-400">Attendance Percentage</div>
                          <div className={`text-3xl font-bold ${
                            parseInt(courseAttendance.percentage) >= 85 
                              ? 'text-green-600 dark:text-green-400' 
                              : parseInt(courseAttendance.percentage) >= 75 
                                ? 'text-yellow-600 dark:text-yellow-400'
                                : 'text-red-600 dark:text-red-400'
                          }`}>
                            {courseAttendance.percentage}
                          </div>
                          
                          {parseInt(courseAttendance.percentage) < 75 && (
                            <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                              Attendance below 75% threshold
                            </div>
                          )}
                        </div>

                        <div className="flex justify-end mt-4">
                          <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors">
                            <Download className="h-4 w-4 mr-2" />
                            Download Report
                          </button>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <p className="text-gray-500 dark:text-gray-400">No attendance data available for this course.</p>
                    );
                  }
                })()}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>Select a course to view attendance details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentsPage;
