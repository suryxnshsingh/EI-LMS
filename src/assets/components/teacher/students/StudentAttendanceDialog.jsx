import React, { useState } from 'react';
import { X } from 'lucide-react';
import AttendanceTab from './AttendanceTab';
import AssignmentTab from './AssignmentTab';
import TestTab from './TestTab';

const StudentAttendanceDialog = ({ student, courseId, courseName, session, onClose }) => {
  const [activeTab, setActiveTab] = useState('attendance');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 w-[50vw] h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Details of {student.firstName} {student.lastName} - {courseName}
            </h2>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span className="mr-3">Enrollment: {student.enrollmentNumber || 'N/A'}</span>
              <span>Session: {session}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-4 flex border-b dark:border-neutral-700">
          <button
            className={`px-4 py-2 ${activeTab === 'attendance' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-700 dark:text-gray-300'}`}
            onClick={() => setActiveTab('attendance')}
          >
            Attendance
          </button>
          <button
            className={`px-4 py-2 ml-2 ${activeTab === 'assignment' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-700 dark:text-gray-300'}`}
            onClick={() => setActiveTab('assignment')}
          >
            Assignment
          </button>
          <button
            className={`px-4 py-2 ml-2 ${activeTab === 'test' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-700 dark:text-gray-300'}`}
            onClick={() => setActiveTab('test')}
          >
            Test
          </button>
        </div>

        {activeTab === 'attendance' && <AttendanceTab student={student} courseId={courseId} />}
        {activeTab === 'assignment' && <AssignmentTab />}
        {activeTab === 'test' && <TestTab />}
      </div>
    </div>
  );
};

export default StudentAttendanceDialog;