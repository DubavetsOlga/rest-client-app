'use client';

import s from './SideMenu.module.css';
import { useState } from 'react';
import { Link, usePathname } from '@/shared/i18n/routing';
import { HISTORY, REST, VARIABLES } from '@/shared/models/routes';
import {
  CloudFog,
  ListX,
  History,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  Home,
} from 'lucide-react';
import { useLocale } from 'next-intl';
import { translate } from '@/shared/i18n/langSwitcher';
import { useAuthContext } from '@/shared/hooks/useAuthContext';
import { HttpMethod } from '@/shared/models/httpMethod';
import { useAppSelector } from '@/shared/store/hooks/useAppSelector';

export default function SideMenu() {
  const { isAuth, loading } = useAuthContext();
  const path = usePathname();

  const clientLink =
    useAppSelector((store) => store.restClientReducer.link) ?? REST;

  const locale = useLocale();
  const { basic: t } = translate(locale);

  const [isOpen, setIsOpen] = useState(false);
  const [isShort, setIsShort] = useState(true);

  if (loading || !isAuth) {
    return null;
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleWidth = () => {
    setIsShort(!isShort);
  };

  const isActive = (href: string) => {
    if (href === clientLink) {
      return Object.values(HttpMethod).some((method) =>
        path.toUpperCase().startsWith(`/${method}`)
      );
    }

    return path === href;
  };

  const menuItems = [
    {
      href: '/',
      icon: <Home />,
      text: t.main,
    },
    {
      href: clientLink,
      icon: <CloudFog />,
      text: t.restClient,
    },
    {
      href: VARIABLES,
      icon: <ListX />,
      text: t.variables,
    },
    {
      href: HISTORY,
      icon: <History />,
      text: t.history,
    },
  ];

  return (
    <>
      <button className={s.menuToggle} onClick={toggleMenu} aria-label={t.menu}>
        {isOpen ? <X /> : <Menu />}
      </button>
      <nav
        className={`${s.sideMenu} ${isOpen ? s.open : ''} ${isShort ? s.short : ''}`}
        onClick={() => setIsOpen(false)}
      >
        <div className={s.menuContainer}>
          <div className={isShort ? s.menuHeaderShort : s.menuHeader}>
            <button
              onClick={toggleWidth}
              className={s.toggleWidthButton}
              aria-label={t.menu}
            >
              {isShort ? <ChevronRight /> : <ChevronLeft />}
            </button>
          </div>
          <ul className={s.menuList}>
            {menuItems.map((item) => (
              <li
                key={item.href}
                className={`${s.menuItem} ${isActive(item.href) ? s.active : ''}`}
                title={isShort ? item.text : ''}
              >
                <Link
                  href={item.href}
                  className={s.menuLink}
                  aria-label={item.text}
                >
                  {item.icon}
                  <span className={`${isShort ? s.shortMenuLink : ''}`}>
                    {item.text}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
}
