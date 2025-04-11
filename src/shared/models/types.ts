import { HttpMethodType } from '@/shared/models/httpMethod';

export type HeaderType = {
  key: string;
  value: string;
};

export type HistoryRequestType = {
  method: HttpMethodType;
  url: string;
  body: string;
  headers: HeaderType[];
  timestamp: number;
};

export type Variable = {
  id: string;
  key: string;
  value: string;
};

export type DialogType = 'clear' | 'item' | null;
