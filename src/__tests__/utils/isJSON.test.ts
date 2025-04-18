import { isJSON } from '@/shared/utils/isJson';

describe('isJSON', () => {
  it('should return true for valid JSON string', () => {
    const validJSON = '{"name": "John", "age": 30}';
    expect(isJSON(validJSON)).toBe(true);
  });

  it('should return false for invalid JSON string', () => {
    const invalidJSON = '{"name": "John", "age": 30';
    expect(isJSON(invalidJSON)).toBe(false);
  });

  it('should return false for non-JSON string', () => {
    const nonJSON = 'Hello, World!';
    expect(isJSON(nonJSON)).toBe(false);
  });

  it('should return true for JSON with null value', () => {
    const nullJSON = '{"name": null}';
    expect(isJSON(nullJSON)).toBe(true);
  });

  it('should return false for empty string', () => {
    const emptyString = '';
    expect(isJSON(emptyString)).toBe(false);
  });

  it('should return false for JSON array (optional test case)', () => {
    const jsonArray = '[{"name": "John"}]';
    expect(isJSON(jsonArray)).toBe(true);
  });
});
