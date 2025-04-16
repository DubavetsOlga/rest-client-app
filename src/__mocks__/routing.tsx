import type { ReactNode } from 'react';
import { jest } from '@jest/globals';

export const Link = ({
  children,
  href,
}: {
  children: ReactNode;
  href: string;
}) => <a href={href}>{children}</a>;

export const usePathname = jest.fn(() => '/');
