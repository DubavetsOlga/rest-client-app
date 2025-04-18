import { HttpMethodType } from '@/shared/models/httpMethod';
import { Variable, HeaderType } from '@/shared/models/types';
import { prepareRequestData } from '@/shared/utils/prepareRequestData';

jest.mock('@/shared/utils/replaceVariables', () => ({
  replaceVariables: jest.fn((input: string, vars: Variable[]) => {
    return vars.reduce(
      (acc, curr) =>
        acc.replace(new RegExp(`{{\\s*${curr.key}\\s*}}`, 'g'), curr.value),
      input
    );
  }),
}));

describe('prepareRequestData', () => {
  const variables: Variable[] = [
    {
      key: 'userId',
      value: '123',
      id: '1',
    },
    {
      key: 'token',
      value: 'abc',
      id: '2',
    },
  ];

  const headers: HeaderType[] = [
    {
      key: 'Authorization',
      value: 'Bearer {{token}}',
      id: '1',
    },
    {
      key: 'Content-Type',
      value: 'application/json',
      id: '2',
    },
  ];

  it('replaces variables in endpoint, body, and headers', () => {
    const result = prepareRequestData(
      'POST' as HttpMethodType,
      '/users/{{userId}}',
      '{"id":"{{userId}}"}',
      headers,
      variables
    );

    expect(result.endpoint).toBe('/users/123');
    expect(result.body).toBe('{"id":"123"}');
    expect(result.headers).toEqual({
      Authorization: 'Bearer abc',
      'Content-Type': 'application/json',
    });
  });

  it('constructs the history entry correctly', () => {
    const result = prepareRequestData(
      'GET' as HttpMethodType,
      '/users/{{userId}}',
      '',
      headers,
      variables
    );

    expect(result.historyEntry).toMatchObject({
      method: 'GET',
      url: '/users/123',
      body: '',
      headers: [
        { key: 'Authorization', value: 'Bearer abc' },
        { key: 'Content-Type', value: 'application/json' },
      ],
    });

    expect(typeof result.historyEntry.timestamp).toBe('number');
  });

  it('ignores headers with empty keys when reducing', () => {
    const headersWithEmptyKey: HeaderType[] = [
      {
        key: '',
        value: 'invalid',
        id: '1',
      },
      {
        key: 'X-Test',
        value: 'value',
        id: '2',
      },
    ];

    const result = prepareRequestData(
      'PUT' as HttpMethodType,
      '/test',
      '{}',
      headersWithEmptyKey,
      []
    );

    expect(result.headers).toEqual({
      'X-Test': 'value',
    });
  });
});
