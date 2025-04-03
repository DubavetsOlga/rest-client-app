'use client';

import { translate } from '@/shared/i18n/langSwitcher';
import { useLocale } from 'next-intl';
import { memo, useCallback, useState } from 'react';
import s from './VariableItem.module.css';
import { useAppDispatch } from '@/shared/store/hooks/useAppDispatch';
import {
  editVariable,
  removeVariable,
  createVariable,
} from '@/shared/store/reducers/VariablesSlice';
import { Trash2 } from 'lucide-react';

type Props = {
  itemId: string;
  itemKey: string;
  itemValue: string;
  itemCreated: boolean;
  className: string;
};

export const VariableItem = memo(function VariableItem({
  itemId,
  itemKey,
  itemValue,
  itemCreated,
  className,
}: Partial<Props>) {
  const locale = useLocale();
  const { variablesPage: t } = translate(locale);

  const [id, setId] = useState(itemId ?? crypto.randomUUID());
  const [key, setKey] = useState(itemKey ?? '');
  const [value, setValue] = useState(itemValue ?? '');
  const [created] = useState(itemCreated ?? false);

  const dispatch = useAppDispatch();

  const remove = useCallback(() => {
    dispatch(removeVariable(id));
  }, [id, dispatch]);

  const edit = useCallback(() => {
    dispatch(editVariable({ id, key, value }));
  }, [id, key, value, dispatch]);

  const create = useCallback(() => {
    if (key && value && !created) {
      dispatch(createVariable({ id, key, value }));
      setKey('');
      setValue('');
      setId(crypto.randomUUID());
    }
    if (created) {
      edit();
    }
  }, [id, key, value, created, dispatch, edit]);

  return (
    <div className={className} onBlur={create}>
      <div className={s['input-container']}>
        <input
          className={s.input}
          placeholder={t.variableNamePlaceholder}
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
      </div>
      <div className={s['input-container']}>
        <input
          className={s.input}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      <div
        className={`${s['input-container']} ${created ? s.created : ''}`}
        onClick={created ? () => remove() : undefined}
      >
        {created && <Trash2 className={s['remove-icon']} />}
      </div>
    </div>
  );
});
