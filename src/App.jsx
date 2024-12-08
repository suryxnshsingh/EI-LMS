import {BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './assets/components/land/home'
import Signin from './assets/components/auth/signin'
import Signup from './assets/components/auth/signup'
import StudentSidebar from './assets/components/student/StudentSidebar'
import TeacherSidebar from './assets/components/teacher/TeacherSidebar'
import { Toaster } from 'react-hot-toast';

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
            <Route path="/" element={<Home/>}/>
            <Route path="/signin" element={<Signin/>}/>
            <Route path="/signup" element={<Signup/>}/>
            <Route path='/students/*' element={<StudentSidebar />} />
            <Route path='/teachers/*' element={<TeacherSidebar />} />
          </Routes>
        </BrowserRouter>
      </div>
  )
}

export default App
