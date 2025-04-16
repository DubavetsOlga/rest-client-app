import React from 'react';
import { render } from '@testing-library/react';
import { Flip, ToastContainer } from 'react-toastify';
import { Alert } from '@/shared/components';
import '@testing-library/jest-dom';

jest.mock('lucide-react', () => ({
  X: jest.fn(() => <svg data-testid="close-icon" />),
}));

describe('Alert Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders ToastContainer with default props', () => {
    render(<Alert />);

    const toastContainerProps = (ToastContainer as jest.Mock).mock.calls[0][0];

    expect(toastContainerProps).toEqual(
      expect.objectContaining({
        closeButton: expect.any(Function),
        closeOnClick: true,
        hideProgressBar: true,
        position: 'top-center',
        transition: Flip,
        icon: false,
      })
    );
  });

  it('uses custom close button with X icon', () => {
    render(<Alert />);

    const toastContainerProps = (ToastContainer as jest.Mock).mock.calls[0][0];
    const CloseButton = toastContainerProps.closeButton;

    const { getByTestId } = render(<CloseButton />);
    expect(getByTestId('close-icon')).toBeInTheDocument();
  });

  it('uses Flip transition', () => {
    render(<Alert />);

    const toastContainerProps = (ToastContainer as jest.Mock).mock.calls[0][0];
    expect(toastContainerProps.transition).toBe(Flip);
  });

  it('disables icons by default', () => {
    render(<Alert />);

    const toastContainerProps = (ToastContainer as jest.Mock).mock.calls[0][0];
    expect(toastContainerProps.icon).toBe(false);
  });
});
