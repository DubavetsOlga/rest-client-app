import { HttpMethodType } from '@/shared/models/httpMethod';
import { CodeLanguageType } from '@/shared/models/codeLanguages';

export type ResponseType = {
  result: string;
  status: number;
  headers: Record<string, string>;
};

export type HeaderType = {
  id: string;
  key: string;
  value: string;
};

type RequestType = {
  method: HttpMethodType;
  url: string;
  body: string;
  headers: HeaderType[];
  response: ResponseType;
};

export type RestClientType = RequestType & {
  response: ResponseType;
  isJsonMode: boolean;
  codeType: CodeLanguageType;
  link: string;
};

export type HistoryRequestType = RequestType & {
  timestamp: number;
};

export type Variable = {
  id: string;
  key: string;
  value: string;
};

export type DialogType = 'clear' | 'item' | null;
