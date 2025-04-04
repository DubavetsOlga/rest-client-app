'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { ReactElement, useState } from 'react';
import s from './LocaleSwitcher.module.css';
import { translate } from '@/shared/i18n/langSwitcher';

const languages = [
  { value: 'en', label: 'EN' },
  { value: 'ru', label: 'RU' },
];

export const LocaleSwitcher = (): ReactElement => {
  const locale = useLocale();
  const { basic: t } = translate(locale);
  const router = useRouter();
  const pathname = usePathname();

  const [language, setLanguage] = useState<string>(locale);

  const handleClickChangeLang = (value: string): void => {
    setLanguage(value);
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
    router.push(`/${value}${pathWithoutLocale}`);
  };

  return (
    <select
      value={language}
      onChange={(e) => handleClickChangeLang(e.target.value)}
      className={s.select}
      aria-label={t.language}
    >
      {languages.map((lang) => (
        <option key={lang.value} value={lang.value}>
          {lang.label}
        </option>
      ))}
    </select>
  );
};
