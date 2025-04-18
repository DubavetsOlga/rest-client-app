import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { RequestForm } from '@/features/restClient/ui/requestForm/RequestForm';
import { selectUrl } from '@/shared/store/selectors/restClientSelectors';

jest.mock(
  '@/features/restClient/ui/requestForm/methodSelect/MethodSelect',
  () => ({
    MethodSelect: () => <div data-testid="method-select" />,
  })
);

jest.mock(
  '@/features/restClient/ui/requestForm/endpointInput/EndpointInput',
  () => ({
    EndpointInput: ({
      onChange,
    }: {
      onChange: (disabled: boolean) => void;
    }) => (
      <input
        data-testid="endpoint-input"
        onChange={(e) => onChange(!e.target.value)}
      />
    ),
  })
);

jest.mock('@/features/restClient/ui/requestForm/sendButton/SendButton', () => ({
  SendButton: ({ disabled }: { disabled: boolean }) => (
    <button data-testid="send-button" disabled={disabled}>
      Send
    </button>
  ),
}));

jest.mock('@/shared/store/selectors/restClientSelectors', () => ({
  selectUrl: jest.fn(),
}));

describe('RequestForm Component', () => {
  const mockSelectUrl = selectUrl as jest.MockedFunction<typeof selectUrl>;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders all child components', () => {
    mockSelectUrl.mockReturnValue('');
    const store = configureStore({
      reducer: {
        restClientSlice: () => ({}),
      },
    });

    render(
      <Provider store={store}>
        <RequestForm />
      </Provider>
    );

    expect(screen.getByTestId('method-select')).toBeInTheDocument();
    expect(screen.getByTestId('endpoint-input')).toBeInTheDocument();
    expect(screen.getByTestId('send-button')).toBeInTheDocument();
  });

  it('disables send button when url is empty', () => {
    mockSelectUrl.mockReturnValue('');
    const store = configureStore({
      reducer: {
        restClientSlice: () => ({}),
      },
    });

    render(
      <Provider store={store}>
        <RequestForm />
      </Provider>
    );

    expect(screen.getByTestId('send-button')).toBeDisabled();
  });

  it('enables send button when url is not empty', () => {
    mockSelectUrl.mockReturnValue('https://api.example.com');
    const store = configureStore({
      reducer: {
        restClientSlice: () => ({}),
      },
    });

    render(
      <Provider store={store}>
        <RequestForm />
      </Provider>
    );

    expect(screen.getByTestId('send-button')).toBeEnabled();
  });

  it('updates send button disabled state when endpoint input changes', () => {
    mockSelectUrl.mockReturnValue('');
    const store = configureStore({
      reducer: {
        restClientSlice: () => ({}),
      },
    });

    render(
      <Provider store={store}>
        <RequestForm />
      </Provider>
    );

    const endpointInput = screen.getByTestId('endpoint-input');

    fireEvent.change(endpointInput, {
      target: { value: 'https://api.example.com' },
    });
    expect(screen.getByTestId('send-button')).toBeEnabled();

    fireEvent.change(endpointInput, { target: { value: '' } });
    expect(screen.getByTestId('send-button')).toBeDisabled();
  });

  it('has correct container class', () => {
    mockSelectUrl.mockReturnValue('');
    const store = configureStore({
      reducer: {
        restClientSlice: () => ({}),
      },
    });

    const { container } = render(
      <Provider store={store}>
        <RequestForm />
      </Provider>
    );

    expect(container.firstChild).toHaveClass('container');
  });
});
