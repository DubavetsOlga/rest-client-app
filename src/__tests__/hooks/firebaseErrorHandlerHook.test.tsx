import { FirebaseError } from 'firebase/app';
import { toast } from 'react-toastify';
import { useFirebaseErrorHandler } from '@/shared/hooks/useFirebaseErrorHandler';

describe('useFirebaseErrorHandler', () => {
  beforeEach(() => {
    (toast.error as jest.Mock).mockClear();
  });

  it('should handle FirebaseError and show appropriate toast message', () => {
    const { handleFirebaseError } = useFirebaseErrorHandler();

    const mockSetError = jest.fn();

    const error = new FirebaseError(
      'auth/invalid-email',
      'Email address is malformed'
    );
    handleFirebaseError(error, { setError: mockSetError });

    expect(mockSetError).toHaveBeenCalledWith('Email address is malformed');
  });

  it('should handle unknown error and show default toast message', () => {
    const { handleFirebaseError } = useFirebaseErrorHandler();

    const mockSetError = jest.fn();

    const error = new Error('Some unknown error');
    handleFirebaseError(error, { setError: mockSetError });

    expect(mockSetError).toHaveBeenCalledWith(null);
    expect(toast.error).toHaveBeenCalledWith('Something went wrong');
  });

  it('should call setError with null when no error is provided', () => {
    const { handleFirebaseError } = useFirebaseErrorHandler();

    const mockSetError = jest.fn();

    handleFirebaseError(null, { setError: mockSetError });

    expect(mockSetError).toHaveBeenCalledWith(null);
    expect(toast.error).toHaveBeenCalledWith('Something went wrong');
  });

  it('should map custom FirebaseError codes to correct messages', () => {
    const { handleFirebaseError } = useFirebaseErrorHandler();

    const mockSetError = jest.fn();

    const error = new FirebaseError(
      'auth/email-already-in-use',
      'Email already in use.'
    );
    handleFirebaseError(error, { setError: mockSetError });

    expect(mockSetError).toHaveBeenCalledWith('Email is already registered');
  });
});
