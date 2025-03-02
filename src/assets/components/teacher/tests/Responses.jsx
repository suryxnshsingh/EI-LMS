import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Loader2, Edit, Info } from 'lucide-react';
import ResponseDialog from './ResponseDialog';

import { utils, writeFile } from 'xlsx';

const BASE_URL = `${import.meta.env.VITE_API_URL}`;

function Responses() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [quizDetails, setQuizDetails] = useState(null);

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

  const fetchQuizDetails = async () => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get(`${BASE_URL}/api/quiz/teacher/my-quizzes/${quizId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuizDetails(response.data);
    } catch (error) {
      console.error('Error fetching quiz details:', error);
      setError('Failed to fetch quiz details');
    }
  };

  const exportResults = () => {
    // Create worksheet with header row
    const worksheet = utils.aoa_to_sheet([
      ["STUDENTS", "MARKS"] // Header row
    ]);
    
    // Add data rows
    responses.forEach(response => {
      utils.sheet_add_aoa(
        worksheet, 
        [[`${response.user.firstName} ${response.user.lastName}`, response.score]], 
        { origin: -1 } // Append at the end
      );
    });
    
    // Set column widths
    worksheet['!cols'] = [{ wch: 30 }, { wch: 10 }];
    
    // Create workbook and append sheet
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Results');
    
    // Simple styling for header row (more compatible approach)
    if (worksheet['A1']) {
      if (!worksheet['A1'].s) worksheet['A1'].s = {};
      if (!worksheet['B1'].s) worksheet['B1'].s = {};
      
      // Bold headers
      worksheet['A1'].s.font = { bold: true };
      worksheet['B1'].s.font = { bold: true };
      
      // Fill headers with yellow
      worksheet['A1'].s.fill = { patternType: 'solid', fgColor: { rgb: 'FFFF00' } };
      worksheet['B1'].s.fill = { patternType: 'solid', fgColor: { rgb: 'FFFF00' } };
    }

    // Save the file
    writeFile(workbook, `${quizDetails?.title || 'quiz'}_results.xlsx`);
  };

  useEffect(() => {
    fetchResponses();
    fetchQuizDetails();
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
        <button
          onClick={exportResults}
          className="flex items-center px-4 py-2 text-md dark:text-white text-gray-700 bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 rounded-md"
        >
          Export Results
        </button>
      </div>
      {error && (
        <div className="alert alert-error text-red-600 mb-4 max-w-2xl mx-auto">
          {error}
        </div>
      )}
      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-md">
          <thead className='bg-gray-50 dark:bg-neutral-700 rounded-lg'>
            <tr className="border-b border-neutral-200 dark:border-neutral-700">
              <th className="px-4 py-2 text-left text-gray-900 dark:text-white font-bold">Student</th>
              <th className="px-4 py-2 text-left text-gray-900 dark:text-white font-bold">Marks</th>
              <th className="px-4 py-2 text-left text-gray-900 dark:text-white font-bold">Status</th>
              <th className="px-4 py-2 text-left text-gray-900 dark:text-white font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {responses.map(response => (
              <tr key={response.id} className="border-t border-neutral-200 dark:border-neutral-700">
                <td className="px-4 py-2 text-gray-900 dark:text-white border-r border-neutral-200 dark:border-neutral-700">{response.user.firstName} {response.user.lastName}</td>
                <td className="px-4 py-2 text-gray-600 dark:text-gray-300 border-r border-neutral-200 dark:border-neutral-700">{response.score}</td>
                <td className="px-4 py-2 text-gray-600 dark:text-gray-300 border-r border-neutral-200 dark:border-neutral-700">{response.status}</td>
                <td className="px-4 py-2">
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