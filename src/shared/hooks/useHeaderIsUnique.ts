import { useAppSelector } from '@/shared/store/hooks/useAppSelector';
import { selectHeaders } from '@/shared/store/selectors/restClientSelectors';
import { useCallback } from 'react';

export const useHeaderIsUnique = () => {
  const headers = useAppSelector(selectHeaders);

  return useCallback(
    (key: string, id: string = '') => {
      return !headers.some((h) => h.id !== id && h.key === key);
    },
    [headers]
  );
};
