import { signOut } from 'firebase/auth';
import { auth } from '@/shared/services/firebase';

export const logout = async () => {
  return await signOut(auth);
};
