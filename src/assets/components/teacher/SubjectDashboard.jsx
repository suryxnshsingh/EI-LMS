import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from "framer-motion";
import { useState } from "react";
import axios from 'axios';
import Cookies from 'js-cookie';
import Assignments from './Assignments';
import Notes from './components/Notes';
import Create from './components/Home';

const tabs = ["Home","Assignments", "Notes"];
const SubjectDashboard = () => {
    const { courseId } = useParams();
    const [selected, setSelected] = useState(tabs[0]);
    const [courseName, setCourseName] = useState('');
    const [courseCode, setCourseCode] = useState('');

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const token = Cookies.get('token');
                const response = await axios.get(`http://localhost:8080/api/courses/course-details/${courseId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setCourseName(response.data.name);
                setCourseCode(response.data.courseCode);
            } catch (error) {
                console.error('Error fetching course details:', error);
            }
        };

        fetchCourseDetails();
    }, [courseId]);

  return (
    <div className='w-full'>
      <div className='flex flex-col md:m-10 m-5'>
        <p className="text-4xl font-semibold ">{courseName}</p>
        <p className="text-2xl font-semibold text-neutral-700 dark:text-neutral-300 ">{courseCode}</p>
      </div>
        <div className="md:px-10 px-5  flex items-center flex-wrap gap-4 overflow-x-auto">
            {tabs.map((tab) => (
                <Chip
                text={tab}
                selected={selected === tab}
                setSelected={setSelected}
                key={tab}
                />
            ))}
        </div>
        <div className='md:p-10 p-5'>
        {selected === "Home" && <Create/>}
        {selected === "Assignments" && <Assignments/>}
        {selected === "Notes" && <Notes/>}
        </div>
    </div>
  )
}

const Chip = ({
    text,
    selected,
    setSelected,
  }) => {
    return (
      <button
        onClick={() => setSelected(text) }
        className={`${
          selected
            ? "text-white "
            : "text-black dark:text-neutral-200 hover:text-slate-200 hover:bg-slate-700"
        } text-xl transition-colors px-2.5 py-0.5 rounded-md relative`}
      >
        <span className="relative z-10">{text}</span>
        {selected && (
          <motion.span
            layoutId="pill-tab"
            transition={{ type: "spring", duration: 0.5 }}
            className="absolute inset-0 z-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-md"
          ></motion.span>
        )}
      </button>
    );
  };

export default SubjectDashboard