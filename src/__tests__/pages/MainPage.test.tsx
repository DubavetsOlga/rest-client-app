import { render, screen } from '@testing-library/react';
import MainPage from '@/app/[locale]/page';
import { useAuthContext } from '@/shared/hooks/useAuthContext';
import { useAppSelector } from '@/shared/store/hooks/useAppSelector';
import '@testing-library/jest-dom';
import { ReactNode } from 'react';

jest.mock('@/shared/hooks/useAuthContext', () => ({
  useAuthContext: jest.fn(),
}));

jest.mock('@/shared/store/hooks/useAppSelector', () => ({
  useAppSelector: jest.fn(),
}));

jest.mock('@/widgets/developers/Developers', () => ({
  Developers: () => <div data-testid="developers">Developers</div>,
}));

jest.mock('@/shared/components', () => ({
  Button: ({ href, children }: { href: string; children: ReactNode }) => (
    <a data-testid={`button-${href}`} href={href}>
      {children}
    </a>
  ),
  Spinner: () => <div data-testid="spinner">Loading...</div>,
}));

describe('MainPage', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('shows spinner when loading', () => {
    (useAuthContext as jest.Mock).mockReturnValue({ loading: true });
    render(<MainPage />);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders authenticated user view', () => {
    (useAuthContext as jest.Mock).mockReturnValue({
      loading: false,
      isAuth: true,
      userName: 'Alice',
    });
    (useAppSelector as jest.Mock).mockReturnValue('/rest');

    render(<MainPage />);

    expect(screen.getByText('Welcome back, Alice!')).toBeInTheDocument();
    expect(screen.getByTestId('button-/rest')).toHaveTextContent('REST Client');
    expect(screen.getByTestId('button-/history')).toHaveTextContent('History');
    expect(screen.getByTestId('button-/variables')).toHaveTextContent(
      'Variables'
    );
    expect(screen.getByTestId('developers')).toBeInTheDocument();
  });

  it('renders unauthenticated user view', () => {
    (useAuthContext as jest.Mock).mockReturnValue({
      loading: false,
      isAuth: false,
      userName: '',
    });
    (useAppSelector as jest.Mock).mockReturnValue(null);

    render(<MainPage />);

    expect(screen.getByText('Welcome!')).toBeInTheDocument();
    expect(screen.getByTestId('button-/login')).toHaveTextContent('Sign In');
    expect(screen.getByTestId('button-/registration')).toHaveTextContent(
      'Sign Up'
    );
  });
});
