import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ArrowLeft, Edit, Trash2, ClipboardList, X, Settings, ClipboardPlus, CheckCircle, Loader2 } from 'lucide-react';
import AddQuestionDialog from './AddQuestionDialog';

const BASE_URL = `${import.meta.env.VITE_API_URL}`;

function UpdateTest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState({ 
    title: '', 
    description: '', 
    timeLimit: 30,
    maxMarks: 0,
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

  // Move fetchQuiz to component scope
  const fetchQuiz = async () => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get(`${BASE_URL}/api/quiz/teacher/my-quizzes`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      
      // Find the specific quiz from all quizzes
      const quizData = response.data.find(q => q.id === id);
      if (!quizData) {
        throw new Error('Quiz not found');
      }
      
      setQuiz(quizData);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch quiz:', err);
      setError('Failed to load quiz');
      navigate('/teachers/tests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, [id, navigate]);

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
          maxMarks: parseFloat(quiz.maxMarks),
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
          maxMarks: parseFloat(quiz.maxMarks),
          courseIds: quiz.Course ? quiz.Course.map(c => c.id) : [],
          scheduledFor: quiz.scheduledFor  // New field added
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setQuiz(response.data);
      setIsEditDialogOpen(false);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(null), 2000);
      fetchQuiz();
    } catch (err) {
      console.error('Failed to save changes:', err);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="animate-spin w-10 h-10 text-gray-600 dark:text-gray-300" />
    </div>
  );

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
          <button
            className="ml-auto p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            onClick={handleEditDetails}
          >
            <Settings className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        <div className="p-6 bg-white dark:bg-neutral-800 rounded-lg border border-gray-300 dark:border-neutral-600 shadow-md mb-6">
          <div className="space-y-4">
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                Title
              </label>
              <p className="text-gray-900 dark:text-white">{quiz.title}</p>
            </div>

            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                Description
              </label>
              <p className="text-gray-900 dark:text-white">{quiz.description}</p>
            </div>

            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                Time Limit (minutes)
              </label>
              <p className="text-gray-900 dark:text-white">{quiz.timeLimit}</p>
            </div>

            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                Maximum Marks
              </label>
              <p className="text-gray-900 dark:text-white">{quiz.maxMarks}</p>
            </div>

            {/* Additional Quiz Details */}
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                Course
              </label>
              <p className="text-gray-900 dark:text-white">
                {quiz.Course?.map(c => c.name).join(', ') || 'N/A'}
              </p>
            </div>

            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                Created By
              </label>
              <p className="text-gray-900 dark:text-white">
                {`${teacherFname} ${teacherLname}` || 'N/A'}
              </p>
            </div>

            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                Scheduled For
              </label>
              <p className="text-gray-900 dark:text-white">
                {quiz.scheduledFor ? new Date(quiz.scheduledFor).toLocaleString() : 'Not scheduled'}
              </p>
            </div>

            {/* New Card for Questions Count and Total Marks */}
            <div className=" mb-6">
                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Number of Questions
                  </label>
                  <p className="text-gray-900 dark:text-white">{quiz.questions?.length || 0}</p>
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total Marks
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {quiz.questions?.reduce((total, question) => total + question.marks, 0) || 0}
                  </p>
                </div>
            </div>

            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                Status
              </label>
              <p className={`text-${quiz.isActive ? 'green' : 'red'}-600 dark:text-${quiz.isActive ? 'green' : 'red'}-400`}>
                {quiz.isActive ? 'Active' : 'Inactive'}
              </p>
            </div>

            {/* Add Question Button */}
            <div className="flex justify-center mt-4">
              <button
                className="flex items-center justify-center w-full px-3 py-2 text-lg  text-white border-2 border-neutral-200 dark:border-neutral-700 rounded-md bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-indigo-500 hover:to-violet-500 transition-colors duration-800"
                onClick={() => setIsDialogOpen(true)}
              >
                <ClipboardPlus size={24} className="mr-2" />
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
                  className="p-6 mb-4 bg-white dark:bg-neutral-800 dark:text-white rounded-lg shadow-lg border border-gray-200 dark:border-neutral-700 flex hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="w-3/4">
                    <div className="flex items-center mb-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {question.type}
                      </span>
                      <span className="ml-2 px-2 py-1 bg-green-100 text-green-900 text-xs rounded-full">
                        Marks: {question.marks}
                      </span>
                    </div>
                    <h3 className="font-medium text-xl mb-2">
                      {index + 1}. {question.text}
                    </h3>
                    
                    {/* Show options for MCQ questions */}
                    {question.type.includes('MCQ') && question.options && (
                      <div className="mt-1 ml-3">
                        {question.options.map((option, idx) => (
                          <p 
                            key={idx} 
                            className={`flex items-center ${option.isCorrect ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'} text-lg`}
                          >
                            <span className="mr-2">{String.fromCharCode(65 + idx)}.</span> 
                            <span>{option.text}</span>
                            {option.isCorrect && <CheckCircle className="ml-2 text-green-600 dark:text-green-400" size={16} />}
                          </p>
                        ))}
                      </div>
                    )}

                    {/* Show correct answer for numerical questions */}
                    {question.type === 'NUMERICAL' && (
                      <p className="flex gap-2 text-gray-600 dark:text-gray-300 text-lg">
                        Ans:&nbsp;
                        <span className="text-green-600 dark:text-green-400 text-lg">
                          {question.correctAnswer}
                        </span>
                        &nbsp;± {question.tolerance}
                      </p>
                    )}

                    {/* Show keywords for descriptive questions */}
                    {question.type === 'DESCRIPTIVE' && (
                      <p className="text-gray-600 dark:text-gray-300 text-lg">
                        Keywords: {question.keywords.join(', ')}
                      </p>
                    )}
                  </div>

                  {question.imageUrl && (
                    <div className="w-1/4 ml-4">
                      <img
                        src={`${BASE_URL}${question.imageUrl}`}
                        alt="Question"
                        className="rounded-lg max-h-48 object-contain cursor-pointer hover:opacity-90 transition-opacity"
                        loading="lazy"
                        onClick={() => handleImageClick(`${BASE_URL}${question.imageUrl}`)}
                      />
                    </div>
                  )}

                  <div className="flex gap-2 ml-auto">
                    <button 
                      onClick={() => handleEditQuestion(question)}
                      className="text-blue-500 hover:text-blue-700 hover:dark:text-blue-400 p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-950 transition-colors duration-300"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDeleteQuestion(question.id)}
                      className="text-red-500 hover:text-red-700 hover:dark:text-red-400 p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-950 transition-colors duration-300"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div
            className="p-2 mt-2 flex flex-col justify-center items-center h-[85svh] gap-2 rounded-md shadow"
          >
            <ClipboardList size={50} className="mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-300">
              No Questions Added Yet
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              Start adding questions to create your quiz.
            </p>
            <button
              className="mt-2 px-4 p-2 text-2xl  text-white border-2 border-neutral-200 dark:border-neutral-700 rounded-md bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-indigo-500 hover:to-violet-500 transition-colors duration-800"
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
          <div className="bg-white dark:bg-neutral-800 p-6 rounded-md shadow-md w-1/3">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Edit Quiz Details</h2>
            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={quiz.title || ''}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                           bg-white dark:bg-neutral-800 
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
                  value={quiz.description || ''}
                  onChange={handleChange}
                  rows={3}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                           bg-white dark:bg-neutral-800 
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
                  value={quiz.timeLimit || ''}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                           bg-white dark:bg-neutral-800 
                           text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                           focus:border-transparent outline-none
                           transition-colors duration-200"
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                  Maximum Marks
                </label>
                <input
                  type="number"
                  name="maxMarks"
                  value={quiz.maxMarks || ''}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                           bg-white dark:bg-neutral-800 
                           text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                           focus:border-transparent outline-none
                           transition-colors duration-200"
                />
              </div>

              {/* NEW: Scheduled For input */}
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                  Scheduled For
                </label>
                <input
                  type="datetime-local"
                  name="scheduledFor"
                  value={quiz.scheduledFor ? new Date(quiz.scheduledFor).toISOString().slice(0,16) : ''}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                           bg-white dark:bg-neutral-800 
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