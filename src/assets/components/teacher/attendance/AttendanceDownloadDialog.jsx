import React, { useState, useEffect } from 'react';
import { Loader2, Calendar, Clock } from 'lucide-react';
import Cookies from 'js-cookie';
import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

const AttendanceDownloadDialog = ({ courseId, courseName, onClose }) => {
  const [activeTab, setActiveTab] = useState('month'); // 'month' or 'range'
  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState('');
  const [courseDetails, setCourseDetails] = useState(null);
  const [months, setMonths] = useState([]);
  
  // New state for date range
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/courses/courses/${courseId}`, {
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`
          }
        });
        setCourseDetails(response.data);
        
        // Generate months based on the course session
        const session = response.data.session;
        const [startYear] = session.split('-');
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
      } catch (error) {
        console.error('Error fetching course details:', error);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  const downloadExcel = async () => {
    try {
      setLoading(true);
      
      let requestUrl, params;
      
      if (activeTab === 'month') {
        const year = parseInt(month) >= 7 ? courseDetails.session.split('-')[0] 
                                        : (parseInt(courseDetails.session.split('-')[0]) + 1).toString();
        
        requestUrl = `${BASE_URL}/api/attendance/attendance/monthly-report/${courseId}`;
        params = {
          month,
          year,
          session: courseDetails.session,
          semester: courseDetails.semester
        };
      } else {
        requestUrl = `${BASE_URL}/api/attendance/attendance/range-report/${courseId}`;
        params = {
          startDate,
          endDate,
          session: courseDetails.session,
          semester: courseDetails.semester
        };
      }
      
      const response = await axios.get(requestUrl, {
        params,
        headers: { 
          Authorization: `Bearer ${Cookies.get('token')}`
        },
        responseType: 'blob'
      });

      if (response.data.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
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
      
      // Generate filename based on active tab
      const filename = activeTab === 'month' 
        ? `Attendance_${courseName}_${months.find(m => m.value === month)?.label}_${courseDetails.session}.xlsx`
        : `Attendance_${courseName}_${startDate}_to_${endDate}.xlsx`;
      
      link.setAttribute('download', filename);
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

  const isDownloadDisabled = () => {
    if (activeTab === 'month') {
      return !month;
    } else {
      return !startDate || !endDate || new Date(startDate) > new Date(endDate);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Download Attendance Report
        </h2>

        {/* Tabs */}
        <div className="flex mb-4 border-b border-gray-200 dark:border-neutral-700">
          <button
            onClick={() => setActiveTab('month')}
            className={`px-4 py-2 ${
              activeTab === 'month'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <Calendar className="inline-block w-4 h-4 mr-2" />
            By Month
          </button>
          <button
            onClick={() => setActiveTab('range')}
            className={`px-4 py-2 ${
              activeTab === 'range'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <Clock className="inline-block w-4 h-4 mr-2" />
            Date Range
          </button>
        </div>

        <div className="space-y-4">
          {activeTab === 'month' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Month
              </label>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full px-3 py-2 border rounded-md dark:bg-neutral-700 dark:border-neutral-600"
              >
                <option value="">Select Month</option>
                {months.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md dark:bg-neutral-700 dark:border-neutral-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  className="w-full px-3 py-2 border rounded-md dark:bg-neutral-700 dark:border-neutral-600"
                />
              </div>
            </>
          )}

          <div className="text-sm text-gray-600 dark:text-gray-400">
            <div>Session: {courseDetails?.session}</div>
            <div>Semester: {courseDetails?.semester}</div>
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
            disabled={loading || isDownloadDisabled()}
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