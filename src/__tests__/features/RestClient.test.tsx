import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { RestClient } from '@/features/restClient/ui/restClient/RestClient';
import { useUpdateUrl } from '@/shared/hooks/useUpdateUrl';
import { useRestClientInitialization } from '@/shared/hooks/useRestClientInitialization';
import restClientReducer from '@/shared/store/reducers/restClientSlice';
import { HttpMethod } from '@/shared/models/httpMethod';
import { CodeLanguageType } from '@/shared/models/codeLanguages';

jest.mock('@/shared/hooks/useUpdateUrl', () => ({
  useUpdateUrl: jest.fn(),
}));

jest.mock('@/shared/hooks/useRestClientInitialization');

jest.mock('@/features/restClient/ui/requestForm/RequestForm', () => ({
  RequestForm: () => <div data-testid="request-form">Request Form</div>,
}));

jest.mock('@/features/restClient/ui/tabs/Tabs', () => ({
  Tabs: () => <div data-testid="tabs">Tabs</div>,
}));

jest.mock('@/features/restClient/ui/responseViewer/ResponseViewer', () => ({
  ResponseViewer: () => (
    <div data-testid="response-viewer">Response Viewer</div>
  ),
}));

describe('RestClient Component', () => {
  const mockUpdateUrl = jest.fn();
  const mockUseRestClientInitialization = jest.fn();

  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    jest.clearAllMocks();

    (useUpdateUrl as jest.Mock).mockReturnValue(mockUpdateUrl);
    (useRestClientInitialization as jest.Mock) =
      mockUseRestClientInitialization;

    store = configureStore({
      reducer: {
        restClientReducer: restClientReducer,
      },
      preloadedState: {
        restClientReducer: {
          method: HttpMethod.GET,
          url: 'https://api.example.com',
          body: '',
          headers: [
            { id: '1', key: 'Content-Type', value: 'application/json' },
          ],
          response: { result: '', status: 0, headers: {} },
          isJsonMode: true,
          codeType: 'curl' as CodeLanguageType,
          link: '/api/v1/endpoint',
        },
      },
    });

    render(
      <Provider store={store}>
        <RestClient>
          <div data-testid="child">Child Component</div>
        </RestClient>
      </Provider>
    );
  });

  it('should render RequestForm, Tabs, and ResponseViewer', () => {
    expect(screen.getByTestId('request-form')).toBeInTheDocument();
    expect(screen.getByTestId('tabs')).toBeInTheDocument();
    expect(screen.getByTestId('response-viewer')).toBeInTheDocument();
  });

  it('should render child components inside RestClient', () => {
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
