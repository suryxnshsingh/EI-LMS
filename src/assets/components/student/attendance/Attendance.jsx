import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ScanQrCode, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import QrScanner from 'qr-scanner';

const BASE_URL = 'http://localhost:8080';

const Attendance = () => {
  const [attendanceId, setAttendanceId] = useState('');
  const [qrId, setQrId] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef(null);

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
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to mark attendance', {
        id: loadingToast,
      });
    } finally {
      setLoading(false);
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

  const handleScan = () => {
    setScanning(true);
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
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
            </div>
          </div>
        </div>

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
      </div>
    </div>
  );
};

export default Attendance;