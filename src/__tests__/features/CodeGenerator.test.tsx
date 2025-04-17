import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { CodeGenerator } from '@/features/restClient/ui/tabs/codeGenerator/CodeGenerator';
import restClientReducer from '@/shared/store/reducers/restClientSlice';
import variablesReducer from '@/shared/store/reducers/variablesSlice';
import { HttpMethod } from '@/shared/models/httpMethod';
import { CodeLanguageType } from '@/shared/models/codeLanguages';

type MockRequestOptions = {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | string;
  header?: Record<string, string>;
  body?: string;
};

class MockRequest {
  constructor(public options: MockRequestOptions) {}

  url = this.options.url;
  method = this.options.method;
  headers = this.options.header;
  body = this.options.body;
}

jest.mock('postman-collection', () => ({
  Request: MockRequest,
}));

jest.mock('postman-code-generators', () => ({
  convert: jest.fn(() => 'generated-code'),
}));

jest.mock('uuid', () => ({
  v4: () => 'mock-uuid',
  v1: () => 'mock-uuid',
}));

jest.mock('@/shared/utils/codeGeneratorUtils', () => ({
  __esModule: true,
  languageExtensions: {
    curl: [],
    fetch: [jest.fn()],
    xhr: [jest.fn()],
    nodejs: [jest.fn()],
    python: [jest.fn()],
    java: [jest.fn()],
    csharp: [jest.fn()],
    go: [jest.fn()],
  },
  EDITOR_EXTENSIONS: [],
  EDITOR_SETUP: {
    lineNumbers: false,
    highlightActiveLine: false,
  },
  generateCode: jest.fn((request) => {
    return `Generated ${request.method} code for ${request.url}`;
  }),
  createPostmanRequest: jest.fn((method, url, body, headers) => {
    return new MockRequest({
      method: method.toUpperCase(),
      url: url,
      header: headers,
      ...(body && { body: { mode: 'raw', raw: body } }),
    });
  }),
}));

jest.mock('@uiw/react-codemirror', () => ({ value }: { value: string }) => (
  <div data-testid="codemirror">{value}</div>
));

describe('CodeGenerator Component', () => {
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

  it('renders correctly and generates code', async () => {
    render(
      <Provider store={mockStore}>
        <CodeGenerator />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('codemirror')).toHaveTextContent(
        'Generated GET code for https://api.example.com'
      );
    });
  });

  it('changes language when select value changes', async () => {
    render(
      <Provider store={mockStore}>
        <CodeGenerator />
      </Provider>
    );

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'python' } });

    await waitFor(() => {
      expect(select).toHaveValue('python');
    });
  });
});
