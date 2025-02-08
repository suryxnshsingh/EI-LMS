import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Loader2, Plus } from 'lucide-react';
import AssignmentDialog from './AssignmentDialog';
import CreateAssignmentDialog from './CreateAssignmentDialog';

const BASE_URL = 'http://localhost:8080';

const Assignments = () => {
  const { courseId } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const fetchAssignments = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/assignment/course/${courseId}/all`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`
        }
      });
      setAssignments(response.data);
    } catch (err) {
      setError('Failed to fetch assignments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [courseId]);

  const handleCreateAssignment = async (assignmentData) => {
    try {
      await axios.post(`${BASE_URL}/api/assignment/create`, assignmentData, {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`
        }
      });
      fetchAssignments();
    } catch (err) {
      setError('Failed to create assignment');
    }
  };

  const handleViewAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setShowDialog(true);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-900 dark:text-white" />
      </div>
    );
  }

  return (
    <div className="w-full m-0">
      <div className="container space-y-6">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setShowCreateDialog(true)}
            className="inline-flex w-full items-center justify-center px-3 py-1.5 transition-all text-md font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 text-white"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Create Assignment
          </button>
        </div>

        {error && (
          <div className="border px-4 py-3 rounded mb-4 bg-red-50 border-red-200 text-red-700 dark:bg-red-900 dark:border-red-800 dark:text-red-200">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {assignments.map((assignment) => (
            <div
              key={assignment.id}
              onClick={() => handleViewAssignment(assignment)}
              className="flex items-center justify-between p-4 rounded bg-gray-50 dark:bg-neutral-950 border border-gray-200 dark:border-neutral-700 cursor-pointer hover:shadow-lg dark:shadow-neutral-800 transition-shadow"
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-300">{assignment.title}</h2>
                <span className={`inline-block md:hidden mt-2 px-2 py-1 text-xs font-semibold rounded-full ${assignment.acceptingSubmissions ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {assignment.acceptingSubmissions ? 'Accepting' : 'Closed'}
                </span>
                <p className="text-sm text-gray-600 dark:text-gray-400 hidden md:block">{assignment.description}</p>
              </div>
              <div className="text-right flex flex-col md:flex-row-reverse gap-8 items-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Due Date:<br/> {formatDate(assignment.dueDate)}</p>
                <span className={`hidden md:inline-block px-2 py-1 text-xs font-semibold rounded-full ${assignment.acceptingSubmissions ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {assignment.acceptingSubmissions ? 'Accepting Submissions' : 'Submissions Closed'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showDialog && (
        <AssignmentDialog
          courseId={courseId}
          assignment={selectedAssignment}
          onClose={() => setShowDialog(false)}
        />
      )}

      {showCreateDialog && (
        <CreateAssignmentDialog
          courseId={courseId}
          onClose={() => setShowCreateDialog(false)}
          onCreate={handleCreateAssignment}
        />
      )}
    </div>
  );
};

export default Assignments;
