export type UserRole = 'guest' | 'bellman' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  displayName?: string;
}

export interface LuggageRequest {
  id: string;
  guestId: string;
  guestName?: string;
  roomNumber: string;
  notes?: string;
  status: 'pending' | 'accepted' | 'completed';
  bellmanId?: string;
  bellmanName?: string;
  timestamp: Date;
  acceptedAt?: Date;
  scheduledTime?: string; // optional ISO timestamp string
}
