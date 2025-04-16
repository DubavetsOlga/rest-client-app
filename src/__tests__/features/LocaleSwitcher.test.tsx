import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LocaleSwitcher } from '@/features/localeSwitcher/LocaleSwitcher';

const mockPush = jest.fn();
const mockUsePathname = jest.fn();
const mockUseSearchParams = jest.fn();
const mockSearchParams = new URLSearchParams('page=2');

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => mockUsePathname(),
  useSearchParams: () => mockUseSearchParams(),
}));

describe('LocaleSwitcher', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePathname.mockReturnValue('/en/some-path');
    mockUseSearchParams.mockReturnValue(mockSearchParams);
  });

  it('renders with correct default language', () => {
    render(<LocaleSwitcher />);
    const select = screen.getByRole('combobox', { name: 'Language' });
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue('en');
  });

  it('changes language and calls router.push with new locale', () => {
    render(<LocaleSwitcher />);
    const select = screen.getByRole('combobox', { name: 'Language' });

    fireEvent.change(select, { target: { value: 'ru' } });

    expect(select).toHaveValue('ru');
    expect(mockPush).toHaveBeenCalledWith('/ru/some-path?page=2');
  });

  it('generates correct URL when no search params exist', () => {
    mockUseSearchParams.mockReturnValueOnce(new URLSearchParams());
    render(<LocaleSwitcher />);
    const select = screen.getByRole('combobox');

    fireEvent.change(select, { target: { value: 'ru' } });

    expect(mockPush).toHaveBeenCalledWith('/ru/some-path');
  });

  it('handles root pathname correctly', () => {
    mockUsePathname.mockReturnValue('/en');
    render(<LocaleSwitcher />);
    const select = screen.getByRole('combobox');

    fireEvent.change(select, { target: { value: 'ru' } });

    expect(mockPush).toHaveBeenCalledWith('/ru/?page=2');
  });
});
