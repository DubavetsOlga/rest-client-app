import { useCallback, useState } from 'react';
import { useAppSelector } from '@/shared/store/hooks/useAppSelector';
import s from './Headers.module.css';
import { useAppDispatch } from '@/shared/store/hooks/useAppDispatch';
import { deleteHeader } from '@/shared/store/reducers/restClientSlice';
import { ConfirmDialog } from '@/shared/components';
import { useLocale } from 'next-intl';
import { translate } from '@/shared/i18n/langSwitcher';
import { selectHeaders } from '@/shared/store/selectors/restClientSelectors';
import { NewHeaderItem } from '@/features/restClient/ui/tabs/headers/newHeaderItem/NewHeaderItem';
import { HeaderItem } from '@/features/restClient/ui/tabs/headers/headerItem/HeaderItem';

export const Headers = () => {
  const locale = useLocale();
  const { clientPage: t } = translate(locale);

  const dispatch = useAppDispatch();

  const headers = useAppSelector(selectHeaders);

  const [dialog, setDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = useCallback((id: string) => {
    setDeleteId(id);
    setDialog(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (!deleteId) return;

    dispatch(deleteHeader(deleteId));
    setDialog(false);
  }, [deleteId, dispatch]);

  return (
    <div className={s.container}>
      <table>
        <thead>
          <tr>
            <th>{t.key}</th>
            <th>{t.value}</th>
            <th></th>
          </tr>
        </thead>
        <tbody className={s.body}>
          {headers.map((header) => (
            <HeaderItem
              key={header.id}
              header={header}
              onDelete={() => handleDelete(header.id)}
            />
          ))}
          <NewHeaderItem />
        </tbody>
      </table>

      <ConfirmDialog
        open={dialog}
        title={t.confirmDeletion}
        text={t.confirmDeleteHeader}
        onOpenChange={(open) => !open && setDialog(false)}
        handleConfirm={handleConfirmDelete}
        handleCancel={() => setDialog(false)}
      />
    </div>
  );
};
