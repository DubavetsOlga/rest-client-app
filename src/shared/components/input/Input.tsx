'use client';

import { useState } from 'react';
import { ComponentProps, ReactNode, Ref } from 'react';
import s from './Input.module.css';
import { Eye, EyeClosed } from 'lucide-react';

type Props = ComponentProps<'input'> & {
  label?: string;
  error?: string;
  ref?: Ref<HTMLInputElement> | Ref<HTMLSelectElement> | undefined;
  children?: ReactNode;
};

export const Input = ({
  label,
  type = 'text',
  id,
  ref,
  error,
  ...rest
}: Props) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div>
      {label && type !== 'checkbox' && (
        <label htmlFor={id} className={s.label}>
          {label}
        </label>
      )}
      {type === 'checkbox' ? (
        <label className={s.checkboxLabel}>
          <input
            type={type}
            id={id}
            ref={ref as Ref<HTMLInputElement>}
            className={s.checkbox}
            {...rest}
          />
          {label}
        </label>
      ) : (
        <div className={s.inputContainer}>
          <input
            type={type === 'password' && passwordVisible ? 'text' : type}
            id={id}
            className={s.input}
            ref={ref as Ref<HTMLInputElement>}
            {...rest}
          />
          {type === 'password' && (
            <span
              className={s.togglePassword}
              onClick={togglePasswordVisibility}
            >
              {passwordVisible ? <EyeClosed /> : <Eye />}
            </span>
          )}
        </div>
      )}
      <div className={s.errorContainer}>
        {error && <span className={s.error}>{error}</span>}
      </div>
    </div>
  );
};
