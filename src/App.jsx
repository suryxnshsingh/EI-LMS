import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './assets/components/land/home';
import Signin from './assets/components/auth/signin';
import Signup from './assets/components/auth/signup';
import StudentSidebar from './assets/components/student/StudentSidebar';
import TeacherSidebar from './assets/components/teacher/TeacherSidebar';
import HodSidebar from './assets/components/hod/HodSidebar'; // Add import for HOD sidebar
import { Toaster } from 'react-hot-toast';
import ForgotPassword from './assets/components/auth/ForgotPassword';
import ChangePassword from './assets/components/auth/ChangePassword';
import QuizAttempt from './assets/components/student/tests/QuizAttempt';
import { Spice, CircuitSim } from './assets/components/simulators/sims';
import ThankYou from './assets/components/student/tests/ThankYou';

function App() {
  return (
    <div>
      <Toaster 
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Default options for specific types
          success: {
            duration: 3000,
            style: {
              background: '#059669',
              color: 'white',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#dc2626',
              color: 'white',
            },
          },
          // Default options for all toasts
          style: {
            maxWidth: '500px',
            padding: '16px 24px',
            borderRadius: '8px',
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/students/*" element={<StudentSidebar />} />
          <Route path="/teachers/*" element={<TeacherSidebar />} />
          <Route path="/hod/*" element={<HodSidebar />} />
          <Route path="/spice" element={<Spice />} />
          <Route path="/circuit" element={<CircuitSim />} />
          <Route path="/student/quiz/:quizId" element={<QuizAttempt />} />
          <Route path="/students/tests/thank-you" element={<ThankYou />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
