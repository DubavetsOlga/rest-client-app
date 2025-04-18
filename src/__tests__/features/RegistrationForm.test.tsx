import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RegistrationForm } from '@/features/registration/ui/registrationForm/RegistrationForm';
import { FormEvent } from 'react';
import { SubmitHandler } from 'react-hook-form';

const setUserName = jest.fn();
const handleFirebaseError = jest.fn();
const mockCreateUser = jest.fn();

jest.mock('@/features/registration/createUser', () => ({
  createUser: (data: { name: string; email: string; password: string }) =>
    mockCreateUser(data),
}));

type RegistrationFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

jest.mock('@/features/registration/hooks/useRegistrationForm', () => ({
  useRegistrationForm: () => ({
    register: (): { name: string } => ({ name: 'mock' }),

    handleSubmit:
      (cb: SubmitHandler<RegistrationFormValues>) => (e: FormEvent) => {
        e.preventDefault();
        return cb({
          name: 'John',
          email: 'john@example.com',
          password: 'password123',
          confirmPassword: 'password123',
        });
      },

    formState: {
      errors: {},
      isValid: true,
    },
  }),
}));

jest.mock('@/shared/hooks/useFirebaseErrorHandler', () => ({
  useFirebaseErrorHandler: () => ({
    handleFirebaseError,
  }),
}));

jest.mock('@/shared/hooks/useAuthContext', () => ({
  useAuthContext: () => ({
    setUserName,
  }),
}));

describe('RegistrationForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form fields and sign in link', () => {
    render(<RegistrationForm />);

    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm password')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Create Account' })
    ).toBeInTheDocument();
    expect(screen.getByText('Already have an account?')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toHaveAttribute('href', '/login');
  });

  it('calls createUser and setUserName on successful submit', async () => {
    mockCreateUser.mockResolvedValue({});

    render(<RegistrationForm />);

    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));

    await waitFor(() => {
      expect(mockCreateUser).toHaveBeenCalledWith({
        name: 'John',
        email: 'john@example.com',
        password: 'password123',
      });
      expect(setUserName).toHaveBeenCalledWith('John');
    });
  });

  it('handles firebase error if registration fails', async () => {
    const error = new Error('Firebase failure');
    mockCreateUser.mockRejectedValue(error);

    render(<RegistrationForm />);

    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));

    await waitFor(() => {
      expect(handleFirebaseError).toHaveBeenCalledWith(error, {
        setError: expect.any(Function),
      });
    });
  });
});
