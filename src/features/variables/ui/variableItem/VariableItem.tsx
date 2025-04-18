import { translate } from '@/shared/i18n/langSwitcher';
import { useLocale } from 'next-intl';
import { ChangeEvent, memo, useState } from 'react';
import s from './VariableItem.module.css';
import { useAppDispatch } from '@/shared/store/hooks/useAppDispatch';
import {
  editVariable,
  createVariable,
} from '@/shared/store/reducers/variablesSlice';
import { Trash2, TriangleAlert } from 'lucide-react';
import { Variable } from '@/shared/models/types';
import { useAppSelector } from '@/shared/store/hooks/useAppSelector';

type Props = {
  variable?: Variable;
  itemCreated?: boolean;
  onRemove?: (id: string) => void;
};

export const VariableItem = memo(function VariableItem({
  variable = {
    id: crypto.randomUUID(),
    key: '',
    value: '',
  },
  itemCreated = false,
  onRemove,
}: Props) {
  const locale = useLocale();
  const { variablesPage: t } = translate(locale);
  const [item, setItem] = useState(variable);
  const [isCreated] = useState(itemCreated);
  const [willOverwrite, setWillOverwrite] = useState(false);
  const dispatch = useAppDispatch();
  const { variables } = useAppSelector((state) => state.variablesReducer);

  const create = () => {
    const trimmedKey = item.key.trim();
    const trimmedValue = item.value.trim();
    setItem({ ...item, key: trimmedKey, value: trimmedValue });
    if (trimmedKey && trimmedValue && !isCreated) {
      dispatch(
        createVariable({ id: item.id, key: trimmedKey, value: trimmedValue })
      );
      setItem({ id: crypto.randomUUID(), key: '', value: '' });
      setWillOverwrite(false);
    }
    if (isCreated) {
      dispatch(editVariable({ ...item, key: trimmedKey, value: trimmedValue }));
      setWillOverwrite(false);
    }
  };

  const handleKeyChange = (e: ChangeEvent<HTMLInputElement>) => {
    setItem({ ...item, key: e.target.value });
    const sameKeyVariable = variables.find(
      (variable) => variable.key === e.target.value
    );
    if (!sameKeyVariable || sameKeyVariable.id === item.id) {
      setWillOverwrite(false);
      return;
    }
    setWillOverwrite(true);
  };

  return (
    <div className={s.item} onBlur={create}>
      <div className={s['input-container']}>
        <input
          className={s.input}
          placeholder={t.variableNamePlaceholder}
          value={item.key}
          onChange={handleKeyChange}
        />
        {willOverwrite && (
          <div className={s.tooltip}>
            <TriangleAlert
              className={s['alert-icon']}
              size={20}
              color="var(--color-warning-500)"
            />
            <i className={s['tooltip-text']}>{t.variableOverwriteTooltip}</i>
          </div>
        )}
      </div>
      <div className={s['input-container']}>
        <input
          className={s.input}
          placeholder={t.variableValuePlaceholder}
          value={item.value}
          onChange={(e) => setItem({ ...item, value: e.target.value })}
        />
      </div>
      <div className={s['input-container']}>
        {isCreated && (
          <Trash2
            size={20}
            cursor={'pointer'}
            onClick={onRemove ? () => onRemove(item.id) : undefined}
          />
        )}
      </div>
    </div>
  );
});
