'use client';

import { toast } from 'react-toastify';
import { useCallback } from 'react';
import { useLocale } from 'next-intl';
import { translate } from '@/shared/i18n/langSwitcher';

export const useLocalStorage = <T>() => {
  const locale = useLocale();
  const { errors: t } = translate(locale);
  const isClient = typeof window !== 'undefined';

  const getStorageItem = useCallback(
    (key: string, fallback: T = [] as T): T => {
      if (!isClient) return fallback;

      try {
        const data = window.localStorage.getItem(key);
        return data ? JSON.parse(data) : fallback;
      } catch (error) {
        toast.error(`${t.readError}: ${error}`);
        return fallback;
      }
    },
    [isClient, t.readError]
  );

  const setStorageItem = useCallback(
    (key: string, value: T): void => {
      if (!isClient) return;

      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        toast.error(`${t.saveError}: ${error}`);
      }
    },
    [isClient, t.saveError]
  );

  const removeStorageItem = useCallback(
    (key: string): void => {
      if (!isClient) return;

      try {
        window.localStorage.removeItem(key);
      } catch (error) {
        toast.error(`${t.deleteError}: ${error}`);
      }
    },
    [isClient, t.deleteError]
  );

  return {
    getStorageItem,
    setStorageItem,
    removeStorageItem,
  };
};
