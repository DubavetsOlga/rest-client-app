import { HistoryRequestType } from '@/shared/models/types';

export const createRequestLink = (request: HistoryRequestType): string => {
  const encodedUrl = Buffer.from(request.url).toString('base64');
  const hasBody = Boolean(request.body);
  const encodedBody = hasBody
    ? Buffer.from(request.body || '').toString('base64')
    : '';

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
