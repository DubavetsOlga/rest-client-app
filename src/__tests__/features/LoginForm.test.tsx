import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LoginForm } from '@/features/login/ui/loginForm/LoginForm';
import { FormEvent } from 'react';
import { SubmitHandler } from 'react-hook-form';

const mockSignIn = jest.fn();
const handleFirebaseError = jest.fn();

jest.mock('@/features/login/signIn', () => ({
  signIn: (email: string, password: string) => mockSignIn(email, password),
}));

type LoginFormValues = {
  email: string;
  password: string;
};

jest.mock('@/features/login/hooks/useLoginForm', () => ({
  useLoginForm: () => ({
    register: () => ({ name: 'mock' }),

    handleSubmit: (cb: SubmitHandler<LoginFormValues>) => (e: FormEvent) => {
      e.preventDefault();
      return cb({
        email: 'test@example.com',
        password: 'password123',
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

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form inputs and sign up link', () => {
    render(<LoginForm />);

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toHaveAttribute(
      'href',
      '/registration'
    );
  });

  it('submits form and calls signIn with correct values', async () => {
    mockSignIn.mockResolvedValue({});

    render(<LoginForm />);

    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith(
        'test@example.com',
        'password123'
      );
    });
  });

  it('handles firebase error on failed sign in', async () => {
    const error = new Error('Invalid credentials');
    mockSignIn.mockRejectedValue(error);

    render(<LoginForm />);

    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(handleFirebaseError).toHaveBeenCalledWith(error, {
        setError: expect.any(Function),
      });
    });
  });
});
