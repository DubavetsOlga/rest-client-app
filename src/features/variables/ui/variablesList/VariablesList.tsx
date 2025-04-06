'use client';

import { useLocale } from 'next-intl';
import s from './VariablesList.module.css';
import { translate } from '@/shared/i18n/langSwitcher';
import { VariableItem } from '../variableItem/VariableItem';
import { useAppSelector } from '@/shared/store/hooks/useAppSelector';
import { useEffect, useMemo, useState } from 'react';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import { Variable } from '@/shared/models/types';
import { VariablesListHeader } from '../variablesListHeader/VariablesListHeader';

const STORAGE_KEY = 'variables';

export const VariablesList = () => {
  const locale = useLocale();
  const { variablesPage: t } = translate(locale);
  const { variables, isStored } = useAppSelector((state) => state.variablesReducer);
  const { setStorageItem } = useLocalStorage<Variable[]>();
  const [searchQuery, setSearchQuery] = useState('');

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
              variable={variable}
              itemCreated={true}
            />
          );
        })}
        <VariableItem className={s.item} />
      </div>
    </section>
  );
};
