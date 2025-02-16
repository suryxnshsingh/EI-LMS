import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = `${import.meta.env.VITE_API_URL}`;

const AttendanceTab = ({ student, courseId }) => {
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
    <>
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
                  <th className="py-3 px-4 font-semibold text-gray-900 dark:text-white text-center">Date</th>
                  <th className="py-3 px-4 font-semibold text-gray-900 dark:text-white text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.attendance.map((record, index) => (
                  <tr 
                    key={index} 
                    className="border-b dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700 text-center"
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
    </>
  );
};

export default AttendanceTab;
