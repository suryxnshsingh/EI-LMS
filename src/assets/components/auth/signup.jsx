import React, { useState, useEffect } from "react";
import axios from "axios";
import Label from "../ui/label";
import Input from "../ui/input";
import { cn } from "../../../../lib/utils";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import Cookies from 'js-cookie';
import { Mail, KeyRound } from "lucide-react";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "STUDENT",
    enrollmentNumber: "",
    semester: "",
    year: "",
    secretKey: ""
  });
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(Cookies.get("theme") || "dark");
  const [lastResendTime, setLastResendTime] = useState(null);
  const RESEND_LIMIT = 60 * 1000; // 1 minute
  const navigate = useNavigate();

  // Secret keys for teacher and admin
  const TEACHER_KEY = "teacher_secret2025";
  const ADMIN_KEY = "admin_secret2025";

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (theme) {
      document.documentElement.classList.add(theme);
    }

    setTimeout(() => {
      setLoading(false);
    }, 200);
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Loading toast
    const loadingToast = toast.loading('Creating your account...');

    // Email validation for student role
    if (formData.role === "STUDENT") {
      const emailPattern = /^0801ei[a-zA-Z0-9._%+-]+@sgsits\.ac\.in$/;
      if (!emailPattern.test(formData.email)) {
        toast.error('Please use a valid college issued email associated with EI Dept. only', {
          id: loadingToast,
        });
        return;
      }
    }

    if (formData.role === "TEACHER") {
      const TeacherEmailPattern = /^[a-zA-Z0-9._%+-]+@sgsits\.ac\.in$/;
      if (!TeacherEmailPattern.test(formData.email)) {
        toast.error('Please use a valid college issued email only', {
          id: loadingToast,
        });
        return;
      }
    }

    // Verify secret key for teacher and admin roles
    if (formData.role === "TEACHER" && formData.secretKey !== TEACHER_KEY) {
      toast.error('Invalid teacher secret key', {
        id: loadingToast,
      });
      return;
    }
    if (formData.role === "ADMIN" && formData.secretKey !== ADMIN_KEY) {
      toast.error('Invalid admin secret key', {
        id: loadingToast,
      });
      return;
    }

    try {
      // Password validation
      if (formData.password.length < 6) {
        toast.error('Password must be at least 6 characters long', {
          id: loadingToast,
        });
        return;
      }

      // Send the signup request to the backend
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, formData);
      
      // Success toast
      toast.success('Account created successfully! Please check your email to verify your account.', {
        id: loadingToast,
        duration: 3000,
      });

      // Short delay before navigation to allow toast to be seen
      setTimeout(() => {
        navigate("/signin");
      }, 1000);

    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            toast.error(error.response.data.message || "User with this email already exists.", {
              id: loadingToast,
            });
            break;
          case 422:
            toast.error("Invalid input data. Please check your entries.", {
              id: loadingToast,
            });
            break;
          case 429:
            toast.error("Verification email already sent. Please wait for some time to resend a new email.", {
              id: loadingToast,
            });
            break;
          default:
            toast.error("Something went wrong. Please try again.", {
              id: loadingToast,
            });
        }
      } else {
        toast.error("Network error. Please check your connection.", {
          id: loadingToast,
        });
      }
    }
  };

  const handleResendVerification = async () => {
    const now = Date.now();
    if (lastResendTime && now - lastResendTime < RESEND_LIMIT) {
      toast.error('Please wait a minute before resending the verification email.');
      return;
    }

    const loadingToast = toast.loading('Resending verification email...');

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/resend-verification`, { email: formData.email });
      toast.success('Verification email resent successfully!', {
        id: loadingToast,
        duration: 3000,
      });

      setLastResendTime(now);

      // Short delay before navigation to allow toast to be seen
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    } catch (error) {
      toast.error('Error resending verification email. Please try again.', {
        id: loadingToast,
      });
    }
  };

  // If loading, display skeleton
  if (loading) {
    return <SkeletonSignup />;
  }

  return (
    <div className="bg-white dark:bg-black dark:bg-dot-white/[0.2] bg-dot-black/[0.2] h-screen flex items-center justify-center">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 max-md:border-0 border-2 border-neutral-300 dark:border-neutral-700 bg-white dark:bg-black">
        <h2 className="font-bold text-center text-xl text-neutral-950 dark:text-neutral-200">
          EI-LMS
        </h2>
        <form className="my-8" onSubmit={handleSubmit}>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="role">Sign up as</Label>
            <select
              id="role"
              className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 p-2 text-neutral-900 dark:text-neutral-100 bg-gray-50 dark:bg-black"
              value={formData.role}
              onChange={handleInputChange}
              required
            >
              <option value="STUDENT">Student</option>
              <option value="TEACHER">Teacher</option>
              <option value="ADMIN">Head</option>
            </select>
          </LabelInputContainer>

          {formData.role === "STUDENT" && (
            <>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="enrollmentNumber">Enrollment Number</Label>
                <Input
                  id="enrollmentNumber"
                  placeholder="0801FC69420"
                  type="text"
                  value={formData.enrollmentNumber}
                  onChange={handleInputChange}
                  required
                />
              </LabelInputContainer>
              
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
                <LabelInputContainer>
                  <Label htmlFor="semester">Semester</Label>
                  <select
                    id="semester"
                    className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 p-2 text-neutral-900 dark:text-neutral-100 bg-gray-50 dark:bg-black"
                    value={formData.semester}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Semester</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                  </select>
                </LabelInputContainer>
                <LabelInputContainer>
                  <Label htmlFor="year">Year</Label>
                  <select
                    id="year"
                    className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 p-2 text-neutral-900 dark:text-neutral-100 bg-gray-50 dark:bg-black"
                    value={formData.year}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </LabelInputContainer>
              </div>
            </>
          )}

          {(formData.role === "TEACHER" || formData.role === "ADMIN") && (
            <LabelInputContainer className="mb-4">
              <Label htmlFor="secretKey">Secret Key</Label>
              <Input
                id="secretKey"
                placeholder="Contact Head for key"
                type="password"
                value={formData.secretKey}
                onChange={handleInputChange}
                required
              />
            </LabelInputContainer>
          )}
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
            <LabelInputContainer>
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                placeholder="Tyler"
                type="text"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                placeholder="Durden"
                type="text"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </LabelInputContainer>
          </div>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              placeholder="projectmayhem@fc.com"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </LabelInputContainer>

          <button
            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
          >
            Sign up &rarr;
            <BottomGradient />
          </button>

          <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
          <div
            className="mt-4 relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-neutral-700 dark:text-neutral-300 rounded-md h-9 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)] cursor-pointer"
            onClick={handleResendVerification}
          >
            <p className="flex gap-4 text-sm"><Mail size={20}/>Resend Verification Email</p>
            <BottomGradient />
          </div>
          <a
            href="/signin"
            className="mt-2 relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-neutral-700 dark:text-neutral-300 rounded-md h-9 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
          >
            <p className="flex gap-4 text-sm"><KeyRound size={20}/> Already have an account</p>
            <BottomGradient />
          </a>
        </form>
      </div>
    </div>
  );
};

// Skeleton Loader for the Signup component
const SkeletonSignup = () => {
  return (
    <div className="bg-white dark:bg-black dark:bg-dot-white/[0.2] bg-dot-black/[0.2] h-screen flex items-center justify-center">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 border-2 border-neutral-300 dark:border-neutral-700 bg-white dark:bg-black h-auto">
        <div className="animate-pulse">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-6 bg-gray-300 dark:bg-gray-700 rounded-full shadow-inner"></div>
            <div className="w-6 h-6 ml-1 bg-gray-300 dark:bg-gray-700 rounded-full shadow-inner"></div>
          </div>
          <div className="h-8 bg-gray-300 dark:bg-gray-700 mb-6 w-32 mx-auto rounded-md"></div>
          <div className="w-full h-[42px] bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
          <div className="w-full h-[32px] bg-gray-300 dark:bg-gray-700 rounded mb-6"></div>
          <div className="flex justify-center">
            <div>
              <div className="flex items-center justify-start mb-4">
                <div className="w-32 h-6 bg-gray-300 dark:bg-gray-700 rounded-full shadow-inner"></div>
              </div>
              <div className="w-48 h-[42px] bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
            </div>
            <div>
              <div className="flex items-center justify-start mb-4">
                <div className="ml-3 w-32 h-6 bg-gray-300 dark:bg-gray-700 rounded-full shadow-inner"></div>
              </div>
              <div className="ml-3 w-44 h-[42px] bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
            </div>
          </div>
          <div className="flex items-center justify-start mb-4">
            <div className=" w-32 h-6 bg-gray-300 dark:bg-gray-700 rounded-full shadow-inner"></div>
          </div>
          <div className="w-full h-[42px] bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
          <div className="flex items-center justify-start mb-4">
            <div className="w-24 h-6 bg-gray-300 dark:bg-gray-700 rounded-full shadow-inner"></div>
          </div>
          <div className="bg-gray-300 dark:bg-gray-700 h-[1px] w-full mb-8"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 w-48 mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({ children, className }) => {
  return <div className={cn("flex flex-col space-y-2 w-full", className)}>{children}</div>;
};

export default Signup;