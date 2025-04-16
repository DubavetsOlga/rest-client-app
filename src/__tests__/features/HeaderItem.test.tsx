import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HeaderItem } from '@/features/restClient/ui/tabs/headers/headerItem/HeaderItem';
import { useAppDispatch } from '@/shared/store/hooks/useAppDispatch';
import { updateHeader } from '@/shared/store/reducers/restClientSlice';
import { useHeaderIsUnique } from '@/shared/hooks/useHeaderIsUnique';
import { toast } from 'react-toastify';

jest.mock('@/shared/store/hooks/useAppDispatch', () => ({
  useAppDispatch: jest.fn(),
}));

jest.mock('@/shared/hooks/useHeaderIsUnique', () => ({
  useHeaderIsUnique: jest.fn(),
}));

describe('HeaderItem', () => {
  const mockDispatch = jest.fn();
  const mockIsUnique = jest.fn();
  const header = {
    id: '123',
    key: 'Authorization',
    value: 'Bearer token',
  };

  const onDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useHeaderIsUnique as jest.Mock).mockReturnValue(mockIsUnique);
  });

  const setup = () => {
    render(
      <table>
        <tbody>
          <HeaderItem header={header} onDelete={onDelete} />
        </tbody>
      </table>
    );
    const keyInput = screen.getByLabelText('Key') as HTMLInputElement;
    const valueInput = screen.getByLabelText('Value') as HTMLInputElement;
    const deleteButton = screen.getByLabelText('Delete header');
    return { keyInput, valueInput, deleteButton };
  };

  it('renders inputs and delete button', () => {
    const { keyInput, valueInput, deleteButton } = setup();
    expect(keyInput).toHaveValue('Authorization');
    expect(valueInput).toHaveValue('Bearer token');
    expect(deleteButton).toBeInTheDocument();
  });

  it('warns if key is empty on blur', () => {
    const { keyInput } = setup();
    mockIsUnique.mockReturnValue(true);

    fireEvent.change(keyInput, { target: { value: '' } });
    fireEvent.blur(keyInput);

    expect(toast.warning).toHaveBeenCalledWith('Header key is required');
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('warns if key is not unique', () => {
    const { keyInput } = setup();
    mockIsUnique.mockReturnValue(false);

    fireEvent.change(keyInput, { target: { value: 'Authorization' } });
    fireEvent.blur(keyInput);

    expect(toast.warning).toHaveBeenCalledWith('Header key must be unique');
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('warns if value is empty but still updates', () => {
    const { keyInput, valueInput } = setup();
    mockIsUnique.mockReturnValue(true);

    fireEvent.change(keyInput, { target: { value: 'X-Custom' } });
    fireEvent.change(valueInput, { target: { value: '' } });
    fireEvent.blur(valueInput);

    expect(toast.warning).toHaveBeenCalledWith(
      'A header with an empty value will not be used in the request'
    );
    expect(mockDispatch).toHaveBeenCalledWith(
      updateHeader({ id: '123', key: 'X-Custom', value: '' })
    );
  });

  it('updates header if key/value are valid and unique', () => {
    const { keyInput, valueInput } = setup();
    mockIsUnique.mockReturnValue(true);

    fireEvent.change(keyInput, { target: { value: 'X-Test' } });
    fireEvent.change(valueInput, { target: { value: 'TestValue' } });
    fireEvent.blur(valueInput);

    expect(mockDispatch).toHaveBeenCalledWith(
      updateHeader({ id: '123', key: 'X-Test', value: 'TestValue' })
    );
  });

  it('calls onDelete when delete button clicked', () => {
    const { deleteButton } = setup();
    fireEvent.click(deleteButton);
    expect(onDelete).toHaveBeenCalledWith('123');
  });
});
