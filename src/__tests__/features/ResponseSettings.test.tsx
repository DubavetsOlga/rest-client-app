import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { getHttpStatusText } from '@/shared/utils/getHttpStatusText';
import { getStatusCodeClass } from '@/shared/utils/getStatusCodeClass';
import { ResponseSettings } from '@/features/restClient/ui/responseViewer/responseSetting/ResponseSetting';
import '@testing-library/jest-dom';

jest.mock('@/shared/utils/getHttpStatusText');
jest.mock('@/shared/utils/getStatusCodeClass');

const mockGetHttpStatusText = getHttpStatusText as jest.Mock;
const mockGetStatusCodeClass = getStatusCodeClass as jest.Mock;

describe('ResponseSettings', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockGetHttpStatusText.mockImplementation((code: number) => {
      return code === 200 ? 'OK' : 'Unknown';
    });

    mockGetStatusCodeClass.mockImplementation((code: number) => {
      if (code >= 200 && code < 300) return 'success';
      return 'error';
    });
  });

  it('renders with status and correct labels', () => {
    render(
      <ResponseSettings status={200} isBody={true} setIsBody={jest.fn()} />
    );

    expect(screen.getByText('Response')).toBeInTheDocument();
    expect(screen.getByLabelText('Body')).toBeChecked();
    expect(screen.getByLabelText('Headers')).not.toBeChecked();
    expect(screen.getByText('200 OK')).toBeInTheDocument();
  });

  it('renders no status block if status is 0', () => {
    const { queryByText } = render(
      <ResponseSettings status={0} isBody={false} setIsBody={jest.fn()} />
    );

    expect(queryByText(/0/)).not.toBeInTheDocument();
  });

  it('calls setIsBody when toggling radio buttons', () => {
    const mockSetIsBody = jest.fn();

    render(
      <ResponseSettings status={200} isBody={true} setIsBody={mockSetIsBody} />
    );

    const headersRadio = screen.getByLabelText('Headers');
    fireEvent.click(headersRadio);

    expect(mockSetIsBody).toHaveBeenCalledWith(false);
  });
});
