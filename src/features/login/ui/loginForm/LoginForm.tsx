'use client';

import { translate } from '@/shared/i18n/langSwitcher';
import { useLocale } from 'next-intl';
import { Link } from '@/shared/i18n/routing';
import {
  LoginFormValues,
  useLoginForm,
} from '@/features/login/hooks/useLoginForm';
import { REGISTRATION } from '@/shared/models/routes';
import { toast } from 'react-toastify';
import { FirebaseError } from '@firebase/util';
import { signIn } from '@/features/login/signIn';
import { Card, Input, Button } from '@/shared/components';
import s from './LoginForm.module.css';

export const LoginForm = () => {
  const locale = useLocale();
  const { auth, basic } = translate(locale);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useLoginForm();

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await signIn(data.email, data.password);
    } catch (error) {
      toast.error((error as FirebaseError).message || basic.unexpectedError);
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
