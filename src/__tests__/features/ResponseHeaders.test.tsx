import React from 'react';
import { render, screen } from '@testing-library/react';
import { useAppSelector } from '@/shared/store/hooks/useAppSelector';

import { ResponseHeaders } from '@/features/restClient/ui/responseViewer/responseHeaders/ResponseHeaders';
import '@testing-library/jest-dom';

jest.mock('@/shared/store/hooks/useAppSelector');

const mockUseAppSelector = useAppSelector as jest.Mock;

describe('ResponseHeaders', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when headers are empty', () => {
    mockUseAppSelector.mockReturnValue({
      headers: {},
    });

    const { container } = render(<ResponseHeaders />);
    expect(container.firstChild).toBeNull();
  });

  it('renders headers table when headers are present', () => {
    mockUseAppSelector.mockReturnValue({
      headers: {
        'Content-Type': 'application/json',
        'X-Test': 'true',
      },
    });

    render(<ResponseHeaders />);

    expect(screen.getByText('Key')).toBeInTheDocument();
    expect(screen.getByText('Value')).toBeInTheDocument();
    expect(screen.getByText('Content-Type')).toBeInTheDocument();
    expect(screen.getByText('application/json')).toBeInTheDocument();
    expect(screen.getByText('X-Test')).toBeInTheDocument();
    expect(screen.getByText('true')).toBeInTheDocument();
  });
});
