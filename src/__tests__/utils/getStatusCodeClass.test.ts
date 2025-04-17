import { getStatusCodeClass } from '@/shared/utils/getStatusCodeClass';

describe('getStatusCodeClass', () => {
  it('returns "infoCode" for 1xx status codes', () => {
    expect(getStatusCodeClass(100)).toBe('infoCode');
    expect(getStatusCodeClass(199)).toBe('infoCode');
  });

  it('returns "successCode" for 2xx status codes', () => {
    expect(getStatusCodeClass(200)).toBe('successCode');
    expect(getStatusCodeClass(250)).toBe('successCode');
    expect(getStatusCodeClass(299)).toBe('successCode');
  });

  it('returns "redirectCode" for 3xx status codes', () => {
    expect(getStatusCodeClass(300)).toBe('redirectCode');
    expect(getStatusCodeClass(302)).toBe('redirectCode');
    expect(getStatusCodeClass(399)).toBe('redirectCode');
  });

  it('returns "errorCode" for 4xx and 5xx status codes', () => {
    expect(getStatusCodeClass(400)).toBe('errorCode');
    expect(getStatusCodeClass(404)).toBe('errorCode');
    expect(getStatusCodeClass(500)).toBe('errorCode');
    expect(getStatusCodeClass(599)).toBe('errorCode');
  });

  it('returns empty string for status codes outside 100–599', () => {
    expect(getStatusCodeClass(99)).toBe('');
    expect(getStatusCodeClass(600)).toBe('');
    expect(getStatusCodeClass(-1)).toBe('');
    expect(getStatusCodeClass(0)).toBe('');
  });
});
