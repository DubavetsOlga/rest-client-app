'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useLocale } from 'use-intl';
import { LoginForm } from '@/features/login/ui/loginForm/LoginForm';
import { Spinner } from '@/shared/components';
import { useAuthContext } from '@/shared/hooks/useAuthContext';

export default function LoginPage() {
  const router = useRouter();
  const locale = useLocale();

  const { isAuth, loading } = useAuthContext();

  useEffect(() => {
    if (isAuth) {
      router.replace(`/${locale}`);
    }
  }, [isAuth, router, locale]);

  if (loading) {
    return <Spinner />;
  }

  return !isAuth && <LoginForm />;
}
