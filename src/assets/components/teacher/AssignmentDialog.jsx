import React, { useState } from 'react';
import { X, Loader2, Calendar, FileText, Paperclip, Edit3, Trash2, Eye } from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = 'http://localhost:8080';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const SubmissionsDialog = ({ submissions, onClose, loading }) => (
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
                      <a href={`${BASE_URL}/${submission.fileUrl}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400">
                        View File
                      </a>
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
      {showSubmissionsDialog && (
        <SubmissionsDialog
          submissions={submissions}
          onClose={() => setShowSubmissionsDialog(false)}
          loading={loading}
        />
      )}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg w-[90%] md:w-1/3 max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-neutral-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {assignment ? 'Assignment Details' : 'Create Assignment'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-4">
          {assignment ? (
            <>
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{assignment.title}</p>
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
                  <a href={`${BASE_URL}/${assignment.fileUrl}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400">
                    View File
                  </a>
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
                  <div className={`relative w-11 h-6 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 ${
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
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg bg-yellow-100 text-yellow-600 hover:bg-yellow-200 dark:bg-yellow-800 dark:text-yellow-300 dark:hover:bg-yellow-700"
                >
                  <Edit3 className="h-4 w-4 mr-1" />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-800 dark:text-red-300 dark:hover:bg-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </button>
                <button
                  onClick={() => {
                    setShowSubmissionsDialog(true);
                    fetchSubmissions();
                  }}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-300 dark:hover:bg-blue-700"
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-neutral-700 dark:border-neutral-600 dark:text-gray-300"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-neutral-700 dark:border-neutral-600 dark:text-gray-300"
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-neutral-700 dark:border-neutral-600 dark:text-gray-300"
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-neutral-700 dark:border-neutral-600 dark:text-gray-300"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="file" className="block text-sm font-medium text-gray-700 dark:text-gray-300">File</label>
                <input
                  type="file"
                  id="file"
                  onChange={handleFileChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-neutral-700 dark:border-neutral-600 dark:text-gray-300"
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
                  className="inline-flex items-center px-3 py-1.5 transition-all text-sm font-medium rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-300 dark:hover:bg-blue-700"
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
