'use client';

import { HistoryRequestType } from '@/shared/models/types';
import { formatTime } from '@/shared/utils/dateUtils';
import { Trash2 } from 'lucide-react';
import s from './HistoryItem.module.css';
import { Link } from '@/shared/i18n/routing';
import { createRequestLink } from '@/shared/utils/createRequestLink';
import { useMemo } from 'react';
import { useLocale } from 'next-intl';
import { translate } from '@/shared/i18n/langSwitcher';

type Props = {
  request: HistoryRequestType;
  onRemove: (timestamp: number) => void;
};

export const HistoryItem = ({ request, onRemove }: Props) => {
  const locale: string = useLocale();
  const { historyPage: t } = translate(locale);

  const historyLink = useMemo(() => createRequestLink(request), [request]);

  return (
    <div className={s.historyItem}>
      <span className={`${s.method} ${s[request.method.toLowerCase()]}`}>
        {request.method}
      </span>
      <Link href={historyLink} className={s.link}>
        {request.url}
      </Link>
      <span className={s.time}>{formatTime(request.timestamp, locale)}</span>
      <button
        onClick={() => onRemove(request.timestamp)}
        className={s.deleteButton}
        title={t.deleteRequest}
        aria-label={t.deleteRequest}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};
