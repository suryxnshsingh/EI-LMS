import React, { useState, useEffect } from 'react';
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
  Sun,
  Moon,
  Users,
  LogOut,
  Cpu
} from 'lucide-react';
import { Sidebar, SidebarBody, SidebarLink } from '../ui/sidebar';
import {  Routes, Route, Link } from 'react-router-dom';
import Attendance from './attendance/Attendance';
import ManageCourses from './courses/ManageCourses';
import TeacherDashboard from './TeacherDashboard';
import SubjectDashboard from './SubjectDashboard';
import Reports from './reports/Reports';
import ManageStudents from './students/ManageStudents';
import { Simulator } from '../simulators/Simulator';
import UpdateTest from './tests/UpdateTest';
import Profile from './Profile';
import Tests from './tests/Tests';
import Cookies from 'js-cookie';

const TeacherSidebar = () => {
  const [theme, setTheme] = useState(
    typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
  );

  const handleThemeToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    Cookies.set("theme", newTheme);
  };

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
      label: "Simulators",
      href: "/teachers/simulators",
      icon: <Cpu className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    },
    {
      label: "Change Theme",
      href: "#",
      icon: theme === "dark" ? <Moon className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" /> : <Sun className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
      onClick: handleThemeToggle
    },
    {
      label: "Logout",
      href: "#",
      icon: <LogOut className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
      onClick: handleLogout
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
                link.onClick ? (
                  <div key={idx} onClick={link.onClick} className="flex items-center gap-2 p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg cursor-pointer">
                    {link.icon}
                    <span className='text-neutral-700 dark:text-neutral-200 text-md'>{link.label}</span>
                  </div>
                ) : (
                  <Link to={link.href} key={idx} className="flex items-center gap-2 p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg">
                    {link.icon}
                    <span className='text-neutral-700 dark:text-neutral-200 text-md'>{link.label}</span>
                  </Link>
                )
              ))}
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
        EI - LMS
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
            <Route path="/:courseId" element={<SubjectDashboard />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/students" element={<ManageStudents />} />
            <Route path="/tests" element={<Tests />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/managecourses" element={<ManageCourses />} />
            <Route path="/simulators" element={<Simulator/>} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/test/:id" element={<UpdateTest />} />
          </Routes>
          </div>
          </div>
      </div>
    </div>
  );
};

export default TeacherSidebar;