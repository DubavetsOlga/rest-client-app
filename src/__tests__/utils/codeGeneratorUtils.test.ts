import { Request } from 'postman-collection';
import { Variable } from '@/shared/models/types';
import { generatePostmanCode } from '@/shared/utils/postmanCodegenUtils';
import { CodeLanguageType } from '@/shared/models/codeLanguages';
import {
  createPostmanRequest,
  generateCode,
} from '@/shared/utils/codeGeneratorUtils';

jest.mock('@/shared/utils/postmanCodegenUtils', () => ({
  ...jest.requireActual('@/shared/utils/postmanCodegenUtils'),
  generatePostmanCode: jest.fn(),
}));

jest.mock('postman-code-generators', () => ({
  convert: jest.fn(() => 'generated-code'),
}));

Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => 'mock-uuid',
  },
});

jest.mock('uuid', () => ({
  v4: () => 'mock-uuid',
  v1: () => 'mock-uuid',
}));

describe('createPostmanRequest', () => {
  const variables: Variable[] = [
    {
      key: 'userId',
      value: '123',
      id: '1',
    },
    {
      key: 'token',
      value: 'abc123',
      id: '2',
    },
  ];

  it('replaces variables in URL, body, and headers', () => {
    const method = 'POST';
    const url = 'https://api.example.com/users/{{userId}}';
    const body = '{"token": "{{token}}"}';
    const headers = [
      { key: 'Authorization', value: 'Bearer {{token}}' },
      { key: '', value: 'shouldIgnore' },
    ];

    const request = createPostmanRequest(method, url, body, headers, variables);

    expect(request.method).toBe('POST');
    expect(request.url.toString()).toBe('https://api.example.com/users/123');
    expect(request.body?.raw).toBe('{"token": "abc123"}');
    expect(request.headers.count()).toBe(1);
  });

  it('handles empty body and filters invalid headers', () => {
    const request = createPostmanRequest(
      'GET',
      'https://test.com/data',
      '',
      [
        { key: 'Valid', value: 'ok' },
        { key: '', value: 'missingKey' },
        { key: 'NoValue', value: '' },
      ],
      []
    );

    expect(request.method).toBe('GET');
    expect(request.body).toBeUndefined();
    expect(request.headers.count()).toBe(1);
  });
});

describe('generateCode', () => {
  const mockRequest = new Request({
    method: 'GET',
    url: 'https://api.example.com/data',
  });

  const errorMessage = 'Code generation failed';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('generates code using supported language and variant', async () => {
    (generatePostmanCode as jest.Mock).mockResolvedValue('some code');
    const result = await generateCode(
      mockRequest,
      'python' as CodeLanguageType,
      errorMessage
    );
    expect(result).toBe('some code');
    expect(generatePostmanCode).toHaveBeenCalledWith(
      mockRequest,
      'python',
      'requests'
    );
  });

  it('returns error message on generation failure', async () => {
    (generatePostmanCode as jest.Mock).mockRejectedValue(new Error('Boom'));
    const result = await generateCode(
      mockRequest,
      'go' as CodeLanguageType,
      errorMessage
    );
    expect(result).toBe('Code generation failed (Boom)');
  });
});
