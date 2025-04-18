import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useAppSelector } from '@/shared/store/hooks/useAppSelector';
import { isJSON } from '@/shared/utils/isJson';
import '@testing-library/jest-dom';
import { ResponseViewer } from '@/features/restClient/ui/responseViewer/ResponseViewer';

jest.mock('@/shared/store/hooks/useAppSelector');

jest.mock('@/shared/utils/isJson');

jest.mock('@uiw/react-codemirror', () => ({ value }: { value: string }) => (
  <div data-testid="code-mirror">{value}</div>
));

jest.mock(
  '@/features/restClient/ui/responseViewer/responseHeaders/ResponseHeaders',
  () => ({
    ResponseHeaders: () => <div data-testid="response-headers">Headers</div>,
  })
);

jest.mock(
  '@/features/restClient/ui/responseViewer/responseSetting/ResponseSetting',
  () => ({
    ResponseSettings: ({
      status,
      setIsBody,
    }: {
      status: number;
      isBody: boolean;
      setIsBody: (value: boolean) => void;
    }) => (
      <div>
        <button onClick={() => setIsBody(true)}>Body</button>
        <button onClick={() => setIsBody(false)}>Headers</button>
        <span data-testid="status">{status}</span>
      </div>
    ),
  })
);

const mockUseAppSelector = useAppSelector as jest.Mock;
const mockIsJSON = isJSON as jest.Mock;

describe('ResponseViewer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows JSON response body by default if isBody is true', () => {
    mockUseAppSelector.mockReturnValue({
      status: 200,
      result: '{"message":"Hello"}',
      headers: { 'Content-Type': 'application/json' },
    });
    mockIsJSON.mockReturnValue(true);

    render(<ResponseViewer />);

    expect(screen.getByTestId('code-mirror')).toHaveTextContent(
      '{"message":"Hello"}'
    );
    expect(screen.queryByTestId('response-headers')).not.toBeInTheDocument();
  });

  it('switches to headers view when toggled', async () => {
    mockUseAppSelector.mockReturnValue({
      status: 200,
      result: '{"message":"Hello"}',
      headers: { 'Content-Type': 'application/json' },
    });
    mockIsJSON.mockReturnValue(true);

    render(<ResponseViewer />);

    await userEvent.click(screen.getByText('Headers'));

    expect(screen.queryByTestId('code-mirror')).not.toBeInTheDocument();
    expect(screen.getByTestId('response-headers')).toBeInTheDocument();
  });

  it('does not apply json extension if response is not JSON', () => {
    mockUseAppSelector.mockReturnValue({
      status: 200,
      result: '<html lang="en"><body>Error</body></html>',
      headers: { 'Content-Type': 'text/html' },
    });
    mockIsJSON.mockReturnValue(false);

    render(<ResponseViewer />);

    expect(screen.getByTestId('code-mirror')).toHaveTextContent(
      '<html lang="en"><body>Error</body></html>'
    );
  });

  it('handles status 0 gracefully', () => {
    mockUseAppSelector.mockReturnValue({
      status: 0,
      result: '',
      headers: {},
    });
    mockIsJSON.mockReturnValue(false);

    render(<ResponseViewer />);

    expect(screen.getByTestId('code-mirror')).toBeInTheDocument();
    expect(screen.queryByTestId('response-headers')).not.toBeInTheDocument();
  });
});
