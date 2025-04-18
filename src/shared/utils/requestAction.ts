'use server';

import { HttpMethod, HttpMethodType } from '@/shared/models/httpMethod';

type Request = {
  method: HttpMethodType;
  url: string;
  body: string;
  headers: Record<string, string>;
};

export const requestAction = async ({
  method,
  url,
  body,
  headers,
}: Request) => {
  if (!url) return { result: '', status: 0, headers: {} };

  try {
    const response = await fetch(url, {
      method,
      headers: headers,
      body: body ? body : null,
      cache: 'no-cache',
    });

    const { status } = response;

    if (status === 204 || method === HttpMethod.HEAD) {
      return {
        result: '',
        status,
        headers: Object.fromEntries(response.headers.entries()),
      };
    }

    let result;
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      result = await response.json();
      result = JSON.stringify(result, null, 2);
    } else {
      result = await response.text();
    }

    return {
      result,
      status,
      headers: Object.fromEntries(response.headers.entries()),
    };
  } catch (error) {
    const e = error as Error;
    return { result: e.message, status: 0, headers: {} };
  }
};
