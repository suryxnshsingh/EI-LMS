import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { FileDown } from 'lucide-react'; // added for consistency

const BASE_URL = `${import.meta.env.VITE_API_URL}`;

const Notes = () => {
  const { courseId } = useParams();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotes = async () => {
    try {
      const url = `${BASE_URL}/api/notes/notes/course/${courseId}`;
      const headers = {
        Authorization: `Bearer ${Cookies.get('token')}`,
      };
      const response = await axios.get(url, { headers });
      setNotes(response.data);
    } catch (err) {
      console.error('Error fetching notes:', err);
      setError('Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [courseId]);

  const downloadFile = (fileUrl) => {
    try {
      const filename = fileUrl.split('/').pop();
      window.open(`${BASE_URL}/api/notes/download/${filename}`, '_blank');
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        {/* ...loading indicator... */}
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="container space-y-6">
        {error && (
          <div className="border px-4 py-3 rounded mb-4 bg-red-50 border-red-200 text-red-700 dark:bg-red-900 dark:border-red-800 dark:text-red-200">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {notes.map((note) => (
            <div key={note.id} className="p-4 rounded bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-700 hover:shadow-lg transition-shadow flex justify-between items-center"> {/* updated card container styling */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-300">{note.title}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">{note.description}</p>
              </div>
              {note.fileUrl && (
                <button
                  onClick={() => downloadFile(note.fileUrl)}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white" // updated download button styling
                >
                  <FileDown className="h-4 w-4 mr-1" />
                  Download File
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notes;