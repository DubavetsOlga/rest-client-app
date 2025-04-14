import { Request } from 'postman-collection';
import {
  generatePostmanCode,
  SupportedLanguage,
} from '@/shared/utils/postmanCodegenUtils';
import { replaceVariables } from '@/shared/utils/replaceVariables';
import { CodeLanguageType } from '@/shared/models/codeLanguages';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { go } from '@codemirror/lang-go';
import { Variable } from '../models/types';

export const languageExtensions = {
  curl: [],
  fetch: [javascript()],
  xhr: [javascript()],
  nodejs: [javascript()],
  python: [python()],
  java: [java()],
  csharp: [cpp()],
  go: [go()],
};

export const languageMap: Record<
  CodeLanguageType,
  { language: SupportedLanguage; variant: string }
> = {
  curl: { language: 'curl', variant: 'cURL' },
  fetch: { language: 'javascript', variant: 'fetch' },
  xhr: { language: 'javascript', variant: 'xhr' },
  nodejs: { language: 'nodejs', variant: 'native' },
  python: { language: 'python', variant: 'requests' },
  java: { language: 'java', variant: 'okhttp' },
  csharp: { language: 'csharp', variant: 'restsharp' },
  go: { language: 'go', variant: 'native' },
};

export const createPostmanRequest = (
  method: string,
  url: string,
  body: string,
  headers: Array<{ key: string; value: string }>,
  variables: Variable[]
): Request => {
  const replacedUrl = replaceVariables(url, variables);
  const replacedBody = replaceVariables(body, variables);
  const replacedHeaders = headers
    .filter((h) => h.key && h.value)
    .map((h) => ({
      key: h.key,
      value: replaceVariables(h.value, variables),
    }));

  return new Request({
    method: method.toUpperCase(),
    url: replacedUrl,
    header: replacedHeaders,
    ...(replacedBody && {
      body: {
        mode: 'raw',
        raw: replacedBody,
      },
    }),
  });
};

export const generateCode = async (
  request: Request,
  codeType: CodeLanguageType,
  errorMessage: string
): Promise<string> => {
  if (!request.url) {
    return errorMessage;
  }

  try {
    const { language, variant } = languageMap[codeType];
    return await generatePostmanCode(request, language, variant);
  } catch (error) {
    return `${errorMessage} (${(error as Error).message})`;
  }
};
