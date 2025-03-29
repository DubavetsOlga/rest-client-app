'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useLocale } from 'use-intl';
import { RegistrationForm } from '@/features/registration/ui/registrationForm/RegistrationForm';
import { Spinner } from '@/shared/components';
import { useAuthContext } from '@/shared/hooks/useAuthContext';

export default function RegistrationPage() {
  const router = useRouter();
  const locale = useLocale();

  const { isAuth, loading } = useAuthContext();

  useEffect(() => {
    if (isAuth) {
      router.push(`/${locale}`);
    }
  }, [isAuth, router, locale]);

  if (loading) {
    return <Spinner />;
  }

  return !isAuth && <RegistrationForm />;
}
