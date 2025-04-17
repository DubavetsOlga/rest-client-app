import { useHistoryRequest } from '@/features/history/hooks/useHistoryRequest';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import { act, renderHook } from '@testing-library/react';
import { HttpMethod } from '@/shared/models/httpMethod';

jest.mock('@/shared/hooks/useLocalStorage', () => ({
  useLocalStorage: jest.fn(),
}));

describe('useHistoryRequest', () => {
  const mockSetStorageItem = jest.fn();
  const mockGetStorageItem = jest.fn();
  const mockRemoveStorageItem = jest.fn();

  beforeEach(() => {
    mockSetStorageItem.mockClear();
    mockGetStorageItem.mockClear();
    mockRemoveStorageItem.mockClear();

    (useLocalStorage as jest.Mock).mockImplementation(() => ({
      getStorageItem: mockGetStorageItem,
      setStorageItem: mockSetStorageItem,
      removeStorageItem: mockRemoveStorageItem,
    }));
  });

  it('should load history from localStorage', () => {
    mockGetStorageItem.mockReturnValue([
      { timestamp: 1, url: 'http://example.com' },
    ]);

    const { result } = renderHook(() => useHistoryRequest());

    expect(result.current.history).toEqual([
      { timestamp: 1, url: 'http://example.com' },
    ]);
    expect(result.current.isLoading).toBe(false);
  });

  it('should add an item to history and update localStorage', () => {
    const newItem = {
      timestamp: 2,
      url: 'http://new-url.com',
      method: HttpMethod.GET,
      body: '',
      headers: [],
    };
    const { result } = renderHook(() => useHistoryRequest());

    act(() => {
      result.current.addToHistory(newItem);
    });

    expect(result.current.history).toEqual([
      newItem,
      { timestamp: 1, url: 'http://example.com' },
    ]);
    expect(mockSetStorageItem).toHaveBeenCalledWith('history', [
      newItem,
      { timestamp: 1, url: 'http://example.com' },
    ]);
  });

  it('should remove an item from history and update localStorage', () => {
    const { result } = renderHook(() => useHistoryRequest());

    act(() => {
      result.current.removeFromHistory(1);
    });

    expect(result.current.history).toEqual([]);
    expect(mockSetStorageItem).toHaveBeenCalledWith('history', []);
  });

  it('should clear the history and remove it from localStorage', () => {
    const { result } = renderHook(() => useHistoryRequest());

    act(() => {
      result.current.clearHistory();
    });

    expect(result.current.history).toEqual([]);
    expect(mockRemoveStorageItem).toHaveBeenCalledWith('history');
  });

  it('should handle loading state correctly', () => {
    mockGetStorageItem.mockReturnValueOnce([
      { timestamp: 1, url: 'http://example.com' },
    ]);

    const { result } = renderHook(() => useHistoryRequest());

    expect(result.current.history).toEqual([
      {
        timestamp: 1,
        url: 'http://example.com',
      },
    ]);
    expect(result.current.isLoading).toBe(false);

    act(() => {
      result.current.addToHistory({
        timestamp: 2,
        url: 'http://new-url.com',
        method: HttpMethod.GET,
        body: '',
        headers: [],
      });
    });

    expect(result.current.isLoading).toBe(false);
  });
});
