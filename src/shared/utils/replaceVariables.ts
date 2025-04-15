import { Variable } from '../models/types';

export const replaceVariables = (input: string, variables: Variable[]) => {
  return input.replace(/{{(.*?)}}/g, (_, varName) => {
    const found = variables.find((v) => v.key === varName.trim());

    return found?.value ?? '{{' + varName + '}}';
  });
};
