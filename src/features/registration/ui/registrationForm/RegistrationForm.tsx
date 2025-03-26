'use client';

import { translate } from '@/shared/i18n/langSwitcher';
import { useLocale } from 'next-intl';
import { Link } from '@/shared/i18n/routing';
import { LOGIN } from '@/shared/models/routes';
import { toast } from 'react-toastify';
import { FirebaseError } from '@firebase/util';
import {
  RegistrationFormValues,
  useRegistrationForm,
} from '@/features/registration/hooks/useRegistrationForm';
import { createUser } from '@/features/registration/createUser';
import { Card, Input, Button } from '@/shared/components';

export const RegistrationForm = () => {
  const locale = useLocale();
  const { auth, basic } = translate(locale);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useRegistrationForm();

  const onSubmit = async (data: RegistrationFormValues) => {
    try {
      await createUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });
    } catch (error) {
      toast.error((error as FirebaseError).message || basic.unexpectedError);
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
        <Button type="submit" disabled={!isValid}>
          {auth.createAccount}
        </Button>
        <p>
          {auth.haveAccount}&nbsp;
          <Link href={LOGIN}>{basic.signIn}</Link>
        </p>
      </form>
    </Card>
  );
};
