import type { Metadata } from 'next';
import './globals.css';
import { ReactElement, ReactNode } from 'react';
import StoreProvider from '@/shared/providers/storeProviders';
import { AppErrorBoundary } from '@/shared/components';
import { Alert } from '@/shared/components';
import { AuthProvider } from '@/shared/providers/authProvider';

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
        <AppErrorBoundary>
          <AuthProvider>
            <StoreProvider>
              {children}
              <Alert />
            </StoreProvider>
          </AuthProvider>
        </AppErrorBoundary>
      </body>
    </html>
  );
}
