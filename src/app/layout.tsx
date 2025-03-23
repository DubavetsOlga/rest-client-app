import type { Metadata } from 'next';
import './globals.css';
import { ReactElement, ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'REST Client App',
  icons: [
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '80x80',
      url: '/favicon.png',
    },
  ],
};

export default async function LocaleLayout({
                                             children,
                                           }: Readonly<{
  children: ReactNode;
}>): Promise<ReactElement> {

  return (
    <html lang="en">
    <body>
    {children}
    </body>
    </html>
  );
}
