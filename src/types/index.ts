export interface LuggageRequest {
  id: string;
  roomNumber: string;
  luggageType: 'suitcase' | 'carry-on' | 'cart' | 'other';
  pickupTime: 'asap' | 'scheduled';
  scheduledTime?: string;
  notes?: string;
  status: 'pending' | 'in-progress' | 'completed';
  timestamp: Date;
}

export interface Admin {
  username: string;
  password: string;
}