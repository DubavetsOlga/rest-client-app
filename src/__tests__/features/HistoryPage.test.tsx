import { render, screen } from '@testing-library/react';
import History from '@/app/[locale]/history/page';
import { useCheckPrivateRoute } from '@/shared/hooks/useCheckPrivateRoute';
import '@testing-library/jest-dom';

jest.mock('@/shared/hooks/useCheckPrivateRoute', () => ({
  useCheckPrivateRoute: jest.fn(),
}));

jest.mock('next/dynamic', () => () => {
  const Component = () => <div data-testid="history-list">HistoryList</div>;
  Component.displayName = 'DynamicHistoryList';
  return Component;
});

jest.mock('@/shared/components', () => ({
  Spinner: () => <div data-testid="spinner">Loading...</div>,
}));

describe('History Page', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('shows spinner when loading', () => {
    (useCheckPrivateRoute as jest.Mock).mockReturnValue({
      loading: true,
      isAuth: false,
    });

    render(<History />);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders HistoryList if authenticated', () => {
    (useCheckPrivateRoute as jest.Mock).mockReturnValue({
      loading: false,
      isAuth: true,
    });

    render(<History />);
    expect(screen.getByTestId('history-list')).toBeInTheDocument();
  });

  it('does not render HistoryList if not authenticated', () => {
    (useCheckPrivateRoute as jest.Mock).mockReturnValue({
      loading: false,
      isAuth: false,
    });

    render(<History />);
    expect(screen.queryByTestId('history-list')).not.toBeInTheDocument();
  });
});
