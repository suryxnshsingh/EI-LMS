import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Clock, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = `${import.meta.env.VITE_API_URL}`;

function Tests() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    upcoming: 0,
    completed: 0,
    missed: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          console.error('No token found');
          return;
        }

        const response = await axios.get(`${BASE_URL}/api/quiz/student/stats`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setStats(response.data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
        if (err.response?.status === 401) {
          // Handle unauthorized error - maybe redirect to login
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-gray-600 dark:text-gray-300" />
      </div>
    );
  }

  return (
    <div className="p-5 md:p-10 w-full mr-0 md:mr-14">
      {/* Header Section */}
      <div className="mb-10 flex flex-col md:flex-row justify-between w-full pr-20">
          <h1 className="text-4xl font-semibold text-gray-900 dark:text-white mb-2">
            Manage Tests
          </h1>
          {/* <button
            onClick={() => setOpenDialog(true)}
            className="mt-4 md:mt-0 w-fit px-4 py-2 text-xl text-white border-2 border-neutral-200 dark:border-neutral-700 rounded-md bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-indigo-500 hover:to-violet-500 transition-colors duration-800"
          >
            <div className='flex items-center'><FlaskConical className='mr-2'/>Create New Test</div>
          </button> */}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-neutral-800 p-4 md:p-6 rounded-lg shadow-md border border-gray-200 dark:border-neutral-700">
          <div className="flex flex-col md:flex-row justify-center md:justify-start items-center gap-3">
            <Clock className="w-8 h-8 text-blue-500" />
            <div className='flex flex-col justify-center items-center md:items-start'>
              <p className="text-gray-600 dark:text-gray-400">Upcoming</p>
              <h3 className="text-2xl font-bold dark:text-white">{stats.upcoming}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-neutral-800 p-4 md:p-6 rounded-lg shadow-md border border-gray-200 dark:border-neutral-700">
          <div className="flex flex-col md:flex-row justify-center md:justify-start items-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
            <div className='flex flex-col justify-center items-center md:items-start'>
              <p className="text-gray-600 dark:text-gray-400">Completed</p>
              <h3 className="text-2xl font-bold dark:text-white">{stats.completed}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-neutral-800 p-4 md:p-6 rounded-lg shadow-md border border-gray-200 dark:border-neutral-700">
          <div className="flex flex-col md:flex-row justify-center md:justify-start items-center gap-3">
            <XCircle className="w-8 h-8 text-red-500" />
            <div className='flex flex-col justify-center items-center md:items-start'>
              <p className="text-gray-600 dark:text-gray-400">Missed</p>
              <h3 className="text-2xl font-bold dark:text-white">{stats.missed}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 gap-6">
        <div 
          onClick={() => navigate('/students/tests/available')}
          className="bg-white dark:bg-neutral-900 hover:dark:bg-neutral-800 p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <ClipboardList className="w-8 h-8 text-blue-500 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold dark:text-white">Available Tests</h3>
              <p className="text-gray-600 dark:text-gray-400">View and attempt available tests</p>
            </div>
          </div>
        </div>

        <div 
          onClick={() => navigate('/students/tests/history')}
          className="bg-white dark:bg-neutral-900 hover:dark:bg-neutral-800 p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <Clock className="w-8 h-8 text-green-500 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold dark:text-white">Test History</h3>
              <p className="text-gray-600 dark:text-gray-400">View your previous tests</p>
            </div>
          </div>
        </div>

        <div 
          onClick={() => navigate('')}
          className="bg-white dark:bg-neutral-900 hover:dark:bg-neutral-800 p-6 rounded-lg shadow-md cursor-not-allowed hover:shadow-lg transition-shadow relative"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <CheckCircle2 className="w-8 h-8 text-purple-500 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold dark:text-white">View Results</h3>
              <p className="text-gray-600 dark:text-gray-400">Check your test results</p>
            </div>
          </div>
          <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
            Coming Soon
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tests;