import { replaceVariables } from '@/shared/utils/replaceVariables';
import { Variable } from '@/shared/models/types';

describe('replaceVariables', () => {
  const variables: Variable[] = [
    {
      key: 'name',
      value: 'Alice',
      id: '1',
    },
    {
      key: 'city',
      value: 'Wonderland',
      id: '2',
    },
  ];

  it('replaces single variable', () => {
    const input = 'Hello {{name}}!';
    const result = replaceVariables(input, variables);
    expect(result).toBe('Hello Alice!');
  });

  it('replaces multiple variables', () => {
    const input = 'Hi {{name}}, welcome to {{city}}!';
    const result = replaceVariables(input, variables);
    expect(result).toBe('Hi Alice, welcome to Wonderland!');
  });

  it('leaves unknown variables untouched', () => {
    const input = 'Hello {{unknown}}!';
    const result = replaceVariables(input, variables);
    expect(result).toBe('Hello {{unknown}}!');
  });

  it('handles whitespace around variable names', () => {
    const input = 'Hello {{ name }} from {{ city }}!';
    const result = replaceVariables(input, variables);
    expect(result).toBe('Hello Alice from Wonderland!');
  });

  it('returns the same string if no variables are present', () => {
    const input = 'Just a plain string';
    const result = replaceVariables(input, variables);
    expect(result).toBe('Just a plain string');
  });

  it('handles empty variable list', () => {
    const input = 'Hello {{name}}!';
    const result = replaceVariables(input, []);
    expect(result).toBe('Hello {{name}}!');
  });
});
