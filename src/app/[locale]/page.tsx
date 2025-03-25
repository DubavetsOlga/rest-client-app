'use client';

import { useLocale } from 'use-intl';
import { translate } from '@/shared/i18n/langSwitcher';
import { Developers } from '@/widgets/developers/Developers';
import {
  HISTORY,
  REGISTRATION,
  VARIABLES,
  REST,
  LOGIN,
} from '@/shared/models/routes';
import s from './style.module.css';
import { Button, Spinner } from '@/shared/components';
import { useAuthContext } from '@/shared/hooks/useAuthContext';

export default function MainPage() {
  const locale = useLocale();
  const { mainPage, basic } = translate(locale);

  const { isAuth, userName, loading } = useAuthContext();

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className={s.mainContainer}>
      <h1>
        {isAuth ? `${mainPage.welcomeBack} ${userName}!` : mainPage.welcome}
      </h1>
      <div className={s.aboutContainer}>
        <p className={s.aboutProject}>{mainPage.aboutProject}</p>
        <p className={s.aboutSchool}>{mainPage.aboutSchool}</p>
      </div>
      <div className={s.buttonContainer}>
        {isAuth ? (
          <>
            <Button href={REST}>{basic.restClient}</Button>
            <Button href={HISTORY} variant="secondary">
              {basic.history}
            </Button>
            <Button href={VARIABLES} variant="secondary">
              {basic.variables}
            </Button>
          </>
        ) : (
          <>
            <Button href={LOGIN}>{basic.signIn}</Button>
            <Button href={REGISTRATION} variant="secondary">
              {basic.signUp}
            </Button>
          </>
        )}
      </div>
      <Developers />
    </div>
  );
}
