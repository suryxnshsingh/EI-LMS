import React, { Children, useState, useEffect, Profiler } from 'react';
import { cn } from '../../../../lib/utils';
import { 
  LayoutDashboard,
  NotebookPen,
  ListTodo,
  FlaskConical,
  LibraryBig,
  NotepadText,
  FileDown,
  UserCircle, 
  Settings,
  Users,
  LogOut,
  ArrowUp01,
  AudioLines
} from 'lucide-react';
import { Sidebar, SidebarBody, SidebarLink } from '../ui/sidebar';
import {  Routes, Route, Link } from 'react-router-dom';
import Attendance from './Attendance';
import ManageCourses from './ManageCourses';
import TeacherDashboard from './TeacherDashboard';
import SubjectDashboard from './SubjectDashboard';
import Reports from './Reports';
import ManageStudents from './ManageStudents';
import SubDash from '../subDash';
import Profile from './Profile';
import Tests from './Tests';
import Cookies from 'js-cookie';

const TeacherSidebar = () => {
  const [theme, setTheme] = useState(
    typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
  );
  useEffect(() => {
    const savedTheme = Cookies.get("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
  }, []);

  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    Cookies.remove("firstName");
    Cookies.remove("lastName");
    Cookies.remove("token");
    Cookies.remove("userId");
    Cookies.remove("userEmail");
    Cookies.remove("userRole");
    window.location.href = "/signin";
  };

  const links = [
    {
      label: "Dashboard",
      href: "/teachers/",
      icon: <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    },
    {
      label: "Manage Attendance",
      href: "/teachers/attendance",
      icon: <ListTodo className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    },
    {
      label: "Manage Tests",
      href: "/teachers/tests",
      icon: <FlaskConical className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    },
    {
        label: "Manage Students",
        href: "/teachers/students",
        icon: <Users className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    },
    {
      label: "Manage Courses",
      href: "/teachers/managecourses",
      icon: <LibraryBig className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    },
    {
        label: "Download Reports",
        href: "/teachers/reports",
        icon: <FileDown className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    },
    {
      label: "Analog Simulator",
      href: "/teachers/",
      icon: <AudioLines className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    },
    {
      label: "Digital Simulator",
      href: "/teachers/",
      icon: <ArrowUp01 className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    },
    {
      label: "Settings",
      href: "/teachers/settings",
      icon: <Settings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    }
    
  ];
  const firstName = Cookies.get("firstName") || "Profile";
  const lastName = Cookies.get("lastName") || ""; 

  return (
    <div className={cn(
      " flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
      "h-screen"
    )}>
      <Sidebar open={open} setOpen={setOpen} >
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-14 flex flex-col gap-2 text-nowrap">
              {links.map((link, idx) => (
                <Link to={link.href} key={idx} className="flex items-center gap-2 p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg">
                {link.icon}
                <span className='text-neutral-700 dark:text-neutral-200 text-md'>{link.label}</span>
                </Link>
              ))}
              <SidebarLink 
              onClick={handleLogout}
              className='pl-2'
              link={{
                label: 'Logout',
                icon: <LogOut className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
              }} />
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: `${firstName} ${lastName}`,
                href: "/teachers/profile",
                icon: (
                  <div className="h-7 w-7 flex-shrink-0 rounded-full bg-neutral-300 dark:bg-neutral-600" />
                )
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <Dashboard />
    </div>
  );
};

const Logo = () => {
  return (
    <a
      href="/teachers/"
      className="font-normal flex space-x-2 items-center text-md text-black dark:text-white py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <span className="font-medium text-black dark:text-white whitespace-pre opacity-1 animate-fadeIn">
        EI Classroom
      </span>
    </a>
  );
};

const LogoIcon = () => {
  return (
    <a
      href="#"
      className="font-normal flex space-x-2 items-center text-md text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </a>
  );
};

const Dashboard = () => {

  return (
    <div className="flex flex-1 bg-neutral-100 dark:bg-neutral-950">
      <div className=" rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-black dark:bg-dot-white/[0.2] bg-dot-black/[0.2] ">
        <div className=' rounded-tl-2xl  w-screen h-screen overflow-scroll'>
        <div className=' flex items-center justify-center text-black  dark:text-white'>
          <Routes>
            <Route path="/" element={<TeacherDashboard />} />
            <Route path="/:subjectCode" element={<SubjectDashboard />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/students" element={<ManageStudents />} />
            <Route path="/tests" element={<Tests />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/reports/:subjectCode" element={<SubDash />} />
            <Route path="/managecourses" element={<ManageCourses />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
          </div>
          </div>
      </div>
    </div>
  );
};

const SettingsPage = () => {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    Cookies.set('theme', theme);
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="p-6 text-start">
      <h1 className="text-3xl font-semibold mb-8">Settings</h1>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between max-w-md">
          <h2 className="text-lg font-medium pr-2">Theme Preference :</h2>
          
          <div className="flex items-center space-x-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={theme === "dark"}
                onChange={handleThemeToggle}
                aria-label="Toggle theme"
              />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
            <span className="text-xl" aria-hidden="true">
              {theme === "dark" ? "🌙" : "☀️"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherSidebar;