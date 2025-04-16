import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import { AuthContext, AuthProvider } from '@/shared/providers/authProvider';

jest.mock('react-firebase-hooks/auth', () => ({
  useAuthState: jest.fn(),
}));

const mockUseAuthState = useAuthState as jest.Mock;

const Consumer = () => {
  const context = useContext(AuthContext);
  if (!context) return null;
  return (
    <div>
      <p>isAuth: {context.isAuth ? 'true' : 'false'}</p>
      <p>userName: {context.userName}</p>
      <p>loading: {context.loading ? 'true' : 'false'}</p>
    </div>
  );
};

describe('AuthProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children and provides default values when loading', () => {
    mockUseAuthState.mockReturnValue([null, true, null]);

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    expect(screen.getByText('isAuth: false')).toBeInTheDocument();
    expect(screen.getByText('userName: Unknown')).toBeInTheDocument();
    expect(screen.getByText('loading: true')).toBeInTheDocument();
  });

  it('sets auth and userName when user is authenticated', async () => {
    mockUseAuthState.mockReturnValue([
      { displayName: 'John Doe' },
      false,
      null,
    ]);

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('isAuth: true')).toBeInTheDocument();
      expect(screen.getByText('userName: John Doe')).toBeInTheDocument();
      expect(screen.getByText('loading: false')).toBeInTheDocument();
    });
  });

  it('uses fallback userName if displayName is missing', async () => {
    mockUseAuthState.mockReturnValue([{}, false, null]);

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('userName: Unknown')).toBeInTheDocument();
    });
  });

  it('shows toast error on auth error', () => {
    const error = new Error('Something went wrong');
    mockUseAuthState.mockReturnValue([null, false, error]);

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    expect(toast.error).toHaveBeenCalledWith('Something went wrong');
  });

  it('updates userName via setUserName', async () => {
    mockUseAuthState.mockReturnValue([null, false, null]);

    const TestComponent = () => {
      const context = useContext(AuthContext);
      if (!context) return null;

      return (
        <div>
          <p>{context.userName}</p>
          <button onClick={() => context.setUserName('Alice')}>Set Name</button>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText('Set Name'));

    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument();
    });
  });
});
