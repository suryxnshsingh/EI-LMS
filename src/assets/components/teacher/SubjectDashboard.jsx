import React from 'react'
import { useParams } from 'react-router-dom'
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Routes, Route, Link } from 'react-router-dom';
import Assignments from './Assignment';
import Notes from './Notes';
import Tests from './Tests';
import Books from './Books';

const tabs = ["Assignments", "Tests", "Notes", "Books"];
const SubjectDashboard = () => {
    const { subjectCode } = useParams();
    const [selected, setSelected] = useState(tabs[0]);
  return (
    <div className='w-full'>
        <p className="text-4xl font-semibold md:m-10 m-5 ">Subject Name</p>
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
        {selected === "Assignments" && <Assignments/>}
        {selected === "Notes" && <Notes/>}
        {selected === "Tests" && <Tests/>}
        {selected === "Books" && <Books/>}
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