import { z } from 'zod';
import { useLocale } from 'next-intl';
import { translate } from '@/shared/i18n/langSwitcher';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const useGetSchema = () => {
  const locale = useLocale();
  const { validations: t } = translate(locale);

  return z.object({
    email: z
      .string()
      .trim()
      .email(t.emailInvalid)
      .refine((val) => val !== '', t.required),
    password: z
      .string()
      .trim()
      .refine((val) => val !== '', t.required),
  });
};

export const useLoginForm = () => {
  return useForm({
    resolver: zodResolver(useGetSchema()),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });
};

export type LoginFormValues = z.infer<ReturnType<typeof useGetSchema>>;
