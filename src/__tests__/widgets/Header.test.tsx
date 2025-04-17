import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useAuthContext } from '@/shared/hooks/useAuthContext';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import { useAppDispatch } from '@/shared/store/hooks/useAppDispatch';
import { Header } from '@/widgets/header/Header';
import '@testing-library/jest-dom';

const mockPush = jest.fn();
const mockUsePathname = jest.fn();
const mockUseSearchParams = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => mockUsePathname(),
  useSearchParams: () => mockUseSearchParams(),
}));

jest.mock('@/shared/hooks/useAuthContext', () => ({
  useAuthContext: jest.fn(),
}));

jest.mock('@/shared/hooks/useLocalStorage', () => ({
  useLocalStorage: jest.fn(),
}));

jest.mock('@/shared/store/hooks/useAppDispatch', () => ({
  useAppDispatch: jest.fn(),
}));

type MockImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  layout?: 'intrinsic' | 'fixed' | 'responsive' | 'fill';
  quality?: number | string;
  objectFit?: string;
  objectPosition?: string;
  loading?: 'lazy' | 'eager';
};

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: MockImageProps) => {
    const { priority, alt, ...restProps } = props;
    return <img {...restProps} alt={alt} />;
  },
}));

jest.mock('@/features/logout/logout', () => ({
  logout: jest.fn(),
}));

describe('Header Component', () => {
  const mockDispatch = jest.fn();
  const mockGetStorageItem = jest.fn();

  beforeEach(() => {
    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useLocalStorage as jest.Mock).mockReturnValue({
      getStorageItem: mockGetStorageItem,
    });
    mockGetStorageItem.mockReturnValue([]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the logo and title', () => {
    (useAuthContext as jest.Mock).mockReturnValue({
      isAuth: false,
      loading: false,
    });

    render(<Header />);

    expect(screen.getByAltText('Logo')).toBeInTheDocument();
    expect(screen.getByText('REST Client')).toBeInTheDocument();
  });

  it('renders locale switcher', () => {
    (useAuthContext as jest.Mock).mockReturnValue({
      isAuth: false,
      loading: false,
    });

    render(<Header />);

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('shows sign in and sign up buttons when not authenticated', () => {
    (useAuthContext as jest.Mock).mockReturnValue({
      isAuth: false,
      loading: false,
    });

    render(<Header />);

    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  it('shows sign out button when authenticated', () => {
    (useAuthContext as jest.Mock).mockReturnValue({
      isAuth: true,
      loading: false,
    });

    render(<Header />);

    expect(screen.getByText('Sign Out')).toBeInTheDocument();
  });

  it('does not render auth buttons when loading', () => {
    (useAuthContext as jest.Mock).mockReturnValue({
      isAuth: false,
      loading: true,
    });

    render(<Header />);

    expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
    expect(screen.queryByText('Sign Up')).not.toBeInTheDocument();
    expect(screen.queryByText('Sign Out')).not.toBeInTheDocument();
  });

  it('calls logout function when sign out button is clicked', async () => {
    const mockLogout = require('@/features/logout/logout').logout;
    (useAuthContext as jest.Mock).mockReturnValue({
      isAuth: true,
      loading: false,
    });

    render(<Header />);

    fireEvent.click(screen.getByText('Sign Out'));

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: [],
        type: 'variables/setVariables',
      });
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: undefined,
        type: 'variables/clearVariables',
      });
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: undefined,
        type: 'restClient/resetRestClient',
      });
    });
  });

  it('shows error toast when logout fails', async () => {
    const mockLogout = require('@/features/logout/logout').logout;
    const mockToastError = require('react-toastify').toast.error;
    const error = new Error('Logout failed');

    mockLogout.mockRejectedValue(error);
    (useAuthContext as jest.Mock).mockReturnValue({
      isAuth: true,
      loading: false,
    });

    render(<Header />);

    fireEvent.click(screen.getByText('Sign Out'));

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith('Logout failed');
    });
  });

  it('loads variables from localStorage when authenticated', () => {
    const testVariables = [{ id: '1', name: 'test' }];
    mockGetStorageItem.mockReturnValue(testVariables);

    (useAuthContext as jest.Mock).mockReturnValue({
      isAuth: true,
      loading: false,
    });

    render(<Header />);

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'variables/setVariables',
        payload: testVariables,
      })
    );
  });

  it('applies sticky class when scrolled', () => {
    (useAuthContext as jest.Mock).mockReturnValue({
      isAuth: false,
      loading: false,
    });

    render(<Header />);

    const header = screen.getByRole('banner');
    expect(header).not.toHaveClass('sticky');

    Object.defineProperty(document.body, 'scrollTop', {
      value: 2,
      writable: true,
    });
    fireEvent.scroll(document.body);

    expect(header).toHaveClass('sticky');
  });
});
