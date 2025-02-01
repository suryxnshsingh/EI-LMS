import React, { useState } from 'react';
import { X, Loader2, Edit3, Trash2 } from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';

const BE_URL = 'http://localhost:8080';

const NoteDialog = ({ note, onClose, onUpdate, onDelete }) => {
  const [title, setTitle] = useState(note ? note.title : '');
  const [description, setDescription] = useState(note ? note.description : '');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpdate = async () => {
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (file) {
      formData.append('file', file);
    }

    try {
      await onUpdate(note.id, formData);
      onClose();
    } catch (err) {
      setError('Failed to update note');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      await onDelete(note.id);
      onClose();
    } catch (err) {
      setError('Failed to delete note');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg w-[90%] md:w-1/3 max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-neutral-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Note Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-4">
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
            <label htmlFor="file" className="block text-sm font-medium text-gray-700 dark:text-gray-300">File</label>
            <input
              type="file"
              id="file"
              onChange={handleFileChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-neutral-700 dark:border-neutral-600 dark:text-gray-300"
            />
            {note.fileUrl && (
              <a href={`${BE_URL}/${note.fileUrl}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 mt-2 block">Download Current File</a>
            )}
          </div>
          {error && (
            <div className="border px-4 py-3 rounded mb-4 bg-red-50 border-red-200 text-red-700 dark:bg-red-900 dark:border-red-800 dark:text-red-200">
              {error}
            </div>
          )}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteDialog;
