import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Pencil, Users, BookPlus, Loader2 } from 'lucide-react';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

const BASE_URL = `${import.meta.env.VITE_API_URL}`;

const ManageCourses = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null); 
  const [editingCourse, setEditingCourse] = useState(null);
  const [create, setCreate] = useState(false);

const teacherData = {
  firstName: Cookies.get('firstName'),
  lastName: Cookies.get('lastName'),
};

const fetchCourses = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/courses/teacher-courses`, {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`
      }
    });
    setSubjects(response.data);
    setLoading(false);
  } catch (err) {
    console.error('Error details:', err.response?.data || err);
    setError(err.response?.data?.message || "Failed to fetch courses");
    toast.error(err.response?.data?.message || "Failed to fetch courses");
    setLoading(false);
  }
};

const handleDeleteCourse = async (courseId) => {
  if (!window.confirm('Are you sure you want to delete this course?')) {
    return;
  }

  setDeleteLoading(courseId);
  try {
    await axios.delete(`${BASE_URL}/api/courses/courses/${courseId}`, {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`
      }
    });

    // Fetch updated courses after deletion
    toast.success('Course deleted successfully');
    await fetchCourses();
    
  } catch (err) {
    console.error('Error deleting course:', err);
    alert(err.response?.data?.message || 'Failed to delete course');
    toast.error(err.response?.data?.message || 'Failed to delete course');
  } finally {
    setDeleteLoading(null);
  }
};

const handleEditCourse = (course) => {
  setEditingCourse(course);
};

useEffect(() => {
  fetchCourses();
}, []);

if (loading) {
  return (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-gray-900 dark:text-white" />
    </div>
  );
}
if (error) return <div>Error: {error}</div>;

return (
  <div className='p-5 md:p-10 w-full mr-0 md:mr-16'>
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start">
        <div>
          <h1 className="text-4xl font-semibold text-gray-900 dark:text-white mb-2">
            Welcome, {teacherData.firstName} {teacherData.lastName} !
          </h1>
          <div className="space-y-1">
            <p className="text-gray-600 dark:text-gray-300 text-xl">
              Total Courses: {subjects.length}
            </p>
          </div>
        </div>
        <button
          onClick={() => setCreate(true)}
          className="mt-4 md:mt-0 px-4 py-2 text-xl text-white border-2 border-neutral-200 dark:border-neutral-700 rounded-md bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-indigo-500 hover:to-violet-500 transition-colors duration-800"
        >
          <div className='flex items-center'><BookPlus className='mr-2' />Create New Course</div>
        </button>
      </div>

            {/* Courses Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6">
      {subjects.map((subject) => (
        <div
          key={subject.id}
          className="bg-gray-50 dark:bg-neutral-800 border-[1px] border-neutral-200 dark:border-neutral-700 rounded-md p-6 shadow-lg hover:shadow-xl transition duration-300"
        > 
          <p className="text-gray-600 dark:text-gray-300 text-xl ">
              {subject.courseCode}
            </p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {subject.name}
          </h3>
          <div className="space-y-2">
            <div className='flex justify-between text-lg'>
            <p className="text-gray-600 dark:text-gray-300 ">
              Semester:{subject.semester}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
            {subject.session}
            </p>
            </div>
            <div className='py-2'></div>
            <div className='flex items-center gap-2 border text-black dark:text-white border-gray-300 font-regular py-2 px-4 rounded-md transition duration-300'>
                  <Users className="w-4 h-4" />Enrolled Students: {subject._count.enrollments}
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <button 
              className="flex items-center gap-2 border-[1px] bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-md transition duration-300"
              onClick={() => handleEditCourse(subject)}
            >
              <Pencil className="w-4 h-4" />
              Edit Course
            </button>

            <button 
              className={`flex items-center gap-2 border-[1px] bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded-md transition duration-300 ${
                deleteLoading === subject.id ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={() => handleDeleteCourse(subject.id)}
              disabled={deleteLoading === subject.id}
            >
              <Trash2 className="w-4 h-4" />
              {deleteLoading === subject.id ? 'Deleting...' : 'Delete Course'}
            </button>
          </div>
        </div>
      ))}
    </div>

    {/* Edit Course Modal */}
    {editingCourse && (
      <EditCourse 
        course={editingCourse} 
        onClose={() => setEditingCourse(null)}
        onSuccess={async () => {
          setEditingCourse(null);
          await fetchCourses();
        }}
      />
    )}

    {/* Create Course Modal */}
    {create && (
      <CreateCourse 
        create={create} 
        setCreate={setCreate} 
        onSuccess={async () => {
          setCreate(false);
          await fetchCourses();
        }}
      />
    )}
  </div>
)
}

// Edit Course Component
const EditCourse = ({ course, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: course.name,
    code: course.courseCode,
    session: course.session,
    semester: course.semester
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.put(`${BASE_URL}/api/courses/courses/${course.id}`,
        {
          name: formData.name,
          courseCode: formData.code,
          session: formData.session,
          semester: formData.semester
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Cookies.get('token')}`
          }
        }
      );

      console.log('Course updated:', response.data);
      setSuccess("Course updated successfully");
      toast.success('Course updated successfully');
      setTimeout(() => {
        onSuccess();
      }, 1000);

    } catch (error) {
      console.error('Error:', error);
      setError(error.response?.data?.message || 'Failed to update course. Please try again.');
    }
  };

  return (
    <div className="fixed h-full w-full top-0 left-0 flex items-center justify-center rounded-tl-2xl z-50 poppins-regular backdrop-brightness-50 dark:backdrop-brightness-50 backdrop-blur-sm">
      <form className="max-w-md bg-white dark:bg-neutral-950 rounded-xl mx-4 p-2 w-full md:w-1/3 h-auto border-2 border-neutral-300 dark:border-neutral-700" onSubmit={handleSubmit}>
        <div className="p-4">
          <div 
            className="flex justify-end text-white cursor-pointer"
            onClick={onClose}
          >❌</div>
          
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="name"
              className="block py-2.5 px-0 w-full text-lg text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text:white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
              placeholder=" "
              value={formData.name}
              onChange={handleChange}
              required
            />
            <label className="peer-focus:font-medium absolute text-lg text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Course Name
            </label>
          </div>

          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="code"
              className="block py-2.5 px-0 w-full text-lg text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text:white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
              placeholder=" "
              value={formData.code}
              onChange={handleChange}
              required
            />
            <label className="peer-focus:font-medium absolute text-lg text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Course Code
            </label>
          </div>

          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="session"
              className="block py-2.5 px-0 w-full text-lg text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text:white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
              placeholder=" "
              value={formData.session}
              onChange={handleChange}
              required
            />
            <label className="peer-focus:font-medium absolute text-lg text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Session (Ex. : 2024-25)
            </label>
          </div>

          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="semester"
              className="block py-2.5 px-0 w-full text-lg text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text:white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
              placeholder=" "
              value={formData.semester}
              onChange={handleChange}
              required
            />
            <label className="peer-focus:font-medium absolute text-lg text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Semester (Ex. : 1-8)
            </label>
          </div>

          {error && <div className="text-red-500 mb-3">{error}</div>}
          {success && <div className="text-green-500 mb-3">{success}</div>}
          
          <button
            type="submit"
            className="text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-lg w-full sm:w-auto px-5 py-2.5 mt-5 text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800"
          >
            Update Course
          </button>
        </div>
      </form>
    </div>
  );
};

// Add CreateCourse component
const CreateCourse = ({ create, setCreate, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    session: '',
    semester: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsCreating(true);

    try {
      await axios.post(
        `${BASE_URL}/api/courses/courses`,
        {
          name: formData.name,
          courseCode: formData.code,
          session: formData.session,
          semester: formData.semester
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Cookies.get('token')}`
          }
        }
      );

      setSuccess("Course created successfully");
      toast.success('Course created successfully');
      setTimeout(() => {
        onSuccess();
      }, 1000);

    } catch (error) {
      console.error('Error:', error);
      setError(error.response?.data?.message || 'Failed to create course. Please try again.');
      toast.error(error.response?.data?.message || 'Failed to create course. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed h-full w-full top-0 left-0 flex items-center justify-center rounded-tl-2xl z-50 poppins-regular backdrop-brightness-50 dark:backdrop-brightness-50 backdrop-blur-sm">
      <form className="max-w-md bg-white dark:bg-neutral-950 rounded-xl mx-4 p-2 w-full md:w-1/3 h-auto border-2 border-neutral-300 dark:border-neutral-700" onSubmit={handleSubmit}>
        <div className="p-4">
          <div 
            className="flex justify-end text-white cursor-pointer"
            onClick={() => setCreate(false)}
          >❌</div>
          
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="name"
              className="block py-2.5 px-0 w-full text-lg text-gray-900 dark:text-gray-200 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text:white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
              placeholder=" "
              value={formData.name}
              onChange={handleChange}
              required
            />
            <label className="peer-focus:font-medium absolute text-lg text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Course Name
            </label>
          </div>

          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="code"
              className="block py-2.5 px-0 w-full text-lg text-gray-900 dark:text-gray-200 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text:white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
              placeholder=" "
              value={formData.code}
              onChange={handleChange}
              required
            />
            <label className="peer-focus:font-medium absolute text-lg text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Course Code
            </label>
          </div>

          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="session"
              className="block py-2.5 px-0 w-full text-lg text-gray-900 dark:text-gray-200 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text:white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
              placeholder=" "
              value={formData.session}
              onChange={handleChange}
              required
            />
            <label className="peer-focus:font-medium absolute text-lg text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Session (Ex. : 2024-25)
            </label>
          </div>

          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="semester"
              className="block py-2.5 px-0 w-full text-lg text-gray-900 dark:text-gray-200 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text:white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
              placeholder=" "
              value={formData.semester}
              onChange={handleChange}
              required
            />
            <label className="peer-focus:font-medium absolute text-lg text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Semester (Ex. : 1-8)
            </label>
          </div>

          {error && <div className="text-red-500 mb-3">{error}</div>}
          {success && <div className="text-green-500 mb-3">{success}</div>}
          
          <button
            type="submit"
            className="text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-lg w-full sm:w-auto px-5 py-2.5 mt-5 text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800"
            disabled={isCreating}
          >
            {isCreating ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Create Course'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManageCourses;