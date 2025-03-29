import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthContext } from '@/shared/hooks/useAuthContext';

export const useCheckPrivateRoute = () => {
  const { isAuth, loading } = useAuthContext();

  const locale = useLocale();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuth) {
      router.push(`/${locale}`);
    }
  }, [isAuth, router, loading, locale]);

  return { isAuth, loading };
};
