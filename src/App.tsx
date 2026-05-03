import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthContext';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import RoadmapGenerator from './pages/RoadmapGenerator';
import SavedRoadmaps from './pages/SavedRoadmaps';
import StudyPlanner from './pages/StudyPlanner';
import SkillTracker from './pages/SkillTracker';
import Notes from './pages/Notes';
import Resources from './pages/Resources';
import InterviewPrep from './pages/InterviewPrep';
import ResumeCritic from './pages/ResumeCritic';
import JobBoard from './pages/JobBoard';
import FocusMode from './pages/FocusMode';
import Assignments from './pages/Assignments';
import InternshipTracker from './pages/InternshipTracker';
import Profile from './pages/Profile';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0E7C66]"></div>
    </div>
  );
  
  if (!user) return <Navigate to="/login" replace />;

  return <Layout>{children}</Layout>;
};

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/roadmaps" element={<ProtectedRoute><RoadmapGenerator /></ProtectedRoute>} />
        <Route path="/saved-roadmaps" element={<ProtectedRoute><SavedRoadmaps /></ProtectedRoute>} />
        <Route path="/study-planner" element={<ProtectedRoute><StudyPlanner /></ProtectedRoute>} />
        <Route path="/skill-tracker" element={<ProtectedRoute><SkillTracker /></ProtectedRoute>} />
        <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
        <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
        <Route path="/interview-prep" element={<ProtectedRoute><InterviewPrep /></ProtectedRoute>} />
        <Route path="/resume-critic" element={<ProtectedRoute><ResumeCritic /></ProtectedRoute>} />
        <Route path="/jobs" element={<ProtectedRoute><JobBoard /></ProtectedRoute>} />
        <Route path="/focus" element={<ProtectedRoute><FocusMode /></ProtectedRoute>} />
        <Route path="/assignments" element={<ProtectedRoute><Assignments /></ProtectedRoute>} />
        <Route path="/internships" element={<ProtectedRoute><InternshipTracker /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
