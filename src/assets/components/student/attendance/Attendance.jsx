import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { QrCode, Loader2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useMediaQuery } from 'react-responsive';
import toast from 'react-hot-toast';

const BASE_URL = 'http://localhost:8080';

const Attendance = () => {
  const [attendanceId, setAttendanceId] = useState('');
  const [loading, setLoading] = useState(false);
  const isSmallDevice = useMediaQuery({ maxWidth: 768 });

  const handleMarkAttendance = async () => {
    setLoading(true);
    try {
      const userId = Cookies.get('userId');
      const token = Cookies.get('token');
      await axios.post(`${BASE_URL}/api/attendance/attendance/${attendanceId}/mark`, {
        userId: parseInt(userId)
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      toast.success('Attendance marked successfully');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to mark attendance');
    } finally {
      setLoading(false);
    }
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
              <QrCode />
              <input
                type="text"
                value={attendanceId}
                onChange={(e) => setAttendanceId(e.target.value)}
                placeholder="Enter Attendance ID"
                className="px-3 py-2 rounded-lg bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-gray-300"
              />
              <button
                onClick={handleMarkAttendance}
                disabled={loading || !attendanceId}
                className="inline-flex text-center items-center px-3 py-1.5 text-sm font-medium rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-300 dark:hover:bg-blue-700 transition-colors disabled:opacity-50"
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
      </div>
    </div>
  );
};

export default Attendance;