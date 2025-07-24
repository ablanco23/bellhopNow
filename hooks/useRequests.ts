import { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  getDoc,
} from 'firebase/firestore';
import { UserProfile } from '../types';

export const useRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const profileSnap = await getDoc(doc(db, 'users', user.uid));
    if (!profileSnap.exists()) {
      console.warn('User profile not found');
      setLoading(false);
      return;
    }

    const profile = profileSnap.data() as UserProfile;
    let q;

    // 🔐 Role-based filtering
    if (profile.role === 'guest') {
      q = query(collection(db, 'bellRequests'), where('guestIdentifier', '==', user.uid));
    } else if (profile.role === 'bellman' || profile.role === 'admin') {
      q = collection(db, 'bellRequests'); // Bellmen and admins see all
    } else {
      console.warn('Unknown role:', profile.role);
      setLoading(false);
      return;
    }

    const snapshot = await getDocs(q);
    setRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  };

  const createRequest = async (formData: any) => {
    const user = auth.currentUser;
    if (!user) return;

    await addDoc(collection(db, 'bellRequests'), {
      ...formData,
      guestIdentifier: user.uid, // 🔑 Required for guest filtering
      timestamp: new Date(),
    });

    await loadRequests();
  };

  useEffect(() => {
    if (auth.currentUser) {
      loadRequests();
    }
  }, []);

  return { requests, loading, createRequest, reload: loadRequests };
};
