import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/shared/hooks/useAuthContext';
import '@testing-library/jest-dom';
import RegistrationPage from '@/app/[locale]/registration/page';

jest.mock('@/shared/hooks/useAuthContext', () => ({
  useAuthContext: jest.fn(),
}));

jest.mock(
  '@/features/registration/ui/registrationForm/RegistrationForm',
  () => () => <div>RegistrationForm Mock</div>
);

jest.mock('@/shared/components', () => ({
  Spinner: () => <div>Spinner Mock</div>,
}));

describe('RegistrationPage', () => {
  const mockReplace = jest.fn();
  const mockUseRouter = useRouter as jest.Mock;
  const mockUseAuthContext = useAuthContext as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({
      replace: mockReplace,
    });
  });

  it('should redirect to home page if authenticated', () => {
    mockUseAuthContext.mockReturnValue({
      isAuth: true,
      loading: false,
    });

    render(<RegistrationPage />);

    expect(mockReplace).toHaveBeenCalledWith('/en');
    expect(screen.queryByText('RegistrationForm Mock')).not.toBeInTheDocument();
  });

  it('should show spinner while loading', () => {
    mockUseAuthContext.mockReturnValue({
      isAuth: false,
      loading: true,
    });

    render(<RegistrationPage />);

    expect(screen.getByText('Spinner Mock')).toBeInTheDocument();
    expect(screen.queryByText('RegistrationForm Mock')).not.toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
