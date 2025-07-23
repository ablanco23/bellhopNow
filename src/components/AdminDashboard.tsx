import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
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
  QrCode,
  Bell
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { requests, updateRequestStatus, logoutAdmin } = useApp();
  
  const [filter, setFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');
  const [roomFilter, setRoomFilter] = useState('');

  const handleLogout = () => {
    logoutAdmin();
    navigate('/');
  };

  const filteredRequests = requests.filter(request => {
    const statusMatch = filter === 'all' || request.status === filter;
    const roomMatch = !roomFilter || request.roomNumber.toLowerCase().includes(roomFilter.toLowerCase());
    return statusMatch && roomMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'in-progress': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'completed': return 'text-green-400 bg-green-400/10 border-green-400/20';
      default: return 'text-blue-300 bg-blue-300/10 border-blue-300/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock;
      case 'in-progress': return PlayCircle;
      case 'completed': return CheckCircle;
      default: return Clock;
    }
  };

  const getLuggageIcon = (type: string) => {
    switch (type) {
      case 'suitcase': return Luggage;
      case 'carry-on': return Package;
      case 'cart': return ShoppingCart;
      case 'other': return HelpCircle;
      default: return Luggage;
    }
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const inProgressCount = requests.filter(r => r.status === 'in-progress').length;
  const completedCount = requests.filter(r => r.status === 'completed').length;

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
              <h1 className="text-xl font-semibold">Admin Dashboard</h1>
              <p className="text-blue-200 text-sm">Manage bellman requests</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/qr-generator')}
              className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
              title="QR Code Generator"
            >
              <QrCode className="w-5 h-5" />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5 text-red-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-amber-400">{pendingCount}</div>
            <div className="text-sm text-blue-200">Pending</div>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{inProgressCount}</div>
            <div className="text-sm text-blue-200">In Progress</div>
          </div>
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{completedCount}</div>
            <div className="text-sm text-blue-200">Completed</div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-wrap gap-2">
            {['all', 'pending', 'in-progress', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === status
                    ? 'bg-amber-500 text-slate-900'
                    : 'bg-slate-700 text-blue-200 hover:bg-slate-600'
                }`}
              >
                {status === 'all' ? 'All' : status.split('-').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </button>
            ))}
          </div>
          
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
                <p className="text-blue-200 text-lg">No requests found</p>
                <p className="text-blue-300 text-sm">Requests will appear here as they come in</p>
              </div>
            </div>
          ) : (
            filteredRequests.map((request) => {
              const StatusIcon = getStatusIcon(request.status);
              const LuggageIcon = getLuggageIcon(request.luggageType);
              
              return (
                <div key={request.id} className="bg-slate-800/60 rounded-xl p-6 border border-blue-700/30">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-slate-700 p-2 rounded-lg">
                        <LuggageIcon className="w-5 h-5 text-blue-200" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">Room {request.roomNumber}</h3>
                        <p className="text-blue-200 text-sm">
                          {format(request.timestamp, 'MMM d, h:mm a')}
                        </p>
                      </div>
                    </div>
                    
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${getStatusColor(request.status)}`}>
                      <StatusIcon className="w-4 h-4" />
                      <span className="text-sm font-medium capitalize">
                        {request.status.replace('-', ' ')}
                      </span>
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

                  {request.status !== 'completed' && (
                    <div className="flex space-x-3">
                      {request.status === 'pending' && (
                        <button
                          onClick={() => updateRequestStatus(request.id, 'in-progress')}
                          className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/20 py-2 px-4 rounded-lg transition-colors"
                        >
                          Start Service
                        </button>
                      )}
                      
                      <button
                        onClick={() => updateRequestStatus(request.id, 'completed')}
                        className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/20 py-2 px-4 rounded-lg transition-colors"
                      >
                        Mark Complete
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;