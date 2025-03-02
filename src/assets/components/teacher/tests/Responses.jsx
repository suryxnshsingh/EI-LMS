import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Loader2, Edit, Info } from 'lucide-react';
import ResponseDialog from './ResponseDialog';
import { IconDetails } from '@tabler/icons-react';

const BASE_URL = `${import.meta.env.VITE_API_URL}`;

function Responses() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedResponse, setSelectedResponse] = useState(null);

  const fetchResponses = async () => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get(`${BASE_URL}/api/quiz/teacher/${quizId}/responses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResponses(response.data);
    } catch (error) {
      console.error('Error fetching responses:', error);
      setError('Failed to fetch responses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResponses();
  }, [quizId]);

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="animate-spin w-10 h-10 text-gray-600 dark:text-gray-300" />
    </div>
  );

  return (
    <div className="p-5 md:p-10 mr-0 md:mr-16 w-full">
      <div className="mb-10 flex justify-between">
        <h1 className="text-4xl font-semibold text-gray-900 dark:text-white">Responses</h1>
      </div>
      {error && (
        <div className="alert alert-error text-red-600 mb-4 max-w-2xl mx-auto">
          {error}
        </div>
      )}
      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-md">
          <thead className='bg-gray-50 dark:bg-neutral-700 rounded-lg'>
            <tr >
              <th className="px-4 py-2 text-left text-gray-900 dark:text-white">Student</th>
              <th className="px-4 py-2 text-left text-gray-900 dark:text-white">Marks</th>
              <th className="px-4 py-2 text-left text-gray-900 dark:text-white">Status</th>
              <th className="px-4 py-2 text-left text-gray-900 dark:text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {responses.map(response => (
              <tr key={response.id} className="border-t border-neutral-200 dark:border-neutral-700 rrounded-lg">
                <td className="px-4 py-2 text-gray-900 dark:text-white ">{response.user.firstName} {response.user.lastName}</td>
                <td className="px-4 py-2 text-gray-600 dark:text-gray-300 ">{response.score}</td>
                <td className="px-4 py-2 text-gray-600 dark:text-gray-300 ">{response.status}</td>
                <td className="px-4 py-2 ">
                  <button
                    onClick={() => setSelectedResponse(response)}
                    className="flex items-center px-2 py-1 text-md dark:text-white text-gray-700 bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 rounded-md"
                  >
                    <Info className="mr-2 w-5 h-5" /> View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedResponse && (
        <ResponseDialog
          response={selectedResponse}
          onClose={() => setSelectedResponse(null)}
          onSave={fetchResponses}
        />
      )}
    </div>
  );
}

export default Responses;
