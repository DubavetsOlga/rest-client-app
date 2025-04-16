import { getHttpStatusText } from '@/shared/utils/getHttpStatusText';

describe('getHttpStatusText', () => {
  it('returns the correct status text for known HTTP status codes', () => {
    expect(getHttpStatusText(200)).toBe('OK');
    expect(getHttpStatusText(201)).toBe('Created');
    expect(getHttpStatusText(202)).toBe('Accepted');
    expect(getHttpStatusText(404)).toBe('Not Found');
    expect(getHttpStatusText(500)).toBe('Internal Server Error');
    expect(getHttpStatusText(301)).toBe('Moved Permanently');
  });

  it('returns "Unknown Status" for an unknown status code', () => {
    expect(getHttpStatusText(999)).toBe('Unknown Status');
    expect(getHttpStatusText(123)).toBe('Unknown Status');
  });
});
