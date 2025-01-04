import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ScanQrCode, Loader2, Download, History, BarChart2 } from 'lucide-react';
import toast from 'react-hot-toast';
import QrScanner from 'qr-scanner';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import StudentAttendanceDownloadDialog from './StudentAttendanceDownloadDialog';

ChartJS.register(ArcElement, Tooltip, Legend);

const BASE_URL = 'http://localhost:8080';

const Attendance = () => {
  const [attendanceId, setAttendanceId] = useState('');
  const [qrId, setQrId] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const videoRef = useRef(null);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  const fetchAttendanceHistory = async () => {
    setHistoryLoading(true);
    try {
      const studentId = Cookies.get('userId');
      console.log('Fetching attendance history for student:', studentId);

      const response = await axios.get(
        `${BASE_URL}/api/attendance/students/${studentId}/attendance-history`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`
          }
        }
      );

      console.log('Received attendance data:', response.data);
      
      if (!response.data || !Array.isArray(response.data.records)) {
        console.error('Invalid response format:', response.data);
        toast.error('Invalid response format from server');
        return;
      }

      setAttendanceHistory(response.data.records);
      setAttendanceStats(response.data.stats);
      calculateAttendanceStats(response.data.records);
    } catch (error) {
      console.error('Error fetching attendance history:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      toast.error('Failed to fetch attendance history');
    } finally {
      setHistoryLoading(false);
    }
  };

  const calculateAttendanceStats = (history) => {
    setStatsLoading(true);
    try {
      const totalClasses = history.length;
      const totalPresent = history.filter(record => record.status === 'Present').length;
      const percentage = totalClasses ? ((totalPresent / totalClasses) * 100).toFixed(2) : 0;
      const classesNeededFor75 = Math.ceil((0.75 * totalClasses - totalPresent) / 0.25);

      setAttendanceStats({
        totalClasses,
        totalPresent,
        percentage,
        classesNeededFor75: classesNeededFor75 > 0 ? classesNeededFor75 : 0
      });
    } catch (error) {
      console.error('Error calculating attendance stats:', error);
      toast.error('Failed to calculate attendance stats');
    } finally {
      setStatsLoading(false);
    }
  };

  const handleMarkAttendance = async () => {
    setLoading(true);
    const loadingToast = toast.loading('Marking Attendance...');
    try {
      const userId = Cookies.get('userId');
      const token = Cookies.get('token');
      await axios.post(`${BASE_URL}/api/attendance/attendance/${attendanceId || qrId }/mark`, {
        userId: parseInt(userId)
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      toast.success('Attendance marked successfully', {
        id: loadingToast,
      });
      // Refresh history if it's being shown
      if (showHistory) {
        fetchAttendanceHistory();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to mark attendance', {
        id: loadingToast,
      });
    } finally {
      setLoading(false);
      setAttendanceId('');
    }
  };

  useEffect(() => {
    if (scanning && videoRef.current) {
      const qrScanner = new QrScanner(
        videoRef.current,
        async (result) => {
          await setQrId(result.data);
          qrScanner.stop();
          setScanning(false);
        },
        {
          // onDecodeError: (error) => {
          //   toast.error('Failed to scan QR code');
          // },
        }
      );
      qrScanner.start();

      return () => {
        qrScanner.stop();
      };
    }
  }, [scanning]);

  useEffect(() => {
    if (qrId) {
      handleMarkAttendance();
    }
  }, [qrId]);

  useEffect(() => {
    if (showStats) {
      fetchAttendanceHistory();
    }
  }, [showStats]);

  const handleScan = () => {
    setScanning(true);
  };

  const toggleStatsAndHistory = () => {
    setShowStats(!showStats);
    setShowHistory(!showHistory);
  };

  const doughnutData = {
    labels: ['Present', 'Absent'],
    datasets: [
      {
        data: [attendanceStats?.totalPresent || 0, (attendanceStats?.totalClasses || 0) - (attendanceStats?.totalPresent || 0)],
        backgroundColor: ['#2196F3', '#F44336'],
        hoverBackgroundColor: ['#64B5F6', '#EF5350'],
        borderWidth: 0 // Remove the white border
      }
    ]
  };

  return (
    <div className="w-full m-10">
      <div className="container p-4 space-y-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-semibold text-gray-900 dark:text-white">Attendance</h1>
          </div>
        </div>

        <div className="rounded-lg bg-white dark:bg-neutral-800 shadow-md dark:shadow-none p-6 space-y-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-center">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div
                onClick={handleScan}
                className="flex justify-center items-center gap-2 bg-gray-200 dark:bg-neutral-700 text-gray-600 dark:text-gray-300 dark:hover:bg-neutral-600 hover:bg-neutral-300 transition-colors border border-gray-200 dark:border-neutral-600 rounded-lg p-2 cursor-pointer"
              >
                <ScanQrCode size={35} />
                <h1 className="text-xl font-medium poppins">Scan</h1>
              </div>
              <input
                type="text"
                value={attendanceId}
                onChange={(e) => setAttendanceId(e.target.value)}
                placeholder="Enter Attendance ID"
                className="px-3 py-2 rounded-lg text-center border border-gray-200 dark:border-neutral-700 bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-gray-300"
              />
              <button
                onClick={handleMarkAttendance}
                disabled={loading || !attendanceId}
                className="flex justify-center text-center items-center px-3 py-2 text-sm font-medium rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-300 dark:hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Mark Attendance'
                )}
              </button>
              <button
                onClick={() => setShowDownloadDialog(true)}
                className="flex justify-center text-center items-center px-3 py-2 text-sm font-medium rounded-lg bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-800 dark:text-green-300 dark:hover:bg-green-700 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Complete Attendance
              </button>
              <button
                onClick={toggleStatsAndHistory}
                className="flex justify-center text-center items-center px-3 py-2 text-sm font-medium rounded-lg bg-yellow-100 text-yellow-600 hover:bg-yellow-200 dark:bg-yellow-800 dark:text-yellow-300 dark:hover:bg-yellow-700 transition-colors"
              >
                <BarChart2 className="h-4 w-4 mr-2" />
                {showStats ? 'Hide Stats & History' : 'Show Stats & History'}
              </button>
            </div>
          </div>
        </div>

        {showStats && (
          <div className="rounded-lg bg-white dark:bg-neutral-800 shadow-md dark:shadow-none p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Attendance Stats
            </h2>
            {attendanceStats && attendanceStats.percentage < 75 && (
              <div className="bg-red-100 text-red-600 p-2 text-center rounded-lg mb-4">
                <strong>LOW ATTENDANCE</strong>
                <p>Attend {attendanceStats.classesNeededFor75} more classes to reach 75% attendance</p>
              </div>
            )}
            {statsLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : attendanceStats ? (
              <div className="space-y-4 grid grid-col-1 md:grid-cols-2 gap-4">
                <div className='flex flex-col justify-center items-center'>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Total Classes:</strong> {attendanceStats.totalClasses}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Total Present:</strong> {attendanceStats.totalPresent}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Percentage:</strong> {attendanceStats.percentage}%
                  </p>
                </div>
                <div className="w-48 md:w-96 h-48 mx-auto">
                  <Doughnut data={doughnutData} />
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                No attendance stats available
              </p>
            )}
          </div>
        )}

        {showHistory && (
          <div className="rounded-lg bg-white dark:bg-neutral-800 shadow-md dark:shadow-none p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Attendance History
            </h2>
            
            {historyLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : attendanceHistory.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                No attendance records found
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b dark:border-neutral-700">
                      <th className="py-3 px-4 font-semibold text-gray-900 dark:text-white">Date</th>
                      <th className="py-3 px-4 font-semibold text-gray-900 dark:text-white">Course</th>
                      <th className="py-3 px-4 font-semibold text-gray-900 dark:text-white">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceHistory.map((record, index) => (
                      <tr 
                        key={index}
                        className="border-b dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700"
                      >
                        <td className="py-2 px-4 text-gray-700 dark:text-gray-300">
                          {new Date(record.date).toLocaleDateString('en-GB')}
                        </td>
                        <td className="py-2 px-4 text-gray-700 dark:text-gray-300">
                          {record.courseName} ({record.courseCode})
                        </td>
                        <td className={`py-2 px-4 ${
                          record.status === 'Present' 
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {record.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {scanning && (
          <div className="absolute -top-6 left-0 w-full h-full z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
            <div className="bg-white rounded-lg shadow-lg dark:bg-neutral-800 p-6">
              <video ref={videoRef} className="w-[60svw] h-[60svh]" />
              <button
                onClick={() => setScanning(false)}
                className="mt-4 inline-flex text-center items-center px-3 py-2 text-sm font-medium rounded-lg bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-800 dark:text-red-300 dark:hover:bg-red-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {showDownloadDialog && (
          <StudentAttendanceDownloadDialog
            onClose={() => setShowDownloadDialog(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Attendance;