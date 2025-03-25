import { useContext } from 'react';
import { AuthContext } from '@/shared/providers/authProvider';

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuthContext must be used within a AuthProvider');
  }

  return context;
};
