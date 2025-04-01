import { Button } from '@/shared/components';
import { REST } from '@/shared/models/routes';
import { useLocale } from 'next-intl';
import { translate } from '@/shared/i18n/langSwitcher';
import s from './EmptyHistory.module.css';

export const EmptyHistory = () => {
  const locale = useLocale();
  const { historyPage, basic } = translate(locale);

  return (
    <div className={s.container}>
      <div className={s.text}>
        <h3 className={s.noRequests}>{historyPage.noRequests}</h3>
        <h3>{historyPage.empty}</h3>
      </div>
      <Button href={REST}>{basic.restClient}</Button>
    </div>
  );
};
