import { render, screen } from '@testing-library/react';
import Variables from '@/app/[locale]/variables/page';
import { useCheckPrivateRoute } from '@/shared/hooks/useCheckPrivateRoute';
import '@testing-library/jest-dom';

jest.mock('@/shared/hooks/useCheckPrivateRoute', () => ({
  useCheckPrivateRoute: jest.fn(),
}));

jest.mock('@/shared/components', () => ({
  Spinner: () => <div data-testid="spinner">Loading...</div>,
}));

jest.mock('next/dynamic', () => () => {
  const Component = () => <div data-testid="variables-list">VariablesList</div>;
  Component.displayName = 'DynamicVariablesList';
  return Component;
});

describe('Variables page', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders spinner while loading', () => {
    (useCheckPrivateRoute as jest.Mock).mockReturnValue({
      loading: true,
      isAuth: false,
    });

    render(<Variables />);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders VariablesList when authenticated', () => {
    (useCheckPrivateRoute as jest.Mock).mockReturnValue({
      loading: false,
      isAuth: true,
    });

    render(<Variables />);
    expect(screen.getByTestId('variables-list')).toBeInTheDocument();
  });

  it('renders nothing when not authenticated and not loading', () => {
    (useCheckPrivateRoute as jest.Mock).mockReturnValue({
      loading: false,
      isAuth: false,
    });

    const { container } = render(<Variables />);
    expect(container).toBeEmptyDOMElement();
  });
});
