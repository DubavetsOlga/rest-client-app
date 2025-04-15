import { replaceVariables } from '@/shared/utils/replaceVariables';
import { HeaderType, HistoryRequestType } from '@/shared/models/types';
import { HttpMethodType } from '@/shared/models/httpMethod';
import { Variable } from '@/shared/models/types';

export const prepareRequestData = (
  method: HttpMethodType,
  endpoint: string,
  body: string,
  headers: HeaderType[],
  variables: Variable[]
) => {
  const endpointWithVars = replaceVariables(endpoint, variables);
  const bodyWithVars = replaceVariables(body, variables);
  const headersWithVars = headers.map((h) => ({
    key: h.key,
    value: replaceVariables(h.value, variables),
  }));

  const headersObj = headersWithVars.reduce<Record<string, string>>(
    (acc, h) => {
      if (h.key) acc[h.key] = h.value;
      return acc;
    },
    {}
  );

  return {
    endpoint: endpointWithVars,
    body: bodyWithVars,
    headers: headersObj,
    historyEntry: {
      method,
      url: endpointWithVars,
      body: bodyWithVars,
      headers: headersWithVars,
      timestamp: Date.now(),
    } as HistoryRequestType,
  };
};
