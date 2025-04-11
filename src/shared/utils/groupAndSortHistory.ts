import { HistoryRequestType } from '@/shared/models/types';

export const groupAndSortHistory = (history: HistoryRequestType[]) => {
  const groupedRequests = history.reduce(
    (acc, request) => {
      const dateKey = new Date(request.timestamp).toISOString().split('T')[0];
      (acc[dateKey] ||= []).push(request);
      return acc;
    },
    {} as Record<string, HistoryRequestType[]>
  );

  const sortedDates = Object.keys(groupedRequests).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  return { groupedRequests, sortedDates };
};
