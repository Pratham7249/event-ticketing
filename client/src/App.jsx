import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EventManager from './pages/EventManager';
import PublicEvent from './pages/PublicEvent';
import TicketView from './pages/TicketView';
import ExploreEvents from './pages/ExploreEvents';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Login isRegister={true} />} />

        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/event/:eventId/manage" element={<ProtectedRoute><EventManager /></ProtectedRoute>} />

        {/* Public Routes */}
        <Route path="/explore" element={<ExploreEvents />} />
        <Route path="/p/event/:eventId" element={<PublicEvent />} />
        <Route path="/ticket/:ticketId" element={<TicketView />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
