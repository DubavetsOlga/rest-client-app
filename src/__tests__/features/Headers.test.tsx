import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Headers } from '@/features/restClient/ui/tabs/headers/Headers';
import { useAppSelector } from '@/shared/store/hooks/useAppSelector';
import { useAppDispatch } from '@/shared/store/hooks/useAppDispatch';
import { deleteHeader } from '@/shared/store/reducers/restClientSlice';
import { selectHeaders } from '@/shared/store/selectors/restClientSelectors';
import { HeaderType } from '@/shared/models/types';

jest.mock('@/shared/store/hooks/useAppSelector');
jest.mock('@/shared/store/hooks/useAppDispatch');

jest.mock(
  '@/features/restClient/ui/tabs/headers/newHeaderItem/NewHeaderItem',
  () => ({
    NewHeaderItem: () => <tr data-testid="new-header-item" />,
  })
);

jest.mock(
  '@/features/restClient/ui/tabs/headers/headerItem/HeaderItem',
  () => ({
    HeaderItem: ({
      header,
      onDelete,
    }: {
      header: HeaderType;
      onDelete: (id: string) => void;
    }) => (
      <tr data-testid={`header-item-${header.id}`}>
        <td>{header.key}</td>
        <td>{header.value}</td>
        <td>
          <button
            onClick={() => onDelete(header.id)}
            aria-label={`Delete-${header.id}`}
          >
            Delete
          </button>
        </td>
      </tr>
    ),
  })
);

jest.mock('@/shared/components', () => ({
  ConfirmDialog: ({
    open,
    title,
    text,
    handleConfirm,
    handleCancel,
  }: {
    open: boolean;
    title: string;
    text: string;
    onOpenChange: (open: boolean) => void;
    handleCancel: () => void;
    handleConfirm: () => void;
  }) =>
    open ? (
      <div data-testid="confirm-dialog">
        <h2>{title}</h2>
        <p>{text}</p>
        <button onClick={handleConfirm} aria-label="confirm-delete">
          Confirm
        </button>
        <button onClick={handleCancel} aria-label="cancel-delete">
          Cancel
        </button>
      </div>
    ) : null,
}));

describe('Headers Component', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useAppSelector as jest.Mock).mockImplementation((selector) => {
      if (selector === selectHeaders)
        return [
          { id: '1', key: 'Authorization', value: 'Bearer token' },
          { id: '2', key: 'Content-Type', value: 'application/json' },
        ];
      return [];
    });
  });

  it('renders all headers and new header input', () => {
    render(<Headers />);

    expect(screen.getByText('Authorization')).toBeInTheDocument();
    expect(screen.getByText('Content-Type')).toBeInTheDocument();
    expect(screen.getByTestId('new-header-item')).toBeInTheDocument();
  });

  it('opens confirm dialog when delete is clicked', async () => {
    render(<Headers />);

    const deleteButton = screen.getByLabelText('Delete-1');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument();
    });

    expect(screen.getByText('Confirm Deletion')).toBeInTheDocument();
    expect(
      screen.getByText('Are you sure you want to delete header?')
    ).toBeInTheDocument();
  });

  it('confirms header deletion', async () => {
    render(<Headers />);

    fireEvent.click(screen.getByLabelText('Delete-2'));

    await waitFor(() => {
      expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText('confirm-delete'));

    expect(mockDispatch).toHaveBeenCalledWith(deleteHeader('2'));
  });

  it('cancels header deletion', async () => {
    render(<Headers />);

    fireEvent.click(screen.getByLabelText('Delete-1'));

    await waitFor(() => {
      expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText('cancel-delete'));

    await waitFor(() => {
      expect(screen.queryByTestId('confirm-dialog')).not.toBeInTheDocument();
    });
  });
});
