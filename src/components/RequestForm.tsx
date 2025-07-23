import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Luggage, Package, ShoppingCart, HelpCircle, Clock, MessageSquare, ArrowLeft } from 'lucide-react';

const RequestForm: React.FC = () => {
  const navigate = useNavigate();
  const { addRequest } = useApp();
  
  const [formData, setFormData] = useState({
    roomNumber: '',
    luggageType: '' as 'suitcase' | 'carry-on' | 'cart' | 'other' | '',
    pickupTime: '' as 'asap' | 'scheduled' | '',
    scheduledTime: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const luggageOptions = [
    { value: 'suitcase', label: 'Suitcase', icon: Luggage, description: 'Standard luggage bags' },
    { value: 'carry-on', label: 'Carry-on', icon: Package, description: 'Small bags & carry-ons' },
    { value: 'cart', label: 'Multiple Bags', icon: ShoppingCart, description: 'Cart of bags' },
    { value: 'other', label: 'Other', icon: HelpCircle, description: 'Special items' },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.roomNumber.trim()) {
      newErrors.roomNumber = 'Room number is required';
    }

    if (!formData.luggageType) {
      newErrors.luggageType = 'Please select luggage type';
    }

    if (!formData.pickupTime) {
      newErrors.pickupTime = 'Please select pickup time';
    }

    if (formData.pickupTime === 'scheduled' && !formData.scheduledTime) {
      newErrors.scheduledTime = 'Please select a time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      addRequest({
        roomNumber: formData.roomNumber,
        luggageType: formData.luggageType as 'suitcase' | 'carry-on' | 'cart' | 'other',
        pickupTime: formData.pickupTime as 'asap' | 'scheduled',
        scheduledTime: formData.pickupTime === 'scheduled' ? formData.scheduledTime : undefined,
        notes: formData.notes || undefined,
      });
      
      navigate('/confirmation');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Header */}
      <div className="sticky top-0 bg-gray-900/90 backdrop-blur-sm border-b border-gray-700 z-10">
        <div className="flex items-center px-6 py-4">
          <button
            onClick={() => navigate('/')}
            className="mr-4 p-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold">Request Bellman Service</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-8 space-y-8">
        {/* Room Number */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Room Number *
          </label>
          <input
            type="text"
            value={formData.roomNumber}
            onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
            className={`w-full bg-gray-800 border ${errors.roomNumber ? 'border-red-500' : 'border-gray-600'} rounded-xl px-4 py-4 text-white text-lg focus:outline-none focus:border-yellow-500 transition-colors`}
            placeholder="e.g., 1205"
          />
          {errors.roomNumber && (
            <p className="mt-2 text-red-400 text-sm">{errors.roomNumber}</p>
          )}
        </div>

        {/* Luggage Type */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-4">
            Luggage Type *
          </label>
          <div className="grid grid-cols-2 gap-3">
            {luggageOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, luggageType: option.value as any })}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.luggageType === option.value
                      ? 'border-yellow-500 bg-yellow-500/10'
                      : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                  }`}
                >
                  <IconComponent className={`w-8 h-8 mx-auto mb-2 ${
                    formData.luggageType === option.value ? 'text-yellow-400' : 'text-gray-400'
                  }`} />
                  <div className="text-sm font-medium text-white">{option.label}</div>
                  <div className="text-xs text-gray-400 mt-1">{option.description}</div>
                </button>
              );
            })}
          </div>
          {errors.luggageType && (
            <p className="mt-2 text-red-400 text-sm">{errors.luggageType}</p>
          )}
        </div>

        {/* Pickup Time */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-4">
            Pickup Time *
          </label>
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, pickupTime: 'asap', scheduledTime: '' })}
              className={`w-full flex items-center p-4 rounded-xl border-2 transition-all ${
                formData.pickupTime === 'asap'
                  ? 'border-yellow-500 bg-yellow-500/10'
                  : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
              }`}
            >
              <Clock className={`w-6 h-6 mr-3 ${
                formData.pickupTime === 'asap' ? 'text-yellow-400' : 'text-gray-400'
              }`} />
              <div className="text-left">
                <div className="font-medium text-white">As Soon As Possible</div>
                <div className="text-sm text-gray-400">Average wait: 5-10 minutes</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, pickupTime: 'scheduled' })}
              className={`w-full flex items-center p-4 rounded-xl border-2 transition-all ${
                formData.pickupTime === 'scheduled'
                  ? 'border-yellow-500 bg-yellow-500/10'
                  : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
              }`}
            >
              <Clock className={`w-6 h-6 mr-3 ${
                formData.pickupTime === 'scheduled' ? 'text-yellow-400' : 'text-gray-400'
              }`} />
              <div className="text-left">
                <div className="font-medium text-white">Schedule for Later</div>
                <div className="text-sm text-gray-400">Choose a specific time</div>
              </div>
            </button>
          </div>
          {errors.pickupTime && (
            <p className="mt-2 text-red-400 text-sm">{errors.pickupTime}</p>
          )}
        </div>

        {/* Scheduled Time Input */}
        {formData.pickupTime === 'scheduled' && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Select Time *
            </label>
            <input
              type="datetime-local"
              value={formData.scheduledTime}
              onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
              min={new Date().toISOString().slice(0, 16)}
              className={`w-full bg-gray-800 border ${errors.scheduledTime ? 'border-red-500' : 'border-gray-600'} rounded-xl px-4 py-4 text-white text-lg focus:outline-none focus:border-yellow-500 transition-colors`}
            />
            {errors.scheduledTime && (
              <p className="mt-2 text-red-400 text-sm">{errors.scheduledTime}</p>
            )}
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Special Instructions (Optional)
          </label>
          <div className="relative">
            <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-gray-800 border border-gray-600 rounded-xl pl-12 pr-4 py-4 text-white resize-none focus:outline-none focus:border-yellow-500 transition-colors"
              rows={3}
              placeholder="e.g., Please knock softly, baby sleeping"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-yellow-500/25 active:scale-95"
        >
          Submit Request
        </button>
      </form>
    </div>
  );
};

export default RequestForm;