import React, { createContext, useContext, useState, useEffect } from 'react';
import { LuggageRequest } from '../types';
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
  getDocs
} from 'firebase/firestore';
import { db } from '../firebase';

interface AppContextType {
  requests: LuggageRequest[];
  addRequest: (request: Omit<LuggageRequest, 'id' | 'status' | 'timestamp'>) => void;
  updateRequestStatus: (id: string, status: LuggageRequest['status']) => void;
  isAdminLoggedIn: boolean;
  loginAdmin: (username: string, password: string) => boolean;
  logoutAdmin: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'bellhop2024'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [requests, setRequests] = useState<LuggageRequest[]>([]);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const requestsRef = collection(db, 'requests');

  useEffect(() => {
    const q = query(requestsRef, orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedRequests = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as any)
      })) as LuggageRequest[];

      setRequests(loadedRequests);
    });

    const adminStatus = localStorage.getItem('bellhop-admin-logged-in');
    if (adminStatus === 'true') {
      setIsAdminLoggedIn(true);
    }

    return () => unsubscribe();
  }, []);

  const addRequest = async (requestData: Omit<LuggageRequest, 'id' | 'status' | 'timestamp'>) => {
    await addDoc(requestsRef, {
      ...requestData,
      status: 'pending',
      timestamp: serverTimestamp(),
    });
  };

  const updateRequestStatus = async (id: string, status: LuggageRequest['status']) => {
    const requestDoc = doc(db, 'requests', id);
    await addDoc(requestsRef, {
      ...requestDoc,
      status,
    });
  };

  const deleteOldRequests = async () => {
    const snapshot = await getDocs(requestsRef);
    const now = new Date().getTime();

    snapshot.forEach(async (docSnap) => {
      const data = docSnap.data();
      if (data.timestamp?.toDate) {
        const timestamp = data.timestamp.toDate().getTime();
        const ageInHours = (now - timestamp) / (1000 * 60 * 60);
        if (ageInHours > 24) {
          await deleteDoc(doc(db, 'requests', docSnap.id));
        }
      }
    });
  };

  useEffect(() => {
    if (isAdminLoggedIn) {
      deleteOldRequests();
    }
  }, [isAdminLoggedIn]);

  const loginAdmin = (username: string, password: string): boolean => {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      setIsAdminLoggedIn(true);
      localStorage.setItem('bellhop-admin-logged-in', 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('bellhop-admin-logged-in');
  };

  return (
    <AppContext.Provider value={{
      requests,
      addRequest,
      updateRequestStatus,
      isAdminLoggedIn,
      loginAdmin,
      logoutAdmin,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
