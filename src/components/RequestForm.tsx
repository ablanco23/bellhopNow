import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirebase } from '../contexts/FirebaseContext';
import { Luggage, Package, ShoppingCart, HelpCircle, Clock, MessageSquare, ArrowLeft } from 'lucide-react';

const RequestForm: React.FC = () => {
  const navigate = useNavigate();
  const { user, signInAsGuest, createBellRequest } = useFirebase();

  const [formData, setFormData] = useState({
    roomNumber: '',
    luggageType: '' as 'suitcase' | 'carry-on' | 'cart' | 'other' | '',
    pickupTime: '' as 'asap' | 'scheduled' | '',
    scheduledTime: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Ensure guest is signed in before proceeding
    if (!user) {
      signInAsGuest().catch((err) => {
        console.error('Anonymous sign-in failed:', err);
        alert('Unable to sign in. Please refresh and try again.');
      });
    }
  }, [user]);

  const luggageOptions = [
    { value: 'suitcase', label: 'Suitcase', icon: Luggage, description: 'Standard luggage bags' },
    { value: 'carry-on', label: 'Carry-on', icon: Package, description: 'Small bags & carry-ons' },
    { value: 'cart', label: 'Multiple Bags', icon: ShoppingCart, description: 'Cart of bags' },
    { value: 'other', label: 'Other', icon: HelpCircle, description: 'Special items' },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.roomNumber.trim()) newErrors.roomNumber = 'Room number is required';
    if (!formData.luggageType) newErrors.luggageType = 'Please select luggage type';
    if (!formData.pickupTime) newErrors.pickupTime = 'Please select pickup time';
    if (formData.pickupTime === 'scheduled' && !formData.scheduledTime) {
      newErrors.scheduledTime = 'Please select a time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      // Ensure guest is authenticated
      if (!user) await signInAsGuest();

      // Construct request payload
      const requestId = await createBellRequest({
        roomNumber: formData.roomNumber,
        luggageType: formData.luggageType,
        pickupTime: formData.pickupTime,
        scheduledTime: formData.pickupTime === 'scheduled' ? formData.scheduledTime : undefined,
        notes: formData.notes || undefined,
      });

      localStorage.setItem('currentRequestId', requestId);
      navigate('/confirmation');
    } catch (err) {
      console.error('Error creating request:', err);
      alert('Failed to create request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
      {/* Header */}
      <div className="sticky top-0 bg-slate-900/90 backdrop-blur-sm border-b border-blue-700/50 z-10">
        <div className="flex items-center px-6 py-4">
          <button onClick={() => navigate('/')} className="mr-4 p-2 rounded-lg hover:bg-slate-700 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold">Request Bellman Service</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-8 space-y-8">
        {/* Room Number */}
        <div>
          <label className="block text-sm font-medium text-blue-200 mb-3">Room Number *</label>
          <input
            type="text"
            value={formData.roomNumber}
            onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
            className={`w-full bg-slate-800 border ${errors.roomNumber ? 'border-red-500' : 'border-blue-600'} rounded-xl px-4 py-4 text-white text-lg focus:outline-none focus:border-amber-500 transition-colors`}
            placeholder="e.g., 1205"
          />
          {errors.roomNumber && <p className="mt-2 text-red-400 text-sm">{errors.roomNumber}</p>}
        </div>

        {/* Luggage Options */}
        <div>
          <label className="block text-sm font-medium text-blue-200 mb-4">Luggage Type *</label>
          <div className="grid grid-cols-2 gap-3">
            {luggageOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  type="button"
                  key={option.value}
                  onClick={() => setFormData({ ...formData, luggageType: option.value })}
                  className={`p-4 rounded-xl border-2 ${
                    formData.luggageType === option.value
                      ? 'border-amber-500 bg-amber-500/10'
                      : 'border-blue-600 bg-slate-800/50 hover:border-blue-500'
                  }`}
                >
                  <Icon className={`w-8 h-8 mx-auto mb-2 ${formData.luggageType === option.value ? 'text-amber-400' : 'text-blue-300'}`} />
                  <div className="text-sm font-medium text-white">{option.label}</div>
                  <div className="text-xs text-blue-200 mt-1">{option.description}</div>
                </button>
              );
            })}
          </div>
          {errors.luggageType && <p className="mt-2 text-red-400 text-sm">{errors.luggageType}</p>}
        </div>

        {/* Pickup Time */}
        <div>
          <label className="block text-sm font-medium text-blue-200 mb-4">Pickup Time *</label>
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, pickupTime: 'asap', scheduledTime: '' })}
              className={`w-full flex items-center p-4 rounded-xl border-2 ${
                formData.pickupTime === 'asap' ? 'border-amber-500 bg-amber-500/10' : 'border-blue-600 bg-slate-800/50 hover:border-blue-500'
              }`}
            >
              <Clock className={`w-6 h-6 mr-3 ${formData.pickupTime === 'asap' ? 'text-amber-400' : 'text-blue-300'}`} />
              <div className="text-left">
                <div className="font-medium text-white">As Soon As Possible</div>
                <div className="text-sm text-blue-200">Average wait: 5-10 minutes</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, pickupTime: 'scheduled' })}
              className={`w-full flex items-center p-4 rounded-xl border-2 ${
                formData.pickupTime === 'scheduled'
                  ? 'border-amber-500 bg-amber-500/10'
                  : 'border-blue-600 bg-slate-800/50 hover:border-blue-500'
              }`}
            >
              <Clock className={`w-6 h-6 mr-3 ${formData.pickupTime === 'scheduled' ? 'text-amber-400' : 'text-blue-300'}`} />
              <div className="text-left">
                <div className="font-medium text-white">Schedule for Later</div>
                <div className="text-sm text-blue-200">Choose a specific time</div>
              </div>
            </button>
          </div>
          {errors.pickupTime && <p className="mt-2 text-red-400 text-sm">{errors.pickupTime}</p>}
        </div>

        {/* Scheduled Time */}
        {formData.pickupTime === 'scheduled' && (
          <div>
            <label className="block text-sm font-medium text-blue-200 mb-3">Select Time *</label>
            <input
              type="datetime-local"
              value={formData.scheduledTime}
              onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
              min={new Date().toISOString().slice(0, 16)}
              className={`w-full bg-slate-800 border ${errors.scheduledTime ? 'border-red-500' : 'border-blue-600'} rounded-xl px-4 py-4 text-white text-lg focus:outline-none focus:border-amber-500 transition-colors`}
            />
            {errors.scheduledTime && <p className="mt-2 text-red-400 text-sm">{errors.scheduledTime}</p>}
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-blue-200 mb-3">Special Instructions (Optional)</label>
          <div className="relative">
            <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-blue-300" />
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-slate-800 border border-blue-600 rounded-xl pl-12 pr-4 py-4 text-white resize-none focus:outline-none focus:border-amber-500 transition-colors"
              rows={3}
              placeholder="e.g., Please knock softly, baby sleeping"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-900 font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-amber-500/25 active:scale-95 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
    </div>
  );
};

export default RequestForm;
