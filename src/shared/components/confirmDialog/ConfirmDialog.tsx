'use client';

import s from './ConfirmDialog.module.css';
import { Button } from '@/shared/components';
import { useLocale } from 'next-intl';
import { translate } from '@/shared/i18n/langSwitcher';

type Props = {
  open: boolean;
  title: string;
  text: string;
  onOpenChange: (open: boolean) => void;
  handleCancel: () => void;
  handleConfirm: () => void;
};

export const ConfirmDialog = ({
  open,
  title,
  text,
  onOpenChange,
  handleCancel,
  handleConfirm,
}: Props) => {
  const locale = useLocale();
  const { basic: t } = translate(locale);

  if (!open) return null;

  return (
    <div className={s.dialogOverlay} onClick={() => onOpenChange(false)}>
      <div className={s.dialogContent} onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p>{text}</p>
        <div className={s.dialogActions}>
          <Button onClick={handleCancel}>{t.no}</Button>
          <Button variant="secondary" onClick={handleConfirm}>
            {t.yes}
          </Button>
        </div>
      </div>
    </div>
  );
};
