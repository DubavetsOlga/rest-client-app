import { getStatusCodeClass } from '@/shared/utils/getStatusCodeClass';
import { getHttpStatusText } from '@/shared/utils/getHttpStatusText';
import { useLocale } from 'next-intl';
import { translate } from '@/shared/i18n/langSwitcher';
import { memo } from 'react';
import s from './ResponseSetting.module.css';

type Props = {
  status: number;
  isBody: boolean;
  setIsBody: (value: boolean) => void;
};

export const ResponseSettings = memo(function ResponseSettings({
  status,
  isBody,
  setIsBody,
}: Props) {
  const locale = useLocale();
  const { clientPage: t } = translate(locale);

  return (
    <div className={s.info}>
      <div className={s.resultType}>
        <span>{t.response}</span>
        <label className={s.radioLabel}>
          <input
            type="radio"
            checked={isBody}
            onChange={(e) => setIsBody(e.target.checked)}
          />
          {t.body}
        </label>
        <label className={s.radioLabel}>
          <input
            type="radio"
            checked={!isBody}
            onChange={(e) => setIsBody(!e.target.checked)}
          />
          {t.headers}
        </label>
      </div>

      {status !== 0 && (
        <span className={`${s.responseCode} ${s[getStatusCodeClass(status)]}`}>
          {status} {getHttpStatusText(status)}
        </span>
      )}
    </div>
  );
});
