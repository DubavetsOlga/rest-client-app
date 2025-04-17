import { render, screen } from '@testing-library/react';
import { useCheckPrivateRoute } from '@/shared/hooks/useCheckPrivateRoute';
import RestLayout from '@/app/[locale]/(client)/layout';
import '@testing-library/jest-dom';
import { ReactNode } from 'react';

jest.mock('@/shared/hooks/useCheckPrivateRoute', () => ({
  useCheckPrivateRoute: jest.fn(),
}));

jest.mock('next/dynamic', () => () => {
  const Component = ({ children }: { children: ReactNode }) => (
    <div data-testid="rest-client">{children}</div>
  );
  Component.displayName = 'DynamicRestClient';
  return Component;
});

jest.mock('@/shared/components', () => ({
  Spinner: () => <div data-testid="spinner">Loading...</div>,
}));

describe('RestLayout', () => {
  const children = <div data-testid="child">Child Content</div>;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('shows spinner when loading', () => {
    (useCheckPrivateRoute as jest.Mock).mockReturnValue({
      loading: true,
      isAuth: false,
    });

    render(<RestLayout>{children}</RestLayout>);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders RestClient with children when authenticated', () => {
    (useCheckPrivateRoute as jest.Mock).mockReturnValue({
      loading: false,
      isAuth: true,
    });

    render(<RestLayout>{children}</RestLayout>);
    expect(screen.getByTestId('rest-client')).toBeInTheDocument();
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('renders nothing if not authenticated and not loading', () => {
    (useCheckPrivateRoute as jest.Mock).mockReturnValue({
      loading: false,
      isAuth: false,
    });

    const { container } = render(<RestLayout>{children}</RestLayout>);
    expect(container).toBeEmptyDOMElement();
  });
});
