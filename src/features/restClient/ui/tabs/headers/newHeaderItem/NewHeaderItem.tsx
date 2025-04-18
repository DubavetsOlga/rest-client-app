import { useRef } from 'react';
import { useLocale } from 'next-intl';
import { translate } from '@/shared/i18n/langSwitcher';
import { toast } from 'react-toastify';
import { addHeader } from '@/shared/store/reducers/restClientSlice';
import { useAppDispatch } from '@/shared/store/hooks/useAppDispatch';
import { useHeaderIsUnique } from '@/shared/hooks/useHeaderIsUnique';

export const NewHeaderItem = () => {
  const locale = useLocale();
  const { clientPage: t } = translate(locale);

  const dispatch = useAppDispatch();

  const isHeaderUnique = useHeaderIsUnique();

  const keyRef = useRef<HTMLInputElement>(null);
  const valueRef = useRef<HTMLInputElement>(null);

  const handleAdd = () => {
    const key = keyRef.current?.value.trim() || '';
    const value = valueRef.current?.value.trim() || '';

    if (!key) {
      return;
    }

    if (!isHeaderUnique(key)) {
      toast.warning(t.headerUnique);
      return;
    }

    if (!value) {
      return;
    }

    dispatch(addHeader({ id: crypto.randomUUID(), key, value }));

    if (keyRef.current) keyRef.current.value = '';
    if (valueRef.current) valueRef.current.value = '';
  };

  return (
    <tr onBlur={handleAdd}>
      <td>
        <input ref={keyRef} placeholder={t.addKey} aria-label={t.addKey} />
      </td>
      <td>
        <input
          ref={valueRef}
          placeholder={t.addValue}
          aria-label={t.addValue}
        />
      </td>
      <td></td>
    </tr>
  );
};
