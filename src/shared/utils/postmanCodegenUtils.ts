import { convert } from 'postman-code-generators';
import { Request as PostmanRequest } from 'postman-collection';

type PostmanCodegenOptions = {
  indentCount?: number;
  indentType?: 'space' | 'tab';
  trimRequestBody?: boolean;
  followRedirect?: boolean;
};

export type SupportedLanguage =
  | 'javascript'
  | 'nodejs'
  | 'python'
  | 'java'
  | 'csharp'
  | 'go'
  | 'curl';

export const generatePostmanCode = async (
  request: PostmanRequest,
  language: SupportedLanguage,
  variant: string = 'fetch',
  options: PostmanCodegenOptions = {
    indentCount: 2,
    indentType: 'space',
    trimRequestBody: true,
    followRedirect: true,
  }
): Promise<string> => {
  return new Promise((resolve, reject) => {
    convert(
      language,
      variant,
      request,
      options,
      (error: Error | null, snippet: string) => {
        if (error) {
          reject(error);
        } else {
          resolve(snippet);
        }
      }
    );
  });
};

export type { Request } from 'postman-code-generators';
