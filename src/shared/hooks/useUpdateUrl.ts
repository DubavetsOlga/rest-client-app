import { setLink } from '@/shared/store/reducers/restClientSlice';
import { useAppDispatch } from '@/shared/store/hooks/useAppDispatch';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useAppSelector } from '@/shared/store/hooks/useAppSelector';
import { HeaderType } from '@/shared/models/types';
import { encodeToBase64 } from '@/shared/utils/codeBase64';

export const useUpdateUrl = () => {
  const locale = useLocale();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { method, url, body, headers } = useAppSelector(
    (store) => store.restClientReducer
  );

  return () => {
    const { fullUrl, shortUrl } = buildUrl(locale, method, url, body, headers);

    router.replace(fullUrl, { scroll: false });
    dispatch(setLink(shortUrl));
  };
};

const buildUrl = (
  locale: string,
  method: string,
  url: string,
  body: string,
  headers: HeaderType[]
) => {
  const encodedUrl = url ? `/${encodeToBase64(url)}` : body ? '/ ' : '';
  const encodedBody = body ? `/${encodeToBase64(body)}` : '';

  let encodedHeaders = '';
  if (headers.length) {
    const searchParams = new URLSearchParams();
    headers.forEach(({ key, value }) => {
      searchParams.set(key, value);
    });
    encodedHeaders = '?' + searchParams.toString();
  }

  return {
    fullUrl: `/${locale}/${method}${encodedUrl}${encodedBody}${encodedHeaders}`,
    shortUrl: `/${method}${encodedUrl}${encodedBody}${encodedHeaders}`,
  };
};
