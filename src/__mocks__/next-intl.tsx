import { ReactNode } from 'react';

module.exports = {
  defineRouting: jest.fn().mockReturnValue({
    locales: ['en', 'ru'],
    defaultLocale: 'en',
  }),
  createNavigation: jest.fn().mockReturnValue({
    Link: ({ children, href }: { children: ReactNode; href: string }) => (
      <a href={href}>{children}</a>
    ),
    redirect: jest.fn(),
    usePathname: jest.fn(),
    useRouter: jest.fn(),
    getPathname: jest.fn(),
  }),
  useLocale: () => 'en',
};
