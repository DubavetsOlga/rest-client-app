'use client';

import {
  createContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/shared/services/firebase';
import { toast } from 'react-toastify';

export type AuthContextValue = {
  isAuth: boolean;
  userName: string;
  loading: boolean;
  setUserName: (name: string) => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, loading, error] = useAuthState(auth);
  const [contextValue, setContextValue] = useState<AuthContextValue>({
    isAuth: false,
    userName: 'Unknown',
    loading: true,
    setUserName: () => {},
  });

  useEffect(() => {
    setContextValue((prev) => ({
      ...prev,
      isAuth: !!user,
      userName: user?.displayName || 'Unknown',
      loading,
    }));
  }, [user, loading]);

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  const handleSetUserName = useCallback((name: string) => {
    setContextValue((prev) => ({
      ...prev,
      userName: name || 'Unknown',
    }));
  }, []);

  return (
    <AuthContext.Provider
      value={{ ...contextValue, setUserName: handleSetUserName }}
    >
      {children}
    </AuthContext.Provider>
  );
}
