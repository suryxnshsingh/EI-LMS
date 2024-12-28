import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Label from "../ui/label";
import Input from "../ui/input";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [theme, setTheme] = useState(Cookies.get("theme") || "dark");
  const navigate = useNavigate();

  useEffect(() => {
    if (theme) {
      document.documentElement.classList.add(theme);
    }
  }, [theme]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Sending password reset email...');

    try {
      await axios.post(`http://localhost:8080/api/auth/forgot-password`, { email });
      toast.success('Password reset email sent successfully!', {
        id: loadingToast,
      });
      navigate("/signin");
    } catch (error) {
      toast.error('Error sending password reset email. Please try again.', {
        id: loadingToast,
      });
    }
  };

  return (
    <div className="bg-white dark:bg-black dark:bg-dot-white/[0.2] bg-dot-black/[0.2] h-screen flex items-center justify-center">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 max-md:border-0 border-2 border-neutral-300 dark:border-neutral-700 bg-white dark:bg-black">
        <h2 className="font-bold text-center text-xl text-neutral-800 dark:text-neutral-200">
          Forgot Password
        </h2>
        <form className="my-8" onSubmit={handleSubmit}>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              placeholder="your-email@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </LabelInputContainer>
          <button
            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
          >
            Send Reset Link
            <BottomGradient />
          </button>
        </form>
      </div>
    </div>
  );
};

const LabelInputContainer = ({ children, className }) => {
  return <div className={`flex flex-col space-y-2 w-full ${className}`}>{children}</div>;
};

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

export default ForgotPassword;
