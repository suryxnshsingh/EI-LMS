import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FileDown, FileText, Users, BookOpen, BarChart2, 
  CalendarDays, ClipboardCheck, GraduationCap, Calendar,
  Search, ChevronDown, Loader2, School, Filter, ArrowRight
} from 'lucide-react';
import Cookies from 'js-cookie';

const BASE_URL = `${import.meta.env.VITE_API_URL}`;

const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState('department');
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [reportType, setReportType] = useState('attendance');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedSession, setSelectedSession] = useState('');
  const [generating, setGenerating] = useState(false);
  const [mockMode, setMockMode] = useState(false); // Use mock data if API isn't ready yet
  const [reportFormat, setReportFormat] = useState('dateRange'); // 'dateRange' or 'monthly' format

  // Fetch courses and students on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // Try to fetch from the real API endpoint
        try {
          const [coursesResponse, studentsResponse] = await Promise.all([
            axios.get(`${BASE_URL}/api/courses/all-courses`, {
              headers: { Authorization: `Bearer ${Cookies.get("token")}` }
            }),
            axios.get(`${BASE_URL}/api/hod/students`, {
              headers: { Authorization: `Bearer ${Cookies.get("token")}` }
            })
          ]);
          
          setCourses(coursesResponse.data);
          setStudents(studentsResponse.data);
          setMockMode(false);
        } catch (apiError) {
          console.warn('API not available, using mock data:', apiError);
          setMockMode(true);
          
          // Mock courses data
          const mockCourses = [
            { id: 1, name: 'Digital Signal Processing', courseCode: 'EI401', semester: '7', session: '2023-24' },
            { id: 2, name: 'Control Systems', courseCode: 'EI303', semester: '5', session: '2023-24' },
            { id: 3, name: 'Digital Electronics', courseCode: 'EI301', semester: '5', session: '2023-24' },
            { id: 4, name: 'Microprocessors', courseCode: 'EI302', semester: '5', session: '2023-24' },
            { id: 5, name: 'Signals and Systems', courseCode: 'EI203', semester: '3', session: '2023-24' },
            { id: 6, name: 'Circuit Theory', courseCode: 'EI201', semester: '3', session: '2023-24' },
            { id: 7, name: 'Advanced Signal Processing', courseCode: 'EI501', semester: '1', session: '2023-24' },
            { id: 8, name: 'Industrial Automation', courseCode: 'EI502', semester: '1', session: '2023-24' }
          ];
          
          // Mock students data
          const mockStudents = Array.from({ length: 20 }, (_, i) => ({
            id: i + 1,
            firstName: ['John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah'][i % 6],
            lastName: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller'][i % 6],
            enrollmentNumber: `0901EI${20 + Math.floor(i / 6)}${i.toString().padStart(3, '0')}`,
            semester: `${Math.floor(i / 5) + 1}`
          }));
          
          setCourses(mockCourses);
          setStudents(mockStudents);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleGenerateReport = async (event) => {
    event.preventDefault();
    setGenerating(true);
    
    try {
      if (mockMode) {
        // Simulate a delay in mock mode
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Alert the user that this is mock data
        alert('Report generation simulated in mock mode');
      } else {
        let endpoint;
        let params = {};
        
        // Handle different report types and contexts
        if (activeTab === 'department') {
          if (reportType === 'attendance') {
            endpoint = `${BASE_URL}/api/hod/reports/department/attendance`;
            params = { semester: selectedSemester, session: selectedSession };
          } else if (reportType === 'assignments') {
            endpoint = `${BASE_URL}/api/hod/reports/department/assignments`;
            params = { semester: selectedSemester, session: selectedSession };
          } else if (reportType === 'tests') {
            endpoint = `${BASE_URL}/api/hod/reports/department/tests`;
            params = { semester: selectedSemester, session: selectedSession };
          }
        } else if (activeTab === 'course') {
          if (!selectedCourse) throw new Error('No course selected');
          
          if (reportType === 'attendance') {
            if (reportFormat === 'monthly') {
              endpoint = `${BASE_URL}/api/hod/reports/course/${selectedCourse.id}/monthly-attendance`;
              params = { 
                month: selectedMonth, 
                year: selectedYear,
                semester: selectedCourse.semester,
                session: selectedCourse.session 
              };
            } else {
              endpoint = `${BASE_URL}/api/attendance/attendance/range-report/${selectedCourse.id}`;
              params = { 
                startDate: dateRange.startDate, 
                endDate: dateRange.endDate,
                semester: selectedCourse.semester,
                session: selectedCourse.session 
              };
            }
          } else if (reportType === 'assignments') {
            if (reportFormat === 'monthly') {
              endpoint = `${BASE_URL}/api/hod/reports/course/${selectedCourse.id}/monthly-assignments`;
              params = { 
                month: selectedMonth, 
                year: selectedYear,
                semester: selectedCourse.semester,
                session: selectedCourse.session 
              };
            } else {
              endpoint = `${BASE_URL}/api/hod/reports/course/${selectedCourse.id}/assignments`;
              params = { startDate: dateRange.startDate, endDate: dateRange.endDate };
            }
          } else if (reportType === 'tests') {
            if (reportFormat === 'monthly') {
              endpoint = `${BASE_URL}/api/hod/reports/course/${selectedCourse.id}/monthly-tests`;
              params = { 
                month: selectedMonth, 
                year: selectedYear,
                semester: selectedCourse.semester,
                session: selectedCourse.session 
              };
            } else {
              endpoint = `${BASE_URL}/api/hod/reports/course/${selectedCourse.id}/tests`;
              params = { startDate: dateRange.startDate, endDate: dateRange.endDate };
            }
          }
        } else if (activeTab === 'student') {
          if (!selectedStudent) throw new Error('No student selected');
          
          if (reportType === 'attendance') {
            endpoint = `${BASE_URL}/api/hod/students/${selectedStudent.id}/report`;
          } else if (reportType === 'assignments') {
            endpoint = `${BASE_URL}/api/hod/reports/student/${selectedStudent.id}/assignments`;
            params = { startDate: dateRange.startDate, endDate: dateRange.endDate };
          } else if (reportType === 'tests') {
            endpoint = `${BASE_URL}/api/hod/reports/student/${selectedStudent.id}/tests`;
            params = { startDate: dateRange.startDate, endDate: dateRange.endDate };
          }
        }
        
        // Make the API request to generate the report
        const response = await axios.get(endpoint, {
          params,
          headers: { 
            Authorization: `Bearer ${Cookies.get("token")}` 
          },
          responseType: 'blob' // Important for file downloads
        });
        
        // Create and trigger a download link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        
        // Set the appropriate filename based on report type
        let filename = '';
        if (activeTab === 'department') {
          filename = `Department_${reportType}_Sem${selectedSemester}_${selectedSession}.xlsx`;
        } else if (activeTab === 'course') {
          if (reportType === 'attendance' && reportFormat === 'monthly') {
            const monthNames = [
              'January', 'February', 'March', 'April', 'May', 'June',
              'July', 'August', 'September', 'October', 'November', 'December'
            ];
            filename = `${selectedCourse.courseCode}_${monthNames[selectedMonth-1]}_${selectedYear}_${reportType}.xlsx`;
          } else {
            filename = `${selectedCourse.courseCode}_${reportType}_report.xlsx`;
          }
        } else if (activeTab === 'student') {
          filename = `${selectedStudent.enrollmentNumber}_${reportType}_report.xlsx`;
        }
        
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  // Filter courses based on search term
  const filteredCourses = searchTerm 
    ? courses.filter(course => 
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.courseCode.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : courses;

  // Filter students based on search term
  const filteredStudents = searchTerm
    ? students.filter(student =>
        `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.enrollmentNumber && student.enrollmentNumber.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : students;

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="w-full m-4 md:m-10">
      <div className="container p-4 space-y-8">
        <div>
          <h1 className="text-4xl font-semibold text-gray-900 dark:text-white mb-2">Reports</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Generate comprehensive reports for the department, specific courses, or individual students
          </p>
        </div>

        {mockMode && (
          <div className="border px-4 py-3 rounded mb-4 bg-yellow-50 border-yellow-200 text-yellow-700 dark:bg-yellow-900/30 dark:border-yellow-800 dark:text-yellow-200">
            Using mock data. The actual HOD API endpoints may not be available yet.
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-neutral-700">
          <nav className="flex -mb-px space-x-8" aria-label="Report types">
            <TabButton 
              isActive={activeTab === 'department'} 
              onClick={() => setActiveTab('department')}
              icon={<School className="h-5 w-5" />}
              label="Department Reports"
            />
            <TabButton 
              isActive={activeTab === 'course'} 
              onClick={() => setActiveTab('course')}
              icon={<BookOpen className="h-5 w-5" />}
              label="Course Reports"
            />
            <TabButton 
              isActive={activeTab === 'student'} 
              onClick={() => setActiveTab('student')}
              icon={<GraduationCap className="h-5 w-5" />}
              label="Student Reports"
            />
          </nav>
        </div>
        
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm">
          <form onSubmit={handleGenerateReport}>
            {/* Department-wide Reports */}
            {activeTab === 'department' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  <School className="inline-block mr-2 h-6 w-6 text-blue-500" />
                  Department-wide Reports
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="reportType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Report Type
                    </label>
                    <div className="relative">
                      <select
                        id="reportType"
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                        className="block w-full rounded-md border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 pr-10"
                      >
                        <option value="attendance">Attendance Report</option>
                        <option value="assignments">Assignments Report</option>
                        <option value="tests">Test Performance Report</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 dark:text-gray-400">
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                
                  <div>
                    <label htmlFor="semester" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Semester
                    </label>
                    <input
                      type="text"
                      id="semester"
                      value={selectedSemester}
                      onChange={(e) => setSelectedSemester(e.target.value)}
                      placeholder="Enter semester (e.g., 1, 2, 3...)"
                      className="block w-full rounded-md border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="session" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Session
                    </label>
                    <input
                      type="text"
                      id="session"
                      value={selectedSession}
                      onChange={(e) => setSelectedSession(e.target.value)}
                      placeholder="Enter session (e.g., 2023-24)"
                      className="block w-full rounded-md border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      <FileText className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                        About Department Reports
                      </h3>
                      <div className="mt-2 text-sm text-blue-700 dark:text-blue-400">
                        <p>
                          This will generate a consolidated report for all courses in the selected 
                          semester and session. It includes summary statistics on attendance, 
                          assignment completion rates, or test performance, depending on the 
                          report type selected.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Course-specific Reports */}
            {activeTab === 'course' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  <BookOpen className="inline-block mr-2 h-6 w-6 text-green-500" />
                  Course-specific Reports
                </h2>
                
                <div>
                  <label htmlFor="courseSearch" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Search Courses
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="courseSearch"
                      placeholder="Search by course name or code..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Select a Course
                    </h3>
                    <div className="h-64 overflow-y-auto border border-gray-200 dark:border-neutral-700 rounded-lg">
                      {loading ? (
                        <div className="flex justify-center items-center h-full">
                          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                        </div>
                      ) : filteredCourses.length > 0 ? (
                        <ul className="divide-y divide-gray-200 dark:divide-neutral-700">
                          {filteredCourses.map(course => (
                            <li key={course.id}>
                              <button
                                type="button"
                                className={`w-full text-left px-4 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-neutral-700 flex items-center justify-between ${
                                  selectedCourse && selectedCourse.id === course.id
                                    ? 'bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500'
                                    : ''
                                }`}
                                onClick={() => setSelectedCourse(course)}
                              >
                                <div>
                                  <div className="font-medium text-gray-900 dark:text-white">
                                    {course.name}
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-2">
                                    <span>{course.courseCode}</span>
                                    <span>•</span>
                                    <span>Semester {course.semester}</span>
                                  </div>
                                </div>
                                {selectedCourse && selectedCourse.id === course.id && (
                                  <ArrowRight className="h-4 w-4 text-blue-500" />
                                )}
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-gray-500 dark:text-gray-400">
                            No courses found matching your search
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Report Configuration
                    </h3>
                    <div className="p-4 bg-gray-50 dark:bg-neutral-900 rounded-lg h-64 overflow-y-auto">
                      {!selectedCourse ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                          <BookOpen className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-2" />
                          <p className="text-gray-500 dark:text-gray-400">
                            Please select a course to configure the report
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center mb-3">
                            <span className="text-lg font-medium text-gray-900 dark:text-white">{selectedCourse.name}</span>
                            <span className="ml-2 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                              {selectedCourse.courseCode}
                            </span>
                          </div>
                          
                          <div>
                            <label htmlFor="reportType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Report Type
                            </label>
                            <div className="relative">
                              <select
                                id="reportType"
                                value={reportType}
                                onChange={(e) => setReportType(e.target.value)}
                                className="block w-full rounded-md border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 pr-10"
                              >
                                <option value="attendance">Attendance Report</option>
                                <option value="assignments">Assignments Report</option>
                                <option value="tests">Test Performance Report</option>
                              </select>
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 dark:text-gray-400">
                                <ChevronDown className="h-4 w-4" />
                              </div>
                            </div>
                          </div>
                          
                          {reportType === 'attendance' && (
                            <div className="space-y-4">
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center">
                                  <input
                                    type="radio"
                                    id="monthlyReport"
                                    name="reportFormat"
                                    value="monthly"
                                    checked={reportFormat === 'monthly'}
                                    onChange={() => setReportFormat('monthly')}
                                    className="h-4 w-4 text-blue-600"
                                  />
                                  <label htmlFor="monthlyReport" className="ml-2 text-gray-700 dark:text-gray-300">Monthly Report</label>
                                </div>
                                
                                <div className="flex items-center">
                                  <input
                                    type="radio"
                                    id="dateRangeReport"
                                    name="reportFormat"
                                    value="dateRange"
                                    checked={reportFormat === 'dateRange'}
                                    onChange={() => setReportFormat('dateRange')}
                                    className="h-4 w-4 text-blue-600"
                                  />
                                  <label htmlFor="dateRangeReport" className="ml-2 text-gray-700 dark:text-gray-300">Date Range Report</label>
                                </div>
                              </div>
                              
                              {reportFormat === 'monthly' ? (
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label htmlFor="month" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                      Month
                                    </label>
                                    <div className="relative">
                                      <select
                                        id="month"
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                                        className="block w-full rounded-md border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 pr-10"
                                      >
                                        {months.map((name, index) => (
                                          <option key={index} value={index + 1}>{name}</option>
                                        ))}
                                      </select>
                                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 dark:text-gray-400">
                                        <ChevronDown className="h-4 w-4" />
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <label htmlFor="year" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                      Year
                                    </label>
                                    <div className="relative">
                                      <select
                                        id="year"
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                        className="block w-full rounded-md border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 pr-10"
                                      >
                                        {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                                          <option key={year} value={year}>{year}</option>
                                        ))}
                                      </select>
                                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 dark:text-gray-400">
                                        <ChevronDown className="h-4 w-4" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                      Start Date
                                    </label>
                                    <input
                                      type="date"
                                      id="startDate"
                                      value={dateRange.startDate}
                                      onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                                      className="block w-full rounded-md border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                  </div>
                                  
                                  <div>
                                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                      End Date
                                    </label>
                                    <input
                                      type="date"
                                      id="endDate"
                                      value={dateRange.endDate}
                                      onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                                      className="block w-full rounded-md border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                          
                          {reportType !== 'attendance' && (
                            <div className="space-y-4">
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center">
                                  <input
                                    type="radio"
                                    id="monthlyReport"
                                    name="reportFormat"
                                    value="monthly"
                                    checked={reportFormat === 'monthly'}
                                    onChange={() => setReportFormat('monthly')}
                                    className="h-4 w-4 text-blue-600"
                                  />
                                  <label htmlFor="monthlyReport" className="ml-2 text-gray-700 dark:text-gray-300">Monthly Report</label>
                                </div>
                                
                                <div className="flex items-center">
                                  <input
                                    type="radio"
                                    id="dateRangeReport"
                                    name="reportFormat"
                                    value="dateRange"
                                    checked={reportFormat === 'dateRange'}
                                    onChange={() => setReportFormat('dateRange')}
                                    className="h-4 w-4 text-blue-600"
                                  />
                                  <label htmlFor="dateRangeReport" className="ml-2 text-gray-700 dark:text-gray-300">Date Range Report</label>
                                </div>
                              </div>
                              
                              {reportFormat === 'monthly' ? (
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label htmlFor="month" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                      Month
                                    </label>
                                    <div className="relative">
                                      <select
                                        id="month"
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                                        className="block w-full rounded-md border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 pr-10"
                                      >
                                        {months.map((name, index) => (
                                          <option key={index} value={index + 1}>{name}</option>
                                        ))}
                                      </select>
                                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 dark:text-gray-400">
                                        <ChevronDown className="h-4 w-4" />
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <label htmlFor="year" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                      Year
                                    </label>
                                    <div className="relative">
                                      <select
                                        id="year"
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                        className="block w-full rounded-md border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 pr-10"
                                      >
                                        {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                                          <option key={year} value={year}>{year}</option>
                                        ))}
                                      </select>
                                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 dark:text-gray-400">
                                        <ChevronDown className="h-4 w-4" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                      Start Date
                                    </label>
                                    <input
                                      type="date"
                                      id="startDate"
                                      value={dateRange.startDate}
                                      onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                                      className="block w-full rounded-md border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                  </div>
                                  
                                  <div>
                                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                      End Date
                                    </label>
                                    <input
                                      type="date"
                                      id="endDate"
                                      value={dateRange.endDate}
                                      onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                                      className="block w-full rounded-md border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      <FileText className="h-5 w-5 text-green-500 dark:text-green-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800 dark:text-green-300">
                        About Course Reports
                      </h3>
                      <div className="mt-2 text-sm text-green-700 dark:text-green-400">
                        <p>
                          This will generate a detailed report for the selected course. Attendance reports 
                          show monthly attendance records for all students. Assignment reports include 
                          submission status and grades. Test reports include performance analytics for 
                          all tests conducted during the selected period.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Student-specific Reports */}
            {activeTab === 'student' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  <GraduationCap className="inline-block mr-2 h-6 w-6 text-purple-500" />
                  Student-specific Reports
                </h2>
                
                <div>
                  <label htmlFor="studentSearch" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Search Students
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="studentSearch"
                      placeholder="Search by name or enrollment number..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Select a Student
                    </h3>
                    <div className="h-64 overflow-y-auto border border-gray-200 dark:border-neutral-700 rounded-lg">
                      {loading ? (
                        <div className="flex justify-center items-center h-full">
                          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                        </div>
                      ) : filteredStudents.length > 0 ? (
                        <ul className="divide-y divide-gray-200 dark:divide-neutral-700">
                          {filteredStudents.map(student => (
                            <li key={student.id}>
                              <button
                                type="button"
                                className={`w-full text-left px-4 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-neutral-700 flex items-center justify-between ${
                                  selectedStudent && selectedStudent.id === student.id
                                    ? 'bg-purple-50 dark:bg-purple-900/30 border-l-4 border-purple-500'
                                    : ''
                                }`}
                                onClick={() => setSelectedStudent(student)}
                              >
                                <div>
                                  <div className="font-medium text-gray-900 dark:text-white">
                                    {student.firstName} {student.lastName}
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-2">
                                    <span>{student.enrollmentNumber || 'No ID'}</span>
                                    {student.semester && (
                                      <>
                                        <span>•</span>
                                        <span>Semester {student.semester}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                                {selectedStudent && selectedStudent.id === student.id && (
                                  <ArrowRight className="h-4 w-4 text-purple-500" />
                                )}
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-gray-500 dark:text-gray-400">
                            No students found matching your search
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Report Configuration
                    </h3>
                    <div className="p-4 bg-gray-50 dark:bg-neutral-900 rounded-lg h-64 overflow-y-auto">
                      {!selectedStudent ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                          <GraduationCap className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-2" />
                          <p className="text-gray-500 dark:text-gray-400">
                            Please select a student to configure the report
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center mb-3">
                            <span className="text-lg font-medium text-gray-900 dark:text-white">
                              {selectedStudent.firstName} {selectedStudent.lastName}
                            </span>
                            <span className="ml-2 px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                              {selectedStudent.enrollmentNumber || 'No ID'}
                            </span>
                          </div>
                          
                          <div>
                            <label htmlFor="reportType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Report Type
                            </label>
                            <div className="relative">
                              <select
                                id="reportType"
                                value={reportType}
                                onChange={(e) => setReportType(e.target.value)}
                                className="block w-full rounded-md border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 pr-10"
                              >
                                <option value="attendance">Attendance Report</option>
                                <option value="assignments">Assignments Report</option>
                                <option value="tests">Test Performance Report</option>
                              </select>
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 dark:text-gray-400">
                                <ChevronDown className="h-4 w-4" />
                              </div>
                            </div>
                          </div>
                          
                          {reportType !== 'attendance' && (
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Start Date
                                </label>
                                <input
                                  type="date"
                                  id="startDate"
                                  value={dateRange.startDate}
                                  onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                                  className="block w-full rounded-md border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                              </div>
                              
                              <div>
                                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  End Date
                                </label>
                                <input
                                  type="date"
                                  id="endDate"
                                  value={dateRange.endDate}
                                  onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                                  className="block w-full rounded-md border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                              </div>
                            </div>
                          )}

                          {reportType === 'attendance' && (
                            <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                              <p className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1 text-purple-500" />
                                <span>Complete attendance report across all enrolled courses will be generated.</span>
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      <FileText className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-purple-800 dark:text-purple-300">
                        About Student Reports
                      </h3>
                      <div className="mt-2 text-sm text-purple-700 dark:text-purple-400">
                        <p>
                          This will generate a comprehensive report for the selected student. 
                          Attendance reports include details across all enrolled courses. 
                          Assignment and test reports show performance in all submissions and 
                          exams during the selected time period.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={
                  generating || 
                  (activeTab === 'department' && (!selectedSemester || !selectedSession)) ||
                  (activeTab === 'course' && !selectedCourse) || 
                  (activeTab === 'student' && !selectedStudent)
                }
                className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white shadow-sm
                  ${activeTab === 'department' ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500' : 
                    activeTab === 'course' ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' : 
                    'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500'} 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 
                  transition-all duration-200 ease-in-out
                  disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {generating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileDown className="mr-2 h-4 w-4" />
                    Generate Report
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Tab button component with hover and active state styling
const TabButton = ({ isActive, onClick, icon, label }) => {
  return (
    <button
      type="button"
      className={`group inline-flex items-center px-1 py-4 border-b-2 font-medium text-sm focus:outline-none transition-colors duration-200 ${
        isActive
          ? `border-blue-500 text-blue-600 dark:text-blue-400`
          : `border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600`
      }`}
      onClick={onClick}
    >
      <span className={`transition-colors duration-200 ${isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'}`}>
        {React.cloneElement(icon, { className: `${icon.props.className} mr-2` })}
      </span>
      {label}
    </button>
  );
};

export default ReportsPage;
