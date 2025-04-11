'use client';

import Image from 'next/image';
import { Link } from '@/shared/i18n/routing';
import s from './Header.module.css';
import { LocaleSwitcher } from '@/features/localeSwitcher/LocaleSwitcher';
import { useLocale } from 'use-intl';
import { translate } from '@/shared/i18n/langSwitcher';
import { FirebaseError } from '@firebase/util';
import { toast } from 'react-toastify';
import { LOGIN, REGISTRATION } from '@/shared/models/routes';
import { useState, useEffect } from 'react';
import { Button } from '@/shared/components';
import { logout } from '@/features/logout/logout';
import { useAuthContext } from '@/shared/hooks/useAuthContext';

export const Header = () => {
  const locale = useLocale();
  const { basic: t } = translate(locale);
  const { isAuth, loading } = useAuthContext();
  const [isSticky, setIsSticky] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      toast.error((error as FirebaseError).message || t.unexpectedError);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(document.body.scrollTop > 1);
    };

    document.body.addEventListener('scroll', handleScroll);

    return () => {
      document.body.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`${s.header} ${isSticky ? s.sticky : ''}`}>
      <div className={s.logo}>
        <Link href="/">
          <Image
            src="/logo.png"
            priority
            alt="Logo"
            width={50}
            height={50}
          />
        </Link>
        <h2 className={s.title}>REST Client</h2>
      </div>
      {!loading && (
        <div className={s.actions}>
          <LocaleSwitcher />
          {isAuth ? (
            <Button onClick={handleLogout} variant="secondary">
              {t.signOut}
            </Button>
          ) : (
            <>
              <Button href={LOGIN}>{t.signIn}</Button>
              <Button href={REGISTRATION} variant="secondary">
                {t.signUp}
              </Button>
            </>
          )}
        </div>
      )}
    </header>
  );
};
