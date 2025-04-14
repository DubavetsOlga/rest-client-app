'use client';

import { NotFound } from '@/widgets/notFound/NotFound';
import { useLocale } from 'use-intl';
import { translate } from '@/shared/i18n/langSwitcher';

export default function Page() {
  const locale = useLocale();
  const { errorPage: t } = translate(locale);

  return <NotFound text={t.text} linkText={t.link} />;
}
