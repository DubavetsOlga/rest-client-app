import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ConfirmDialog } from '@/shared/components/confirmDialog/ConfirmDialog';
import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';

jest.mock('@/shared/components', () => ({
  Button: ({
    children,
    ...props
  }: DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >) => <button {...props}>{children}</button>,
}));

describe('ConfirmDialog', () => {
  const defaultProps = {
    open: true,
    title: 'Confirm',
    text: 'Are you sure?',
    onOpenChange: jest.fn(),
    handleCancel: jest.fn(),
    handleConfirm: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not render when open is false', () => {
    render(<ConfirmDialog {...defaultProps} open={false} />);
    expect(screen.queryByText('Confirm')).not.toBeInTheDocument();
  });

  it('renders when open is true', () => {
    render(<ConfirmDialog {...defaultProps} />);
    expect(screen.getByText('Confirm')).toBeInTheDocument();
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
  });

  it('calls onOpenChange(false) when clicking overlay', () => {
    render(<ConfirmDialog {...defaultProps} />);
    const overlay = screen.getByText('Confirm').parentElement?.parentElement;
    fireEvent.click(overlay!);
    expect(defaultProps.onOpenChange).toHaveBeenCalledWith(false);
  });

  it('calls handleCancel when clicking No button', () => {
    render(<ConfirmDialog {...defaultProps} />);
    fireEvent.click(screen.getByText('No'));
    expect(defaultProps.handleCancel).toHaveBeenCalled();
  });

  it('calls handleConfirm when clicking Yes button', () => {
    render(<ConfirmDialog {...defaultProps} />);
    fireEvent.click(screen.getByText('Yes'));
    expect(defaultProps.handleConfirm).toHaveBeenCalled();
  });

  it('does not trigger close when clicking inside content', () => {
    render(<ConfirmDialog {...defaultProps} />);
    const content = screen.getByText('Confirm').parentElement!;
    fireEvent.click(content);
    expect(defaultProps.onOpenChange).not.toHaveBeenCalled();
  });
});
