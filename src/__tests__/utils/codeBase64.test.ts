import { decodeFromBase64, encodeToBase64 } from '@/shared/utils/codeBase64';

describe('encodeToBase64', () => {
  it('encodes a regular string to base64', () => {
    const result = encodeToBase64('Hello World');
    expect(result).toBe('SGVsbG8gV29ybGQ');
  });

  it('uses URL-safe characters', () => {
    const input = 'this+is/a=test==';
    const encoded = encodeToBase64(input);
    expect(encoded).not.toMatch(/[+/=]/);
  });

  it('encodes and removes padding', () => {
    const input = 'test';
    const encoded = encodeToBase64(input);
    expect(encoded.endsWith('=')).toBe(false);
  });

  it('encodes empty string as empty', () => {
    expect(encodeToBase64('')).toBe('');
  });
});

describe('decodeFromBase64', () => {
  it('decodes a base64 string back to original', () => {
    const encoded = encodeToBase64('Encode this string!');
    const decoded = decodeFromBase64(encoded);
    expect(decoded).toBe('Encode this string!');
  });

  it('handles URL-safe characters during decoding', () => {
    const original = 'some+test/data=123';
    const encoded = encodeToBase64(original);
    const decoded = decodeFromBase64(encoded);
    expect(decoded).toBe(original);
  });

  it('decodes empty string as empty', () => {
    expect(decodeFromBase64('')).toBe('');
  });
});
