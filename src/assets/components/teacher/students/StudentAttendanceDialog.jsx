import React, { useState, useEffect } from 'react';
import { Loader2, X } from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = 'http://localhost:8080';

const StudentAttendanceDialog = ({ student, courseId, courseName, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendanceSummary = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/attendance/courses/${courseId}/students/${student.id}/attendance-summary`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get('token')}`
            }
          }
        );
        setAttendanceData(response.data);
      } catch (error) {
        console.error('Error fetching attendance:', error);
        setError(error.response?.data?.error || 'Failed to fetch attendance records');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceSummary();
  }, [courseId, student.id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 w-[600px] max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Attendance Record of {student.firstName} {student.lastName} - {courseName}
            </h2>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span className="mr-3">Enrollment: {attendanceData?.student?.enrollmentNumber || 'N/A'}</span>
              <span>Session: {new Date().getFullYear()}-{(new Date().getFullYear() + 1).toString().slice(-2)}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : (
          <>
            <div className="mb-6 p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <div className="flex justify-between mb-2">
                  <span>Total Sessions:</span>
                  <span className="font-medium">{attendanceData.summary.totalSessions}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Present:</span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    {attendanceData.summary.presentSessions}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Attendance:</span>
                  <span className="font-medium">{attendanceData.summary.percentage}%</span>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b dark:border-neutral-700">
                    <th className="py-3 px-4 font-semibold text-gray-900 dark:text-white">Date</th>
                    <th className="py-3 px-4 font-semibold text-gray-900 dark:text-white">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.attendance.map((record, index) => (
                    <tr 
                      key={index} 
                      className="border-b dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700"
                    >
                      <td className="py-2 px-4 text-gray-700 dark:text-gray-300">{record.date}</td>
                      <td className={`py-2 px-4 ${
                        record.status === 'Present' 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {record.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentAttendanceDialog; 