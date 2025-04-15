import { useAppDispatch } from '@/shared/store/hooks/useAppDispatch';
import { usePathname } from '@/shared/i18n/routing';
import { useParams, useSearchParams } from 'next/navigation';
import { HeaderType } from '@/shared/models/types';
import { decodeFromBase64 } from '@/shared/utils/codeBase64';
import { HttpMethodType } from '@/shared/models/httpMethod';
import {
  setLink,
  setResponse,
  setBody,
  setHeaders,
  setMethod,
  setUrl,
} from '@/shared/store/reducers/restClientSlice';
import { useEffect } from 'react';

type RestParams = {
  rest?: string | string[];
};

export const useRestClientInitialization = () => {
  const dispatch = useAppDispatch();
  const path = usePathname();
  const searchParams = useSearchParams();
  const params = useParams<RestParams>();

  useEffect(() => {
    const restArray = !params.rest
      ? []
      : typeof params.rest === 'string'
        ? [params.rest]
        : params.rest;

    const [method = '', url = '', body = ''] = restArray;
    const decodedUrl = url === '%20' ? '' : decodeFromBase64(url);
    const decodedBody = decodeFromBase64(body);

    const headers: HeaderType[] = Array.from(searchParams.entries()).map(
      ([key, value]) => ({
        id: crypto.randomUUID(),
        key,
        value,
      })
    );

    const fullPath = `${path}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

    dispatch(setMethod(method as HttpMethodType));
    dispatch(setUrl(decodedUrl));
    dispatch(setBody(decodedBody));
    dispatch(setHeaders(headers));
    dispatch(setLink(fullPath));

    return () => {
      dispatch(setResponse({ result: '', status: 0, headers: {} }));
    };
  }, []);
};
