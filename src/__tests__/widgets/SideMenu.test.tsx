import React from 'react';
import { render, screen } from '@testing-library/react';
import { useAuthContext } from '@/shared/hooks/useAuthContext';
import { useAppSelector } from '@/shared/store/hooks/useAppSelector';
import { usePathname } from '@/shared/i18n/routing';
import SideMenu from '@/widgets/sideMenu/SideMenu';
import '@testing-library/jest-dom';

jest.mock('@/shared/hooks/useAuthContext');
jest.mock('@/shared/store/hooks/useAppSelector');

jest.mock('lucide-react', () => ({
  CloudFog: () => <div>CloudFog</div>,
  ListX: () => <div>ListX</div>,
  History: () => <div>History Icon</div>,
  ChevronRight: () => <div>ChevronRight</div>,
  ChevronLeft: () => <div>ChevronLeft</div>,
  Menu: () => <div>Menu Icon</div>,
  X: () => <div>X</div>,
  Home: () => <div>Home</div>,
}));

describe('SideMenu Component', () => {
  const mockUseAuthContext = useAuthContext as jest.MockedFunction<
    typeof useAuthContext
  >;
  const mockUseAppSelector = useAppSelector as jest.MockedFunction<
    typeof useAppSelector
  >;
  const mockUsePathname = usePathname as jest.MockedFunction<
    typeof usePathname
  >;

  beforeEach(() => {
    mockUseAuthContext.mockReturnValue({
      setUserName(): void {},
      userName: '',
      isAuth: true,
      loading: false,
    });
    mockUseAppSelector.mockImplementation((selector) => {
      if (selector.toString().includes('restClientReducer')) {
        return '/rest';
      }
      return null;
    });
    mockUsePathname.mockReturnValue('/');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when loading', () => {
    mockUseAuthContext.mockReturnValueOnce({
      setUserName(): void {},
      userName: '',
      isAuth: false,
      loading: true,
    });
    const { container } = render(<SideMenu />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when not authenticated', () => {
    mockUseAuthContext.mockReturnValueOnce({
      setUserName(): void {},
      userName: '',
      isAuth: false,
      loading: false,
    });
    const { container } = render(<SideMenu />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders all menu items', () => {
    render(<SideMenu />);
    expect(screen.getByText('Main')).toBeInTheDocument();
    expect(screen.getByText('REST Client')).toBeInTheDocument();
    expect(screen.getByText('Variables')).toBeInTheDocument();
    expect(screen.getByText('History')).toBeInTheDocument();
  });

  it('marks active menu item based on current path', () => {
    mockUsePathname.mockReturnValueOnce('/variables');
    render(<SideMenu />);

    const variablesItem = screen.getByText('Variables').closest('li');
    expect(variablesItem).toHaveClass('active');
  });

  it('marks REST Client as active when path starts with HTTP method', () => {
    mockUsePathname.mockReturnValueOnce('/GET/some-endpoint');
    render(<SideMenu />);

    const restClientItem = screen.getByText('REST Client').closest('li');
    expect(restClientItem).toHaveClass('active');
  });

  it('shows tooltips for menu items when in short mode', () => {
    render(<SideMenu />);

    const menuItems = ['Main', 'REST Client', 'Variables', 'History'];
    menuItems.forEach((text) => {
      const item = screen.getByText(text).closest('li');
      expect(item).toHaveAttribute('title', text);
    });
  });
});
