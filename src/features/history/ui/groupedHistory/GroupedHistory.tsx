'use client';

import { HistoryRequestType } from '@/shared/models/types';
import { Accordion } from '@/shared/components/accordion/Accordion';
import { HistoryItem } from '@/features/history/ui/historyItem/HistoryItem';
import { formatDate } from '@/shared/utils/dateUtils';
import { useLocale } from 'next-intl';
import { groupAndSortHistory } from '@/shared/utils/groupAndSortHistory';
import { useMemo } from 'react';

type Props = {
  history: HistoryRequestType[];
  handleRemoveItem: (id: number) => void;
};

export const GroupedHistory = ({ history, handleRemoveItem }: Props) => {
  const locale = useLocale();

  const { groupedRequests, sortedDates } = useMemo(
    () => groupAndSortHistory(history),
    [history]
  );

  return (
    <div>
      {sortedDates.map((date) => (
        <Accordion key={date} title={formatDate(date, locale)}>
          {groupedRequests[date]
            .sort((a, b) => b.timestamp - a.timestamp)
            .map((request) => (
              <HistoryItem
                key={request.timestamp}
                request={request}
                onRemove={handleRemoveItem}
              />
            ))}
        </Accordion>
      ))}
    </div>
  );
};
