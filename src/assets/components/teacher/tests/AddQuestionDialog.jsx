"use client"

import { useState, useEffect } from "react"
import { Plus, Trash, ImagePlus, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const questionTypes = [
  { value: "SINGLE_MCQ", label: "Single Choice Question" },
  { value: "MULTI_MCQ", label: "Multiple Choice Question" },
  { value: "NUMERICAL", label: "Numerical Answer" },
  { value: "DESCRIPTIVE", label: "Descriptive Answer" },
]

function AddQuestionDialog({ open, onClose, onSubmit, initialQuestion, mode = "add" }) {
  const [selectedImage, setSelectedImage] = useState(null)
  const [question, setQuestion] = useState({
    type: "SINGLE_MCQ",
    text: "",
    marks: 1,
    options: [],
    correctAnswer: null,
    tolerance: null,
    keywords: [],
    threshold: null,
    order: 0,
    imageUrl: null,
  })

  useEffect(() => {
    if (initialQuestion && open) {
      setQuestion({
        ...initialQuestion,
        keywords: Array.isArray(initialQuestion.keywords)
          ? initialQuestion.keywords.join(", ")
          : initialQuestion.keywords || "",
      })
    } else if (!open) {
      setQuestion({
        type: "SINGLE_MCQ",
        text: "",
        marks: 1,
        options: [],
        correctAnswer: null,
        tolerance: null,
        keywords: [],
        threshold: null,
        order: 0,
        imageUrl: null,
      })
      setSelectedImage(null)
    }
  }, [initialQuestion, open])

  const handleChange = (e) => {
    const { name, value } = e.target
    setQuestion((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0])
    }
  }

  const handleSubmit = () => {
    const formData = new FormData()

    if (question.type.includes("MCQ")) {
      formData.append("options", JSON.stringify(question.options))
    }

    if (question.type === "DESCRIPTIVE") {
      const keywordArray =
        typeof question.keywords === "string"
          ? question.keywords
              .split(",")
              .map((k) => k.trim())
              .filter((k) => k)
          : question.keywords
      formData.append("keywords", JSON.stringify(keywordArray))
    }

    formData.append("type", question.type)
    formData.append("text", question.text)
    formData.append("marks", question.marks)
    formData.append("order", question.order || 0)

    if (question.threshold) formData.append("threshold", question.threshold)
    if (question.correctAnswer) formData.append("correctAnswer", question.correctAnswer)
    if (question.tolerance) formData.append("tolerance", question.tolerance)

    if (selectedImage) {
      formData.append("image", selectedImage)
    }

    onSubmit(formData)
    setSelectedImage(null)
    setQuestion({
      type: "SINGLE_MCQ",
      text: "",
      marks: 1,
      options: [],
      correctAnswer: "",
      tolerance: 0,
      keywords: [],
      threshold: 0,
      order: 0,
    })
  }

  const renderAdditionalFields = () => {
    switch (question.type) {
      case "SINGLE_MCQ":
      case "MULTI_MCQ":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-4 space-y-2"
          >
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Options</label>
            <AnimatePresence>
              {(question.options || []).map((option, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex gap-2 items-center"
                >
                  <input
                    type="checkbox"
                    checked={option.isCorrect}
                    onChange={(e) => handleCorrectOptionChange(index, e.target.checked)}
                    disabled={
                      question.type === "SINGLE_MCQ" && question.options.some((opt, i) => i !== index && opt.isCorrect)
                    }
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600"
                  />
                  <input
                    type="text"
                    placeholder={`Option ${index + 1}`}
                    value={option.text}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                               bg-white dark:bg-neutral-800 text-gray-900 dark:text-white
                               focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                               focus:border-transparent outline-none transition-colors duration-200"
                  />
                  <button
                    onClick={() => handleRemoveOption(index)}
                    className="text-red-500 hover:text-red-700 transition-colors duration-200"
                  >
                    <Trash size={20} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            <button
              onClick={handleAddOption}
              className="flex items-center mt-2 text-blue-500 hover:text-blue-700 transition-colors duration-200"
            >
              <Plus size={18} className="mr-1" />
              Add Option
            </button>
          </motion.div>
        )

      case "NUMERICAL":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-4 space-y-2"
          >
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Correct Answer
                </label>
                <input
                  type="number"
                  placeholder="Correct Answer"
                  name="correctAnswer"
                  value={question.correctAnswer || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                             bg-white dark:bg-neutral-800 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                             focus:border-transparent outline-none transition-colors duration-200"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Tolerance (±)</label>
                <input
                  type="number"
                  placeholder="Tolerance"
                  name="tolerance"
                  value={question.tolerance || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                             bg-white dark:bg-neutral-800 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                             focus:border-transparent outline-none transition-colors duration-200"
                />
              </div>
            </div>
          </motion.div>
        )

      case "DESCRIPTIVE":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-4 space-y-2"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Keywords (comma separated)
              </label>
              <input
                type="text"
                placeholder="Enter keywords..."
                name="keywords"
                value={question.keywords || ""}
                onChange={handleKeywordsChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                           bg-white dark:bg-neutral-800 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                           focus:border-transparent outline-none transition-colors duration-200"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Add keywords for auto-grading (separate with commas)
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Threshold (%)</label>
              <input
                type="number"
                placeholder="Threshold"
                name="threshold"
                value={question.threshold || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                           bg-white dark:bg-neutral-800 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                           focus:border-transparent outline-none transition-colors duration-200"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Minimum percentage of keywords needed for full marks
              </p>
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  const handleOptionChange = (index, value) => {
    const newOptions = [...question.options]
    newOptions[index] = { ...newOptions[index], text: value }
    setQuestion((prev) => ({ ...prev, options: newOptions }))
  }

  const handleCorrectOptionChange = (index, isCorrect) => {
    const newOptions = [...question.options]
    if (question.type === "SINGLE_MCQ") {
      newOptions.forEach((opt, i) => (opt.isCorrect = i === index ? isCorrect : false))
    } else {
      newOptions[index] = { ...newOptions[index], isCorrect }
    }
    setQuestion((prev) => ({ ...prev, options: newOptions }))
  }

  const handleAddOption = () => {
    setQuestion((prev) => ({
      ...prev,
      options: [...(Array.isArray(prev.options) ? prev.options : []), { text: "", isCorrect: false }],
    }))
  }

  const handleRemoveOption = (index) => {
    setQuestion((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }))
  }

  const handleKeywordsChange = (e) => {
    setQuestion((prev) => ({
      ...prev,
      keywords: e.target.value,
    }))
  }

  const isFormValid = () => {
    if (!question.type || !question.text || !question.marks) return false
    if (question.type.includes("MCQ")) {
      const options = question.options || []
      if (options.some(option => !option.text)) return false
      if (!options.some(option => option.isCorrect)) return false
    }
    if (question.type === "NUMERICAL" && (!question.correctAnswer || !question.tolerance)) return false
    if (question.type === "DESCRIPTIVE" && (!question.keywords || !question.threshold)) return false
    return true
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white dark:bg-neutral-800 rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {mode === "edit" ? "Edit Question" : "Add New Question"}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Question Type</label>
                <select
                  name="type"
                  value={question.type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                             bg-white dark:bg-neutral-800 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                             focus:border-transparent outline-none transition-colors duration-200"
                >
                  {questionTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Marks</label>
                  <input
                    type="number"
                    name="marks"
                    value={question.marks}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                               bg-white dark:bg-neutral-800 text-gray-900 dark:text-white
                               focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                               focus:border-transparent outline-none transition-colors duration-200"
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Add Image</label>
                  <div className="relative">
                    <input
                      type="file"
                      id="image-upload"
                      hidden
                      accept="image/jpeg,image/png,image/jpg"
                      onChange={handleImageChange}
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                                 bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-200
                                 hover:bg-gray-50 dark:hover:bg-neutral-700 cursor-pointer
                                 transition-colors duration-200"
                    >
                      <ImagePlus className="mr-2" size={20} />
                      {selectedImage ? "Change Image" : "Add Image"}
                    </label>
                  </div>
                  {selectedImage && (
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 truncate">{selectedImage.name}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Question Text</label>
                <textarea
                  name="text"
                  value={question.text}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                             bg-white dark:bg-neutral-800 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                             focus:border-transparent outline-none transition-colors duration-200 resize-none"
                  placeholder="Enter your question here..."
                />
              </div>

              {renderAdditionalFields()}
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <button
                className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className={`px-4 py-2 rounded-md text-white transition-colors duration-200
                  ${
                    !isFormValid()
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                  }
                `}
                disabled={!isFormValid()}
              >
                {mode === "edit" ? "Update Question" : "Add Question"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AddQuestionDialog
