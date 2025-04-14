export const CodeLanguages = {
  curl: 'cURL',
  fetch: 'JavaScript (Fetch API)',
  xhr: 'JavaScript (XHR)',
  nodejs: 'NodeJS',
  python: 'Python',
  java: 'Java',
  csharp: 'C#',
  go: 'Go',
} as const;

export type CodeLanguageType = keyof typeof CodeLanguages;
