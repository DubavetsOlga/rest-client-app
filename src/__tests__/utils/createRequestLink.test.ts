import { HistoryRequestType } from '@/shared/models/types';
import { encodeToBase64 } from '@/shared/utils/codeBase64';
import { createRequestLink } from '@/shared/utils/createRequestLink';

jest.mock('@/shared/utils/codeBase64', () => ({
  encodeToBase64: jest.fn((str: string) => `b64(${str})`),
}));

describe('createRequestLink', () => {
  const baseRequest: HistoryRequestType = {
    method: 'POST',
    url: '/api/users',
    body: '{"name":"John"}',
    headers: [
      {
        key: 'Content-Type',
        value: 'application/json',
        id: '1',
      },
      {
        key: 'Authorization',
        value: 'Bearer token123',
        id: '1',
      },
    ],
    timestamp: Date.now(),
  };

  it('creates a valid request link with body and headers', () => {
    const result = createRequestLink(baseRequest);
    expect(result).toBe(
      '/POST/b64(/api/users)/b64({"name":"John"})?Content-Type=application%2Fjson&Authorization=Bearer%20token123'
    );

    expect(encodeToBase64).toHaveBeenCalledWith('/api/users');
    expect(encodeToBase64).toHaveBeenCalledWith('{"name":"John"}');
  });

  it('creates a link without body if body is empty', () => {
    const requestWithoutBody = {
      ...baseRequest,
      body: '',
    };

    const result = createRequestLink(requestWithoutBody);
    expect(result).toBe(
      '/POST/b64(/api/users)?Content-Type=application%2Fjson&Authorization=Bearer%20token123'
    );

    expect(encodeToBase64).toHaveBeenCalledWith('/api/users');
    expect(encodeToBase64).not.toHaveBeenCalledWith('');
  });

  it('excludes headers with missing key or value', () => {
    const requestWithInvalidHeaders = {
      ...baseRequest,
      headers: [
        { key: '', value: 'shouldIgnore', id: '1' },
        { key: 'Accept', value: '', id: '2' },
        { key: 'X-Test', value: 'valid', id: '3' },
      ],
    };

    const result = createRequestLink(requestWithInvalidHeaders);
    expect(result).toBe(
      '/POST/b64(/api/users)/b64({"name":"John"})?X-Test=valid'
    );
  });

  it('handles missing headers array', () => {
    const noHeadersRequest = {
      ...baseRequest,
      headers: [],
    };

    const result = createRequestLink(noHeadersRequest);
    expect(result).toBe('/POST/b64(/api/users)/b64({"name":"John"})');
  });
});
