import { translate } from '@/shared/i18n/langSwitcher';
import s from './VariablesListHeader.module.css';
import { useLocale } from 'next-intl';
import { ChangeEvent, memo } from 'react';

type Props = {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export const VariablesListHeader = memo(function VariablesListHeader({
  value,
  onChange,
}: Props) {
  const locale = useLocale();
  const { variablesPage: t } = translate(locale);

  return (
    <div className={s.head}>
      <div className={s['head-item']}>
        {t.tableTitle}
        <input
          placeholder={t.variablesFilterPlaceholder}
          className={s.input}
          type="search"
          value={value}
          onChange={onChange}
        />
      </div>
      <div className={s['head-item']}>{t.tableValue}</div>
      <div className={s['head-item']}></div>
    </div>
  );
});
