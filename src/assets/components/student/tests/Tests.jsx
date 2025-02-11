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
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold dark:text-white">Test Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">View and attempt your tests</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-gray-600 dark:text-gray-400">Upcoming</p>
              <h3 className="text-2xl font-bold dark:text-white">{stats.upcoming}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-gray-600 dark:text-gray-400">Completed</p>
              <h3 className="text-2xl font-bold dark:text-white">{stats.completed}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3">
            <XCircle className="w-8 h-8 text-red-500" />
            <div>
              <p className="text-gray-600 dark:text-gray-400">Missed</p>
              <h3 className="text-2xl font-bold dark:text-white">{stats.missed}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          onClick={() => navigate('/students/tests/available')}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <ClipboardList className="w-8 h-8 text-blue-500 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold dark:text-white">Available Tests</h3>
              <p className="text-gray-600 dark:text-gray-400">View and attempt available tests</p>
            </div>
          </div>
        </div>

        <div 
          onClick={() => navigate('/students/tests/history')}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <Clock className="w-8 h-8 text-green-500 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold dark:text-white">Test History</h3>
              <p className="text-gray-600 dark:text-gray-400">View your previous test attempts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tests;