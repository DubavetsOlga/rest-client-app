'use client';

import { ReactNode } from 'react';
import { ErrorBoundary } from '@/shared/components';

export const AppErrorBoundary = ({ children }: { children: ReactNode }) => {
  return <ErrorBoundary>{children}</ErrorBoundary>;
};
