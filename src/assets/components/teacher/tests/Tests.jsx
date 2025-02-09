import React, { useState, useEffect } from 'react';
import { Box, Button, Card, CardContent, Typography, IconButton, Chip, Dialog,
         TextField, Stack, FormControl, InputLabel, Select, MenuItem, Tooltip,
         Skeleton, Paper, Divider, Alert } from '@mui/material';
import { Plus, Pencil, Trash2, Clock, Book } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useTheme } from '@mui/material/styles';

const BASE_URL = 'http://localhost:8080';

const Tests = () => {
  const theme = useTheme();
  console.log("Current theme mode in Tests:", theme.palette.mode); // <-- Debug log

  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);  // Initialize as empty array
  const [courses, setCourses] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(true);  // Add loading state
  const [error, setError] = useState(null);      // Add error state
  const [openDialog, setOpenDialog] = useState(false);
  const [newQuiz, setNewQuiz] = useState({
    title: '',
    description: '',
    timeLimit: 30,
    courseIds: []
  });

  const initialTheme = Cookies.get("theme") || (document.documentElement.classList.contains("dark") ? "dark" : "light");
  const [localTheme, setLocalTheme] = useState(initialTheme);
  
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setLocalTheme(Cookies.get("theme") || (document.documentElement.classList.contains("dark") ? "dark" : "light"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/quiz/teacher/my-quizzes`, {
        headers: { Authorization: `Bearer ${Cookies.get("token")}` }
      });
      setQuizzes(response.data || []); // Ensure we always set an array
      setError(null);
    } catch (error) {
      console.error('Failed to fetch quizzes:', error);
      setError('Failed to load quizzes');
      setQuizzes([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/courses/teacher-courses`, {
        headers: { Authorization: `Bearer ${Cookies.get("token")}` }
      });
      console.log('Courses:', response.data);
      setCourses(Array.isArray(response.data) ? response.data : []); // Ensure it's an array
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      setCourses([]); // Reset to empty array on error
    }
  };

  useEffect(() => {
    fetchQuizzes();
    fetchCourses();
  }, []);

  const handleCreateQuiz = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Sending request with token:', token);
      console.log('Quiz data:', newQuiz);

      const response = await axios.post(
        `${BASE_URL}/api/quiz/teacher`, 
        newQuiz,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Quiz created:', response.data);
      setOpenDialog(false);
      setNewQuiz({ title: '', description: '', timeLimit: 30, courseIds: [] });
      fetchQuizzes();
    } catch (error) {
      console.error('Failed to create quiz:', error.response?.data || error.message);
      setError(error.response?.data?.error || 'Failed to create quiz');
    }
  };

  const handleToggleStatus = async (quizId, currentStatus) => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        throw new Error('No authentication token found');
      }

      await axios.patch(
        `${BASE_URL}/api/quiz/teacher/${quizId}/toggle-status`,
        {}, // empty body for PATCH request
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      fetchQuizzes(); // Refresh the quiz list
    } catch (error) {
      console.error('Failed to toggle quiz status:', error.response?.data || error.message);
      setError(error.response?.data?.error || 'Failed to toggle quiz status');
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        const token = Cookies.get("token");
        if (!token) {
          throw new Error('No authentication token found');
        }

        await axios.delete(
          `${BASE_URL}/api/quiz/teacher/${quizId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        fetchQuizzes(); // Refresh the list after successful deletion
      } catch (error) {
        console.error('Failed to delete quiz:', error.response?.data || error.message);
        setError(error.response?.data?.error || 'Failed to delete quiz');
      }
    }
  };

  const getCoursesDisplay = (courses) => {
    if (!courses || courses.length === 0) return 'No courses';
    if (courses.length === 1) return courses[0].name;
    return `${courses[0].name} +${courses.length - 1}`;
  };

  const LoadingSkeleton = () => {
    const skeletonDarkStyle = localTheme === 'dark' ? { bgcolor: '#3F3F46' } : {};
    return (
      <Box sx={{ 
        display: 'grid', 
        gap: 3, 
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(auto-fill, minmax(280px, 1fr))',
        },
        maxWidth: '1800px',
        mx: 'auto',
      }}>
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <Card key={n} sx={{
            borderRadius: 2,
            bgcolor: localTheme==='dark'? '#18181B' : 'background.default',
            border: 1,
            borderColor: 'divider'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Skeleton variant="text" sx={{ fontSize: '1.25rem', width: '70%', mb: 1, ...skeletonDarkStyle }} />
              <Skeleton variant="text" sx={{ fontSize: '0.875rem', width: '90%', mb: 2, ...skeletonDarkStyle }} />
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Skeleton variant="rounded" width={100} height={24} sx={skeletonDarkStyle} />
                <Skeleton variant="rounded" width={120} height={24} sx={skeletonDarkStyle} />
              </Box>
              <Skeleton variant="rectangular" height={1} sx={{ mb: 2, ...skeletonDarkStyle }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Skeleton variant="rounded" width={80} height={32} sx={skeletonDarkStyle} />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Skeleton variant="circular" width={32} height={32} sx={skeletonDarkStyle} />
                  <Skeleton variant="circular" width={32} height={32} sx={skeletonDarkStyle} />
                </Box>
              </Box> {/* Added missing closing tag for Box */}
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  };

  return (
    <Box sx={{ 
      p: 4, 
      width: { xs: '100%', md: 'calc(100vw - 240px)' }, // Limit width based on sidebar
      mx: 'auto',
      position: 'relative'
    }}>
      {/* Create Quiz button */}
      <Box sx={{ position: 'absolute', top: 16, right: 32 }}>
        <Tooltip title="Create a new quiz" arrow>
          <Button
            variant="contained"
            startIcon={<Plus size={20} />}
            onClick={() => setOpenDialog(true)}
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Create New Quiz
          </Button>
        </Tooltip>
      </Box>

      {/* Centered heading */}
      <Typography 
        variant="h4" 
        sx={{ 
          fontWeight: 'bold', 
          color: localTheme==='dark'?'#FFFFFF':'#000000',
          textAlign: 'center',
          mb: 4
        }}
      >
        My Quizzes
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3, maxWidth: '1400px', mx: 'auto' }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <Box className="grid gap-3 grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] max-w-[1800px] mx-auto">
          {Array.isArray(quizzes) && quizzes.map((quiz) => (
            <Card key={quiz.id} sx={{
              borderRadius: 2,
              bgcolor: localTheme === 'dark' ? '#18181B' : 'background.default',
              border: 1,
              borderColor: 'divider',
              transition: 'all 0.3s ease',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: 3 }
            }}>
              <CardContent sx={{ p: 3 }}>
                {/* ...existing quiz card content... */}
                <div className="mb-2">
                  <h6 className="font-bold text-2xl my-1 dark:text-white">{quiz.title}</h6>
                  <p className="text-md text-gray-600 dark:text-gray-300 mb-2">{quiz.description}</p>
                </div>
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  <Chip
                    icon={<Clock size={16} />}
                    label={`${quiz.timeLimit} mins`}
                    size="small"
                    variant="outlined"
                    sx={ localTheme === 'dark'
                      ? { color: '#fff', borderColor: '#aaa', px: 1, py: 0.5, m: 0.5 }
                      : { px: 1, py: 0.5, m: 0.5 }
                    }
                  />
                  <Tooltip title={quiz.Course?.map(c => c.name).join(', ')} arrow>
                    <Chip
                      icon={<Book size={16} />}
                      label={getCoursesDisplay(quiz.Course)}
                      size="small"
                      variant="outlined"
                      sx={ localTheme === 'dark'
                        ? { color: '#fff', borderColor: '#aaa', px: 1, py: 0.5, m: 0.5 }
                        : { px: 1, py: 0.5, m: 0.5 }
                      }
                    />
                  </Tooltip>
                </Stack>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Tooltip title={`Click to ${quiz.isActive ? 'deactivate' : 'activate'}`} arrow>
                    <Chip
                      label={quiz.isActive ? 'Active' : 'Inactive'}
                      color={quiz.isActive ? 'success' : 'default'}
                      onClick={() => handleToggleStatus(quiz.id, quiz.isActive)}
                      sx={{ 
                        cursor: 'pointer', 
                        transition: 'all 0.2s ease',
                        ...(localTheme === 'dark' && { color: '#fff' })
                      }}
                    />
                  </Tooltip>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Delete quiz" arrow>
                      <IconButton onClick={() => handleDeleteQuiz(quiz.id)} color="error" size="small">
                        <Trash2 size={18} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit quiz" arrow>
                      <IconButton onClick={() => navigate(`/teacher/test/${quiz.id}`)} color="primary" size="small">
                        <Pencil size={18} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {!loading && Array.isArray(quizzes) && quizzes.length === 0 && (
        <Box sx={{ 
          p: 4, 
          textAlign: 'center',
          bgcolor: localTheme === 'dark' ? 'gray.900' : 'background.default', // Updated card color in dark mode
          borderRadius: 2,
          // Removed border and borderColor properties
          maxWidth: '600px',
          mx: 'auto'
        }}>
          <Typography 
            variant="h6" 
            color={localTheme === 'dark' ? 'gray.100' : 'text.secondary'} // Updated text color in dark mode
          >
            No quizzes available
          </Typography>
          <Typography 
            variant="body2" 
            color={localTheme === 'dark' ? 'gray.100' : 'text.secondary'} 
            sx={{ mt: 1 }}
          >
            Create your first quiz by clicking the 'Create New Quiz' button
          </Typography>
        </Box>
      )}

      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'background.default',
            backgroundImage: 'none'
          }
        }}
      >
        <Box sx={{ 
          p: 4,
          bgcolor: 'background.default',
          color: 'text.primary'
        }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3 }}>
            Create New Quiz
          </Typography>
          <Stack spacing={3}>
            <TextField
              label="Title"
              value={newQuiz.title}
              onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
              fullWidth
            />
            <TextField
              label="Description"
              value={newQuiz.description}
              onChange={(e) => setNewQuiz({ ...newQuiz, description: e.target.value })}
              multiline
              rows={3}
              fullWidth
            />
            <TextField
              label="Time Limit (minutes)"
              type="number"
              value={newQuiz.timeLimit}
              onChange={(e) => setNewQuiz({ ...newQuiz, timeLimit: parseInt(e.target.value) })}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel id="course-select-label">Assign to Courses</InputLabel>
              <Select
                labelId="course-select-label"
                multiple
                value={newQuiz.courseIds}
                onChange={(e) => setNewQuiz({ ...newQuiz, courseIds: e.target.value })}
                renderValue={(selected) => {
                  if (selected.length === 0) {
                    return "";  // Return empty string so that the label is visible
                  }
                  return (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map(courseId => (
                        <Chip 
                          key={courseId} 
                          label={
                            // Show course name and additional details for selected courses
                            (() => {
                              const course = courses.find(c => c.id === courseId);
                              return course ? `${course.name} (${course.courseCode} | ${course.session} | ${course.semester})` : courseId;
                            })()
                          }
                          sx={{ m: 0.5, px: 1, py: 0.5 }} // Added margins and paddings
                        />
                      ))}
                    </Box>
                  );
                }}
              >
                {Array.isArray(courses) && courses.length === 0 ? (
                  <MenuItem disabled value="">
                    No courses available
                  </MenuItem>
                ) : (
                  courses.map(course => (
                    <MenuItem key={course.id} value={course.id}>
                      {/* Display detailed info about each course */}
                      <Box>
                        <Typography variant="subtitle1">{course.name}</Typography>
                        <Typography variant="caption">
                          {course.courseCode} | Session : {course.session} | Semester : {course.semester}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
              <Button 
                onClick={() => setOpenDialog(false)}
                sx={{ borderRadius: 2, textTransform: 'none' }}
              >
                Cancel
              </Button>
              <Button 
                variant="contained" 
                onClick={handleCreateQuiz}
                sx={{ borderRadius: 2, textTransform: 'none' }}
              >
                Create Quiz
              </Button>
            </Box>
          </Stack>
        </Box>
      </Dialog>
    </Box>
  );
};

export default Tests;