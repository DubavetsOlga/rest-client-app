'use client';

import { ReactNode, useEffect } from 'react';
import { Tabs } from '@/features/restClient/ui/tabs/Tabs';
import { ResponseViewer } from '@/features/restClient/ui/responseViewer/ResponseViewer';
import s from './RestClient.module.css';
import { RequestForm } from '@/features/restClient/ui/requestForm/RequestForm';
import { useRestClientInitialization } from '@/shared/hooks/useRestClientInitialization';
import { useAppSelector } from '@/shared/store/hooks/useAppSelector';
import { useUpdateUrl } from '@/shared/hooks/useUpdateUrl';

export const RestClient = ({ children }: { children: ReactNode }) => {
  useRestClientInitialization();

  const { method, url, body, headers } = useAppSelector(
    (store) => store.restClientReducer
  );
  const updateUrl = useUpdateUrl();

  useEffect(() => {
    updateUrl();
  }, [method, url, body, headers]);

  return (
    <div className={s.container}>
      <RequestForm />
      <Tabs />
      <ResponseViewer />
      {children}
    </div>
  );
};
