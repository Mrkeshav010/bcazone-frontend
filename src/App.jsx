import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { ForgotPassword } from './pages/ForgotPassword';
import CreatePassword from './pages/CreatePassword';
import CreateProfile from './pages/CreateProfile';
import Home from './pages/Home';
import FindCollege from './pages/FindCollege';
import FindSyllabus from './pages/FindSyllabus';
import FindNotes from './pages/FindNotes';
import FindQPapers from './pages/FindQPapers';
import Upload from './pages/Upload';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import AdminDashboard from './pages/AdminDashboard';
import Courses from './pages/Courses';
import CourseReader from './pages/CourseReader';
import CourseExam from './pages/CourseExam';
import CourseCertificate from './pages/CourseCertificate';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{
          style: {
            fontFamily: 'Nunito, sans-serif',
            borderRadius: '12px',
            border: '1px solid #BBDEFB',
            color: '#1A237E',
          },
        }} />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<CreatePassword />} />
          <Route path="/create-profile" element={<ProtectedRoute><CreateProfile /></ProtectedRoute>} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/find-college" element={<ProtectedRoute><FindCollege /></ProtectedRoute>} />
          <Route path="/find-syllabus" element={<ProtectedRoute><FindSyllabus /></ProtectedRoute>} />
          <Route path="/find-notes" element={<ProtectedRoute><FindNotes /></ProtectedRoute>} />
          <Route path="/find-qpapers" element={<ProtectedRoute><FindQPapers /></ProtectedRoute>} />
          <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
          <Route path="/profile/:id" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
          <Route path="/courses/:courseId" element={<ProtectedRoute><CourseReader /></ProtectedRoute>} />
          <Route path="/courses/:courseId/exam" element={<ProtectedRoute><CourseExam /></ProtectedRoute>} />
          <Route path="/courses/:courseId/certificate" element={<ProtectedRoute><CourseCertificate /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;