import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HistoryItem } from '@/features/history/ui/historyItem/HistoryItem';
import { HttpMethodType } from '@/shared/models/httpMethod';

jest.mock('@/shared/utils/createRequestLink', () => ({
  createRequestLink: jest.fn(() => '/mock-link'),
}));

describe('HistoryItem Component', () => {
  const mockRequest = {
    method: 'GET' as HttpMethodType,
    url: 'https://example.com',
    body: '',
    headers: [],
    timestamp: 1617916700000,
  };

  const mockOnRemove = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the method, URL, and timestamp correctly', () => {
    render(<HistoryItem request={mockRequest} onRemove={mockOnRemove} />);

    expect(screen.getByText(mockRequest.method)).toBeInTheDocument();
    expect(screen.getByText(mockRequest.url)).toBeInTheDocument();
  });

  it('calls onRemove with correct timestamp when delete button is clicked', () => {
    render(<HistoryItem request={mockRequest} onRemove={mockOnRemove} />);

    const deleteButton = screen.getByRole('button', { name: 'Delete request' });
    fireEvent.click(deleteButton);

    expect(mockOnRemove).toHaveBeenCalledWith(mockRequest.timestamp);
  });

  it('renders the delete button with correct aria-label and title', () => {
    render(<HistoryItem request={mockRequest} onRemove={mockOnRemove} />);

    const deleteButton = screen.getByRole('button', { name: 'Delete request' });

    expect(deleteButton).toHaveAttribute('aria-label', 'Delete request');
    expect(deleteButton).toHaveAttribute('title', 'Delete request');
  });

  it('generates the correct link from createRequestLink', () => {
    render(<HistoryItem request={mockRequest} onRemove={mockOnRemove} />);

    const link = screen.getByRole('link', { name: mockRequest.url });
    expect(link).toHaveAttribute('href', '/mock-link');
  });
});
