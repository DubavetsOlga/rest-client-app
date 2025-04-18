import { act, renderHook } from '@testing-library/react';
import { useAppDispatch } from '@/shared/store/hooks/useAppDispatch';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/shared/store/hooks/useAppSelector';
import { setLink } from '@/shared/store/reducers/restClientSlice';
import { encodeToBase64 } from '@/shared/utils/codeBase64';
import { useUpdateUrl } from '@/shared/hooks/useUpdateUrl';

jest.mock('@/shared/store/hooks/useAppDispatch', () => ({
  useAppDispatch: jest.fn(),
}));

jest.mock('@/shared/store/hooks/useAppSelector', () => ({
  useAppSelector: jest.fn(),
}));

jest.mock('@/shared/utils/codeBase64', () => ({
  encodeToBase64: jest.fn(),
}));

jest.mock('@/shared/store/reducers/restClientSlice', () => ({
  setLink: jest.fn(),
}));

describe('useUpdateUrl', () => {
  const mockReplace = jest.fn();
  const mockDispatch = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ replace: mockReplace });
    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useAppSelector as jest.Mock).mockReturnValue({
      method: 'GET',
      url: 'https://example.com',
      body: '',
      headers: [{ key: 'Authorization', value: 'Bearer token' }],
    });
    (encodeToBase64 as jest.Mock).mockImplementation((str) => `encoded-${str}`);
  });

  it('should update the URL and dispatch setLink with the correct short URL', () => {
    const { result } = renderHook(() => useUpdateUrl());

    act(() => {
      result.current();
    });

    expect(mockReplace).toHaveBeenCalledWith(
      '/en/GET/encoded-https://example.com?Authorization=Bearer+token',
      { scroll: false }
    );

    expect(mockDispatch).toHaveBeenCalledWith(
      setLink('/GET/encoded-https://example.com/encoded-Bearer%20token')
    );
  });

  it('should correctly handle the case with a body', () => {
    (useAppSelector as jest.Mock).mockReturnValueOnce({
      method: 'POST',
      url: 'https://example.com',
      body: '{"key":"value"}',
      headers: [],
    });

    const { result } = renderHook(() => useUpdateUrl());

    act(() => {
      result.current();
    });

    expect(mockReplace).toHaveBeenCalledWith(
      '/en/POST/encoded-https://example.com/encoded-{"key":"value"}',
      { scroll: false }
    );
  });
});
