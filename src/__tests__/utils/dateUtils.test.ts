import { formatTime, formatDate } from '@/shared/utils/dateUtils';

describe('formatTime', () => {
  const timestamp = new Date('2023-08-10T15:45:30').getTime();

  it('formats time with seconds in en-US', () => {
    const result = formatTime(timestamp, 'en-US', true);
    expect(result).toMatch(/\d{1,2}:\d{2}:\d{2}\s?[APMapm]{2}/);
  });

  it('formats time without seconds in en-US', () => {
    const result = formatTime(timestamp, 'en-US', false);
    expect(result).toMatch(/\d{1,2}:\d{2}\s?[APMapm]{2}/);
    expect(result.includes(':30')).toBe(false);
  });

  it('formats 24-hour time in non-English locale', () => {
    const result = formatTime(timestamp, 'fr-FR', true);
    expect(result).toMatch(/\d{2}:\d{2}:\d{2}/);
  });

  it('returns "Invalid time" for NaN timestamp', () => {
    expect(formatTime(NaN)).toBe('Invalid time');
  });
});

describe('formatDate', () => {
  it('formats Russian date in genitive case', () => {
    const result = formatDate('2023-08-10', 'ru-RU');
    expect(result).toBe('10 августа 2023');
  });

  it('formats English date with full month name', () => {
    const result = formatDate('2023-08-10', 'en-US');
    expect(result).toMatch(/August \d{1,2}, 2023/);
  });

  it('returns "Invalid date" for empty input', () => {
    expect(formatDate('', 'en-US')).toBe('Invalid date');
  });

  it('returns "Invalid date" for invalid ISO string', () => {
    expect(formatDate('not-a-date', 'en-US')).toBe('Invalid date');
  });
});
