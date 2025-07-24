import { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  Timestamp,
} from 'firebase/firestore';
import { doc, getDoc } from 'firebase/firestore';
import { UserProfile } from '../types';

export const useRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    const user = auth.currentUser;
    if (!user) return;

    // Fetch user profile to determine role
    const profileSnap = await getDoc(doc(db, 'users', user.uid));
    if (!profileSnap.exists()) {
      console.warn('User profile not found');
      setLoading(false);
      return;
    }

    const profile = profileSnap.data() as UserProfile;

    let q;

    if (profile.role === 'guest') {
      q = query(collection(db, 'requests'), where('guestId', '==', user.uid));
    } else if (profile.role === 'bellman') {
      q = query(collection(db, 'requests'), where('bellmanId', '==', user.uid));
    } else if (profile.role === 'admin') {
      // admins can see all requests (you could filter further if needed)
      q = collection(db, 'requests');
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

    await addDoc(collection(db, 'requests'), {
      ...formData,
      guestId: user.uid, // ✅ NOT userId
      timestamp: new Date()
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
