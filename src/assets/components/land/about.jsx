import React from 'react';
import { motion } from "framer-motion";

const gradientBackground = {
  background: "linear-gradient(0deg, rgba(0,212,255,1) 0%, rgba(1,93,133,1) 0%, rgba(2,6,35,1) 78%)",
  minHeight: '100vh',
  width: '100%', 
};

const Title = () => (
  <h1 className="mb-4 text-3xl chakra-petch-bold text-gray-900 dark:text-white md:text-5xl lg:text-6xl md:py-10 px-4 mt-20">
    <div className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400 text-center">
      About the Department
    </div>
  </h1>
);

const DepartmentInfo = () => (
  <p className="text-lg chakra-petch-regular text-slate-300 lg:text-2xl p-4 md:pr-20 max-md:text-center">
    The Department of Electronics and Instrumentation Engineering was established in 1984.
    It came out as an offspring of Electronics Engineering due to enormous
    development in the field of Electronics and demand of Instrumentation Engineers in the
    city and its vicinity. Equipped with modern sophisticated instruments, it offers Under
    Graduate course (B.E. Programme). An M. Tech. course in Microelectronics VLSI Design was
    started by this Department in 2002. The faculty is well qualified to accept the new
    challenges in the Electronics and Instrumentation field.
    <br /><br />
    The Department has been recognized as a centre to conduct short term Programme for teaching
    faculty in the PC based Electronics Instrumentation under UGC vocational courses. New
    ventures for research and product development in the area of Biomedical and Optical
    Engineering are being set up under MHRD schemes.
  </p>
);

const ProfileCard = ({ name, title, department, employeeCode, joinDate, phone, email }) => (
  <a href='https://sgsits.ac.in/index.php/people-ei/eie-faculty-members/371-mr-rajesh-khatri' target="_blank" rel="noopener noreferrer">
  <div className="max-w-sm mx-auto px-4 md:px-0">
    <div className="rounded-lg border bg-slate-400 px-4 pt-8 pb-10 shadow-xl chakra-petch-regular">
      <div className="relative mx-auto w-36 rounded-full">
        <img className="mx-auto h-auto w-full rounded-full" src="/khatri.jpg" alt={name} />
      </div>
      <h1 className="my-1 text-center text-xl font-bold leading-8 text-gray-900">{name}</h1>
      <h3 className="font-lg text-semibold text-center leading-6 text-gray-900">{title}</h3>
      <p className="text-center text-sm leading-6 text-gray-900 hover:text-gray-600">{department}</p>
      <ul className="mt-3 divide-y rounded bg-slate-300 py-2 px-3 text-gray-700 shadow-sm hover:text-gray-800 hover:shadow">
        <ProfileItem label="Employee Code" value={employeeCode} isCode />
        <ProfileItem label="Joined On" value={joinDate} />
        <ProfileItem label="Phone" value={phone} />
        <ProfileItem label="Email" value={email} />
      </ul>
    </div>
  </div>
  </a>
);

const ProfileItem = ({ label, value, isCode }) => (
  <li className="flex items-center py-3 text-sm">
    <span>{label}</span>
    <span className="ml-auto">
      {isCode ? (
        <span className="rounded-full bg-green-200 py-1 px-2 text-xs font-medium text-green-700">{value}</span>
      ) : (
        value
      )}
    </span>
  </li>
);

const About = () => {
  return (
    <section id ="about">
    <div className="flex flex-col items-center justify-center w-full pb-10" style={gradientBackground}>
      <div className="w-full max-w-7xl">
        <Title />
        <motion.div 
          className="flex flex-col md:flex-row-reverse w-full"
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-full md:w-2/3">
            <DepartmentInfo />
          </div>
          <div className="w-full md:w-1/3">
            <ProfileCard
              name="Mr. Rajesh Khatri"
              title="Head of Department"
              department="Electronics and Instrumentation Engineering"
              employeeCode="3300279"
              joinDate="December 24, 2003"
              phone="091-731-2582425"
              email="rajeshkhatri1@rediffmail.com"
            />
          </div>
        </motion.div>
      </div>
    </div>
    </section>
  );
};

export default About;