import { render, screen, fireEvent } from '@testing-library/react';
import { Variable } from '@/shared/models/types';
import { useAppDispatch } from '@/shared/store/hooks/useAppDispatch';
import { useAppSelector } from '@/shared/store/hooks/useAppSelector';
import { VariableItem } from '@/features/variables/ui/variableItem/VariableItem';
import '@testing-library/jest-dom';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';

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

describe('VariableItem', () => {
  const mockDispatch = jest.fn();
  const mockSetStorageItem = jest.fn();
  const mockVariable: Variable = {
    id: '1',
    key: 'testKey',
    value: 'testValue',
  };

  const mockVariables = [
    { id: '2', key: 'existingKey', value: 'existingValue' },
    mockVariable,
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

  it('renders with provided variable', () => {
    render(<VariableItem variable={mockVariable} />);

    expect(screen.getByDisplayValue('testKey')).toBeInTheDocument();
    expect(screen.getByDisplayValue('testValue')).toBeInTheDocument();
  });

  it('updates key and value on input change', () => {
    const { container } = render(<VariableItem />);

    const keyInput = container.querySelector('input.input') as Element;
    const valueInput = container.querySelectorAll('input.input')[1];

    fireEvent.change(keyInput, { target: { value: 'newKey' } });
    fireEvent.change(valueInput, { target: { value: 'newValue' } });

    expect(keyInput).toHaveValue('newKey');
    expect(valueInput).toHaveValue('newValue');
  });

  it('dispatches createVariable when blurring with new values', () => {
    const { container } = render(<VariableItem />);

    const keyInput = container.querySelector('input.input') as Element;
    const valueInput = container.querySelectorAll('input.input')[1];

    fireEvent.change(keyInput, { target: { value: 'newKey' } });
    fireEvent.change(valueInput, { target: { value: 'newValue' } });
    fireEvent.blur(keyInput);

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'variables/createVariable',
        payload: {
          id: expect.any(String),
          key: 'newKey',
          value: 'newValue',
        },
      })
    );
  });

  it('dispatches editVariable when blurring with existing item', () => {
    render(<VariableItem variable={mockVariable} itemCreated />);

    const keyInput = screen.getByDisplayValue('testKey');
    fireEvent.change(keyInput, { target: { value: 'updatedKey' } });
    fireEvent.blur(keyInput);

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'variables/editVariable',
        payload: {
          id: '1',
          key: 'updatedKey',
          value: 'testValue',
        },
      })
    );
  });

  it('trims key and value before dispatching', () => {
    const { container } = render(<VariableItem />);

    const keyInput = container.querySelector('input.input') as Element;
    const valueInput = container.querySelectorAll('input.input')[1];

    fireEvent.change(keyInput, { target: { value: '  trimmedKey  ' } });
    fireEvent.change(valueInput, { target: { value: '  trimmedValue  ' } });
    fireEvent.blur(keyInput);

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: {
          id: 'mock-uuid',
          key: 'trimmedKey',
          value: 'trimmedValue',
        },
      })
    );
  });

  it('resets form after creating new variable', () => {
    const { container } = render(<VariableItem />);

    const keyInput = container.querySelector('input.input') as Element;
    const valueInput = container.querySelectorAll('input.input')[1];

    fireEvent.change(keyInput, { target: { value: 'newKey' } });
    fireEvent.change(valueInput, { target: { value: 'newValue' } });
    fireEvent.blur(keyInput);

    expect(keyInput).toHaveValue('');
    expect(valueInput).toHaveValue('');
  });
});
