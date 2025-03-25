'use client';

import { createContext, ReactNode } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/shared/services/firebase';
import { toast } from 'react-toastify';

export type AuthContextValue = {
  isAuth: boolean;
  userName: string;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, loading, error] = useAuthState(auth);

  const isAuth = !!user;
  const userName = user?.displayName || 'Unknown';

  if (error) {
    toast.error(error.message);
  }

  return (
    <AuthContext.Provider value={{ isAuth, userName, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
