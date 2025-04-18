import { HistoryRequestType } from '@/shared/models/types';
import { encodeToBase64 } from '@/shared/utils/codeBase64';

export const createRequestLink = (request: HistoryRequestType): string => {
  const encodedUrl = encodeToBase64(request.url);
  const hasBody = Boolean(request.body);
  const encodedBody = hasBody ? encodeToBase64(request.body || '') : '';

  const headers = request.headers || [];
  const headersQuery = headers
    .filter((header) => header?.key && header?.value)
    .map(
      (header) =>
        `${encodeURIComponent(header.key)}=${encodeURIComponent(header.value)}`
    )
    .join('&');

  const pathSegments = [
    request.method,
    encodedUrl,
    ...(hasBody ? [encodedBody] : []),
  ].join('/');

  return `/${pathSegments}${headersQuery ? `?${headersQuery}` : ''}`;
};
