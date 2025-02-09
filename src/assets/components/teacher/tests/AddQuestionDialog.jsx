import React, { useState, useEffect } from 'react';
import { Plus, Trash, ImagePlus } from 'lucide-react';  // Add ImagePlus icon

const questionTypes = [
  { value: 'SINGLE_MCQ', label: 'Single Choice Question' },
  { value: 'MULTI_MCQ', label: 'Multiple Choice Question' },
  { value: 'NUMERICAL', label: 'Numerical Answer' },
  { value: 'DESCRIPTIVE', label: 'Descriptive Answer' }
  // SIMULATOR type omitted as it's for future use
];

function AddQuestionDialog({ open, onClose, onSubmit, initialQuestion, mode = 'add' }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [question, setQuestion] = useState({
    type: 'SINGLE_MCQ',  // Default to Single Choice Question
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
        type: 'SINGLE_MCQ',  // Default to Single Choice Question
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
          <div className="mt-2">
            {/* MCQ options management */}
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
              Options
            </label>
            {question.options.map((option, index) => (
              <div key={index} className="flex gap-1 mb-1 items-center">
                <input
                  type="checkbox"
                  checked={option.isCorrect}
                  onChange={(e) => handleCorrectOptionChange(index, e.target.checked)}
                  disabled={question.type === 'SINGLE_MCQ' && 
                          question.options.some((opt, i) => i !== index && opt.isCorrect)}
                  className="w-6 h-6 text-green-600 bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                />
                <input
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  value={option.text}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                             bg-white dark:bg-neutral-800 
                             text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                             focus:border-transparent outline-none
                             transition-colors duration-200"
                />
                <button onClick={() => handleRemoveOption(index)} className="text-red-500 hover:text-red-700">
                  <Trash size={20} />
                </button>
              </div>
            ))}
            <button onClick={handleAddOption} className="flex items-center mt-2 text-blue-500 hover:text-blue-700">
              <Plus size={18} className="mr-1" />
              Add Option
            </button>
          </div>
        );
      
      case 'NUMERICAL':
        return (
          <div className="mt-2 flex gap-2">
            <input
              type="number"
              placeholder="Correct Answer"
              name="correctAnswer"
              value={question.correctAnswer || ''}
              onChange={handleChange}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                         bg-white dark:bg-neutral-800 
                         text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                         focus:border-transparent outline-none
                         transition-colors duration-200"
            />
            <input
              type="number"
              placeholder="Tolerance (±)"
              name="tolerance"
              value={question.tolerance || ''}
              onChange={handleChange}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                         bg-white dark:bg-neutral-800 
                         text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                         focus:border-transparent outline-none
                         transition-colors duration-200"
            />
          </div>
        );
      
      case 'DESCRIPTIVE':
        return (
          <div className="mt-2 flex flex-col gap-2">
            <input
              type="text"
              placeholder="Keywords (comma separated)"
              name="keywords"
              value={question.keywords || ''} // Direct value binding
              onChange={handleKeywordsChange}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                         bg-white dark:bg-neutral-800 
                         text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                         focus:border-transparent outline-none
                         transition-colors duration-200"
            />
            <small className="text-gray-600 dark:text-gray-300">
              Add keywords for auto-grading (separate with commas)
            </small>
            <input
              type="number"
              placeholder="Threshold (%)"
              name="threshold"
              value={question.threshold || ''}
              onChange={handleChange}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                         bg-white dark:bg-neutral-800 
                         text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                         focus:border-transparent outline-none
                         transition-colors duration-200"
            />
            <small className="text-gray-600 dark:text-gray-300">
              Minimum percentage of keywords needed for full marks
            </small>
          </div>
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
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${open ? '' : 'hidden'}`}>
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-neutral-800 rounded-lg shadow-lg max-w-lg w-full p-6 max-h-[80vh] overflow-y-auto">
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 w-full max-w-3xl">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              {mode === 'edit' ? 'Edit Question' : 'Add New Question'}
            </h2>
            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                  Question Type
                </label>
                <select
                  name="type"
                  value={question.type}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                             bg-white dark:bg-neutral-800 
                             text-gray-900 dark:text-white
                             transition-colors duration-200"
                >
                  {questionTypes.map(type => (
                    <option key={type.value} value={type.value} className="dark:text-white dark:bg-neutral-800">
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <div className="flex flex-col flex-1">
                  <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                    Marks
                  </label>
                  <input
                    type="number"
                    name="marks"
                    value={question.marks}
                    onChange={handleChange}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                               bg-white dark:bg-neutral-800 
                               text-gray-900 dark:text-white
                               focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                               focus:border-transparent outline-none
                               transition-colors duration-200"
                  />
                </div>

                <div className="flex flex-col flex-1">
                  <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                    Add Image
                  </label>
                  <button
                    className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                               bg-white dark:bg-neutral-800 
                               text-gray-900 dark:text-white
                               hover:bg-gray-100 dark:hover:bg-neutral-700
                               transition-colors duration-200"
                    onClick={() => document.getElementById('image-upload').click()}
                  >
                    <ImagePlus className="mr-2" />
                    {selectedImage ? 'Change Image' : 'Add Image'}
                  </button>
                  <input
                    type="file"
                    id="image-upload"
                    hidden
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={handleImageChange}
                  />
                  {selectedImage && (
                    <span className="text-gray-600 dark:text-gray-300">
                      {selectedImage.name}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                  Question Text
                </label>
                <textarea
                  name="text"
                  value={question.text}
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

              {renderAdditionalFields()}
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <button className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md" onClick={onClose}>
                Cancel
              </button>
              <button 
                onClick={handleSubmit} 
                className={`px-4 py-2 rounded-md text-white transition-colors duration-200
                  ${!question.type || !question.text 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'}
                `}
                disabled={!question.type || !question.text}
              >
                {mode === 'edit' ? 'Update Question' : 'Add Question'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddQuestionDialog;
