import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, Phone, Home } from 'lucide-react';

const Confirmation: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto redirect after 30 seconds
    const timer = setTimeout(() => {
      navigate('/');
    }, 30000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        {/* Success Animation */}
        <div className="mb-8">
          <div className="mx-auto w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center animate-pulse">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Confirmation Message */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-white mb-4">
            Request Received!
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Thank you, your bellman is on the way
          </p>
          <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm border border-gray-700/50">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Clock className="w-5 h-5 text-yellow-400" />
              <span className="text-gray-300">Estimated arrival time</span>
            </div>
            <p className="text-2xl font-semibold text-yellow-400">5-10 minutes</p>
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-4 mb-12">
          <div className="flex items-start space-x-4 p-4 bg-gray-800/30 rounded-xl">
            <Phone className="w-6 h-6 text-yellow-400 mt-1 flex-shrink-0" />
            <div className="text-left">
              <p className="text-white font-medium">We'll call your room</p>
              <p className="text-gray-400 text-sm">Our bellman will contact you before arrival</p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 bg-gray-800/30 rounded-xl">
            <Home className="w-6 h-6 text-yellow-400 mt-1 flex-shrink-0" />
            <div className="text-left">
              <p className="text-white font-medium">Stay in your room</p>
              <p className="text-gray-400 text-sm">Please remain available for pickup</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <button
            onClick={() => navigate('/request')}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            Make Another Request
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            Back to Home
          </button>
        </div>

        <p className="text-gray-500 text-sm mt-8">
          Need immediate assistance? Call front desk at ext. 0
        </p>
      </div>
    </div>
  );
};

export default Confirmation;