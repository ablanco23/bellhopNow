import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  signInAnonymously,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { UserProfile, LuggageRequest } from '../types';

interface FirebaseContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signInAsGuest: () => Promise<void>;
  signInAsBellman: (email: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
  createBellRequest: (request: Omit<LuggageRequest, 'id' | 'status' | 'timestamp' | 'guestId'>) => Promise<string>;
  acceptRequest: (requestId: string) => Promise<void>;
  updateRequestStatus: (requestId: string, status: LuggageRequest['status']) => Promise<void>;
  subscribeToUserRequests: (guestId: string, callback: (requests: LuggageRequest[]) => void) => () => void;
  subscribeToPendingRequests: (callback: (requests: LuggageRequest[]) => void) => () => void;
  subscribeToRequest: (requestId: string, callback: (request: LuggageRequest | null) => void) => () => void;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserProfile(userDoc.data() as UserProfile);
        } else {
          const profile: UserProfile = {
            uid: user.uid,
            email: user.email || '',
            role: 'guest',
            displayName: user.displayName ?? 'Guest'
          };

          await setDoc(doc(db, 'users', user.uid), profile);
          setUserProfile(profile);
        }
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInAsGuest = async () => {
    await signInAnonymously(auth);
  };

  const signInAsBellman = async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, 'users', result.user.uid));
    if (!userDoc.exists() || userDoc.data().role !== 'bellman') {
      await signOut(auth);
      throw new Error('Access denied. Bellman credentials required.');
    }
  };

  const signOutUser = async () => {
    await signOut(auth);
  };

  const createBellRequest = async (requestData: Omit<LuggageRequest, 'id' | 'status' | 'timestamp' | 'userId'>): Promise<string> => {
    if (!user) throw new Error('User must be authenticated');

    const request = {
      ...requestData,
      status: 'pending' as const,
      timestamp: serverTimestamp(),
      userId: user.uid, // ✅ This must match Firestore rule check
      scheduledTime: requestData.scheduledTime ?? ''
    };

    const docRef = await addDoc(collection(db, 'bellRequests'), request);
    return docRef.id;
  };


  const acceptRequest = async (requestId: string) => {
    if (!user || !userProfile || userProfile.role !== 'bellman') {
      throw new Error('Only bellmen can accept requests');
    }

    await updateDoc(doc(db, 'bellRequests', requestId), {
      status: 'accepted',
      bellmanId: user.uid,
      bellmanName: userProfile.displayName || userProfile.email,
      acceptedAt: serverTimestamp()
    });
  };

  const updateRequestStatus = async (requestId: string, status: LuggageRequest['status']) => {
    if (!user || !userProfile || (userProfile.role !== 'bellman' && userProfile.role !== 'admin')) {
      throw new Error('Insufficient permissions');
    }

    await updateDoc(doc(db, 'bellRequests', requestId), {
      status
    });
  };

  const subscribeToUserRequests = (guestId: string, callback: (requests: LuggageRequest[]) => void) => {
    const q = query(
      collection(db, 'bellRequests'),
      where('guestId', '==', guestId),
      orderBy('timestamp', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const requests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(),
        acceptedAt: doc.data().acceptedAt?.toDate()
      })) as LuggageRequest[];

      callback(requests);
    });
  };

  const subscribeToPendingRequests = (callback: (requests: LuggageRequest[]) => void) => {
    const q = query(
      collection(db, 'bellRequests'),
      where('status', '==', 'pending'),
      orderBy('timestamp', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const requests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      })) as LuggageRequest[];

      callback(requests);
    });
  };

  const subscribeToRequest = (requestId: string, callback: (request: LuggageRequest | null) => void) => {
    return onSnapshot(doc(db, 'bellRequests', requestId), (doc) => {
      if (doc.exists()) {
        const request = {
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate() || new Date(),
          acceptedAt: doc.data().acceptedAt?.toDate()
        } as LuggageRequest;
        callback(request);
      } else {
        callback(null);
      }
    });
  };

  return (
    <FirebaseContext.Provider value={{
      user,
      userProfile,
      loading,
      signInAsGuest,
      signInAsBellman,
      signOutUser,
      createBellRequest,
      acceptRequest,
      updateRequestStatus,
      subscribeToUserRequests,
      subscribeToPendingRequests,
      subscribeToRequest
    }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
