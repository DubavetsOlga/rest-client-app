'use client';

import { useLocale } from 'next-intl';
import { translate } from '@/shared/i18n/langSwitcher';
import { useCheckPrivateRoute } from '@/shared/hooks/useCheckPrivateRoute';
import { Spinner } from '@/shared/components';

export default function Variables() {
  const locale = useLocale();
  const { variablesPage } = translate(locale);

  const { isAuth, loading } = useCheckPrivateRoute();

  if (loading) {
    return <Spinner />;
  }

  return (
    isAuth && (
      <div>
        <h2>{variablesPage.title}</h2>
      </div>
    )
  );
}
