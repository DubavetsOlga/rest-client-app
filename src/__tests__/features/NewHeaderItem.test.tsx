import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { NewHeaderItem } from '@/features/restClient/ui/tabs/headers/newHeaderItem/NewHeaderItem';
import { useAppDispatch } from '@/shared/store/hooks/useAppDispatch';
import { useHeaderIsUnique } from '@/shared/hooks/useHeaderIsUnique';
import { toast } from 'react-toastify';

jest.mock('@/shared/store/hooks/useAppDispatch', () => ({
  useAppDispatch: jest.fn(),
}));

jest.mock('@/shared/hooks/useHeaderIsUnique', () => ({
  useHeaderIsUnique: jest.fn(),
}));

describe('NewHeaderItem', () => {
  const mockDispatch = jest.fn();
  const mockIsUnique = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useHeaderIsUnique as jest.Mock).mockReturnValue(mockIsUnique);
  });

  const setup = () => {
    render(
      <table>
        <tbody>
          <NewHeaderItem />
        </tbody>
      </table>
    );
    const keyInput = screen.getByPlaceholderText('Add Key') as HTMLInputElement;
    const valueInput = screen.getByPlaceholderText(
      'Add Value'
    ) as HTMLInputElement;
    return { keyInput, valueInput };
  };

  it('renders input fields', () => {
    const { keyInput, valueInput } = setup();

    expect(keyInput).toBeInTheDocument();
    expect(valueInput).toBeInTheDocument();
  });

  it('does nothing if key is empty', () => {
    const { valueInput } = setup();
    fireEvent.change(valueInput, { target: { value: 'some value' } });

    fireEvent.blur(valueInput);
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('shows warning if key is not unique', () => {
    const { keyInput, valueInput } = setup();

    fireEvent.change(keyInput, { target: { value: 'Authorization' } });
    fireEvent.change(valueInput, { target: { value: 'Bearer token' } });

    mockIsUnique.mockReturnValue(false);

    fireEvent.blur(valueInput);

    expect(toast.warning).toHaveBeenCalledWith('Header key must be unique');
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('does nothing if value is empty', () => {
    const { keyInput, valueInput } = setup();

    fireEvent.change(keyInput, { target: { value: 'Content-Type' } });
    fireEvent.change(valueInput, { target: { value: '' } });

    mockIsUnique.mockReturnValue(true);

    fireEvent.blur(valueInput);

    expect(mockDispatch).not.toHaveBeenCalled();
  });
});
