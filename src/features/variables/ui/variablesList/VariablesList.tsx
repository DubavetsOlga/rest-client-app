'use client';

import { useLocale } from 'next-intl';
import s from './VariablesList.module.css';
import { translate } from '@/shared/i18n/langSwitcher';
import { VariableItem } from '../variableItem/VariableItem';
import { useAppSelector } from '@/shared/store/hooks/useAppSelector';
import { useEffect, useMemo, useState } from 'react';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import { setVariables, Variable } from '@/shared/store/reducers/VariablesSlice';
import { useAppDispatch } from '@/shared/store/hooks/useAppDispatch';
import { VariablesListHeader } from '../variablesListHeader/variablesListHeader';

export const VariablesList = () => {
  const locale = useLocale();
  const { variablesPage: t } = translate(locale);

  const { variables } = useAppSelector((state) => state.variablesReducer);
  const dispatch = useAppDispatch();

  const { getStorageItem, setStorageItem } = useLocalStorage<Variable[]>();
  const [isStored, setIsStored] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(setVariables(getStorageItem('variables', [])));
    setIsStored(true);
  }, [dispatch, getStorageItem]);

  useEffect(() => {
    if (variables.length || isStored) {
      setStorageItem('variables', variables);
    }
  }, [variables, isStored, setStorageItem]);

  const filteredVariables = useMemo(() => {
    return variables.filter((variable) =>
      variable.key.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );
  }, [variables, searchQuery]);

  return (
    <section className={s.container}>
      <h1 className={s.header}>{t.title}</h1>
      <div className={s.list}>
        <VariablesListHeader
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {filteredVariables.map((variable, i) => {
          const isEven = i % 2 !== 0;
          return (
            <VariableItem
              className={`${s.item} ${isEven ? s.even : ''}`}
              key={variable.id}
              itemId={variable.id}
              itemKey={variable.key}
              itemValue={variable.value}
              itemCreated={true}
            />
          );
        })}
        <VariableItem className={s.item} />
      </div>
    </section>
  );
};
