import { ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react';
import s from './style.module.css';

type Props = {
  className?: string;
  children: ReactNode;
} & ComponentPropsWithoutRef<'div'>;

export function Card({ children, ...rest }: Props): ReactElement {
  return (
    <div className={s.card} {...rest}>
      {children}
    </div>
  );
}
