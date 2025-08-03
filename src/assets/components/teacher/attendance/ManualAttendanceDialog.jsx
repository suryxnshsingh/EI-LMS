import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Download, Loader2, X } from 'lucide-react';

const BASE_URL = `${import.meta.env.VITE_API_URL}`;

const ManualAttendanceDialog = ({ course, onClose }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleDownloadBlankSheet = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/attendance/blank-sheet/${course.id}`, {
        headers: { Authorization: `Bearer ${Cookies.get('token')}` },
        responseType: 'blob'
      });
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', `attendance_blank_${course.courseCode || course.id}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Failed to download blank sheet:', err);
    }
  };

  const handleUploadSheet = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('courseId', course.id);

    try {
      await axios.post(`${BASE_URL}/api/attendance/upload-sheet`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${Cookies.get('token')}`
        }
      });
      setUploadSuccess(true);
    } catch (err) {
      setUploadError(err.response?.data?.error || 'Failed to upload sheet.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Manual Attendance</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <X size={24} />
          </button>
        </div>
        <div className="space-y-4">
          <button
            onClick={handleDownloadBlankSheet}
            className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-300 dark:hover:bg-blue-700 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Blank Sheet
          </button>
          <div>
            <label
              htmlFor="upload-sheet"
              className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg bg-purple-100 text-purple-600 hover:bg-purple-200 dark:bg-purple-800 dark:text-purple-300 dark:hover:bg-purple-700 transition-colors cursor-pointer"
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <span className="inline-block mr-2">
                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 16v2h12v-2M12 3v7.586l2.293-2.293 1.414 1.414L10 15.414l-5.707-5.707 1.414-1.414L8 10.586V3h4z" />
                    </svg>
                  </span>
                  Upload Filled Sheet
                </>
              )}
            </label>
            <input id="upload-sheet" type="file" className="hidden" onChange={handleUploadSheet} accept=".xlsx" />
          </div>
          {uploadError && <p className="text-red-500 text-sm">{uploadError}</p>}
          {uploadSuccess && <p className="text-green-500 text-sm">Sheet uploaded successfully!</p>}
        </div>
      </div>
    </div>
  );
};

export default ManualAttendanceDialog;
