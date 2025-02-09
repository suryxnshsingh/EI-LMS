import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Box, TextField, Button, Typography, Alert, Paper, useTheme, IconButton, Dialog } from '@mui/material';
import { ClipboardList, Trash2, Edit, X, ArrowLeft } from 'lucide-react';
import AddQuestionDialog from './AddQuestionDialog';

const BASE_URL = `${import.meta.env.VITE_API_URL}`;

function UpdateTest() {
  const theme = useTheme();
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
  const [selectedImage, setSelectedImage] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // null | 'saving' | 'saved' | 'error'

  const textFieldSx = {
    mb: 2,
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderWidth: 1,
        borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
      },
      '&:hover fieldset': {
        borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)',
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.primary.main,
      },
      '& input, & textarea': {
        color: theme.palette.mode === 'dark' ? theme.palette.text.primary : 'inherit',
      }
    },
    '& .MuiInputLabel-root': {
      color: theme.palette.mode === 'dark' ? theme.palette.text.secondary : 'rgba(0, 0, 0, 0.6)',
      '&.Mui-focused': {
        color: theme.palette.primary.main,
      }
    }
  };

  useEffect(() => {
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
      
      handleCloseDialog();
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
          courseIds: quiz.Course?.map(c => c.id) || []
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

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </button>
        <h1 className="text-2xl font-semibold ml-3 dark:text-white">Edit Quiz</h1>
      </div>

      {/* Form Fields */}
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

        {/* Save Changes Button */}
        <div className="flex items-center justify-end mt-4 space-x-2">
          {saveStatus === 'saving' && (
            <span className="text-gray-600 dark:text-gray-400">
              Saving...
            </span>
          )}
          {saveStatus === 'saved' && (
            <span className="text-green-600 dark:text-green-400">
              Changes saved!
            </span>
          )}
          {saveStatus === 'error' && (
            <span className="text-red-600 dark:text-red-400">
              Failed to save
            </span>
          )}
          <button
            onClick={saveChanges}
            disabled={isSaving}
            className={`px-4 py-2 rounded-md text-white transition-colors duration-200
              ${isSaving 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'}
            `}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {quiz.questions?.length > 0 ? (
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" className="dark:text-white">Questions</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setIsDialogOpen(true)}
            >
              Add Question
            </Button>
          </Box>
          
          {/* Questions List */}
          <Box sx={{ mb: 3 }}>
            {quiz.questions.map((question, index) => (
              <Paper 
                key={question.id} 
                className="p-4 mb-3 dark:bg-gray-800 dark:text-white"
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box sx={{ width: '100%' }}>
                    {question.imageUrl && (
                      <Box sx={{ mb: 2, maxWidth: '100%' }}>
                        <img
                          src={`${BASE_URL}${question.imageUrl}`}
                          alt="Question"
                          className="rounded-lg max-h-48 object-contain cursor-pointer hover:opacity-90 transition-opacity"
                          loading="lazy"
                          onClick={() => handleImageClick(`${BASE_URL}${question.imageUrl}`)}
                        />
                      </Box>
                    )}
                    <Typography variant="subtitle1" className="font-medium">
                      {index + 1}. {question.text}
                    </Typography>
                    <Typography variant="body2" className="text-gray-600 dark:text-gray-300">
                      Type: {question.type} • Marks: {question.marks}
                    </Typography>
                    
                    {/* Show options for MCQ questions */}
                    {question.type.includes('MCQ') && question.options && (
                      <Box sx={{ mt: 1, ml: 3 }}>
                        {question.options.map((option, idx) => (
                          <Typography 
                            key={idx} 
                            variant="body2" 
                            className={`${option.isCorrect ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}
                          >
                            {String.fromCharCode(65 + idx)}. {option.text}
                          </Typography>
                        ))}
                      </Box>
                    )}

                    {/* Show correct answer for numerical questions */}
                    {question.type === 'NUMERICAL' && (
                      <Typography variant="body2" className="text-gray-600 dark:text-gray-300">
                        Answer: {question.correctAnswer} ± {question.tolerance}
                      </Typography>
                    )}

                    {/* Show keywords for descriptive questions */}
                    {question.type === 'DESCRIPTIVE' && (
                      <Typography variant="body2" className="text-gray-600 dark:text-gray-300">
                        Keywords: {question.keywords.join(', ')}
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton 
                      onClick={() => handleEditQuestion(question)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Edit size={18} />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleDeleteQuestion(question.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </IconButton>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>
        </Box>
      ) : (
        <Paper
          sx={{
            p: 2,
            mt: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            bgcolor: 'grey.50'
          }}
        >
          <ClipboardList size={40} style={{ marginBottom: 16, color: '#9e9e9e' }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Questions Added Yet
          </Typography>
          <Typography color="text.secondary" align="center">
            Start adding questions to create your quiz.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={() => setIsDialogOpen(true)}
          >
            Add First Question
          </Button>
        </Paper>
      )}

      <AddQuestionDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onSubmit={editingQuestion ? handleUpdateQuestion : handleAddQuestion}
        initialQuestion={editingQuestion}
        mode={editingQuestion ? 'edit' : 'add'}
      />

      {/* Image Modal */}
      <Dialog 
        open={!!selectedImage} 
        onClose={handleCloseImage}
        maxWidth="xl"
        fullWidth
        onClick={handleCloseImage}  // Close on backdrop click
        PaperProps={{
          sx: { 
            bgcolor: 'transparent',
            boxShadow: 'none',
            height: '90vh',
            m: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'  // For positioning close button
          }
        }}
      >
        <IconButton 
          onClick={handleCloseImage}
          sx={{ 
            position: 'absolute',
            top: 16,
            right: 16,
            color: 'white',
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.7)'
            }
          }}
        >
          <X size={24} />
        </IconButton>
        {selectedImage && (
          <img
            src={selectedImage}
            alt="Question Full Size"
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}  // Prevent image click from closing
          />
        )}
      </Dialog>

      {/* Remove the bottom buttons Box and replace with empty space */}
      <Box sx={{ height: 40 }} /> {/* Spacer at bottom */}
    </div>
  );
}

export default UpdateTest;
