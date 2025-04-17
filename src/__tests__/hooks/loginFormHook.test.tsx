import { act, renderHook, waitFor } from '@testing-library/react';
import { useLoginForm } from '@/features/login/hooks/useLoginForm';

describe('useLoginForm', () => {
  it('should initialize form with default values', () => {
    const { result } = renderHook(() => useLoginForm());

    expect(result.current.formState.isValid).toBe(false);
    expect(result.current.getValues()).toEqual({
      email: '',
      password: '',
    });
  });

  it('should validate form on change', async () => {
    const { result } = renderHook(() => useLoginForm());

    act(() => {
      result.current.setValue('email', 'invalid-email');
      result.current.trigger();
    });

    await waitFor(() => {
      expect(result.current.formState.errors.email?.message).toBe(
        'Invalid email address'
      );
    });

    act(() => {
      result.current.setValue('email', 'valid@example.com');
      result.current.setValue('password', 'password');
      result.current.trigger();
    });

    await waitFor(() => {
      expect(result.current.formState.isValid).toBe(true);
      expect(result.current.formState.errors).toEqual({});
    });
  });
});
