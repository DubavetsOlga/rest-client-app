import { render, screen, waitFor } from '@testing-library/react';
import LoginPage from '@/app/[locale]/login/page';
import { useAuthContext } from '@/shared/hooks/useAuthContext';
import { useRouter } from 'next/navigation';
import '@testing-library/jest-dom';

jest.mock('@/shared/hooks/useAuthContext', () => ({
  useAuthContext: jest.fn(),
}));

jest.mock('@/features/login/ui/loginForm/LoginForm', () => ({
  LoginForm: () => <div data-testid="login-form">LoginForm</div>,
}));

jest.mock('@/shared/components', () => ({
  Spinner: () => <div data-testid="spinner">Loading...</div>,
}));

describe('LoginPage', () => {
  const replaceMock = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ replace: replaceMock });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('shows spinner when loading', () => {
    (useAuthContext as jest.Mock).mockReturnValue({
      loading: true,
      isAuth: false,
    });

    render(<LoginPage />);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('redirects if authenticated', async () => {
    (useAuthContext as jest.Mock).mockReturnValue({
      loading: false,
      isAuth: true,
    });

    render(<LoginPage />);

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith('/en');
    });
  });

  it('renders login form if not authenticated', () => {
    (useAuthContext as jest.Mock).mockReturnValue({
      loading: false,
      isAuth: false,
    });

    render(<LoginPage />);
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });
});
