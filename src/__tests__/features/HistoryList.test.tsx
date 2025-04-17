import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HistoryList } from '@/features/history/ui/historyList/HistoryList';
import { HistoryRequestType } from '@/shared/models/types';

jest.mock('@/shared/components', () => ({
  Spinner: () => <div>Loading...</div>,
  ConfirmDialog: ({
    open,
    text,
    handleConfirm,
    handleCancel,
  }: {
    open: boolean;
    text: string;
    handleConfirm: () => void;
    handleCancel: () => void;
  }) =>
    open ? (
      <div>
        <div>{text}</div>
        <button onClick={handleConfirm}>Confirm</button>
        <button onClick={handleCancel}>Cancel</button>
      </div>
    ) : null,
}));

jest.mock('@/features/history/ui/groupedHistory/GroupedHistory', () => ({
  GroupedHistory: ({
    handleRemoveItem,
  }: {
    history: HistoryRequestType[];
    handleRemoveItem: (id: number) => void;
  }) => (
    <div>
      <div>Grouped History</div>
      <button onClick={() => handleRemoveItem(1234567890)}>Delete Item</button>
    </div>
  ),
}));

jest.mock('@/features/history/ui/emptyHistory/EmptyHistory', () => ({
  EmptyHistory: () => <div>No history available</div>,
}));

const mockRemove = jest.fn();
const mockClear = jest.fn();

jest.mock('@/features/history/hooks/useHistoryRequest', () => ({
  useHistoryRequest: jest.fn(() => ({
    history: [
      {
        timestamp: 1234567890,
        method: 'GET',
        url: 'http://localhost',
        body: '',
        headers: [],
      },
    ],
    removeFromHistory: mockRemove,
    clearHistory: mockClear,
    isLoading: false,
  })),
}));

describe('HistoryList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders history title', () => {
    render(<HistoryList />);
    expect(screen.getByText('History Requests')).toBeInTheDocument();
  });

  it('shows empty state when history is empty', () => {
    require('@/features/history/hooks/useHistoryRequest').useHistoryRequest.mockReturnValueOnce(
      {
        history: [],
        removeFromHistory: jest.fn(),
        clearHistory: jest.fn(),
        isLoading: false,
      }
    );

    render(<HistoryList />);
    expect(screen.getByText('No history available')).toBeInTheDocument();
  });

  it('opens dialog to confirm remove item when clicking remove item', () => {
    render(<HistoryList />);
    fireEvent.click(screen.getByText('Delete Item'));
    expect(
      screen.getByText('Are you sure you want to remove this item?')
    ).toBeInTheDocument();
  });

  it('calls removeFromHistory when confirm remove item is clicked', async () => {
    render(<HistoryList />);
    fireEvent.click(screen.getByText('Delete Item'));
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));

    await waitFor(() => {
      expect(mockRemove).toHaveBeenCalledWith(1234567890);
    });
  });

  it('shows loading state', () => {
    require('@/features/history/hooks/useHistoryRequest').useHistoryRequest.mockReturnValueOnce(
      {
        history: [],
        removeFromHistory: jest.fn(),
        clearHistory: jest.fn(),
        isLoading: true,
      }
    );

    render(<HistoryList />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
