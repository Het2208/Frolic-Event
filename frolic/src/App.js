import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './CSS/index.css'; 

import Index from './components/Index'; 
import Event from './components/Event';
import Gallery from './components/Gallary';
import About from './components/About';
import Contact from './components/Contact';
import Login from './components/Login';
import Registration from './pages/Registration';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import AdminDashboard from './components/AdminDashboard';
import InstituteListPage from './components/AdminInstituteList';
import DepartmentListPage from './components/AdminDepartmentList';
import EventListpage from './components/AdminEventList';
import ParticipantListPage from './components/AdminParticipantList';
import GroupListPage from './components/AdminGroupList';
import WinnerDisplayPage from './components/AdminWinnerList';
import AdminLayout from './components/AdminLayout';

function App() {
  return (
    <AuthProvider>
      <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />

          {/* User Routes */}
          <Route element={<ProtectedRoute allowedRoles={['user']} />}>
            <Route path="/home" element={<Index />} />
            <Route path="/events" element={<Event />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="institutes" element={<InstituteListPage />} />
              <Route path="departments" element={<DepartmentListPage />} />
              <Route path="events" element={<EventListpage />} />
              <Route path="participants" element={<ParticipantListPage />} />
              <Route path="groups" element={<GroupListPage />} />
              <Route path="winners" element={<WinnerDisplayPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
      </Router>
    </AuthProvider>
  );
}

export default App;