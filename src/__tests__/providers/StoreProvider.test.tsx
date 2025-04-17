import { render } from '@testing-library/react';
import { makeStore } from '@/shared/store/store';
import StoreProvider from '@/shared/providers/storeProviders';
import '@testing-library/jest-dom';

jest.mock('@/shared/store/store', () => ({
  makeStore: jest.fn(),
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  Provider: jest.fn(({ children }) => children),
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

describe('StoreProvider', () => {
  const mockMakeStore = makeStore as jest.Mock;
  const mockStore = {
    dispatch: jest.fn(),
    subscribe: jest.fn(),
    getState: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockMakeStore.mockReturnValue(mockStore);
  });

  it('should create store only once with useMemo', () => {
    const { rerender } = render(
      <StoreProvider>
        <div>Test Child</div>
      </StoreProvider>
    );

    rerender(
      <StoreProvider>
        <div>Test Child</div>
      </StoreProvider>
    );
    rerender(
      <StoreProvider>
        <div>Test Child</div>
      </StoreProvider>
    );

    expect(mockMakeStore).toHaveBeenCalledTimes(1);
  });

  it('should render children correctly', () => {
    const { getByText } = render(
      <StoreProvider>
        <div>Test Child</div>
      </StoreProvider>
    );

    expect(getByText('Test Child')).toBeInTheDocument();
  });
});
