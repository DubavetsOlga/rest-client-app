'use client';

import { translate } from '@/shared/i18n/langSwitcher';
import { useLocale } from 'next-intl';
import { Link } from '@/shared/i18n/routing';
import { LOGIN } from '@/shared/models/routes';
import {
  RegistrationFormValues,
  useRegistrationForm,
} from '@/features/registration/hooks/useRegistrationForm';
import { createUser } from '@/features/registration/createUser';
import { Card, Input, Button } from '@/shared/components';
import s from './RegistrationForm.module.css';
import { useState } from 'react';
import { useAuthContext } from '@/shared/hooks/useAuthContext';
import { useFirebaseErrorHandler } from '@/shared/hooks/useFirebaseErrorHandler';

export const RegistrationForm = () => {
  const locale = useLocale();
  const { auth, basic } = translate(locale);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useRegistrationForm();

  const { handleFirebaseError } = useFirebaseErrorHandler();
  const [firebaseError, setFirebaseError] = useState<string | null>(null);

  const { setUserName } = useAuthContext();

  const onSubmit = async (data: RegistrationFormValues) => {
    try {
      setFirebaseError(null);
      await createUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      setUserName(data.name);
    } catch (error) {
      handleFirebaseError(error, { setError: setFirebaseError });
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          id="name"
          label={auth.name}
          error={errors.name?.message}
          {...register('name')}
        />
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
        <Input
          type="password"
          id="confirmPassword"
          label={auth.confirmPassword}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        {firebaseError && <div className={s.errorMessage}>{firebaseError}</div>}

        <Button type="submit" disabled={!isValid}>
          {auth.createAccount}
        </Button>

        <p className={s.loginLink}>
          {auth.haveAccount}&nbsp;
          <Link href={LOGIN}>{basic.signIn}</Link>
        </p>
      </form>
    </Card>
  );
};
