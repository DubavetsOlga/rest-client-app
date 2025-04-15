import { Trash2 } from 'lucide-react';
import { useRef, memo } from 'react';
import { HeaderType } from '@/shared/models/types';
import { useLocale } from 'next-intl';
import { translate } from '@/shared/i18n/langSwitcher';
import { toast } from 'react-toastify';
import s from '../Headers.module.css';
import { updateHeader } from '@/shared/store/reducers/restClientSlice';
import { useAppDispatch } from '@/shared/store/hooks/useAppDispatch';
import { useHeaderIsUnique } from '@/shared/hooks/useHeaderIsUnique';

type Props = {
  header: HeaderType;
  onDelete: (id: string) => void;
};

export const HeaderItem = memo(function HeaderItem({
  header,
  onDelete,
}: Props) {
  const locale = useLocale();
  const { clientPage: t } = translate(locale);
  const dispatch = useAppDispatch();
  const isHeaderUnique = useHeaderIsUnique();
  const keyRef = useRef<HTMLInputElement>(null);
  const valueRef = useRef<HTMLInputElement>(null);

  const handleBlur = () => {
    const currentKey = keyRef.current?.value.trim() || '';
    const currentValue = valueRef.current?.value.trim() || '';

    if (!currentKey) {
      toast.warning(t.headerRequired);
      keyRef.current!.value = header.key;
      valueRef.current!.value = header.value;
      return;
    }

    if (!isHeaderUnique(currentKey, header.id)) {
      toast.warning(t.headerUnique);
      keyRef.current!.value = header.key;
      valueRef.current!.value = header.value;
      return;
    }

    if (!currentValue) {
      toast.warning(t.emptyHeaderValue);
    }

    dispatch(
      updateHeader({
        id: header.id,
        key: currentKey,
        value: currentValue,
      })
    );
  };

  const handleDelete = () => {
    onDelete(header.id);
  };

  return (
    <tr>
      <td>
        <input
          defaultValue={header.key}
          ref={keyRef}
          onBlur={handleBlur}
          aria-label={t.key}
        />
      </td>
      <td>
        <input
          defaultValue={header.value}
          ref={valueRef}
          onBlur={handleBlur}
          className={!header.value ? s.redBorder : ''}
          aria-label={t.value}
        />
      </td>
      <td>
        <button
          onClick={handleDelete}
          aria-label={t.deleteHeader}
          className={s.deleteButton}
          title={t.deleteHeader}
        >
          <Trash2 size={20} />
        </button>
      </td>
    </tr>
  );
});
