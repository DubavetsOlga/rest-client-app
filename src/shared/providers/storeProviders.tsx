'use client';

import { ReactNode, useMemo } from 'react';
import { Provider } from 'react-redux';
import { makeStore } from '@/shared/store/store';

export default function StoreProvider({ children }: { children: ReactNode }) {
  const store = useMemo(() => makeStore(), []);

  return <Provider store={store}>{children}</Provider>;
}
