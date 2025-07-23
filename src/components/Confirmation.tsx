import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirebase } from '../contexts/FirebaseContext';
import { CheckCircle, Clock, Phone, Home, User } from 'lucide-react';
import { LuggageRequest } from '../types';

const Confirmation: React.FC = () => {
  const navigate = useNavigate();
  const { user, subscribeToRequest } = useFirebase();
  const [currentRequest, setCurrentRequest] = useState<LuggageRequest | null>(null);
  const [showAcceptedBanner, setShowAcceptedBanner] = useState(false);

  // Get the most recent request ID from localStorage or URL params
  const requestId = localStorage.getItem('currentRequestId');

  useEffect(() => {
    if (!requestId) {
      navigate('/');
      return;
    }

    // Subscribe to the current request for real-time updates
    const unsubscribe = subscribeToRequest(requestId, (request) => {
      setCurrentRequest(request);
      
      // Show banner when request is accepted
      if (request && request.status === 'accepted' && request.bellmanName && !showAcceptedBanner) {
        setShowAcceptedBanner(true);
      }
    });

    // Auto redirect after 30 seconds
    const timer = setTimeout(() => {
      navigate('/');
    }, 60000); // Extended to 60 seconds to allow time to see acceptance

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, [navigate, requestId, subscribeToRequest, showAcceptedBanner]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        {/* Accepted Banner */}
        {showAcceptedBanner && currentRequest?.bellmanName && (
          <div className="mb-6 bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-6 animate-bounce">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <CheckCircle className="w-7 h-7 text-emerald-400" />
              <span className="text-emerald-400 font-bold text-lg">Request Accepted!</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <User className="w-5 h-5 text-emerald-300" />
              <span className="text-emerald-300 font-medium text-lg">✅ {currentRequest.bellmanName} is on the way!</span>
            </div>
          </div>
        )}

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
          {showAcceptedBanner ? (
            <p className="text-xl text-emerald-300 mb-6">
              Your bellman is on the way!
            </p>
          ) : (
            <p className="text-xl text-blue-100 mb-6">
              Thank you, waiting for bellman acceptance
            </p>
          )}
          <div className="bg-slate-800/60 rounded-xl p-6 backdrop-blur-sm border border-blue-700/30">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Clock className="w-5 h-5 text-amber-400" />
              <span className="text-blue-200">
                {showAcceptedBanner ? 'Estimated arrival time' : 'Waiting for acceptance'}
              </span>
            </div>
            <p className="text-2xl font-semibold text-amber-400">
              {showAcceptedBanner ? '5-10 minutes' : 'Waiting for acceptance...'}
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-4 mb-12">
          <div className="flex items-start space-x-4 p-4 bg-slate-800/40 rounded-xl">
            <Phone className="w-6 h-6 text-amber-400 mt-1 flex-shrink-0" />
            <div className="text-left">
              <p className="text-white font-medium">We'll call your room</p>
              <p className="text-blue-200 text-sm">Our bellman will contact you before arrival</p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 bg-slate-800/40 rounded-xl">
            <Home className="w-6 h-6 text-amber-400 mt-1 flex-shrink-0" />
            <div className="text-left">
              <p className="text-white font-medium">Stay in your room</p>
              <p className="text-blue-200 text-sm">Please remain available for pickup</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <button
            onClick={() => navigate('/request')}
            className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            Make Another Request
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-900 font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            Back to Home
          </button>
        </div>

        <p className="text-blue-300 text-sm mt-8">
          Need immediate assistance? Call front desk at ext. 0
        </p>
      </div>
    </div>
  );
};

export default Confirmation;