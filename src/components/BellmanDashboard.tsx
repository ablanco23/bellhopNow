import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirebase } from '../contexts/FirebaseContext';
import { format } from 'date-fns';
import { 
  LogOut, 
  Clock, 
  CheckCircle, 
  PlayCircle, 
  Filter,
  Package,
  Luggage,
  ShoppingCart,
  HelpCircle,
  Bell,
  User,
  Calendar
} from 'lucide-react';
import { LuggageRequest } from '../types';

const BellmanDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile, signOutUser, acceptRequest, subscribeToPendingRequests } = useFirebase();
  const [pendingRequests, setPendingRequests] = useState<LuggageRequest[]>([]);
  const [roomFilter, setRoomFilter] = useState('');
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToPendingRequests((requests) => {
      setPendingRequests(requests);
    });

    return unsubscribe;
  }, [subscribeToPendingRequests]);

  const handleLogout = async () => {
    await signOutUser();
    navigate('/');
  };

  const handleAcceptRequest = async (requestId: string) => {
    setLoading(requestId);
    try {
      await acceptRequest(requestId);
      // Request will automatically disappear from pending list due to real-time updates
    } catch (error) {
      console.error('Error accepting request:', error);
      alert('Failed to accept request. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const filteredRequests = pendingRequests.filter(request => {
    const roomMatch = !roomFilter || request.roomNumber.toLowerCase().includes(roomFilter.toLowerCase());
    return roomMatch;
  });

  const getLuggageIcon = (type: string) => {
    switch (type) {
      case 'suitcase': return Luggage;
      case 'carry-on': return Package;
      case 'cart': return ShoppingCart;
      case 'other': return HelpCircle;
      default: return Luggage;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
      {/* Header */}
      <div className="sticky top-0 bg-slate-900/90 backdrop-blur-sm border-b border-blue-700/50 z-10">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-amber-500 to-yellow-600 p-2 rounded-lg shadow-lg">
              <Bell className="w-6 h-6 text-slate-900" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Bellman Dashboard</h1>
              <p className="text-blue-200 text-sm">Welcome, {userProfile?.displayName || userProfile?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5 text-red-400" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 py-6">
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6 mb-6 text-center">
          <div className="text-3xl font-bold text-amber-400 mb-2">{pendingRequests.length}</div>
          <div className="text-blue-200">Pending Requests</div>
        </div>

        {/* Room Filter */}
        <div className="mb-6">
          <div className="relative">
            <Filter className="absolute left-3 top-3 w-5 h-5 text-blue-300" />
            <input
              type="text"
              value={roomFilter}
              onChange={(e) => setRoomFilter(e.target.value)}
              className="w-full bg-slate-800 border border-blue-600 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
              placeholder="Filter by room number..."
            />
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-slate-800/60 rounded-xl p-8 border border-blue-700/30">
                <Bell className="w-12 h-12 text-blue-300 mx-auto mb-4" />
                <p className="text-blue-200 text-lg">No pending requests</p>
                <p className="text-blue-300 text-sm">New requests will appear here automatically</p>
              </div>
            </div>
          ) : (
            filteredRequests.map((request) => {
              const LuggageIcon = getLuggageIcon(request.luggageType);
              const isLoading = loading === request.id;
              
              return (
                <div 
                  key={request.id} 
                  id={`request-${request.id}`}
                  className="bg-slate-800/60 rounded-xl p-6 border border-blue-700/30 transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-slate-700 p-2 rounded-lg">
                        <LuggageIcon className="w-5 h-5 text-blue-200" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">Room {request.roomNumber}</h3>
                        <p className="text-blue-200 text-sm flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {format(request.timestamp, 'MMM d, h:mm a')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 px-3 py-1 rounded-full border border-amber-400/20 bg-amber-400/10">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <span className="text-sm font-medium text-amber-400">Pending</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-blue-200">Luggage: </span>
                      <span className="text-white capitalize">{request.luggageType.replace('-', ' ')}</span>
                    </div>
                    <div>
                      <span className="text-blue-200">Pickup: </span>
                      <span className="text-white">
                        {request.pickupTime === 'asap' ? 'ASAP' : 
                         request.scheduledTime ? format(new Date(request.scheduledTime), 'h:mm a') : 'Scheduled'}
                      </span>
                    </div>
                  </div>

                  {request.notes && (
                    <div className="mb-4 p-3 bg-slate-700/60 rounded-lg">
                      <p className="text-blue-100 text-sm">{request.notes}</p>
                    </div>
                  )}

                  <button
                    onClick={() => handleAcceptRequest(request.id)}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-900 font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:transform-none flex items-center justify-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                        <span>Accepting...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        <span>Accept Request</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default BellmanDashboard;