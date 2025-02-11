import React from 'react';

const ConfirmDialog = ({ showConfirmDialog, setShowConfirmDialog, handleConfirmSubmit, attemptedQuestions, quiz }) => {
  if (!showConfirmDialog) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
        <h3 className="text-xl font-semibold mb-4 dark:text-white">Confirm Submission</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Are you sure you want to submit this quiz? 
          {attemptedQuestions.size < quiz.questions.length && (
            <span className="text-red-500 block mt-2">
              Warning: You have {quiz.questions.length - attemptedQuestions.size} unanswered questions.
            </span>
          )}
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={() => setShowConfirmDialog(false)}
            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmSubmit}
            className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded hover:from-violet-500 hover:to-indigo-500"
          >
            Yes, Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
