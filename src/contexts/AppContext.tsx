import React, { createContext, useContext, useState, useEffect } from 'react';
import { LuggageRequest } from '../types';

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

  useEffect(() => {
    const saved = localStorage.getItem('bellhop-requests');
    if (saved) {
      const parsedRequests = JSON.parse(saved).map((req: any) => ({
        ...req,
        timestamp: new Date(req.timestamp)
      }));
      setRequests(parsedRequests);
    }

    const adminStatus = localStorage.getItem('bellhop-admin-logged-in');
    if (adminStatus === 'true') {
      setIsAdminLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('bellhop-requests', JSON.stringify(requests));
  }, [requests]);

  const addRequest = (requestData: Omit<LuggageRequest, 'id' | 'status' | 'timestamp'>) => {
    const newRequest: LuggageRequest = {
      ...requestData,
      id: Date.now().toString(),
      status: 'pending',
      timestamp: new Date(),
    };
    setRequests(prev => [newRequest, ...prev]);
  };

  const updateRequestStatus = (id: string, status: LuggageRequest['status']) => {
    setRequests(prev => 
      prev.map(req => req.id === id ? { ...req, status } : req)
    );
  };

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