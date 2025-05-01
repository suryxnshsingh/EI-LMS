import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SubCard from '../ui/subcard';
import Cookies from 'js-cookie';
import { motion } from 'framer-motion';

const AccessCourses = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const baseURL = import.meta.env.VITE_API_URL;
        const headers = { Authorization: `Bearer ${Cookies.get('token')}` };
        const response = await axios.get(`${baseURL}/api/enrollment/enrollments/my-courses`, { headers });
        const courses = response.data
          .filter(enrollment => enrollment.status === 'ACCEPTED')
          .map(enrollment => {
            const course = enrollment.course || {};
            return {
              id: enrollment.courseId,
              name: course.name,
              code: course.courseCode,
              teacher: `${course.teacher?.firstName} ${course.teacher?.lastName}`,
              session: course.session,
              semester: course.semester
            };
          });
        setEnrolledCourses(courses);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch courses');
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Always show all courses
  const coursesToDisplay = enrolledCourses;

  if (loading) return (
    <div className="flex justify-center items-center h-screen text-black dark:text-white">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black dark:border-white"></div>
    </div>
  );
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="w-full px-4 md:px-10 pb-16">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">My Courses</h1>
      {enrolledCourses.length === 0 ? (
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-8 text-center border border-gray-100 dark:border-neutral-700">
          <p className="text-xl pb-6 text-gray-600 dark:text-gray-400">No enrolled courses yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {coursesToDisplay.map((course) => (
            <motion.div key={course.id} whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
              <SubCard id={course.id} code={course.code} name={course.name} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AccessCourses;
