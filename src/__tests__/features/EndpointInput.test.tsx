import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { EndpointInput } from '@/features/restClient/ui/requestForm/endpointInput/EndpointInput';
import restClientReducer from '@/shared/store/reducers/restClientSlice';
import variablesReducer from '@/shared/store/reducers/variablesSlice';
import { HttpMethod } from '@/shared/models/httpMethod';
import { CodeLanguageType } from '@/shared/models/codeLanguages';

jest.mock(
  '@uiw/react-codemirror',
  () =>
    ({
      value,
      onChange,
      onBlur,
      placeholder,
    }: {
      value: string;
      onChange: (newValue: string) => void;
      onBlur: () => void;
      placeholder: string;
    }) => (
      <input
        data-testid="codemirror-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
      />
    )
);

describe('EndpointInput Component', () => {
  const mockStore = configureStore({
    reducer: {
      restClientReducer,
      variablesReducer,
    },
    preloadedState: {
      restClientReducer: {
        method: HttpMethod.GET,
        url: 'https://api.example.com',
        body: '',
        headers: [{ id: '1', key: 'Content-Type', value: 'application/json' }],
        response: { result: '', status: 0, headers: {} },
        isJsonMode: true,
        codeType: 'curl' as CodeLanguageType,
        link: '/api/v1/endpoint',
      },
      variablesReducer: {
        variables: [],
        isStored: false,
      },
    },
  });

  it('renders correctly with initial store URL', () => {
    render(
      <Provider store={mockStore}>
        <EndpointInput onChange={jest.fn()} />
      </Provider>
    );

    const input = screen.getByTestId('codemirror-input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('https://api.example.com');
    expect(input).toHaveAttribute('placeholder', 'Enter URL');
  });

  it('calls onChange with false when URL is valid', () => {
    const mockOnChange = jest.fn();
    render(
      <Provider store={mockStore}>
        <EndpointInput onChange={mockOnChange} />
      </Provider>
    );

    const input = screen.getByTestId('codemirror-input');
    fireEvent.change(input, { target: { value: 'https://new-url.com' } });
    expect(mockOnChange).toHaveBeenCalledWith(false);
  });

  it('calls onChange with true when URL is empty', () => {
    const mockOnChange = jest.fn();
    render(
      <Provider store={mockStore}>
        <EndpointInput onChange={mockOnChange} />
      </Provider>
    );

    const input = screen.getByTestId('codemirror-input');
    fireEvent.change(input, { target: { value: '' } });
    expect(mockOnChange).toHaveBeenCalledWith(true);
  });

  it('dispatches setUrl action when blurred', () => {
    const mockDispatch = jest.fn();
    const storeWithMockDispatch = {
      ...mockStore,
      dispatch: mockDispatch,
    };

    render(
      <Provider store={storeWithMockDispatch}>
        <EndpointInput onChange={jest.fn()} />
      </Provider>
    );

    const input = screen.getByTestId('codemirror-input');
    fireEvent.change(input, { target: { value: 'https://test.com' } });
    fireEvent.blur(input);

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'restClient/setUrl',
        payload: 'https://test.com',
      })
    );
  });

  it('trims URL before dispatching', () => {
    const mockDispatch = jest.fn();
    const storeWithMockDispatch = {
      ...mockStore,
      dispatch: mockDispatch,
    };

    render(
      <Provider store={storeWithMockDispatch}>
        <EndpointInput onChange={jest.fn()} />
      </Provider>
    );

    const input = screen.getByTestId('codemirror-input');
    fireEvent.change(input, { target: { value: '  https://test.com  ' } });
    fireEvent.blur(input);

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'restClient/setUrl',
        payload: 'https://test.com',
      })
    );
  });
});
