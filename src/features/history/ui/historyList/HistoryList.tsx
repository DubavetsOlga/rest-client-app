'use client';

import { useLocale } from 'next-intl';
import { translate } from '@/shared/i18n/langSwitcher';
import { useHistoryRequest } from '@/features/history/hooks/useHistoryRequest';
import { EmptyHistory } from '@/features/history/ui/emptyHistory/EmptyHistory';
import { GroupedHistory } from '@/features/history/ui/groupedHistory/GroupedHistory';
import { Trash2 } from 'lucide-react';
import s from './HistoryList.module.css';
import { ConfirmDialog, Spinner } from '@/shared/components';
import { useState } from 'react';

type DialogType = 'clear' | 'item' | null;

export const HistoryList = () => {
  const locale = useLocale();
  const { historyPage: t } = translate(locale);

  const { history, removeFromHistory, clearHistory, isLoading } =
    useHistoryRequest();

  const [dialog, setDialog] = useState<{
    type: DialogType;
    itemTimestamp?: number;
  } | null>(null);

  if (isLoading) return <Spinner />;

  const isEmpty = history.length === 0;

  const openDialog = (type: DialogType, itemTimestamp?: number) =>
    setDialog({ type, itemTimestamp });

  const closeDialog = () => setDialog(null);

  const handleConfirm = () => {
    if (!dialog) return;

    if (dialog.type === 'clear') {
      clearHistory();
    } else if (dialog.type === 'item' && dialog.itemTimestamp) {
      removeFromHistory(dialog.itemTimestamp);
    }

    closeDialog();
  };

  return (
    <>
      <div className={s.historyContainer}>
        <div className={s.historyHeader}>
          <h1 className={s.title}>{t.title}</h1>
          {!isEmpty && (
            <Trash2
              className={s.deleteButton}
              onClick={() => openDialog('clear')}
              aria-label={t.clearHistory}
            />
          )}
        </div>
        {isEmpty ? (
          <EmptyHistory />
        ) : (
          <GroupedHistory
            history={history}
            handleRemoveItem={(timestamp) => openDialog('item', timestamp)}
          />
        )}
      </div>

      <ConfirmDialog
        open={!!dialog}
        title={t.confirmRemoval}
        text={
          dialog?.type === 'clear' ? t.confirmClearHistory : t.confirmRemoveItem
        }
        onOpenChange={(open) => !open && closeDialog()}
        handleConfirm={handleConfirm}
        handleCancel={closeDialog}
      />
    </>
  );
};
