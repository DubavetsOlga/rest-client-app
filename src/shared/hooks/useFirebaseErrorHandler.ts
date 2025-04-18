import { FirebaseError } from 'firebase/app';
import { useLocale } from 'next-intl';
import { translate } from '@/shared/i18n/langSwitcher';
import { toast } from 'react-toastify';

type FirebaseErrorHandlerOptions = {
  setError?: (message: string | null) => void;
};

export const useFirebaseErrorHandler = () => {
  const locale = useLocale();
  const { firebase: t } = translate(locale);

  const handleFirebaseError = (
    error: unknown,
    options: FirebaseErrorHandlerOptions = {}
  ) => {
    const { setError } = options;

    if (!(error instanceof FirebaseError)) {
      toast.error(t.defaultError);
      if (setError) {
        setError(null);
      }
      return;
    }

    const errorCodeMap: Record<string, keyof typeof t> = {
      'auth/invalid-email': 'invalidEmail',
      'auth/invalid-credential': 'invalidCredential',
      'auth/user-not-found': 'userNotFound',
      'auth/wrong-password': 'wrongPassword',
      'auth/email-already-in-use': 'emailInUse',
      'network-request-failed': 'networkRequestFailed',
      'internal-error': 'internalError',
      'auth/too-many-requests': 'tooManyRequests',
    };

    const translationKey = errorCodeMap[error.code] || 'defaultError';
    const userFriendlyMessage = t[translationKey];

    if (setError) setError(userFriendlyMessage);

    return;
  };

  return { handleFirebaseError };
};
