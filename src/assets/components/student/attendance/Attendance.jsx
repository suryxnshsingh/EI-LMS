import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ScanQrCode, Loader2, Download, History, BarChart2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Html5Qrcode } from "html5-qrcode";
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import StudentAttendanceDownloadDialog from './StudentAttendanceDownloadDialog';
import CryptoJS from 'crypto-js'; // Import CryptoJS

ChartJS.register(ArcElement, Tooltip, Legend);

const BASE_URL = `${import.meta.env.VITE_API_URL}`;

const scannerStyles = {
  container: {
    width: '300px',
    height: '420px', // Increased height to accommodate the button
    position: 'relative',
    borderRadius: '12px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    padding: '0.75rem',
    textAlign: 'center'
  },
  readerContainer: {
    width: '300px',
    height: '300px',
    position: 'relative',
    overflow: 'hidden',
    flex: '1 1 auto'
  }
};

const Attendance = () => {
  const [attendanceId, setAttendanceId] = useState('');
  const [qrId, setQrId] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [html5QrCode, setHtml5QrCode] = useState(null);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const scannerRef = useRef(null); // Add this ref to store scanner instance

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

      const sortedRecords = response.data.records.sort((a, b) => new Date(b.date) - new Date(a.date));
      setAttendanceHistory(sortedRecords);
      setAttendanceStats(response.data.stats);
      calculateAttendanceStats(sortedRecords);
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
    }
  };

  const decrypt = (ciphertext) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, 'secret-key');
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  const handleMarkAttendance = async () => {
    setLoading(true);
    const loadingToast = toast.loading('Marking Attendance...');
    try {
      const userId = Cookies.get('userId');
      const token = Cookies.get('token');
      
      console.log('Marking attendance with:', {
        userId,
        qrId: qrId ? 'present' : 'not present',
        attendanceId: attendanceId || 'not present'
      });
      
      // Check if we're using QR code or manual entry
      if (qrId) {
        // Handle dynamic QR token
        console.log('Using dynamic QR token');
        
        // Use the correct endpoint path to match the backend route
        const response = await axios.post(`${BASE_URL}/api/attendance/validate-token`, {
          token: qrId,
          userId: parseInt(userId)
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log('QR token validation response:', response.data);
        
        toast.success('Attendance marked successfully', {
          id: loadingToast,
        });
        
        // Set success message with course details if available
        setSuccessMessage({
          message: 'Attendance marked successfully',
          timestamp: new Date(),
          course: response.data?.courseName || 'Course'
        });
      } else if (attendanceId) {
        // Handle manual attendance ID entry
        console.log('Using manual attendance ID:', attendanceId);
        
        const response = await axios.post(`${BASE_URL}/api/attendance/attendance/${attendanceId}/mark`, {
          userId: parseInt(userId)
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('Manual attendance response:', response.data);

        toast.success('Attendance marked successfully', {
          id: loadingToast,
        });
        
        // Set success message with course details if available
        setSuccessMessage({
          message: 'Attendance marked successfully',
          timestamp: new Date(),
          course: response.data?.courseName || 'Course'
        });
      } else {
        toast.error('No attendance ID provided', {
          id: loadingToast,
        });
        return;
      }

      // Refresh history if it's being shown
      if (showHistory) {
        fetchAttendanceHistory();
      }
    } catch (err) {
      console.error('Attendance marking failed:', err);
      console.error('Error details:', err.response?.data || err.message);
      
      toast.error(err.response?.data?.error || 'Failed to mark attendance', {
        id: loadingToast,
      });
    } finally {
      setLoading(false);
      setAttendanceId('');
      setQrId('');
    }
  };

  const handleScan = async () => {
    if (!isScanning) {
      setScanning(true);
    }
  };

  useEffect(() => {
    const initializeScanner = async () => {
      if (scanning && !isScanning) {
        try {
          // Clean up any existing instance
          if (scannerRef.current) {
            await scannerRef.current.clear();
            scannerRef.current = null;
          }

          // Create new instance
          const scanner = new Html5Qrcode("reader");
          scannerRef.current = scanner;
          setHtml5QrCode(scanner);
          setIsScanning(true);

          await scanner.start(
            { facingMode: "environment" },
            {
              fps: 10,
              qrbox: { width: 1280, height: 720 }, // Increased QR box size
              aspectRatio: 1,
              disableFlip: true, // Disable flipping for mobile devices
              useBarCodeDetectorIfSupported: true // Use barcode detector if supported
            },
            async (decodedText) => {
              console.log("QR Code detected:", decodedText); // Add logging
              setQrId(decodedText);
              if (scannerRef.current) {
                try {
                  await scannerRef.current.stop();
                } catch (err) {
                  console.error('Error stopping scanner:', err);
                }
                scannerRef.current = null;
                setIsScanning(false);
                setScanning(false);
              }
            },
            (errorMessage) => {
              console.error("QR Code scanning error:", errorMessage);
              // toast.error("QR Code scanning error: " + errorMessage);
            }
          );
        } catch (err) {
          console.error("Error starting QR Code scanning", err);
          toast.error("Failed to start camera");
          setScanning(false);
          setIsScanning(false);
        }
      }
    };

    initializeScanner();

    // Cleanup function
    return () => {
      const cleanup = async () => {
        if (scannerRef.current) {
          try {
            await scannerRef.current.stop();
            await scannerRef.current.clear();
          } catch (err) {
            console.error('Error cleaning up scanner:', err);
          }
          scannerRef.current = null;
          setIsScanning(false);
        }
      };
      cleanup();
    };
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

  const handleCancelScan = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      } catch (error) {
        console.error('Error stopping scanner:', error);
      }
      scannerRef.current = null;
    }
    setIsScanning(false);
    setScanning(false);
  };

  return (
    <div className="w-full m-4 md:m-10">
      <div className="container p-4 space-y-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl md:text-4xl font-semibold text-gray-900 dark:text-white">Attendance</h1>
          </div>
        </div>

        <div className="rounded-lg bg-white dark:bg-neutral-800 shadow-md dark:shadow-none p-4 md:p-6 space-y-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-center">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div
                onClick={handleScan}
                className="flex justify-center h-32 md:h-11 items-center gap-2 bg-gray-200 dark:bg-neutral-700 text-gray-600 dark:text-gray-300 dark:hover:bg-neutral-600 hover:bg-neutral-300 transition-colors border border-gray-200 dark:border-neutral-600 rounded-lg p-2 cursor-pointer"
              >
                <ScanQrCode size={35} md:size={80} />
                <h1 className="text-lg md:text-xl font-medium poppins">Scan</h1>
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

        {/* Success Banner - moved here and updated styling */}
        {successMessage && (
          <div className="rounded-lg bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-800 shadow-md mb-6">
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-lg font-medium text-green-800 dark:text-green-200">
                    {successMessage.message}
                  </h3>
                  <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                    <p className="font-semibold">Course: {successMessage.course}</p>
                    <p className="mt-1">
                      Marked on: {successMessage.timestamp.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="ml-auto pl-3">
                  <button
                    onClick={() => setSuccessMessage(null)}
                    className="inline-flex rounded-md p-1.5 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800 focus:outline-none transition-colors"
                  >
                    <span className="sr-only">Dismiss</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 011.414 0L10 8.586l4.293-4.293a1 1 111.414 1.414L11.414 10l4.293 4.293a1 1 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 01-1.414-1.414L8.586 10 4.293 5.707a1 1 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showStats && (
          <div className="rounded-lg bg-white dark:bg-neutral-800 shadow-md dark:shadow-none mb-6">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white border-b dark:border-neutral-700 p-4 mb-4">
              Attendance Stats
            </h2>
            {historyLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : attendanceStats ? (
              <>
                {attendanceStats.percentage < 75 && (
                  <div className="bg-red-200 dark:bg-red-900 text-red-700 dark:text-red-300 border border-red-600 dark:border-red-300 p-2 text-center rounded-lg mx-4">
                    <strong>LOW ATTENDANCE</strong>
                    <p>Attend <strong>{attendanceStats.classesNeededFor75}</strong> more classes to complete 75% attendance</p>
                  </div>
                )}
                <div className="space-y-4 grid grid-col-1 md:grid-cols-2 gap-4 p-4">
                  <div className='flex flex-col justify-center gap-2 md:gap-4 items-center text-lg'>
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
                  <div className="w-32 md:w-48 h-32 md:h-48 mx-auto">
                    <Doughnut data={doughnutData} />
                  </div>
                </div>
              </>
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                No attendance stats available
              </p>
            )}
          </div>
        )}

        {showHistory && (
          <div className="rounded-lg bg-white dark:bg-neutral-800 shadow-md dark:shadow-none">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white p-4 border-b dark:border-neutral-700 mb-4">
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
              <div className="overflow-x-auto p-4">
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm">
            <div style={scannerStyles.container} className="bg-white dark:bg-neutral-800 shadow-lg border-4 border-blue-500">
              <div style={scannerStyles.header} className="border-b border-gray-200 dark:border-neutral-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Scan QR Code
                </h3>
              </div>
              <div style={scannerStyles.readerContainer} className="border-t border-b border-gray-200 dark:border-neutral-700">
                <div 
                  id="reader" 
                  className="relative"
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}
                />
              </div>
              <div className="p-3 text-center border-t border-gray-200 dark:border-neutral-700">
                <button
                  onClick={handleCancelScan}
                  className="inline-flex items-center px-4 py-1.5 text-sm font-medium rounded-lg bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-800/30 dark:text-red-300 dark:hover:bg-red-800/50 transition-colors"
                >
                  Cancel
                </button>
              </div>
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