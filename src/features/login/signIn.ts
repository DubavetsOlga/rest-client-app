import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/shared/services/firebase';

export const signIn = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};
