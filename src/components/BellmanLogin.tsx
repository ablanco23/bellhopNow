import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirebase } from '../contexts/FirebaseContext';
import { Lock, User, ArrowLeft, Eye, EyeOff, Bell } from 'lucide-react';

const BellmanLogin: React.FC = () => {
  const navigate = useNavigate();
  const { signInAsBellman } = useFirebase();
  
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await signInAsBellman(credentials.email, credentials.password);
      navigate('/bellman');
    } catch (error: any) {
      setError(error.message || 'Invalid credentials');
    } finally {
      setLoading(false);
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
            <Bell className="w-8 h-8 text-slate-900" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Bellman Login</h1>
          <p className="text-blue-200">Access the bellman dashboard</p>
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
              Email
            </label>
            <div className="relative">
              <User className="absolute left-4 top-4 w-5 h-5 text-blue-300" />
              <input
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                className="w-full bg-slate-800 border border-blue-600 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-amber-500 transition-colors"
                placeholder="Enter your email"
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
                placeholder="Enter your password"
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
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-900 font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-amber-500/25 active:scale-95 disabled:opacity-50 disabled:transform-none"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Note */}
        <div className="mt-8 p-4 bg-slate-800/40 rounded-xl border border-blue-700/30">
          <p className="text-blue-200 text-sm mb-2">Demo Bellman Account:</p>
          <p className="text-white text-sm">Create a Firebase user with role: "bellman"</p>
        </div>
      </div>
    </div>
  );
};

export default BellmanLogin;