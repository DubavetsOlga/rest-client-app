'use client';

import { useLocale } from 'next-intl';
import s from './VariablesList.module.css';
import { translate } from '@/shared/i18n/langSwitcher';
import { VariableItem } from '../variableItem/VariableItem';
import { useAppSelector } from '@/shared/store/hooks/useAppSelector';
import { useEffect, useMemo, useState } from 'react';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import { DialogType, Variable } from '@/shared/models/types';
import { VariablesListHeader } from '../variablesListHeader/VariablesListHeader';
import { ConfirmDialog } from '@/shared/components/confirmDialog/ConfirmDialog';
import { useAppDispatch } from '@/shared/store/hooks/useAppDispatch';
import { removeVariable } from '@/shared/store/reducers/variablesSlice';

const STORAGE_KEY = 'variables';

export const VariablesList = () => {
  const locale = useLocale();
  const { variablesPage: t } = translate(locale);
  const { variables, isStored } = useAppSelector(
    (state) => state.variablesReducer
  );
  const dispatch = useAppDispatch();
  const { setStorageItem } = useLocalStorage<Variable[]>();
  const [searchQuery, setSearchQuery] = useState('');
  const [dialog, setDialog] = useState<{
    type: DialogType;
    id: string;
  } | null>(null);

  useEffect(() => {
    if (variables.length || isStored) {
      setStorageItem(STORAGE_KEY, variables);
    }
  }, [variables, isStored, setStorageItem]);

  const filteredVariables = useMemo(() => {
    return variables.filter((variable) =>
      variable.key.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );
  }, [variables, searchQuery]);

  const openDialog = (type: DialogType, id: string) => setDialog({ type, id });

  const closeDialog = () => setDialog(null);

  const handleConfirm = () => {
    if (!dialog) return;

    if (dialog.type === 'item' && dialog.id) {
      dispatch(removeVariable(dialog.id));
    }
    closeDialog();
  };

  return (
    <section className={s.container}>
      <h1 className={s.header}>{t.title}</h1>
      <div className={s.list}>
        <VariablesListHeader
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {filteredVariables.map((variable) => {
          return (
            <VariableItem
              key={variable.id}
              variable={variable}
              itemCreated={true}
              onRemove={(id) => openDialog('item', id)}
            />
          );
        })}
        <VariableItem />
      </div>
      <ConfirmDialog
        open={!!dialog}
        title={t.confirmRemoval}
        text={t.confirmRemoveItem}
        onOpenChange={(open) => !open && closeDialog()}
        handleConfirm={handleConfirm}
        handleCancel={closeDialog}
      />
    </section>
  );
};
