'use client';

import s from './SideMenu.module.css';
import { useState } from 'react';
import { Link, usePathname } from '@/shared/i18n/routing';
import { HISTORY, REST, VARIABLES } from '@/shared/models/routes';
import {
  CloudFog,
  ListX,
  History,
  PanelRightClose,
  PanelRightOpen,
  Menu,
  X,
  Home,
} from 'lucide-react';
import { useLocale } from 'next-intl';
import { translate } from '@/shared/i18n/langSwitcher';
import { useAuthContext } from '@/shared/hooks/useAuthContext';

export default function SideMenu() {
  const { isAuth, loading } = useAuthContext();
  const path = usePathname();

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
    return path === href || path.startsWith(`${href}/`);
  };

  const menuItems = [
    {
      href: '/',
      icon: <Home />,
      text: t.main,
    },
    {
      href: REST,
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
          <div className={s.menuHeader}>
            <button
              onClick={toggleWidth}
              className={s.toggleWidthButton}
              aria-label={t.menu}
            >
              {isShort ? (
                <PanelRightClose size={18} />
              ) : (
                <PanelRightOpen size={18} />
              )}
            </button>
          </div>
          <ul className={s.menuList}>
            {menuItems.map((item) => (
              <li
                key={item.href}
                className={`${s.menuItem} ${isActive(item.href) ? s.active : ''}`}
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
