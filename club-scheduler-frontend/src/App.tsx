import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ScheduleSetupPage from './pages/ScheduleSetupPage';
import ScheduleCompletePage from './pages/ScheduleCompletePage';
import ScheduleModifiedCompletePage from './pages/ScheduleModifiedCompletePage';
import EventsPage from './pages/EventsPage';
import EventManagementPage from './pages/EventManagementPage';
import MeetingSetupPage from './pages/MeetingSetupPage';
import MeetingCompletePage from './pages/MeetingCompletePage';
import MeetingJoinPage from './pages/MeetingJoinPage';
import MeetingParticipantPage from './pages/MeetingParticipantPage';
import MeetingParticipantCompletePage from './pages/MeetingParticipantCompletePage';
import AvailabilityHeatmapPage from './pages/AvailabilityHeatmapPage';
import { GlobalStyle } from './styles/GlobalStyle';

const AppRoutes: React.FC = () => {
  const auth = useAuth();

  return (
    <Routes>
      <Route 
        path="/" 
        element={<HomePage />} 
      />
      <Route 
        path="/login" 
        element={auth.user ? <Navigate to="/" /> : <LoginPage />} 
      />
      <Route 
        path="/signup" 
        element={auth.user ? <Navigate to="/" /> : <SignupPage />} 
      />
      <Route 
        path="/schedule" 
        element={auth.user ? <ScheduleSetupPage /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/schedule/setup" 
        element={auth.user ? <ScheduleSetupPage /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/schedule/complete" 
        element={auth.user ? <ScheduleCompletePage /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/schedule/modified-complete" 
        element={auth.user ? <ScheduleModifiedCompletePage /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/events" 
        element={auth.user ? <EventsPage /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/event-management" 
        element={auth.user ? <EventManagementPage /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/meeting/setup" 
        element={auth.user ? <MeetingSetupPage /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/meeting/complete" 
        element={auth.user ? <MeetingCompletePage /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/meeting/join" 
        element={<MeetingJoinPage />} 
      />
      <Route 
        path="/meeting/participant" 
        element={<MeetingParticipantPage />} 
      />
      <Route 
        path="/meeting/participant-complete" 
        element={<MeetingParticipantCompletePage />} 
      />
      <Route 
        path="/availability/heatmap" 
        element={<AvailabilityHeatmapPage />} 
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <GlobalStyle />
        <Header />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;