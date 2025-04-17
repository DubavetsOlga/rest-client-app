import { HistoryRequestType } from '@/shared/models/types';
import { groupAndSortHistory } from '@/shared/utils/groupAndSortHistory';

describe('groupAndSortHistory', () => {
  const history: HistoryRequestType[] = [
    {
      method: 'GET',
      url: '/users',
      body: '',
      headers: [],
      timestamp: new Date('2023-08-10T14:23:00Z').getTime(),
    },
    {
      method: 'POST',
      url: '/users',
      body: '{}',
      headers: [],
      timestamp: new Date('2023-08-10T08:12:00Z').getTime(),
    },
    {
      method: 'GET',
      url: '/posts',
      body: '',
      headers: [],
      timestamp: new Date('2023-08-09T18:00:00Z').getTime(),
    },
  ];

  it('groups requests by date', () => {
    const { groupedRequests } = groupAndSortHistory(history);

    expect(Object.keys(groupedRequests)).toEqual(
      expect.arrayContaining(['2023-08-10', '2023-08-09'])
    );
    expect(groupedRequests['2023-08-10']).toHaveLength(2);
    expect(groupedRequests['2023-08-09']).toHaveLength(1);
  });

  it('sorts grouped dates in descending order', () => {
    const { sortedDates } = groupAndSortHistory(history);
    expect(sortedDates).toEqual(['2023-08-10', '2023-08-09']);
  });

  it('returns empty structures for empty history', () => {
    const result = groupAndSortHistory([]);
    expect(result.groupedRequests).toEqual({});
    expect(result.sortedDates).toEqual([]);
  });
});
