import { useAppSelector } from '@/shared/store/hooks/useAppSelector';
import { selectResponse } from '@/shared/store/selectors/restClientSelectors';
import { useLocale } from 'next-intl';
import { translate } from '@/shared/i18n/langSwitcher';
import s from './ResponseHeaders.module.css';

export const ResponseHeaders = () => {
  const locale = useLocale();
  const { clientPage: t } = translate(locale);

  const response = useAppSelector(selectResponse);

  if (!Object.entries(response.headers).length) {
    return;
  }

  return (
    <table className={s.headersTable}>
      <thead>
        <tr>
          <th>{t.key}</th>
          <th>{t.value}</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(response.headers).map(([key, value], i) => (
          <tr key={i}>
            <td>{key}</td>
            <td>{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
