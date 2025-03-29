import { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import s from './Button.module.css';
import { Link } from '@/shared/i18n/routing';

type Props = {
  variant?: 'primary' | 'secondary';
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
