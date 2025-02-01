import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Loader2, Plus, Trash2, FileDown } from 'lucide-react';
import CreateNoteDialog from './CreateNoteDialog';

const BASE_URL = 'http://localhost:8080';

const Notes = () => {
  const { courseId } = useParams();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const fetchNotes = async () => {
    try {
      const url = `${BASE_URL}/api/notes/notes/course/${courseId}`;
      const headers = {
        Authorization: `Bearer ${Cookies.get('token')}`
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

  const handleCreateNote = async (noteData) => {
    try {
      await axios.post(`${BASE_URL}/api/notes/notes`, noteData, {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`
        }
      });
      fetchNotes();
    } catch (err) {
      setError('Failed to create note');
    }
  };

  const handleDeleteNote = async (noteId) => {
    const confirmed = window.confirm('Are you sure you want to delete this note?');
    if (!confirmed) return;

    try {
      await axios.delete(`${BASE_URL}/api/notes/notes/${noteId}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`
        }
      });
      fetchNotes();
    } catch (err) {
      setError('Failed to delete note');
    }
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
            className="inline-flex w-full items-center justify-center px-3 py-1.5 transition-all text-md font-medium rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-300 dark:hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Create Note
          </button>
        </div>

        {error && (
          <div className="border px-4 py-3 rounded mb-4 bg-red-50 border-red-200 text-red-700 dark:bg-red-900 dark:border-red-800 dark:text-red-200">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className="p-4 rounded bg-gray-50 dark:bg-neutral-800 hover:shadow-lg dark:shadow-gray-600 transition-shadow"
            >
              <div className="flex justify-between items-center mb-0">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-300">{note.title}</h2>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-800 dark:text-red-300 dark:hover:bg-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                </button>
              </div>
              <div className="">
                <p className="text-sm text-gray-600 dark:text-gray-400">{note.description}</p>
              </div>
              <div className="mb-0">
                {note.fileUrl && (
                  <a href={`${BASE_URL}/${note.fileUrl}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-300 dark:hover:bg-blue-700 mt-2">
                    <FileDown className="h-4 w-4 mr-1" />
                    Download File
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showCreateDialog && (
        <CreateNoteDialog
          courseId={courseId}
          onClose={() => setShowCreateDialog(false)}
          onCreate={handleCreateNote}
        />
      )}
    </div>
  );
};

export default Notes;
