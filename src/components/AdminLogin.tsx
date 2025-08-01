import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Lock, User, ArrowLeft, Eye, EyeOff } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { loginAdmin } = useApp();
  
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (loginAdmin(credentials.username, credentials.password)) {
      navigate('/admin');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="absolute top-6 left-6 p-2 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          
          <div className="bg-gradient-to-r from-amber-500 to-yellow-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 shadow-lg">
            <Lock className="w-8 h-8 text-slate-900" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Staff Login</h1>
          <p className="text-blue-200">Access the admin dashboard</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-blue-200 mb-3">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-4 top-4 w-5 h-5 text-blue-300" />
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                className="w-full bg-slate-800 border border-blue-600 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-amber-500 transition-colors"
                placeholder="Enter username"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-200 mb-3">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-4 w-5 h-5 text-blue-300" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="w-full bg-slate-800 border border-blue-600 rounded-xl pl-12 pr-12 py-4 text-white focus:outline-none focus:border-amber-500 transition-colors"
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-blue-300 hover:text-blue-200"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-900 font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-amber-500/25 active:scale-95"
          >
            Sign In
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-8 p-4 bg-slate-800/40 rounded-xl border border-blue-700/30">
          <p className="text-blue-200 text-sm mb-2">Demo Credentials:</p>
          <p className="text-white text-sm">Username: <span className="text-amber-400">admin</span></p>
          <p className="text-white text-sm">Password: <span className="text-amber-400">bellhop2024</span></p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;