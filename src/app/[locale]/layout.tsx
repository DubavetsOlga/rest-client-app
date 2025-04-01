import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ReactNode } from 'react';
import { Header } from '@/widgets/header/Header';
import { Footer } from '@/widgets/footer/Footer';
import { hasLocale } from 'use-intl';
import { routing } from '@/shared/i18n/routing';
import { notFound } from 'next/navigation';
import SideMenu from '@/widgets/sideMenu/SideMenu';

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
      <Header />
      <main>
        <SideMenu />
        {children}
      </main>
      <Footer />
    </NextIntlClientProvider>
  );
}
