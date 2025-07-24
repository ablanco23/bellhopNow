export type UserRole = 'guest' | 'bellman' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  displayName: string; // made required to avoid Firebase "undefined" errors
}

export interface LuggageRequest {
  id: string;
  roomNumber: string;
  luggageType: string;
  pickupTime: string;
  scheduledTime?: string;
  notes?: string;
  status: 'pending' | 'accepted' | 'completed';
  timestamp: Date;
  acceptedAt?: Date;
  bellmanId?: string;
  bellmanName?: string;
  guestIdentifier: string;      // e.g., "1205-7025551234"
  phoneNumber: string;          // optional but useful
}

