'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { ReactElement, useState } from 'react';

export const LocaleSwitcher = (): ReactElement => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [language, setLanguage] = useState<string>(locale);

  const handleClickChangeLang = (value: string): void => {
    setLanguage(value);
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
    router.push(`/${value}${pathWithoutLocale}`);
  };

  return (
    <div>
      <select
        value={language}
        onChange={(e) => handleClickChangeLang(e.target.value)}
      >
        <option value="en">EN</option>
        <option value="ru">RU</option>
      </select>
    </div>
  );
};
