import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { SendButton } from '@/features/restClient/ui/requestForm/sendButton/SendButton';
import { undefined } from 'zod';

jest.mock('@/shared/store/hooks/useAppSelector', () => ({
  useAppSelector: jest.fn(),
}));

jest.mock('@/features/history/hooks/useHistoryRequest', () => ({
  useHistoryRequest: () => ({
    addToHistory: jest.fn(),
  }),
}));

jest.mock('@/shared/utils/prepareRequestData', () => ({
  prepareRequestData: jest.fn(() => ({
    endpoint: 'https://api.example.com',
    bodyWithVars: '{"test":true}',
    headersObj: { 'Content-Type': 'application/json' },
    historyEntry: {
      method: 'GET',
      url: 'https://api.example.com',
      timestamp: '2023-01-01T00:00:00.000Z',
    },
  })),
}));

jest.mock('@/shared/utils/requestAction', () => ({
  requestAction: jest.fn(() =>
    Promise.resolve({
      status: 200,
      data: { success: true },
      headers: {},
      duration: 100,
    })
  ),
}));

describe('SendButton Component', () => {
  const mockUseAppSelector =
    require('@/shared/store/hooks/useAppSelector').useAppSelector;
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseAppSelector.mockImplementation((selector: { name: string }) => {
      if (selector.name === 'selectUrl') {
        return 'https://api.example.com';
      }
      if (selector.name === 'selectMethod') {
        return 'GET';
      }
      if (selector.name === 'selectBody') {
        return '';
      }
      if (selector.name === 'selectHeaders') {
        return [];
      }
      if (selector.name === 'selectVariables') {
        return {};
      }
      return undefined;
    });
  });

  const renderComponent = (disabled = false) => {
    const store = configureStore({
      reducer: {
        restClientSlice: () => ({}),
        variablesReducer: () => ({}),
      },
    });
    store.dispatch = mockDispatch;

    return render(
      <Provider store={store}>
        <SendButton disabled={disabled} />
      </Provider>
    );
  };

  it('renders correctly when enabled', () => {
    renderComponent(false);

    const button = screen.getByRole('button', { name: 'Send' });
    expect(button).toBeInTheDocument();
    expect(button).toBeEnabled();
  });

  it('renders correctly when disabled', () => {
    renderComponent(true);

    const button = screen.getByRole('button', { name: 'Send' });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it('does nothing when clicked with no URL', async () => {
    mockUseAppSelector.mockImplementation((selector: { name: string }) => {
      if (selector.name === 'selectUrl') return '';
      return undefined;
    });

    renderComponent(false);

    const button = screen.getByRole('button', { name: 'Send' });
    fireEvent.click(button);

    expect(mockDispatch).not.toHaveBeenCalled();
  });
});
