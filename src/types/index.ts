export type UserRole = 'guest' | 'bellman' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  displayName: string; // made required to avoid Firebase "undefined" errors
}

export interface LuggageRequest {
  id: string;
  guestId: string;
  guestName: string; // made required for consistency
  roomNumber: string;
  notes?: string;
  status: 'pending' | 'accepted' | 'completed';
  bellmanId?: string;
  bellmanName?: string;
  timestamp: Date;
  acceptedAt?: Date;
  scheduledTime: string; // made required to avoid undefined Firestore errors
}
