import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';
import StudentAttendanceDialog from '../../teacher/students/StudentAttendanceDialog';

const Tab = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 text-lg font-semibold border-b-2 transition-colors duration-200 ${
      active 
        ? 'border-purple-500 text-purple-500' 
        : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
    }`}
  >
    {label}
  </button>
);

const Loading = () => (
  <div className="flex justify-center items-center h-screen text-black dark:text-white">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black dark:border-white"></div>
  </div>
);

const CourseCard = ({ course, onEnroll, status }) => {
  const [showAttendance, setShowAttendance] = useState(false);

  console.log('Course data:', course);

  return (
    <div className="rounded shadow-md p-6 border-[1px] border-slate-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-950">
      <h3 className="text-2xl font-semibold">{course.name}</h3>
      <p className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">{course.courseCode}</p>
      <p className="text-gray-600 dark:text-gray-400 mb-2">
        Teacher: {course.teacher.firstName} {course.teacher.lastName}
      </p>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Session: {course.session} | Semester: {course.semester}
      </p>
      {status === 'ACCEPTED' ? (
        <div className="space-y-2">
          <button 
            className="w-full bg-green-500 text-white font-semibold py-2 px-4 rounded cursor-not-allowed"
            disabled
          >
            Enrolled
          </button>
          <button
            onClick={() => setShowAttendance(true)}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors"
          >
            Check Details
          </button>
        </div>
      ) : status === 'PENDING' ? (
        <button 
          className="w-full bg-yellow-500 text-white font-semibold py-2 px-4 rounded cursor-not-allowed"
          disabled
        >
          Pending Approval
        </button>
      ) : (
        <button
          onClick={() => onEnroll(course.id)}
          className="w-full bg-purple-500 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded"
        >
          Apply for Enrollment
        </button>
      )}

      {showAttendance && (
        <StudentAttendanceDialog
          student={{
            id: course.enrollment.studentId,
            firstName: course.enrollment.student.firstName,
            lastName: course.enrollment.student.lastName,
            enrollmentNumber: course.enrollment.student.enrollmentNumber
          }}
          courseId={course.id}
          courseName={course.name}
          session={course.session}
          onClose={() => setShowAttendance(false)}
        />
      )}
    </div>
  );
};

const CourseGrid = ({ courses, onEnroll, status }) => (
  <div>
    {courses.length === 0 ? (
      <div className="text-center text-gray-600 dark:text-gray-400 py-8">
        <p className="text-xl">No courses to display.</p>
      </div>
    ) : (
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onEnroll={onEnroll}
            status={status}
          />
        ))}
      </div>
    )}
  </div>
);

const ManageCourses = () => {
  const [activeTab, setActiveTab] = useState('enrolled');
  const [availableCourses, setAvailableCourses] = useState([]);
  const [acceptedCourses, setAcceptedCourses] = useState([]);
  const [pendingCourses, setPendingCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesResponse, enrollmentsResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/courses/all-courses`, {
            headers: { Authorization: `Bearer ${Cookies.get('token')}` }
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/enrollment/enrollments/my-courses`, {
            headers: { Authorization: `Bearer ${Cookies.get('token')}` }
          })
        ]);

        const enrollments = enrollmentsResponse.data;
        
        const accepted = enrollments
          .filter(e => e.status === 'ACCEPTED')
          .map(e => ({
            ...e.course,
            enrollment: {
              studentId: e.studentId,
              student: e.student
            }
          }));

        const pending = enrollments
          .filter(e => e.status === 'PENDING')
          .map(e => e.course);

        const enrolledIds = enrollments.map(e => e.courseId);
        const available = coursesResponse.data.filter(
          course => !enrolledIds.includes(course.id)
        );

        setAvailableCourses(available);
        setAcceptedCourses(accepted);
        setPendingCourses(pending);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEnroll = async (courseId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/enrollment/enrollments`,
        { courseId },
        { headers: { Authorization: `Bearer ${Cookies.get('token')}` }}
      );
      
      const courseToMove = availableCourses.find(c => c.id === courseId);
      setPendingCourses([...pendingCourses, courseToMove]);
      setAvailableCourses(availableCourses.filter(c => c.id !== courseId));
      
      toast.success('Enrollment application submitted successfully');
      setActiveTab('pending');
    } catch (error) {
      console.error('Error enrolling in course:', error);
      toast.error(error.response?.data?.message || 'Failed to apply for enrollment');
    }
  };

  if (loading) return <Loading />;

  const tabs = [
    { id: 'enrolled', label: 'Enrolled Courses' },
    { id: 'pending', label: 'Pending Enrollments' },
    { id: 'available', label: 'Available Courses' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'enrolled':
        return (
          <CourseGrid
            courses={acceptedCourses}
            onEnroll={handleEnroll}
            status="ACCEPTED"
          />
        );
      case 'pending':
        return (
          <CourseGrid
            courses={pendingCourses}
            onEnroll={handleEnroll}
            status="PENDING"
          />
        );
      case 'available':
        return (
          <CourseGrid
            courses={availableCourses}
            onEnroll={handleEnroll}
            status="AVAILABLE"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full md:mr-16 pb-16">
        <p className="text-4xl font-semibold md:m-10 m-5 mx-10">Manage Courses</p>
      <div className="md:m-10 m-5">
        <div className="border-b mb-8">
          <div className="flex space-x-4 overflow-x-auto">
            {tabs.map(tab => (
              <Tab
                key={tab.id}
                label={tab.label}
                active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              />
            ))}
          </div>
        </div>
        
        <div className="mt-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ManageCourses;