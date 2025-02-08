import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SubCard from '../ui/subcard';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen text-black dark:text-white">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black dark:border-white"></div>
    </div>
  );
};

const Error = ({ error }) => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center flex-col items-center h-screen text-black dark:text-white text-2xl">
      <div>{error}</div>
      <div>
        <button
          onClick={() => {
            localStorage.clear();
            navigate("/signin");
          }}
          className="bg-purple-500 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-xl my-5"
        >
          Re-Login
        </button>
      </div>
    </div>
  );
};

const Dash = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/enrollment/enrollments/my-courses', {
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`
          }
        });

        // Filter for accepted enrollments and transform the data
        const courses = response.data
          .filter(enrollment => enrollment.status === 'ACCEPTED')
          .map(enrollment => {
            const course = enrollment.course || {}; // Ensure course object exists
            return {
              id: enrollment.courseId, // Use courseId instead of course.id
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
        console.error('Error fetching enrolled courses:', err);
        setError(err.response?.data?.message || 'Failed to fetch enrolled courses');
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error error={error} />;

  return (
    <div className="w-full md:mr-16 pb-16">
      <div className='flex justify-between mb-4'>
        <p className="text-4xl font-semibold md:m-10 m-5">My Courses</p>
      </div>
      {enrolledCourses.length === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-400 py-8 gap-6">
          <p className="text-xl pb-6">No enrolled courses yet.</p>
          <a href='/students/managecourses' className='bg-purple-600 hover:bg-purple-800 text-white font-semibold py-2 px-4 rounded'>Manage Courses</a>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:mx-10 mx-5">
          {enrolledCourses.map((course) => (
            <SubCard 
              key={course.id}
              id={course.id} // Ensure id prop is passed
              code={course.code} 
              name={course.name} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dash;