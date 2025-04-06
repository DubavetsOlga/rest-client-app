import { translate } from '@/shared/i18n/langSwitcher';
import { useLocale } from 'next-intl';
import { useState } from 'react';
import s from './VariableItem.module.css';
import { useAppDispatch } from '@/shared/store/hooks/useAppDispatch';
import {
  editVariable,
  removeVariable,
  createVariable,
} from '@/shared/store/reducers/VariablesSlice';
import { Trash2 } from 'lucide-react';
import { Variable } from '@/shared/models/types';

type Props = {
  variable?: Variable;
  itemCreated?: boolean;
  className: string;
};

export const VariableItem = ({
  variable = {
    id: crypto.randomUUID(),
    key: '',
    value: ''
  },
  itemCreated = false,
  className,
}: Props) => {
  const locale = useLocale();
  const { variablesPage: t } = translate(locale);

  const [item, setItem] = useState(variable)
  const [isCreated] = useState(itemCreated);

  const dispatch = useAppDispatch();

  const remove = () => dispatch(removeVariable(item.id));
  const edit = (val: Variable) => dispatch(editVariable(val))

  const create = () => {
    const trimmedKey = item.key.trim();
    const trimmedValue = item.value.trim();
    setItem({ ...item, key: trimmedKey, value: trimmedValue })
    if (trimmedKey && trimmedValue && !isCreated) {
      dispatch(createVariable({ id: item.id, key: trimmedKey, value: trimmedValue }));
      setItem({ id: crypto.randomUUID(), key: '', value: '' })
    }
    if (isCreated) {
      edit({ ...item, key: trimmedKey, value: trimmedValue });
    }
  }

  return (
    <div className={className} onBlur={create}>
      <div className={s['input-container']}>
        <input
          className={s.input}
          placeholder={t.variableNamePlaceholder}
          value={item.key}
          onChange={(e) => setItem({ ...item, key: e.target.value })}
        />
      </div>
      <div className={s['input-container']}>
        <input
          className={s.input}
          placeholder={t.variableValuePlaceholder}
          value={item.value}
          onChange={(e) => setItem({ ...item, value: e.target.value })}
        />
      </div>
      <div
        className={s['input-container']}
      >
        {isCreated && <Trash2 size={20} cursor={'pointer'} onClick={remove} />}
      </div>
    </div>
  );
};
