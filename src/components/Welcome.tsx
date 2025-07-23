import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Luggage, Star, Clock, Shield } from 'lucide-react';

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/10 to-amber-500/5"></div>
        <div className="relative px-6 py-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-yellow-400 to-amber-500 p-3 rounded-full">
              <Luggage className="w-8 h-8 text-black" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-amber-300 bg-clip-text text-transparent mb-2">
            BellhopNow
          </h1>
          <p className="text-gray-300 text-lg">Premium Luggage Assistance</p>
        </div>
      </div>

      {/* Welcome Content */}
      <div className="px-6 py-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Welcome to Our Hotel
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            Need help with your luggage? Our professional bellman service is here to assist you 24/7.
          </p>
        </div>

        {/* Features */}
        <div className="space-y-6 mb-12">
          <div className="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-700/50">
            <div className="bg-yellow-500/20 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Fast Response</h3>
              <p className="text-gray-400 text-sm">Average response time under 5 minutes</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-700/50">
            <div className="bg-yellow-500/20 p-3 rounded-lg">
              <Star className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Professional Service</h3>
              <p className="text-gray-400 text-sm">Trained and courteous staff</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-700/50">
            <div className="bg-yellow-500/20 p-3 rounded-lg">
              <Shield className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Safe & Secure</h3>
              <p className="text-gray-400 text-sm">Your belongings are in safe hands</p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button
            onClick={() => navigate('/request')}
            className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-yellow-500/25 active:scale-95"
          >
            Request Bellman Service
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-6 text-center text-gray-500 text-sm border-t border-gray-800">
        <p>Available 24/7 • Scan QR code in your room for quick access</p>
      </div>
    </div>
  );
};

export default Welcome;