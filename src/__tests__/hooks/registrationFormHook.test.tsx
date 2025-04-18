import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FormProvider } from 'react-hook-form';
import { useRegistrationForm } from '@/features/registration/hooks/useRegistrationForm';
import '@testing-library/jest-dom';

describe('useRegistrationForm', () => {
  const mockSubmit = jest.fn();

  const MockForm = () => {
    const methods = useRegistrationForm();
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = methods;

    return (
      <FormProvider {...methods}>
        {' '}
        <form onSubmit={handleSubmit(mockSubmit)}>
          <input {...register('name')} placeholder="Name" />
          {errors.name && <span>{errors.name.message}</span>}

          <input {...register('email')} placeholder="Email" />
          {errors.email && <span>{errors.email.message}</span>}

          <input {...register('password')} placeholder="Password" />
          {errors.password && <span>{errors.password.message}</span>}

          <input
            {...register('confirmPassword')}
            placeholder="Confirm Password"
          />
          {errors.confirmPassword && (
            <span>{errors.confirmPassword.message}</span>
          )}

          <button type="submit">Submit</button>
        </form>
      </FormProvider>
    );
  };

  it('should validate the password strength', async () => {
    render(<MockForm />);

    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'weak' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
      target: { value: 'weak' },
    });
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(
        screen.getByText('Password must be at least 8 characters long')
      ).toBeInTheDocument();
    });
  });

  it('should validate the name capitalized', async () => {
    render(<MockForm />);

    fireEvent.change(screen.getByPlaceholderText('Name'), {
      target: { value: 'john' },
    });
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'Password1!' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
      target: { value: 'Password1!' },
    });
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(
        screen.getByText('Name must start with a capital letter')
      ).toBeInTheDocument();
    });
  });

  it('should show password mismatch error', async () => {
    render(<MockForm />);

    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'Password1!' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
      target: { value: 'DifferentPassword!' },
    });
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(screen.getByText('Passwords must match')).toBeInTheDocument();
    });
  });

  it('should call mockSubmit on valid form submission', async () => {
    render(<MockForm />);

    fireEvent.change(screen.getByPlaceholderText('Name'), {
      target: { value: 'John' },
    });
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'Password1!' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
      target: { value: 'Password1!' },
    });
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalled();
    });
  });
});
