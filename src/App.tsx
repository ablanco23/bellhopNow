import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Welcome from './components/Welcome';
import RequestForm from './components/RequestForm';
import Confirmation from './components/Confirmation';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import QRGenerator from './components/QRGenerator';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/request" element={<RequestForm />} />
            <Route path="/confirmation" element={<Confirmation />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/qr-generator" element={
              <ProtectedRoute>
                <QRGenerator />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;