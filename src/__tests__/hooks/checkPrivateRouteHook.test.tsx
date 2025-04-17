import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/shared/hooks/useAuthContext';
import { useCheckPrivateRoute } from '@/shared/hooks/useCheckPrivateRoute';
import '@testing-library/jest-dom';

jest.mock('@/shared/hooks/useAuthContext', () => ({
  useAuthContext: jest.fn(),
}));

const TestComponent = () => {
  const { isAuth, loading } = useCheckPrivateRoute();
  return (
    <>
      {loading && <div>Loading...</div>}
      {!loading && !isAuth && <div>You are not authorized</div>}
      {!loading && isAuth && <div>Welcome!</div>}
    </>
  );
};

describe('useCheckPrivateRoute', () => {
  it('should redirect user if not authenticated', () => {
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useAuthContext as jest.Mock).mockReturnValue({
      isAuth: false,
      loading: false,
    });

    render(<TestComponent />);

    expect(mockPush).toHaveBeenCalledWith('/en');
    expect(screen.getByText('You are not authorized')).toBeInTheDocument();
  });

  it('should show loading state while authentication is loading', () => {
    (useAuthContext as jest.Mock).mockReturnValue({
      isAuth: false,
      loading: true,
    });

    render(<TestComponent />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render protected content if authenticated', () => {
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useAuthContext as jest.Mock).mockReturnValue({
      isAuth: true,
      loading: false,
    });

    render(<TestComponent />);

    expect(screen.getByText('Welcome!')).toBeInTheDocument();
  });
});
