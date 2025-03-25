import { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import s from './style.module.css';
import { Link } from '@/shared/i18n/routing';

type Props = {
  variant?: 'primary' | 'secondary' | 'text';
  className?: string;
  children: ReactNode;
} & (
  | ({ href: string } & ComponentPropsWithoutRef<'a'>)
  | ({ href?: undefined } & ComponentPropsWithoutRef<'button'>)
);

export const Button = ({
  variant = 'primary',
  className,
  children,
  href,
  ...rest
}: Props) => {
  const Tag = (href ? Link : 'button') as ElementType;

  return (
    <Tag
      className={`${s.button} ${s[variant]} ${className || ''}`}
      {...(href ? { href } : {})}
      {...rest}
    >
      {children}
    </Tag>
  );
};
