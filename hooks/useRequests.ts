// hooks/useRequests.ts
import { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
} from 'firebase/firestore';

export const useRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, 'requests'), where('userId', '==', user.uid));
    const snapshot = await getDocs(q);
    setRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  };

  const createRequest = async (formData: any) => {
    const user = auth.currentUser;
    if (!user) return;

    await addDoc(collection(db, 'requests'), {
      ...formData,
      userId: user.uid,
      timestamp: new Date(),
    });

    await loadRequests();
  };

  useEffect(() => {
    if (auth.currentUser) {
      loadRequests();
    }
  }, []);

  return { requests, loading, createRequest };
};
