import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { X, CheckCircle } from 'lucide-react';

const BASE_URL = `${import.meta.env.VITE_API_URL}`;

function ResponseDialog({ response, onClose, onSave }) {
  const [marks, setMarks] = useState(response.marks || response.score);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [editedAnswers, setEditedAnswers] = useState(response.answers);

  console.log('ResponseDialog rendered with response:', response);

  const handleSave = async () => {
    try {
      setSaving(true);
      console.log('Saving marks:', marks);
      const token = Cookies.get("token");

      // Calculate the total score from the edited answers
      const totalScore = editedAnswers.reduce((sum, answer) => sum + (answer.score || 0), 0);

      await axios.put(`${BASE_URL}/api/quiz/teacher/${response.quizId}/responses/${response.id}`, {
        score: totalScore,
        answers: editedAnswers.map(answer => ({
          id: answer.id,
          score: answer.score
        }))
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Marks saved successfully');
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving marks:', error);
      setError('Failed to save marks');
    } finally {
      setSaving(false);
    }
  };

  const handleScoreChange = (answerId, newScore) => {
    setEditedAnswers(prevAnswers =>
      prevAnswers.map(answer =>
        answer.id === answerId ? { ...answer, score: parseFloat(newScore) } : answer
      )
    );
  };

  const getCorrectAnswerText = (question) => {
    if (!question) return 'N/A';
    if (question.type.includes('MCQ')) {
      return question.options?.filter(option => option.isCorrect).map(option => option.text).join(', ') || 'N/A';
    }
    if (question.type === 'NUMERICAL') {
      return `${question.correctAnswer} ± ${question.tolerance}`;
    }
    if (question.type === 'DESCRIPTIVE') {
      return question.keywords.join(', ');
    }
    return question.correctAnswer || 'N/A';
  };

  return (
    <div className=" fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ">
      <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 p-6 rounded-md shadow-md w-3/4 h-3/4 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Response Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200">
            <X size={24} />
          </button>
        </div>
        {error && (
          <div className="alert alert-error text-red-600 mb-4">
            {error}
          </div>
        )}
        <div className="space-y-4">
          {editedAnswers.map(answer => (
            <div key={answer.id} className="p-4 bg-gray-50 dark:bg-neutral-700 rounded-md">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{answer.question?.text || 'N/A'}</h3>
              <p className="text-gray-600 dark:text-gray-300">Correct Answer: {getCorrectAnswerText(answer.question)}</p>
              <p className="text-gray-600 dark:text-gray-300">Student's Answer: {answer.textAnswer || answer.selectedOptionsText.join(', ')}</p>
              <div className="flex items-center">
                <label className="text-gray-600 dark:text-gray-300 mr-2">Marks:</label>
                <input
                  type="number"
                  value={answer.score}
                  onChange={(e) => handleScoreChange(answer.id, e.target.value)}
                  className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200">
            Cancel
          </button>
          <button onClick={handleSave} className={`px-4 py-2 rounded-md text-white transition-colors duration-200 ${saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'}`} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResponseDialog;
