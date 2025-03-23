import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ReactNode } from 'react';
import { hasLocale } from 'use-intl';
import { routing } from '@/shared/i18n/routing';
import { notFound } from 'next/navigation';

export default async function LocaleLayout({
                                             children,
                                             params,
                                           }: {
  children: ReactNode;
  params: { locale: string };
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div>
        {children}
      </div>
    </NextIntlClientProvider>
  );
}
