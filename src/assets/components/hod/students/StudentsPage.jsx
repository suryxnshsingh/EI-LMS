import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, Search, Filter, RefreshCw, Eye, Calendar, Download } from 'lucide-react';
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

  const fetchStudents = async () => {
    try {
      setLoading(true);
      // In a real application, you would fetch from your API
      const response = await axios.get(`${BASE_URL}/api/students`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`
        }
      });

      // For now, using a placeholder array
      const mockStudents = [
        { id: 1, firstName: 'John', lastName: 'Doe', enrollmentNumber: '0901EI201020', course: 'B.Tech', semester: '7', attendance: '85%' },
        { id: 2, firstName: 'Jane', lastName: 'Smith', enrollmentNumber: '0901EI201021', course: 'B.Tech', semester: '7', attendance: '92%' },
        { id: 3, firstName: 'Michael', lastName: 'Johnson', enrollmentNumber: '0901EI201022', course: 'B.Tech', semester: '5', attendance: '78%' },
        { id: 4, firstName: 'Emily', lastName: 'Williams', enrollmentNumber: '0901EI201023', course: 'B.Tech', semester: '5', attendance: '90%' },
        { id: 5, firstName: 'Robert', lastName: 'Brown', enrollmentNumber: '0901EI201024', course: 'B.Tech', semester: '3', attendance: '65%' },
        { id: 6, firstName: 'Sarah', lastName: 'Davis', enrollmentNumber: '0901EI201025', course: 'B.Tech', semester: '3', attendance: '88%' },
        { id: 7, firstName: 'William', lastName: 'Miller', enrollmentNumber: '0901EI201026', course: 'M.Tech', semester: '3', attendance: '95%' },
        { id: 8, firstName: 'Olivia', lastName: 'Wilson', enrollmentNumber: '0901EI201027', course: 'M.Tech', semester: '1', attendance: '80%' },
        { id: 9, firstName: 'James', lastName: 'Moore', enrollmentNumber: '0901EI201028', course: 'M.Tech', semester: '1', attendance: '72%' },
        { id: 10, firstName: 'Sophia', lastName: 'Taylor', enrollmentNumber: '0901EI201029', course: 'M.Tech', semester: '1', attendance: '89%' },
      ];

      setStudents(mockStudents);
      setFilteredStudents(mockStudents);
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
    
    // Filter by course/semester
    if (filterBy !== 'all') {
      const [course, semester] = filterBy.split('-');
      result = result.filter(student => {
        if (semester) {
          return student.course === course && student.semester === semester;
        }
        return student.course === course;
      });
    }
    
    setFilteredStudents(result);
  }, [searchTerm, filterBy, students]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchStudents();
    setRefreshing(false);
  };

  const handleViewAttendance = (student) => {
    setSelectedStudent(student);
    // For now, we're just selecting the student
    // In the next step, we'll implement the attendance view
    console.log('View attendance for student:', student);
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
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="pl-10 pr-8 py-2 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white appearance-none cursor-pointer"
            >
              <option value="all">All Students</option>
              <option value="B.Tech">B.Tech (All)</option>
              <option value="B.Tech-7">B.Tech (Sem 7)</option>
              <option value="B.Tech-5">B.Tech (Sem 5)</option>
              <option value="B.Tech-3">B.Tech (Sem 3)</option>
              <option value="M.Tech">M.Tech (All)</option>
              <option value="M.Tech-3">M.Tech (Sem 3)</option>
              <option value="M.Tech-1">M.Tech (Sem 1)</option>
            </select>
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
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Semester
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Attendance
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
                        <div className="text-sm text-gray-500 dark:text-gray-300">
                          {student.course}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-300">
                          {student.semester}
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
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 dark:text-blue-300 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 transition-colors mr-2"
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          View Attendance
                        </button>
                        <button
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 dark:text-green-300 dark:bg-green-900/30 dark:hover:bg-green-800/50 transition-colors"
                        >
                          <Download className="h-3.5 w-3.5 mr-1" />
                          Export Report
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      No students found matching the search criteria
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

export default StudentsPage;
