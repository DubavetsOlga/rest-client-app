import { getBeautifiedJson } from '@/shared/utils/getBeautifiedJson';

jest.mock('prettier/standalone', () => ({
  format: jest.fn(),
}));

jest.mock('prettier/plugins/babel', () => ({
  default: jest.fn(() => 'babelPlugin'),
}));

jest.mock('prettier/plugins/estree', () => ({
  default: jest.fn(() => 'estreePlugin'),
}));

describe('getBeautifiedJson', () => {
  const mockJsonString = '{"name":"John", "age":30}';

  it('should format the JSON correctly using prettier', async () => {
    const mockJsonString = '{"name":"John", "age":30}';

    const formatMock = require('prettier/standalone').format;
    formatMock.mockResolvedValue(mockJsonString);

    await getBeautifiedJson(mockJsonString);

    expect(formatMock).toHaveBeenCalledWith(mockJsonString, {
      parser: 'json',
      plugins: [
        { default: require('prettier/plugins/babel').default },
        { default: require('prettier/plugins/estree').default },
      ],
      tabWidth: 2,
      trailingComma: 'none',
    });
  });

  it('returns empty string when input is invalid JSON', async () => {
    const invalidJsonString = '{name: John}';

    require('prettier/standalone').format.mockResolvedValue('');

    const result = await getBeautifiedJson(invalidJsonString);

    expect(result).toBe('');
  });

  it('throws error when prettier.format throws', async () => {
    require('prettier/standalone').format.mockRejectedValue(
      new Error('Prettier error')
    );

    try {
      await getBeautifiedJson(mockJsonString);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toBe('Prettier error');
    }
  });
});
