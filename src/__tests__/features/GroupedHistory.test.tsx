import { render, screen } from '@testing-library/react';
import { HistoryRequestType } from '@/shared/models/types';
import { groupAndSortHistory } from '@/shared/utils/groupAndSortHistory';
import '@testing-library/jest-dom';
import { GroupedHistory } from '@/features/history/ui/groupedHistory/GroupedHistory';

jest.mock('@/shared/utils/dateUtils', () => ({
  formatDate: jest.fn((date: number) => new Date(date).toLocaleDateString()),
}));

jest.mock('@/shared/utils/groupAndSortHistory', () => ({
  groupAndSortHistory: jest.fn(() => ({
    groupedRequests: {
      '2021-04-08': [
        {
          method: 'GET',
          url: 'https://example.com',
          timestamp: 1617916700000,
          body: '',
          headers: [],
        },
        {
          method: 'POST',
          url: 'https://example.com/submit',
          timestamp: 1617916800000,
          body: '',
          headers: [],
        },
      ],
    },
    sortedDates: ['2021-04-08'],
  })),
}));

jest.mock('@/features/history/ui/historyItem/HistoryItem', () => {
  return {
    HistoryItem: ({
      request,
      onRemove,
    }: {
      request: HistoryRequestType;
      onRemove: (timestamp: number) => void;
    }) => {
      return (
        <div data-testid="history-item">
          <span>{request.url}</span>
          <button onClick={() => onRemove(request.timestamp)}>Remove</button>
        </div>
      );
    },
  };
});

describe('GroupedHistory Component', () => {
  const mockHandleRemoveItem = jest.fn();
  const mockHistory: HistoryRequestType[] = [
    {
      method: 'GET',
      url: 'https://example.com',
      timestamp: 1617916700000,
      body: '',
      headers: [],
    },
    {
      method: 'POST',
      url: 'https://example.com/submit',
      timestamp: 1617916800000,
      body: '',
      headers: [],
    },
  ];

  it('renders grouped history correctly with sorted items by date', () => {
    render(
      <GroupedHistory
        history={mockHistory}
        handleRemoveItem={mockHandleRemoveItem}
      />
    );

    expect(screen.getByText('08.04.2021')).toBeInTheDocument();

    expect(screen.getByText('https://example.com')).toBeInTheDocument();
    expect(screen.getByText('https://example.com/submit')).toBeInTheDocument();
  });

  it('calls groupAndSortHistory with the provided history array', () => {
    render(
      <GroupedHistory
        history={mockHistory}
        handleRemoveItem={mockHandleRemoveItem}
      />
    );

    expect(groupAndSortHistory).toHaveBeenCalledWith(mockHistory);
  });

  it('renders multiple grouped requests if history contains multiple dates', () => {
    const mockHistoryMultipleDates: HistoryRequestType[] = [
      {
        method: 'GET',
        url: 'https://example.com',
        timestamp: 1617916700000,
        body: '',
        headers: [],
      },
      {
        method: 'POST',
        url: 'https://example.com/submit',
        timestamp: 1617916800000,
        body: '',
        headers: [],
      },
      {
        method: 'GET',
        url: 'https://another-site.com',
        timestamp: 1617916900000,
        body: '',
        headers: [],
      },
    ];

    (groupAndSortHistory as jest.Mock).mockReturnValueOnce({
      groupedRequests: {
        '2021-04-08': [
          {
            method: 'GET',
            url: 'https://example.com',
            timestamp: 1617916700000,
          },
          {
            method: 'POST',
            url: 'https://example.com/submit',
            timestamp: 1617916800000,
          },
        ],
        '2021-04-09': [
          {
            method: 'GET',
            url: 'https://another-site.com',
            timestamp: 1617916900000,
          },
        ],
      },
      sortedDates: ['2021-04-08', '2021-04-09'],
    });

    render(
      <GroupedHistory
        history={mockHistoryMultipleDates}
        handleRemoveItem={mockHandleRemoveItem}
      />
    );

    expect(screen.getByText('08.04.2021')).toBeInTheDocument();
    expect(screen.getByText('09.04.2021')).toBeInTheDocument();
  });
});
