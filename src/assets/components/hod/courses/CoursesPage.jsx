import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, Search, BookOpen, Users, Calendar, RefreshCw, FileDown, FileText, User, Eye } from 'lucide-react';
import Cookies from 'js-cookie';

const BASE_URL = `${import.meta.env.VITE_API_URL}`;

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalTeachers: 0,
    totalStudents: 0
  });
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [viewingAttendance, setViewingAttendance] = useState(false);
  const [viewingStudents, setViewingStudents] = useState(false);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${BASE_URL}/api/courses/all-courses`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`
        }
      });

      const processedCourses = response.data.map(course => {
        if (course.enrollments) {
          const acceptedCount = course.enrollments.filter(e => e.status === 'ACCEPTED').length;
          return {
            ...course,
            _count: {
              ...course._count,
              acceptedEnrollments: acceptedCount
            }
          };
        }
        return course;
      });

      setCourses(processedCourses);
      setFilteredCourses(processedCourses);

      const uniqueTeachers = new Set(processedCourses.map(course => course.teacherId));
      const totalStudents = processedCourses.reduce((sum, course) => 
        sum + (course._count?.acceptedEnrollments || course._count?.enrollments || 0), 0);

      setStats({
        totalCourses: processedCourses.length,
        totalTeachers: uniqueTeachers.size,
        totalStudents
      });

    } catch (err) {
      console.error('Error fetching courses:', err);
      setError(err.message || 'Failed to fetch courses');
      setCourses([]);
      setFilteredCourses([]);
      setStats({ totalCourses: 0, totalTeachers: 0, totalStudents: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = courses.filter(course => 
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.semester.includes(searchTerm) ||
        course.session.includes(searchTerm) ||
        `${course.teacher.firstName} ${course.teacher.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCourses(filtered);
    } else {
      setFilteredCourses(courses);
    }
  }, [searchTerm, courses]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchCourses();
    setRefreshing(false);
  };

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
  };

  const handleCloseModal = () => {
    setSelectedCourse(null);
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
            <h1 className="text-4xl font-semibold text-gray-900 dark:text-white">Courses</h1>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <StatCard 
            title="Total Courses" 
            value={stats.totalCourses}
            icon={<BookOpen className="h-5 w-5 text-blue-500" />}
            color="blue"
          />
          <StatCard 
            title="Total Teachers" 
            value={stats.totalTeachers}
            icon={<User className="h-5 w-5 text-green-500" />}
            color="green"
          />
          <StatCard 
            title="Total Enrolled Students" 
            value={stats.totalStudents}
            icon={<Users className="h-5 w-5 text-purple-500" />}
            color="purple"
          />
        </div>

        <div className="relative flex-grow mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by course name, code, teacher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.length > 0 ? (
            filteredCourses.map(course => (
              <CourseCard 
                key={course.id} 
                course={course} 
                onClick={() => handleCourseClick(course)}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-gray-500 dark:text-gray-400">
              No courses found matching your search criteria
            </div>
          )}
        </div>
      </div>

      {selectedCourse && (
        <CourseDetailModal 
          course={selectedCourse} 
          onClose={handleCloseModal} 
          onViewAttendance={() => setViewingAttendance(true)}
          onViewStudents={() => setViewingStudents(true)}
        />
      )}

      {viewingAttendance && selectedCourse && (
        <CourseAttendanceDialog
          course={selectedCourse}
          onClose={() => setViewingAttendance(false)}
        />
      )}

      {viewingStudents && selectedCourse && (
        <CourseStudentsDialog
          course={selectedCourse}
          onClose={() => setViewingStudents(false)}
        />
      )}
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800",
    green: "bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-800",
    yellow: "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/30 dark:border-yellow-800",
    purple: "bg-purple-50 border-purple-200 dark:bg-purple-900/30 dark:border-purple-800",
  };

  return (
    <div className={`rounded-lg border p-4 ${colorClasses[color]} shadow-sm`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</h3>
        </div>
        <div className="rounded-full p-2">
          {icon}
        </div>
      </div>
    </div>
  );
};

const CourseCard = ({ course, onClick }) => {
  const getSemesterColor = (semester) => {
    const semesterNum = parseInt(semester);
    if (semesterNum <= 2) return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    if (semesterNum <= 4) return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    if (semesterNum <= 6) return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
    return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
  };

  return (
    <div 
      className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-2"></div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
            {course.name}
          </h3>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${getSemesterColor(course.semester)}`}>
            Sem {course.semester}
          </span>
        </div>
        
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          {course.courseCode} • {course.session}
        </div>
        
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
          <User className="h-4 w-4 mr-1.5" />
          <span>{course.teacher.firstName} {course.teacher.lastName}</span>
        </div>
        
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-neutral-700">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Users className="h-4 w-4 mr-1.5" />
            <span>{course._count.acceptedEnrollments || 0} students</span>
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400">
            View details →
          </div>
        </div>
      </div>
    </div>
  );
};

const CourseDetailModal = ({ course, onClose, onViewAttendance, onViewStudents }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 w-[90vw] md:w-[600px] max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {course.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-neutral-900 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Course Code</p>
                <p className="font-medium text-gray-900 dark:text-white">{course.courseCode}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Semester</p>
                <p className="font-medium text-gray-900 dark:text-white">{course.semester}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Session</p>
                <p className="font-medium text-gray-900 dark:text-white">{course.session}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Enrolled Students</p>
                <p className="font-medium text-gray-900 dark:text-white">{course._count.enrollments}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Teacher Information</h3>
            <div className="bg-white dark:bg-neutral-700 p-4 rounded-lg border border-gray-200 dark:border-neutral-600">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 mr-3">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{course.teacher.firstName} {course.teacher.lastName}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Faculty, Electronics & Instrumentation</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3 pt-4">
            <button 
              onClick={onViewStudents}
              className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Users className="h-4 w-4 mr-2" />
              View Student List
            </button>
            <button 
              onClick={onViewAttendance}
              className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <Calendar className="h-4 w-4 mr-2" />
              View Attendance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CourseAttendanceDialog = ({ course, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState([]);
  const [exporting, setExporting] = useState(false);
  const [exportType, setExportType] = useState('monthly');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchAttendanceData();
  }, [course.id]);
  
  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${BASE_URL}/api/attendance/courses/${course.id}/attendance`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`
        }
      });

      const formattedData = response.data.map(session => {
        const attendees = session._count?.responses || 0;
        const percentage = session.totalStudents > 0 
          ? Math.round((attendees / session.totalStudents) * 100) 
          : 0;

        return {
          id: session.id,
          date: session.date,
          attendees: attendees,
          totalStudents: session.totalStudents || course._count.enrollments,
          percentage: percentage
        };
      });

      setAttendanceData(formattedData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching attendance data:', err);
      setError(err.message || 'Failed to load attendance data.');
      setAttendanceData([]);
      setLoading(false);
    }
  };
  
  const handleExportAttendance = async () => {
    try {
      setExporting(true);
      setError(null);

      let endpoint;
      let params = { session: course.session, semester: course.semester };

      if (exportType === 'monthly') {
        endpoint = `${BASE_URL}/api/attendance/attendance/monthly-report/${course.id}`;
        params = { ...params, month, year };
      } else {
        endpoint = `${BASE_URL}/api/attendance/attendance/range-report/${course.id}`;
        params = { ...params, startDate, endDate };
      }

      const response = await axios.get(endpoint, {
        params,
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`
        },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const filename = exportType === 'monthly' 
        ? `attendance_${course.courseCode}_${month}_${year}.xlsx` 
        : `attendance_${course.courseCode}_${startDate}_to_${endDate}.xlsx`;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error exporting attendance:', err);
      setError(err.message || 'Failed to export attendance report');
    } finally {
      setExporting(false);
    }
  };
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 w-[90vw] md:w-[70vw] max-h-[85vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Attendance - {course.name} ({course.courseCode})
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 rounded p-4 mb-4 text-red-800 dark:text-red-200">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}
        
        <div className="mb-6 bg-gray-50 dark:bg-neutral-900 rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Export Attendance Report</h3>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="monthlyReport"
                  name="reportType"
                  value="monthly"
                  checked={exportType === 'monthly'}
                  onChange={() => setExportType('monthly')}
                  className="h-4 w-4 text-blue-600"
                />
                <label htmlFor="monthlyReport" className="ml-2 text-gray-700 dark:text-gray-300">Monthly Report</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="radio"
                  id="rangeReport"
                  name="reportType"
                  value="range"
                  checked={exportType === 'range'}
                  onChange={() => setExportType('range')}
                  className="h-4 w-4 text-blue-600"
                />
                <label htmlFor="rangeReport" className="ml-2 text-gray-700 dark:text-gray-300">Date Range Report</label>
              </div>
            </div>
            
            {exportType === 'monthly' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Month</label>
                  <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="w-full rounded-md border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    {months.map((name, index) => (
                      <option key={index} value={index + 1}>{name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Year</label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full rounded-md border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(yr => (
                      <option key={yr} value={yr}>{yr}</option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-md border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full rounded-md border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
            
            <div className="flex justify-end">
              <button
                onClick={handleExportAttendance}
                disabled={exporting}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {exporting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <FileDown className="h-4 w-4 mr-2" />
                    Export Report
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
              <thead className="bg-gray-50 dark:bg-neutral-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Present</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total Students</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Percentage</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-neutral-700">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-400" />
                    </td>
                  </tr>
                ) : attendanceData.length > 0 ? (
                  attendanceData.map((session) => (
                    <tr key={session.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {new Date(session.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {session.attendees}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {session.totalStudents}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${
                          session.percentage >= 85 
                            ? 'text-green-600 dark:text-green-400' 
                            : session.percentage >= 75 
                              ? 'text-yellow-600 dark:text-yellow-400'
                              : 'text-red-600 dark:text-red-400'
                        }`}>
                          {session.percentage}%
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      No attendance records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const CourseStudentsDialog = ({ course, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [exportingList, setExportingList] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  useEffect(() => {
    fetchStudents();
  }, [course.id]);
  
  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${BASE_URL}/api/hod/courses/${course.id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`
        }
      });

      setStudents(response.data.students || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError(err.message || 'Failed to load students.');
      setStudents([]);
      setLoading(false);
    }
  };
  
  const filteredStudents = students.filter(student => 
    student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.enrollmentNumber && student.enrollmentNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const handleExportStudentList = async () => {
    try {
      setExportingList(true);
      setError(null);

      const csvContent = [
        ['Enrollment Number', 'First Name', 'Last Name'].join(','),
        ...filteredStudents.map(student => 
          [
            student.enrollmentNumber || 'N/A', 
            student.firstName, 
            student.lastName
          ].join(',')
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${course.courseCode}_student_list.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error exporting student list:', err);
      setError(err.message || 'Failed to export student list');
    } finally {
      setExportingList(false);
    }
  };

  const handleViewStudentDetails = (student) => {
    setSelectedStudent(student);
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 w-[90vw] md:w-[70vw] max-h-[85vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Students - {course.name} ({course.courseCode})
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 rounded p-4 mb-4 text-red-800 dark:text-red-200">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}
        
        <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between">
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
          
          <button
            onClick={handleExportStudentList}
            disabled={exportingList || filteredStudents.length === 0}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {exportingList ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <FileDown className="h-4 w-4 mr-2" />
                Export Student List
              </>
            )}
          </button>
        </div>
        
        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
              <thead className="bg-gray-50 dark:bg-neutral-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Enrollment Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-neutral-700">
                {loading ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-400" />
                    </td>
                  </tr>
                ) : filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {student.enrollmentNumber || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {student.firstName} {student.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleViewStudentDetails(student)}
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 dark:text-blue-300 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      No students found matching the search criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {selectedStudent && (
          <StudentDetailsModal 
            student={selectedStudent} 
            course={course}
            onClose={() => setSelectedStudent(null)}
          />
        )}
      </div>
    </div>
  );
};

const StudentDetailsModal = ({ student, course, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState({
    present: 0,
    total: 0,
    percentage: '0%',
    sessions: []
  });
  const [exportingReport, setExportingReport] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${BASE_URL}/api/hod/students/${student.id}/courses/${course.id}/attendance-summary`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`
          }
        });

        setAttendanceData({
          present: response.data.summary.presentSessions,
          total: response.data.summary.totalSessions,
          percentage: `${response.data.summary.percentage}%`,
          sessions: response.data.attendance || []
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching student details:', err);
        setError(err.message || 'Failed to load student details.');
        setAttendanceData({ present: 0, total: 0, percentage: '0%', sessions: [] });
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, [student.id, course.id]);

  const handleExportReport = async () => {
    try {
      setExportingReport(true);
      setError(null);

      const response = await axios.get(
        `${BASE_URL}/api/hod/students/${student.id}/courses/${course.id}/report`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`
          },
          responseType: 'blob'
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${student.firstName}_${student.lastName}_${course.courseCode}_report.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error exporting report:', err);
      setError(err.message || 'Failed to export report');
    } finally {
      setExportingReport(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 w-[80vw] md:w-[500px] max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Student Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="bg-gray-50 dark:bg-neutral-900 p-4 rounded-lg mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Student Information</h3>
          <div className="space-y-2">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Name:</span>
              <span className="ml-2 text-gray-900 dark:text-white">{student.firstName} {student.lastName}</span>
            </div>
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Enrollment Number:</span>
              <span className="ml-2 text-gray-900 dark:text-white">{student.enrollmentNumber || 'N/A'}</span>
            </div>
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Course:</span>
              <span className="ml-2 text-gray-900 dark:text-white">{course.name} ({course.courseCode})</span>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Attendance Summary</h3>
            <button
              onClick={handleExportReport}
              disabled={exportingReport || loading}
              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 dark:text-green-300 dark:bg-green-900/30 dark:hover:bg-green-800/50 transition-colors disabled:opacity-50"
            >
              {exportingReport ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <FileDown className="h-3.5 w-3.5 mr-1.5" />
                  Export Report
                </>
              )}
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-white dark:bg-neutral-700 p-3 rounded-lg text-center">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Present</div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">{attendanceData.present}</div>
                </div>
                <div className="bg-white dark:bg-neutral-700 p-3 rounded-lg text-center">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Total</div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">{attendanceData.total}</div>
                </div>
                <div className="bg-white dark:bg-neutral-700 p-3 rounded-lg text-center">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Percentage</div>
                  <div className={`text-xl font-bold ${
                    parseInt(attendanceData.percentage) >= 85 
                      ? 'text-green-600 dark:text-green-400' 
                      : parseInt(attendanceData.percentage) >= 75 
                        ? 'text-yellow-600 dark:text-yellow-400'
                        : 'text-red-600 dark:text-red-400'
                  }`}>
                    {attendanceData.percentage}
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-neutral-700 rounded-lg border border-gray-200 dark:border-neutral-600 overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-600">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300">Recent Sessions</h4>
                </div>
                <div className="max-h-[200px] overflow-y-auto">
                  {attendanceData.sessions.length > 0 ? (
                    <div className="divide-y divide-gray-200 dark:divide-neutral-600">
                      {attendanceData.sessions
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .slice(0, 10)
                        .map((session, index) => (
                          <div key={index} className="flex justify-between items-center px-4 py-2">
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                              {new Date(session.date).toLocaleDateString()}
                            </div>
                            <div className={`text-sm font-medium px-2 py-1 rounded-full ${
                              session.status === 'Present' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                            }`}>
                              {session.status}
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                      No attendance records found
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
