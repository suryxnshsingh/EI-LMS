import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import Cookies from 'js-cookie';

const BASE_URL = 'http://localhost:8080';

const Responses = ({ courseId, attendanceId }) => {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendanceSummary = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/attendance/attendance/${attendanceId}/summary`, {
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`
          }
        });
        setResponses(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch attendance summary');
        setLoading(false);
      }
    };

    if (attendanceId) {
      fetchAttendanceSummary();
    }
  }, [attendanceId]);

  if (loading) return (
    <div className="flex justify-center items-center p-8">
      <Loader2 className="h-8 w-8 animate-spin text-gray-900 dark:text-white" />
    </div>
  );
  
  if (error) return (
    <div className="text-red-600 dark:text-red-400 p-4 text-center">
      {error}
    </div>
  );

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
          <thead className="bg-gray-50 dark:bg-neutral-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Enrollment Number
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Student Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Timestamp
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-neutral-900 divide-y divide-gray-200 dark:divide-neutral-700">
            {responses.map((response) => (
              <tr key={response.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {response.enrollmentNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {`${response.firstName} ${response.lastName}`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    response.status === 'Present' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {response.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {response.timestamp ? new Date(response.timestamp).toLocaleString() : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {responses.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No students enrolled in this course
          </div>
        )}
      </div>
    </div>
  );
};

export default Responses;
