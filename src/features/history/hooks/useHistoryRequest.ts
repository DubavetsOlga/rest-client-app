'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import { HistoryRequestType } from '@/shared/models/types';

const STORAGE_KEY = 'history';

export const useHistoryRequest = () => {
  const { getStorageItem, setStorageItem, removeStorageItem } =
    useLocalStorage<HistoryRequestType[]>();
  const [history, setHistory] = useState<HistoryRequestType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadHistory = () => {
      const storedData = getStorageItem(STORAGE_KEY);
      setHistory(storedData ?? []);
      setIsLoading(false);
    };
    loadHistory();
  }, [getStorageItem]);

  const addToHistory = useCallback(
    (item: HistoryRequestType) => {
      setHistory((prev) => {
        const updated = [item, ...prev];
        setStorageItem(STORAGE_KEY, updated);
        return updated;
      });
    },
    [setStorageItem]
  );

  const removeFromHistory = useCallback(
    (timestamp: number) => {
      setHistory((prev) => {
        const updated = prev.filter((item) => item.timestamp !== timestamp);
        setStorageItem(STORAGE_KEY, updated);
        return updated;
      });
    },
    [setStorageItem]
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
    removeStorageItem(STORAGE_KEY);
  }, [removeStorageItem]);

  return useMemo(
    () => ({
      history,
      addToHistory,
      removeFromHistory,
      clearHistory,
      isLoading,
    }),
    [history, addToHistory, removeFromHistory, clearHistory, isLoading]
  );
};
