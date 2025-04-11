'use client';

import { useCheckPrivateRoute } from '@/shared/hooks/useCheckPrivateRoute';
import dynamic from 'next/dynamic';
import { Spinner } from '@/shared/components';

const HistoryList = dynamic(
  () =>
    import('@/features/history/ui/historyList/HistoryList').then(
      (mod) => mod.HistoryList
    ),
  {
    loading: () => <Spinner />,
    ssr: false,
  }
);

export default function History() {
  const { isAuth, loading } = useCheckPrivateRoute();

  if (loading) {
    return <Spinner />;
  }

  return isAuth && <HistoryList />;
}
