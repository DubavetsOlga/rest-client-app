'use client';

import { translate } from '@/shared/i18n/langSwitcher';
import { useLocale } from 'next-intl';
import { Link } from '@/shared/i18n/routing';
import {
  LoginFormValues,
  useLoginForm,
} from '@/features/login/hooks/useLoginForm';
import { REGISTRATION } from '@/shared/models/routes';
import { signIn } from '@/features/login/signIn';
import { Card, Input, Button } from '@/shared/components';
import s from './LoginForm.module.css';
import { useState } from 'react';
import { useFirebaseErrorHandler } from '@/shared/hooks/useFirebaseErrorHandler';

export const LoginForm = () => {
  const locale = useLocale();
  const { auth, basic } = translate(locale);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useLoginForm();

  const { handleFirebaseError } = useFirebaseErrorHandler();
  const [firebaseError, setFirebaseError] = useState<string | null>(null);

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setFirebaseError(null);
      await signIn(data.email, data.password);
    } catch (error) {
      handleFirebaseError(error, { setError: setFirebaseError });
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          type="email"
          id="email"
          label={auth.email}
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          type="password"
          id="password"
          label={auth.password}
          error={errors.password?.message}
          {...register('password')}
        />
        {firebaseError && <div className={s.errorMessage}>{firebaseError}</div>}
        <Button type="submit" disabled={!isValid}>
          {basic.signIn}
        </Button>
        <p className={s.registrationLink}>
          {auth.doNotHaveAccount}&nbsp;
          <Link href={REGISTRATION}>{basic.signUp}</Link>
        </p>
      </form>
    </Card>
  );
};
