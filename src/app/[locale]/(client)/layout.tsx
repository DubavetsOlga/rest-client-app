'use client';

import { ReactNode } from 'react';
import { Spinner } from '@/shared/components';
import { useCheckPrivateRoute } from '@/shared/hooks/useCheckPrivateRoute';
import dynamic from 'next/dynamic';

const RestClient = dynamic(
  () =>
    import('@/features/restClient/ui/restClient/RestClient').then(
      (mod) => mod.RestClient
    ),
  {
    loading: () => <Spinner />,
    ssr: false,
  }
);

export default function RestLayout({ children }: { children: ReactNode }) {
  const { isAuth, loading } = useCheckPrivateRoute();

  if (loading) return <Spinner />;

  return isAuth && <RestClient>{children}</RestClient>;
}
