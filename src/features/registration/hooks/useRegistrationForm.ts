import { z } from 'zod';
import { useLocale } from 'next-intl';
import { translate } from '@/shared/i18n/langSwitcher';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const passwordRegex =
  /^(?=.*\d)(?=.*\p{Lu})(?=.*\p{Ll})(?=.*[^\p{L}\d]).{8,}$/u;

const useGetSchema = () => {
  const locale = useLocale();
  const { validations: t } = translate(locale);

  return z
    .object({
      name: z
        .string()
        .trim()
        .regex(/^\p{Lu}[\s\S]*$/u, t.nameCapitalized)
        .refine((val) => val !== '', t.required),
      email: z
        .string()
        .trim()
        .email(t.emailInvalid)
        .refine((val) => val !== '', t.required),
      password: z
        .string()
        .trim()
        .min(8, t.passwordMinLength)
        .regex(passwordRegex, t.passwordStrength)
        .refine((val) => val !== '', t.required),
      confirmPassword: z.string().trim(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t.passwordsMustMatch,
      path: ['confirmPassword'],
    });
};

export const useRegistrationForm = () => {
  return useForm({
    resolver: zodResolver(useGetSchema()),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });
};

export type RegistrationFormValues = z.infer<ReturnType<typeof useGetSchema>>;
