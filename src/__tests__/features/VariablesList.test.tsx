import { render, screen, fireEvent } from '@testing-library/react';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import { useAppSelector } from '@/shared/store/hooks/useAppSelector';
import { useAppDispatch } from '@/shared/store/hooks/useAppDispatch';
import { VariablesList } from '@/features/variables/ui/variablesList/VariablesList';
import '@testing-library/jest-dom';

jest.mock('@/shared/store/hooks/useAppSelector');
jest.mock('@/shared/store/hooks/useAppDispatch');
jest.mock('@/shared/hooks/useLocalStorage');

Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => 'mock-uuid',
  },
});

const mockUseAppSelector = useAppSelector as jest.MockedFunction<
  typeof useAppSelector
>;
const mockUseAppDispatch = useAppDispatch as jest.MockedFunction<
  typeof useAppDispatch
>;
const mockUseLocalStorage = useLocalStorage as jest.MockedFunction<
  typeof useLocalStorage
>;

describe('VariablesList', () => {
  const mockDispatch = jest.fn();
  const mockSetStorageItem = jest.fn();

  const mockVariables = [
    { id: '1', key: 'API_URL', value: 'https://api.example.com' },
    {
      id: '2',
      key: 'DATABASE_URL',
      value: 'postgres://user:pass@localhost:5432/db',
    },
  ];

  beforeEach(() => {
    mockUseAppDispatch.mockReturnValue(mockDispatch);

    mockUseAppSelector.mockImplementation((selector) =>
      selector({
        variablesReducer: {
          variables: mockVariables,
          isStored: true,
        },
        restClientReducer: {
          headers: [],
          url: '',
          isJsonMode: true,
          codeType: 'curl',
          link: '',
          method: 'GET',
          body: '',
          response: { result: '', status: 0, headers: {} },
        },
      })
    );

    mockUseLocalStorage.mockReturnValue({
      getStorageItem: jest.fn(),
      setStorageItem: mockSetStorageItem,
      removeStorageItem: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with variables', () => {
    render(<VariablesList />);

    expect(screen.getByText('Variables')).toBeInTheDocument();
    expect(screen.getByDisplayValue('API_URL')).toBeInTheDocument();
    expect(screen.getByDisplayValue('DATABASE_URL')).toBeInTheDocument();
  });

  it('filters variables based on search query', () => {
    render(<VariablesList />);

    const searchInput = screen.getByRole('searchbox');
    fireEvent.change(searchInput, { target: { value: 'API' } });

    expect(screen.getByDisplayValue('API_URL')).toBeInTheDocument();
    expect(screen.queryByDisplayValue('DATABASE_URL')).not.toBeInTheDocument();
  });

  it('saves variables to localStorage when they change', () => {
    render(<VariablesList />);

    expect(mockSetStorageItem).toHaveBeenCalledWith('variables', mockVariables);
  });
});
