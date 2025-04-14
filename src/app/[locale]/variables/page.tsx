'use client';

import { useCheckPrivateRoute } from '@/shared/hooks/useCheckPrivateRoute';
import { Spinner } from '@/shared/components';
import dynamic from 'next/dynamic';

const VariablesList = dynamic(
  () =>
    import('@/features/variables/ui/variablesList/VariablesList').then(
      (mod) => mod.VariablesList
    ),
  {
    loading: () => <Spinner />,
    ssr: false,
  }
);

export default function Variables() {
  const { isAuth, loading } = useCheckPrivateRoute();

  if (loading) {
    return <Spinner />;
  }

  return isAuth && <VariablesList />;
}
