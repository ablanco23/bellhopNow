import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { FirebaseProvider } from './contexts/FirebaseContext';
import Welcome from './components/Welcome';
import RequestForm from './components/RequestForm';
import Confirmation from './components/Confirmation';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import QRGenerator from './components/QRGenerator';
import BellmanLogin from './components/BellmanLogin';
import BellmanDashboard from './components/BellmanDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import BellmanProtectedRoute from './components/BellmanProtectedRoute';

function App() {
  return (
    <FirebaseProvider>
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
              <Route path="/bellman-login" element={<BellmanLogin />} />
              <Route path="/bellman" element={
                <BellmanProtectedRoute>
                  <BellmanDashboard />
                </BellmanProtectedRoute>
              } />
            </Routes>
          </div>
        </Router>
      </AppProvider>
    </FirebaseProvider>
  );
}

export default App;