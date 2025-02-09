import React, { useState } from 'react';
import { X, Loader2, Calendar, FileText, Paperclip, Edit3, Trash2, Eye } from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = `${import.meta.env.VITE_API_URL}`;

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const SubmissionsDialog = ({ submissions, onClose, loading }) => {
  const downloadFile = (fileUrl) => {
    try {
      const filename = fileUrl.split('/').pop();
      const link = document.createElement('a');
      link.href = `${BASE_URL}/api/assignment/download/submission/${filename}`;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-neutral-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Submissions</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="overflow-x-auto mt-4">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500 dark:text-gray-400" />
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
              <thead className="bg-gray-50 dark:bg-neutral-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Student Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Submission Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    File
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-neutral-900 divide-y divide-gray-200 dark:divide-neutral-700">
                {submissions.map((submission) => (
                  <tr key={submission.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {`${submission.student.firstName} ${submission.student.lastName}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatDate(submission.submissionDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        submission.isLate 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {submission.isLate ? 'Late' : 'On Time'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {submission.fileUrl ? (
                        <button 
                          onClick={() => downloadFile(submission.fileUrl)} 
                          className="text-blue-600 dark:text-blue-400"
                        >
                          Download File
                        </button>
                      ) : (
                        'No file uploaded'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {submissions.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No submissions found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AssignmentDialog = ({ courseId, assignment, onClose, onCreate }) => {
  const [title, setTitle] = useState(assignment ? assignment.title : '');
  const [description, setDescription] = useState(assignment ? assignment.description : '');
  const [dueDate, setDueDate] = useState(assignment ? assignment.dueDate : '');
  const [maxMarks, setMaxMarks] = useState(assignment ? assignment.maxMarks : '');
  const [file, setFile] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [acceptingSubmissions, setAcceptingSubmissions] = useState(assignment ? assignment.acceptingSubmissions : true);
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [showSubmissionsDialog, setShowSubmissionsDialog] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('courseId', courseId);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('dueDate', dueDate);
    formData.append('maxMarks', maxMarks);
    if (file) {
      formData.append('file', file);
    }

    try {
      await onCreate(formData);
      onClose();
    } catch (err) {
      setError('Failed to create assignment');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/assignment/submissions/assignment/${assignment.id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`
        }
      });
      setSubmissions(response.data);
    } catch (err) {
      setError('Failed to fetch submissions');
    } finally {
      setLoading(false);
    }
  };

  const toggleAcceptingSubmissions = async () => {
    try {
      const response = await axios.put(`${BASE_URL}/api/assignment/toggle-submissions/${assignment.id}`, {}, {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`
        }
      });
      setAcceptingSubmissions(response.data.acceptingSubmissions);
    } catch (err) {
      setError('Failed to toggle accepting submissions');
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('dueDate', dueDate);
    formData.append('maxMarks', maxMarks);
    if (file) {
      formData.append('file', file);
    }

    try {
      await axios.put(`${BASE_URL}/api/assignment/update/${assignment.id}`, formData, {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`
        }
      });
      onClose();
    } catch (err) {
      setError('Failed to update assignment');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      await axios.delete(`${BASE_URL}/api/assignment/delete/${assignment.id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`
        }
      });
      onClose();
    } catch (err) {
      setError('Failed to delete assignment');
    } finally {
      setLoading(false);
    }
  };

  const downloadAssignmentFile = async (fileUrl) => {
    try {
      const filename = fileUrl.split('/').pop();
      window.open(`${BASE_URL}/api/assignment/download/${filename}`, '_blank');
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      {showSubmissionsDialog && (
        <SubmissionsDialog
          submissions={submissions}
          onClose={() => setShowSubmissionsDialog(false)}
          loading={loading}
        />
      )}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-2xl w-full md:w-1/2 lg:w-1/3 max-h-[90vh] overflow-y-auto transition">
        <div className="flex justify-between items-center border-b border-neutral-200 dark:border-neutral-700 pb-4 mb-4 px-6 py-3">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {assignment ? 'Assignment Details' : 'Create Assignment'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded transition"
          >
            <X className="h-6 w-6 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white" />
          </button>
        </div>
        <div className="px-6 pb-6">
          {assignment ? (
            <>
              <p className="text-xl font-semibold text-gray-800 dark:text-gray-200">{assignment.title}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{assignment.description}</p>
              <div className="flex flex-col gap-4 items-start mt-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Due Date: {formatDate(assignment.dueDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm">Max Marks: {assignment.maxMarks}</span>
                </div>

              <div className="flex items-center gap-2">
                <Paperclip className="h-4 w-4" />
                <span className="text-sm">Attached Files:</span>
                {assignment.fileUrl ? (
                  <button 
                    onClick={() => downloadAssignmentFile(assignment.fileUrl)} 
                    className="text-blue-600 dark:text-blue-400"
                  >
                    Download File
                  </button>
                ) : (
                  <span className="text-sm text-gray-600 dark:text-gray-400">No file uploaded</span>
                )}
              </div>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <span className="text-sm font-medium">Submissions:</span>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={acceptingSubmissions}
                    onChange={toggleAcceptingSubmissions}
                  />
                  <div className={`relative w-11 h-6 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 ${
                    acceptingSubmissions ? 'bg-red-600 dark:peer-checked:bg-red-600' : 'bg-green-600 dark:peer-checked:bg-green-600'
                  }`}></div>
                  <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                    {acceptingSubmissions ? '[STOP SUBMISSIONS]' : '[ALLOW SUBMISSIONS]'}
                  </span>
                </label>
              </div>
              <div className="flex justify-center gap-4 pt-5 mt-5 border-t border-gray-200 dark:border-neutral-700">
                <button
                  onClick={handleUpdate}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition"
                >
                  <Edit3 className="h-4 w-4 mr-1" />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </button>
                <button
                  onClick={() => {
                    setShowSubmissionsDialog(true);
                    fetchSubmissions();
                  }}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View Submissions
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 focus:outline-none focus:ring focus:border-blue-400"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 focus:outline-none focus:ring focus:border-blue-400"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Due Date</label>
                <input
                  type="datetime-local"
                  id="dueDate"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 focus:outline-none focus:ring focus:border-blue-400"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="maxMarks" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Max Marks</label>
                <input
                  type="number"
                  id="maxMarks"
                  value={maxMarks}
                  onChange={(e) => setMaxMarks(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 focus:outline-none focus:ring focus:border-blue-400"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="file" className="block text-sm font-medium text-gray-700 dark:text-gray-300">File</label>
                <input
                  type="file"
                  id="file"
                  onChange={handleFileChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 focus:outline-none focus:ring focus:border-blue-400"
                />
              </div>
              {error && (
                <div className="border px-4 py-3 rounded mb-4 bg-red-50 border-red-200 text-red-700 dark:bg-red-900 dark:border-red-800 dark:text-red-200">
                  {error}
                </div>
              )}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    'Create Assignment'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentDialog;
