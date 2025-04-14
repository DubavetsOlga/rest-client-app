import { HttpMethod } from '@/shared/models/httpMethod';
import { HttpMethodType } from '@/shared/models/httpMethod';
import s from './MethodSelect.module.css';
import { useAppSelector } from '@/shared/store/hooks/useAppSelector';
import { selectMethod } from '@/shared/store/selectors/restClientSelectors';
import { useAppDispatch } from '@/shared/store/hooks/useAppDispatch';
import { setMethod } from '@/shared/store/reducers/restClientSlice';
import { useLocale } from 'next-intl';
import { translate } from '@/shared/i18n/langSwitcher';

export const MethodSelect = () => {
  const locale = useLocale();
  const { clientPage: t } = translate(locale);

  const method = useAppSelector(selectMethod);
  const dispatch = useAppDispatch();

  const handleMethodChange = (method: HttpMethodType) => {
    dispatch(setMethod(method));
  };

  return (
    <select
      value={method}
      onChange={(e) => handleMethodChange(e.target.value as HttpMethodType)}
      className={`${s.select} ${s[method.toLowerCase()]}`}
      aria-label={t.method}
    >
      {Object.values(HttpMethod).map((method) => (
        <option
          key={method}
          value={method}
          className={`${s[method.toLowerCase()]}`}
        >
          {method}
        </option>
      ))}
    </select>
  );
};
