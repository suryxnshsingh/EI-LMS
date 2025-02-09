import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Checkbox,
  IconButton
} from '@mui/material';
import { Plus, Trash, ImagePlus } from 'lucide-react';  // Add ImagePlus icon

const questionTypes = [
  { value: 'SINGLE_MCQ', label: 'Single Choice Question' },
  { value: 'MULTI_MCQ', label: 'Multiple Choice Question' },
  { value: 'NUMERICAL', label: 'Numerical Answer' },
  { value: 'DESCRIPTIVE', label: 'Descriptive Answer' }
  // SIMULATOR type omitted as it's for future use
];

function AddQuestionDialog({ open, onClose, onSubmit, initialQuestion, mode = 'add' }) {
  const theme = useTheme();
  const [selectedImage, setSelectedImage] = useState(null);
  const [question, setQuestion] = useState({
    type: '',
    text: '',
    marks: 1,
    options: [],          // For MCQ types
    correctAnswer: null,  // For NUMERICAL type (as Decimal in DB)
    tolerance: null,      // For NUMERICAL type
    keywords: [],         // For text-based answers
    threshold: null,      // Percentage threshold for full marks
    order: 0,
    imageUrl: null       // Optional image for any question type
  });

  const [inputStyles, setInputStyles] = useState({});

  useEffect(() => {
    setInputStyles({
      '& .MuiInputBase-root': {
        color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000'
      },
      '& label': {
        color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'rgba(0, 0, 0, 0.6)'
      },
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: theme.palette.mode === 'dark' ? '#FFFFFF' : 'rgba(0, 0, 0, 0.23)'
        },
        '&:hover fieldset': {
          borderColor: theme.palette.mode === 'dark' ? '#4dabf5' : 'rgba(0, 0, 0, 0.87)'
        },
        '&.Mui-focused fieldset': {
          borderColor: theme.palette.mode === 'dark' ? '#90caf9' : theme.palette.primary.main
        }
      },
      '& .MuiSelect-icon': {
        color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'rgba(0, 0, 0, 0.54)'
      }
    });
  }, [theme.palette.mode]);

  useEffect(() => {
    if (initialQuestion && open) {
      setQuestion({
        ...initialQuestion,
        keywords: Array.isArray(initialQuestion.keywords) 
          ? initialQuestion.keywords.join(', ')
          : initialQuestion.keywords || ''
      });
    } else if (!open) {
      setQuestion({
        type: '',
        text: '',
        marks: 1,
        options: [],
        correctAnswer: null,
        tolerance: null,
        keywords: [],
        threshold: null,
        order: 0,
        imageUrl: null
      });
      setSelectedImage(null);
    }
  }, [initialQuestion, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestion(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
    }
  };

  const handleSubmit = () => {
    const formData = new FormData();
    
    // Handle special fields first
    if (question.type.includes('MCQ')) {
      formData.append('options', JSON.stringify(question.options));
    }
    
    if (question.type === 'DESCRIPTIVE') {
      const keywordArray = typeof question.keywords === 'string' 
        ? question.keywords.split(',').map(k => k.trim()).filter(k => k)
        : question.keywords;
      formData.append('keywords', JSON.stringify(keywordArray));
    }

    // Add basic fields
    formData.append('type', question.type);
    formData.append('text', question.text);
    formData.append('marks', question.marks);
    formData.append('order', question.order || 0);
    
    // Add conditional fields
    if (question.threshold) formData.append('threshold', question.threshold);
    if (question.correctAnswer) formData.append('correctAnswer', question.correctAnswer);
    if (question.tolerance) formData.append('tolerance', question.tolerance);
    
    // Add image if selected
    if (selectedImage) {
      formData.append('image', selectedImage);
    }

    onSubmit(formData);
    setSelectedImage(null);
    setQuestion({
      type: '',
      text: '',
      marks: 1,
      options: [],
      correctAnswer: '',
      tolerance: 0,
      keywords: [],
      threshold: 0,
      order: 0
    });
  };

  const renderAdditionalFields = () => {
    switch(question.type) {
      case 'SINGLE_MCQ':
      case 'MULTI_MCQ':
        return (
          <Box sx={{ mt: 2 }}>
            {/* MCQ options management */}
            <Typography 
              variant="subtitle2" 
              sx={{ 
                mb: 1, 
                color: theme.palette.mode === 'dark' ? '#FFFFFF' : undefined 
              }}
            >
              Options
            </Typography>
            {question.options.map((option, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  fullWidth
                  label={`Option ${index + 1}`}
                  value={option.text}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  sx={inputStyles}
                />
                <Checkbox
                  checked={option.isCorrect}
                  onChange={(e) => handleCorrectOptionChange(index, e.target.checked)}
                  disabled={question.type === 'SINGLE_MCQ' && 
                          question.options.some((opt, i) => i !== index && opt.isCorrect)}
                />
                <IconButton onClick={() => handleRemoveOption(index)}>
                  <Trash size={20} />  {/* Changed from Trash2 to Trash */}
                </IconButton>
              </Box>
            ))}
            <Button startIcon={<Plus size={18} />} onClick={handleAddOption}>  {/* Added explicit size */}
              Add Option
            </Button>
          </Box>
        );
      
      case 'NUMERICAL':
        return (
          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <TextField
              label="Correct Answer"
              name="correctAnswer"
              type="number"
              value={question.correctAnswer || ''}
              onChange={handleChange}
              fullWidth
              sx={inputStyles}
            />
            <TextField
              label="Tolerance (±)"
              name="tolerance"
              type="number"
              value={question.tolerance || ''}
              onChange={handleChange}
              fullWidth
              sx={inputStyles}
            />
          </Box>
        );
      
      case 'DESCRIPTIVE':
        return (
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Keywords (comma separated)"
              name="keywords"
              value={question.keywords || ''} // Direct value binding
              onChange={handleKeywordsChange}
              helperText="Add keywords for auto-grading (separate with commas)"
              fullWidth
              className="bg-transparent dark:text-white dark:border-gray-200"
              InputProps={{
                className: 'dark:text-white'
              }}
              InputLabelProps={{
                className: 'dark:text-gray-200'
              }}
            />
            <TextField
              label="Threshold (%)"
              name="threshold"
              type="number"
              value={question.threshold || ''}
              onChange={handleChange}
              helperText="Minimum percentage of keywords needed for full marks"
              fullWidth
              sx={inputStyles}
            />
          </Box>
        );
      
      default:
        return null;
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...question.options];
    newOptions[index] = { ...newOptions[index], text: value };
    setQuestion(prev => ({ ...prev, options: newOptions }));
  };

  const handleCorrectOptionChange = (index, isCorrect) => {
    const newOptions = [...question.options];
    if (question.type === 'SINGLE_MCQ') {
      newOptions.forEach((opt, i) => opt.isCorrect = i === index ? isCorrect : false);
    } else {
      newOptions[index] = { ...newOptions[index], isCorrect };
    }
    setQuestion(prev => ({ ...prev, options: newOptions }));
  };

  const handleAddOption = () => {
    setQuestion(prev => ({
      ...prev,
      options: [...prev.options, { text: '', isCorrect: false }]
    }));
  };

  const handleRemoveOption = (index) => {
    setQuestion(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };

  const handleKeywordsChange = (e) => {
    setQuestion(prev => ({
      ...prev,
      keywords: e.target.value  // Store raw string input
    }));
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        className: "dark:bg-gray-800"
      }}
    >
      <DialogTitle className="dark:text-white">
        {mode === 'edit' ? 'Edit Question' : 'Add New Question'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <FormControl fullWidth>
            <InputLabel className="dark:text-white">Question Type</InputLabel>
            <Select
              name="type"
              value={question.type}
              onChange={handleChange}
              label="Question Type"
              className="dark:text-white dark:border-gray-200"
              MenuProps={{
                PaperProps: {
                  className: "dark:bg-gray-800 dark:text-white"
                }
              }}
            >
              {questionTypes.map(type => (
                <MenuItem 
                  key={type.value} 
                  value={type.value}
                  className="dark:text-white dark:hover:bg-gray-700"
                >
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Add image upload button before question text */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              component="label"
              variant="outlined"
              startIcon={<ImagePlus />}
              className="dark:text-white dark:border-gray-200"
            >
              {selectedImage ? 'Change Image' : 'Add Image'}
              <input
                type="file"
                hidden
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleImageChange}
              />
            </Button>
            {selectedImage && (
              <Typography className="dark:text-gray-300">
                {selectedImage.name}
              </Typography>
            )}
          </Box>

          <TextField
            label="Question Text"
            name="text"
            value={question.text}
            onChange={handleChange}
            multiline
            rows={3}
            fullWidth
            className="bg-transparent dark:text-white dark:border-gray-200"
            InputProps={{
              className: 'dark:text-white'
            }}
            InputLabelProps={{
              className: 'dark:text-gray-200'
            }}
          />

          <TextField
            label="Marks"
            name="marks"
            type="number"
            value={question.marks}
            onChange={handleChange}
            fullWidth
            className="bg-transparent dark:text-white dark:border-gray-200"
            InputProps={{
              className: 'dark:text-white'
            }}
            InputLabelProps={{
              className: 'dark:text-gray-200'
            }}
          />

          {renderAdditionalFields()}
        </Box>
      </DialogContent>
      <DialogActions className="dark:bg-gray-800">
        <Button className="dark:text-gray-200" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={!question.type || !question.text}
        >
          {mode === 'edit' ? 'Update Question' : 'Add Question'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddQuestionDialog;
