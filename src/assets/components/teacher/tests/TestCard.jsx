import React, { useState } from 'react';
import { Clock, Pencil, Eye, Trash2, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react';

const TestCard = ({
  id,
  title,
  description,
  timeLimit,
  subjectName,
  subjectCode,
  isActive,
  onStatusToggle,
  onEdit,
  onViewResponses,
  onDelete
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handleToggleStatus = async () => {
    setIsToggling(true);
    await onStatusToggle(id);
    setIsToggling(false);
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Card Header */}
      <div className="p-4 border-b border-gray-200 dark:border-neutral-700">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h3>
          <div
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              isActive ? "bg-green-200 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {isActive ? "Active" : "Inactive"}
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">{timeLimit} minutes</span>
          </div>

          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{subjectName}</span>
            <span className="ml-2 px-2 py-0.5 bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-gray-400 rounded text-xs">{subjectCode}</span>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-4 bg-gray-50 dark:bg-neutral-700 space-y-4">
        {/* Status Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Test Status</span>
          <div className="flex items-center space-x-2">
            {isToggling ? (
              <Loader2 className="h-4 w-4 text-gray-500 dark:text-gray-400 animate-spin" />
            ) : (
              <span className="text-sm text-gray-500 dark:text-gray-400">{isActive ? "Active" : "Inactive"}</span>
            )}
            <button
              onClick={handleToggleStatus}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isActive ? "bg-blue-600" : "bg-gray-200"
              }`}
              disabled={isToggling}
            >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isActive ? "translate-x-6" : "translate-x-1"
                  }`}
                />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between gap-2">
          <button
            onClick={() => onEdit(id)}
            className="flex items-center justify-center px-3 py-1.5 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Pencil className="h-4 w-4 mr-1" />
            Edit
          </button>

          <button
            onClick={() => onViewResponses(id)}
            className="flex items-center justify-center px-3 py-1.5 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Eye className="h-4 w-4 mr-1" />
            Responses
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center justify-center px-3 py-1.5 bg-red-50 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-md text-sm font-medium text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Are you sure?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-300 mb-4">
              This action cannot be undone. This will permanently delete the test and all associated responses.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete(id);
                  setShowDeleteConfirm(false);
                }}
                className="px-4 py-2 bg-red-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestCard;
