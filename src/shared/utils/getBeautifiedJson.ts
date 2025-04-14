export const getBeautifiedJson = async (jsonString: string) => {
  const { format } = await import('prettier/standalone');
  const { default: babelPlugin } = await import('prettier/plugins/babel');
  const { default: estreePlugin } = await import('prettier/plugins/estree');

  return await format(jsonString, {
    parser: 'json',
    plugins: [babelPlugin, estreePlugin],
    tabWidth: 2,
    trailingComma: 'none',
  });
};
