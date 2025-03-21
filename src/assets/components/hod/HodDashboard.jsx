import React, { useState, useEffect } from 'react';
import { Users, BookOpen, ChartBar, CalendarClock } from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = `${import.meta.env.VITE_API_URL}`;

const HodDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    activeAttendance: 0,
    upcomingTests: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // In a real app, this would fetch actual stats from the backend
    // For now, we'll just simulate loading
    setLoading(true);
    setTimeout(() => {
      setStats({
        totalStudents: 120,
        totalCourses: 8,
        activeAttendance: 3,
        upcomingTests: 5
      });
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="w-full m-4 md:m-10">
      <div className="container p-4 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-4xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
          <div className="mt-4 md:mt-0 text-gray-600 dark:text-gray-300">
            <span>Welcome, Head of Department</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Students" 
            value={stats.totalStudents} 
            icon={<Users className="h-8 w-8 text-blue-500" />}
            color="blue"
          />
          <StatCard 
            title="Total Courses" 
            value={stats.totalCourses} 
            icon={<BookOpen className="h-8 w-8 text-green-500" />}
            color="green"
          />
          <StatCard 
            title="Active Attendance" 
            value={stats.activeAttendance} 
            icon={<CalendarClock className="h-8 w-8 text-yellow-500" />}
            color="yellow"
          />
          <StatCard 
            title="Upcoming Tests" 
            value={stats.upcomingTests} 
            icon={<ChartBar className="h-8 w-8 text-purple-500" />}
            color="purple"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Department Overview</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Welcome to the Head of Department portal. From here, you can monitor department-wide metrics,
              manage students, courses, and faculty members, and generate reports for the department.
            </p>
            <div className="mt-4">
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                <li>View comprehensive analytics of student performance</li>
                <li>Monitor attendance and test statistics across courses</li>
                <li>Generate reports for administrative purposes</li>
                <li>Oversee course management and faculty assignments</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Quick Links</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <QuickLinkCard 
                title="Student Directory" 
                description="View and manage all students"
                link="/hod/students"
                color="blue"
              />
              <QuickLinkCard 
                title="Course Management" 
                description="Manage department courses"
                link="/hod/courses"
                color="green"
              />
              <QuickLinkCard 
                title="Generate Reports" 
                description="Create and download reports"
                link="/hod/reports"
                color="yellow"
              />
              <QuickLinkCard 
                title="Department Analytics" 
                description="View performance metrics"
                link="/hod/analytics"
                color="purple"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800",
    green: "bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-800",
    yellow: "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/30 dark:border-yellow-800",
    purple: "bg-purple-50 border-purple-200 dark:bg-purple-900/30 dark:border-purple-800",
  };

  return (
    <div className={`rounded-lg border p-6 ${colorClasses[color]} shadow-sm`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</h3>
        </div>
        <div className="rounded-full p-2">
          {icon}
        </div>
      </div>
    </div>
  );
};

const QuickLinkCard = ({ title, description, link, color }) => {
  const colorClasses = {
    blue: "hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-900/30 dark:hover:border-blue-800",
    green: "hover:bg-green-50 hover:border-green-200 dark:hover:bg-green-900/30 dark:hover:border-green-800",
    yellow: "hover:bg-yellow-50 hover:border-yellow-200 dark:hover:bg-yellow-900/30 dark:hover:border-yellow-800",
    purple: "hover:bg-purple-50 hover:border-purple-200 dark:hover:bg-purple-900/30 dark:hover:border-purple-800",
  };

  return (
    <a 
      href={link} 
      className={`block rounded-lg border border-gray-200 dark:border-neutral-700 p-4 transition-colors ${colorClasses[color]}`}
    >
      <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{description}</p>
    </a>
  );
};

export default HodDashboard;
