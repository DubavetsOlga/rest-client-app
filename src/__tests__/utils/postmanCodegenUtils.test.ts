import {
  generatePostmanCode,
  SupportedLanguage,
} from '@/shared/utils/postmanCodegenUtils';
import { Request as PostmanRequest } from 'postman-collection';

jest.mock('postman-code-generators', () => ({
  convert: jest.fn(),
}));

const mockConvert = require('postman-code-generators').convert;

jest.mock('uuid', () => ({
  v4: () => 'mock-uuid',
  v1: () => 'mock-uuid',
}));

describe('generatePostmanCode', () => {
  const mockRequest = new PostmanRequest({
    method: 'GET',
    url: 'https://api.example.com',
    header: [{ key: 'Authorization', value: 'Bearer token' }],
  });

  it('should generate code successfully for valid input', async () => {
    const mockSnippet = 'fetch("https://api.example.com")';

    mockConvert.mockImplementation(
      (
        language: SupportedLanguage,
        variant: string,
        request: PostmanRequest,
        options: [],
        callback: (error: Error | null, snippet: string) => void
      ) => {
        callback(null, mockSnippet);
      }
    );

    const result = await generatePostmanCode(
      mockRequest,
      'javascript',
      'fetch'
    );

    expect(result).toBe(mockSnippet);
    expect(mockConvert).toHaveBeenCalledWith(
      'javascript',
      'fetch',
      mockRequest,
      expect.objectContaining({
        indentCount: 2,
        indentType: 'space',
        trimRequestBody: true,
        followRedirect: true,
      }),
      expect.any(Function)
    );
  });

  it('should handle errors when generation fails', async () => {
    const mockError = new Error('Code generation failed');

    mockConvert.mockImplementation(
      (
        language: SupportedLanguage,
        variant: string,
        request: PostmanRequest,
        options: [],
        callback: (error: Error | null, snippet: string) => void
      ) => {
        callback(mockError, '');
      }
    );

    await expect(
      generatePostmanCode(mockRequest, 'python', 'requests')
    ).rejects.toThrow(mockError);
    expect(mockConvert).toHaveBeenCalledWith(
      'python',
      'requests',
      mockRequest,
      expect.objectContaining({
        indentCount: 2,
        indentType: 'space',
        trimRequestBody: true,
        followRedirect: true,
      }),
      expect.any(Function)
    );
  });

  it('should use default options when no options are provided', async () => {
    const mockSnippet = 'fetch("https://api.example.com")';

    mockConvert.mockImplementation(
      (
        language: SupportedLanguage,
        variant: string,
        request: PostmanRequest,
        options: [],
        callback: (error: Error | null, snippet: string) => void
      ) => {
        callback(null, mockSnippet);
      }
    );

    const result = await generatePostmanCode(mockRequest, 'nodejs', 'native');

    expect(result).toBe(mockSnippet);
    expect(mockConvert).toHaveBeenCalledWith(
      'nodejs',
      'native',
      mockRequest,
      expect.objectContaining({
        indentCount: 2,
        indentType: 'space',
        trimRequestBody: true,
        followRedirect: true,
      }),
      expect.any(Function)
    );
  });

  it('should accept custom options for code generation', async () => {
    const customOptions = {
      indentCount: 4,
      indentType: 'tab' as 'space' | 'tab' | undefined,
      trimRequestBody: false,
      followRedirect: false,
    };

    const mockSnippet = 'fetch("https://api.example.com")';

    mockConvert.mockImplementation(
      (
        language: SupportedLanguage,
        variant: string,
        request: PostmanRequest,
        options: [],
        callback: (error: Error | null, snippet: string) => void
      ) => {
        callback(null, mockSnippet);
      }
    );

    const result = await generatePostmanCode(
      mockRequest,
      'java',
      'okhttp',
      customOptions
    );

    expect(result).toBe(mockSnippet);
    expect(mockConvert).toHaveBeenCalledWith(
      'java',
      'okhttp',
      mockRequest,
      expect.objectContaining(customOptions),
      expect.any(Function)
    );
  });
});
