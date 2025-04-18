import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/shared/services/firebase';

export const createUser = async ({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) => {
  const user = await createUserWithEmailAndPassword(auth, email, password);

  await updateProfile(user.user, {
    displayName: name,
  });

  return user.user.displayName;
};
