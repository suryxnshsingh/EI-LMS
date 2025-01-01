import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import Cookies from 'js-cookie';
import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

const AttendanceDownloadDialog = ({ courseId, courseName, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState('');
  const [semester, setSemester] = useState('');
  const [session, setSession] = useState('');
  const [months, setMonths] = useState([]);

  // Function to validate session format (YYYY-YY)
  const isValidSession = (session) => {
    const regex = /^20\d{2}-\d{2}$/;
    if (!regex.test(session)) return false;
    
    const [startYear, endYearShort] = session.split('-');
    const endYear = parseInt(startYear.slice(0, -2) + endYearShort);
    return parseInt(startYear) + 1 === endYear;
  };

  // Function to generate months array based on session
  const generateMonths = (session) => {
    if (!isValidSession(session)) return [];

    const [startYear] = session.split('-');
    const firstYear = parseInt(startYear);
    const secondYear = firstYear + 1;

    return [
      { value: '7', label: `July ${firstYear}` },
      { value: '8', label: `August ${firstYear}` },
      { value: '9', label: `September ${firstYear}` },
      { value: '10', label: `October ${firstYear}` },
      { value: '11', label: `November ${firstYear}` },
      { value: '12', label: `December ${firstYear}` },
      { value: '1', label: `January ${secondYear}` },
      { value: '2', label: `February ${secondYear}` },
      { value: '3', label: `March ${secondYear}` },
      { value: '4', label: `April ${secondYear}` },
      { value: '5', label: `May ${secondYear}` },
      { value: '6', label: `June ${secondYear}` }
    ];
  };

  // Function to get year based on selected month and session
  const getYearForMonth = (monthNum, session) => {
    if (!isValidSession(session)) return null;
    
    const [startYear] = session.split('-');
    const firstYear = parseInt(startYear);
    const monthNumber = parseInt(monthNum);
    
    return monthNumber >= 7 ? firstYear : firstYear + 1;
  };

  // Update months when session changes
  const handleSessionChange = (e) => {
    const newSession = e.target.value;
    setSession(newSession);
    setMonth(''); // Reset month selection
    setMonths(generateMonths(newSession));
  };

  const semesters = [
    { value: '1', label: '1st' },
    { value: '2', label: '2nd' },
    { value: '3', label: '3rd' },
    { value: '4', label: '4th' },
    { value: '5', label: '5th' },
    { value: '6', label: '6th' },
    { value: '7', label: '7th' },
    { value: '8', label: '8th' }
  ];

  const downloadExcel = async () => {
    try {
      setLoading(true);
      const year = getYearForMonth(month, session);
      const requestUrl = `${BASE_URL}/api/attendance/attendance/monthly-report/${courseId}`;
      
      console.log('Making request to:', requestUrl, {
        params: {
          month,
          year,
          session,
          semester
        }
      });

      const response = await axios.get(requestUrl, {
        params: {
          month,
          year,
          session,
          semester
        },
        headers: { 
          Authorization: `Bearer ${Cookies.get('token')}`
        },
        responseType: 'blob',
        validateStatus: false
      });

      console.log('Response received:', {
        status: response.status,
        type: response.data.type,
        size: response.data.size
      });

      // Check if response is not Excel file
      if (response.data.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        // Try to read error message
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const errorData = JSON.parse(reader.result);
            alert(`Failed to download report: ${errorData.error}`);
          } catch {
            alert('Failed to download report: Unexpected response format');
          }
        };
        reader.readAsText(response.data);
        return;
      }

      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', `Attendance_${courseName}_${months.find(m => m.value === month)?.label}_${year}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
      onClose();

    } catch (error) {
      console.error('Error details:', error);
      alert('Failed to download attendance report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Download Attendance Report
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Session
            </label>
            <input
              type="text"
              value={session}
              onChange={handleSessionChange}
              placeholder="e.g., 2024-25"
              className={`w-full px-3 py-2 border rounded-md dark:bg-neutral-700 dark:border-neutral-600 
                ${!session || isValidSession(session) ? '' : 'border-red-500'}`}
            />
            {session && !isValidSession(session) && (
              <p className="mt-1 text-sm text-red-500">
                Please enter a valid session (e.g., 2024-25)
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Semester
            </label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full px-3 py-2 border rounded-md dark:bg-neutral-700 dark:border-neutral-600"
            >
              <option value="">Select Semester</option>
              {semesters.map((sem) => (
                <option key={sem.value} value={sem.value}>
                  {sem.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Month
            </label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              disabled={!isValidSession(session)}
              className="w-full px-3 py-2 border rounded-md dark:bg-neutral-700 dark:border-neutral-600 disabled:opacity-50"
            >
              <option value="">Select Month</option>
              {months.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-neutral-700 dark:text-gray-300 dark:hover:bg-neutral-600"
          >
            Cancel
          </button>
          <button
            onClick={downloadExcel}
            disabled={loading || !isValidSession(session) || !semester || !month}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Downloading...
              </>
            ) : (
              'Download Excel'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceDownloadDialog; 