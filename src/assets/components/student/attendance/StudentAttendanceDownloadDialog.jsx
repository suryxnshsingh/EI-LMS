import React, { useState, useEffect } from 'react';
import { Loader2, X } from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

const BASE_URL = `${import.meta.env.VITE_API_URL}`;

const StudentAttendanceDownloadDialog = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState('');
  const [semester, setSemester] = useState('');
  const [month, setMonth] = useState('');
  const [months, setMonths] = useState([]);
  const [sessionError, setSessionError] = useState('');

  // Generate semester options (1 to 8)
  const semesterOptions = Array.from({ length: 8 }, (_, i) => i + 1);

  // Validate and handle session input
  const handleSessionChange = (value) => {
    setSession(value);
    setSessionError('');
    
    // Clear months if session is invalid
    if (!value.match(/^\d{4}-\d{2}$/)) {
      setMonths([]);
      if (value) {
        setSessionError('Format should be YYYY-YY (e.g., 2024-25)');
      }
      return;
    }

    const [startYear, endYear] = value.split('-');
    if (parseInt(endYear) !== (parseInt(startYear.slice(-2)) + 1)) {
      setSessionError('End year should be next year (e.g., 2024-25)');
      setMonths([]);
      return;
    }

    // Generate months for valid session
    const firstYear = parseInt(startYear);
    const secondYear = firstYear + 1;

    const monthsList = [
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

    setMonths(monthsList);
  };

  const downloadExcel = async () => {
    if (!session || !semester || !month) {
      toast.error('Please select all fields');
      return;
    }

    const year = parseInt(month) <= 6 ? parseInt(session.split('-')[0]) + 1 : parseInt(session.split('-')[0]);
    const token = Cookies.get('token');
    
    console.log('Sending request with:', {
      session,
      semester,
      month,
      year,
      token: token ? 'present' : 'missing'
    });

    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/api/attendance/student-monthly-report`,
        {
          params: {
            session,
            semester: parseInt(semester),
            month: parseInt(month),
            year
          },
          headers: {
            Authorization: `Bearer ${token}`
          },
          responseType: 'blob'
        }
      );

      console.log('Response received:', {
        status: response.status,
        headers: response.headers
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `attendance_${session}_sem${semester}_${month}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Attendance report downloaded successfully');
      onClose();
    } catch (error) {
      console.error('Error downloading report:', error);
      
      if (error.code === 'ERR_NETWORK') {
        toast.error('Cannot connect to server. Please check if server is running.');
      } else if (error.response) {
        // Try to read the error message from the blob
        if (error.response.data instanceof Blob) {
          const text = await error.response.data.text();
          console.error('Server error:', text);
          toast.error(`Server error: ${text}`);
        } else {
          toast.error(`Server error: ${error.response.data.message || 'Unknown error'}`);
        }
      } else {
        toast.error('Failed to download attendance report');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Download Attendance Report
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Session
            </label>
            <input
              type="text"
              value={session}
              onChange={(e) => handleSessionChange(e.target.value)}
              placeholder="YYYY-YY (e.g., 2024-25)"
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
            {sessionError && (
              <p className="mt-1 text-sm text-red-500">{sessionError}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Semester
            </label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white"
            >
              <option value="">Select Semester</option>
              {semesterOptions.map(s => (
                <option key={s} value={s}>{s}</option>
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
              disabled={!session || sessionError}
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white disabled:opacity-50"
            >
              <option value="">Select Month</option>
              {months.map(m => (
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
            disabled={loading || !session || sessionError || !semester || !month}
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

export default StudentAttendanceDownloadDialog; 