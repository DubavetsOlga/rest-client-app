import { useLocale } from 'next-intl';
import { translate } from '@/shared/i18n/langSwitcher';
import s from './BodyTypeInput.module.css';
import { useAppSelector } from '@/shared/store/hooks/useAppSelector';
import { selectIsJsonMode } from '@/shared/store/selectors/restClientSelectors';
import { setIsJsonMode } from '@/shared/store/reducers/restClientSlice';
import { useAppDispatch } from '@/shared/store/hooks/useAppDispatch';

export const BodyTypeInput = () => {
  const locale = useLocale();
  const { clientPage: t } = translate(locale);

  const dispatch = useAppDispatch();
  const isJson = useAppSelector(selectIsJsonMode);

  const handleIsJsonChange = (value: boolean) => {
    dispatch(setIsJsonMode(value));
  };

  return (
    <div className={s.type}>
      <label className={s.radioLabel}>
        <input
          type="radio"
          checked={isJson}
          onChange={(e) => handleIsJsonChange(e.target.checked)}
        />
        JSON
      </label>
      <label className={s.radioLabel}>
        <input
          type="radio"
          checked={!isJson}
          onChange={(e) => handleIsJsonChange(!e.target.checked)}
        />
        {t.text}
      </label>
    </div>
  );
};
