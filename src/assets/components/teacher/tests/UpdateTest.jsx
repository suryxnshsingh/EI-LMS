import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ArrowLeft, Edit, Trash2, ClipboardList, X } from 'lucide-react';
import AddQuestionDialog from './AddQuestionDialog';

const BASE_URL = `${import.meta.env.VITE_API_URL}`;

function UpdateTest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState({ 
    title: '', 
    description: '', 
    timeLimit: 30,
    questions: [] 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // null | 'saving' | 'saved' | 'error'
  const teacherFname = Cookies.get("firstName");
  const teacherLname = Cookies.get("lastName");

  const fetchQuiz = async () => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get(`${BASE_URL}/api/quiz/teacher/quiz/${id}`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setQuiz(response.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch quiz:', err);
      setError('Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuiz(prev => ({ ...prev, [name]: value }));
  };

  const handleAddQuestion = async (formData) => {
    try {
      const token = Cookies.get("token");
      const response = await axios.post(
        `${BASE_URL}/api/quiz/teacher/${id}/questions`,
        formData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'  // Changed for file upload
          }
        }
      );
      
      setQuiz(prev => ({
        ...prev,
        questions: [...prev.questions, response.data]
      }));
      
      setIsDialogOpen(false);
    } catch (err) {
      console.error('Failed to add question:', err);
      setError('Failed to add question');
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      const token = Cookies.get("token");
      await axios.delete(`${BASE_URL}/api/quiz/teacher/${id}/questions/${questionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setQuiz(prev => ({
        ...prev,
        questions: prev.questions.filter(q => q.id !== questionId)
      }));
    } catch (err) {
      console.error('Failed to delete question:', err);
      setError('Failed to delete question');
    }
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingQuestion(null);
    fetchQuiz(); // Trigger a refresh
  };

  const handleUpdateQuestion = async (formData) => {
    try {
      const token = Cookies.get("token");
      const response = await axios.put(
        `${BASE_URL}/api/quiz/teacher/${id}/questions/${editingQuestion.id}`,
        formData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      setQuiz(prev => ({
        ...prev,
        questions: prev.questions.map(q => 
          q.id === editingQuestion.id ? response.data : q
        )
      }));
      
      setIsDialogOpen(false); // Close the dialog
      setEditingQuestion(null);
      fetchQuiz(); // Trigger a refresh
    } catch (err) {
      console.error('Failed to update question:', err);
      setError('Failed to update question');
    }
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const handleCloseImage = () => {
    setSelectedImage(null);
  };

  const saveChanges = async () => {
    try {
      setIsSaving(true);
      setSaveStatus('saving');
      const token = Cookies.get("token");
      await axios.put(
        `${BASE_URL}/api/quiz/teacher/${id}`,  // Fixed URL - removed extra 'quiz'
        {
          title: quiz.title,
          description: quiz.description,
          timeLimit: parseInt(quiz.timeLimit),
          courseIds: quiz.Course ? quiz.Course.map(c => c.id) : [] // Ensure Course is defined
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(null), 2000);
    } catch (err) {
      console.error('Failed to save changes:', err);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditDetails = () => {
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    fetchQuiz(); // Trigger a refresh
  };

  const handleSaveEditDetails = async () => {
    try {
      setIsSaving(true);
      const token = Cookies.get("token");
      const response = await axios.put(
        `${BASE_URL}/api/quiz/teacher/${id}`,
        {
          title: quiz.title,
          description: quiz.description,
          timeLimit: parseInt(quiz.timeLimit),
          courseIds: quiz.Course ? quiz.Course.map(c => c.id) : [] // Ensure Course is defined
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setQuiz(response.data); // Update the state with the new quiz details
      setIsEditDialogOpen(false); // Close the dialog on successful save
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(null), 2000);
      fetchQuiz(); // Trigger a refresh to ensure questions are updated
    } catch (err) {
      console.error('Failed to save changes:', err);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="text-center text-xl">Loading...</div>;

  return (
    <div className="w-full pr-32 p-10 flex">
      {/* Left Column: Quiz Details */}
      <div className="w-1/4 pr-6 fixed h-full overflow-y-auto">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
          <h1 className="text-2xl font-semibold ml-3 dark:text-white">Edit Quiz</h1>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-md shadow-md mb-6">
          <div className="space-y-4">
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                Title
              </label>
              <p className="text-gray-900 dark:text-white">{quiz.title}</p>
            </div>

            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                Description
              </label>
              <p className="text-gray-900 dark:text-white">{quiz.description}</p>
            </div>

            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                Time Limit (minutes)
              </label>
              <p className="text-gray-900 dark:text-white">{quiz.timeLimit}</p>
            </div>

            {/* Additional Quiz Details */}
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                Course
              </label>
              <p className="text-gray-900 dark:text-white">
                {quiz.Course?.map(c => c.name).join(', ') || 'N/A'}
              </p>
            </div>

            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                Created By
              </label>
              <p className="text-gray-900 dark:text-white">
                {`${teacherFname} ${teacherLname}` || 'N/A'}
              </p>
            </div>

            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                Created At
              </label>
              <p className="text-gray-900 dark:text-white">
                {new Date(quiz.createdAt).toLocaleString() || 'N/A'}
              </p>
            </div>

            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                Updated At
              </label>
              <p className="text-gray-900 dark:text-white">
                {new Date(quiz.updatedAt).toLocaleString() || 'N/A'}
              </p>
            </div>

            {/* Edit Details Button */}
            <div className="flex justify-center mt-4">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                onClick={handleEditDetails}
              >
                Edit Details
              </button>
            </div>

            {/* Add Question Button */}
            <div className="flex justify-center mt-4">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                onClick={() => setIsDialogOpen(true)}
              >
                Add Question
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Questions List */}
      <div className="w-3/4 ml-auto overflow-y-auto h-screen" style={{ marginLeft: '29%' }}>
        {quiz.questions?.length > 0 ? (
          <div className="mt-3">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold dark:text-white">Questions</h2>
            </div>
            
            {/* Questions List */}
            <div className="mb-3">
              {quiz.questions.map((question, index) => (
                <div 
                  key={question.id} 
                  className="p-4 mb-3 bg-white dark:bg-gray-800 dark:text-white rounded-md shadow"
                >
                  <div className="flex justify-between">
                    <div className="w-full">
                      {question.imageUrl && (
                        <div className="mb-2 max-w-full">
                          <img
                            src={`${BASE_URL}${question.imageUrl}`}
                            alt="Question"
                            className="rounded-lg max-h-48 object-contain cursor-pointer hover:opacity-90 transition-opacity"
                            loading="lazy"
                            onClick={() => handleImageClick(`${BASE_URL}${question.imageUrl}`)}
                          />
                        </div>
                      )}
                      <h3 className="font-medium">
                        {index + 1}. {question.text}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Type: {question.type} • Marks: {question.marks}
                      </p>
                      
                      {/* Show options for MCQ questions */}
                      {question.type.includes('MCQ') && question.options && (
                        <div className="mt-1 ml-3">
                          {question.options.map((option, idx) => (
                            <p 
                              key={idx} 
                              className={`${option.isCorrect ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}
                            >
                              {String.fromCharCode(65 + idx)}. {option.text}
                            </p>
                          ))}
                        </div>
                      )}

                      {/* Show correct answer for numerical questions */}
                      {question.type === 'NUMERICAL' && (
                        <p className="text-gray-600 dark:text-gray-300">
                          Answer: {question.correctAnswer} ± {question.tolerance}
                        </p>
                      )}

                      {/* Show keywords for descriptive questions */}
                      {question.type === 'DESCRIPTIVE' && (
                        <p className="text-gray-600 dark:text-gray-300">
                          Keywords: {question.keywords.join(', ')}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-1">
                      <button 
                        onClick={() => handleEditQuestion(question)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteQuestion(question.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div
            className="p-2 mt-2 flex flex-col items-center bg-gray-50 dark:bg-gray-800 rounded-md shadow"
          >
            <ClipboardList size={40} className="mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-300">
              No Questions Added Yet
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              Start adding questions to create your quiz.
            </p>
            <button
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
              onClick={() => setIsDialogOpen(true)}
            >
              Add First Question
            </button>
          </div>
        )}
      </div>

      <AddQuestionDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onSubmit={editingQuestion ? handleUpdateQuestion : handleAddQuestion}
        initialQuestion={editingQuestion}
        mode={editingQuestion ? 'edit' : 'add'}
      />

      {/* Edit Details Dialog */}
      {isEditDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-md w-1/3">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Edit Quiz Details</h2>
            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={quiz.title}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                           bg-white dark:bg-gray-800 
                           text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                           focus:border-transparent outline-none
                           transition-colors duration-200"
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                  Description
                </label>
                <textarea
                  name="description"
                  value={quiz.description}
                  onChange={handleChange}
                  rows={3}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                           bg-white dark:bg-gray-800 
                           text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                           focus:border-transparent outline-none
                           transition-colors duration-200 resize-none"
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                  Time Limit (minutes)
                </label>
                <input
                  type="number"
                  name="timeLimit"
                  value={quiz.timeLimit}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                           bg-white dark:bg-gray-800 
                           text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                           focus:border-transparent outline-none
                           transition-colors duration-200"
                />
              </div>

              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={handleCloseEditDialog}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEditDetails}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={handleCloseImage}
        >
          <button 
            onClick={handleCloseImage}
            className="absolute top-4 right-4 text-white bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-75"
          >
            <X size={24} />
          </button>
          <img
            src={selectedImage}
            alt="Question Full Size"
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}  // Prevent image click from closing
          />
        </div>
      )}

      {/* Remove the bottom buttons Box and replace with empty space */}
      <div className="h-10" /> {/* Spacer at bottom */}
    </div>
  );
}

export default UpdateTest;
