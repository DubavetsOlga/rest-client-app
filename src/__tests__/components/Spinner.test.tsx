import { render, screen } from '@testing-library/react';
import styles from './Spinner.module.css';
import { Spinner } from '@/shared/components';
import '@testing-library/jest-dom';

describe('Spinner component', () => {
  it('renders without crashing', () => {
    render(<Spinner />);
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
  });

  it('applies default size when no size prop is passed', () => {
    render(<Spinner />);
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveStyle({ width: '48px', height: '48px' });
  });

  it('applies custom size from props', () => {
    render(<Spinner size={100} />);
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveStyle({ width: '100px', height: '100px' });
  });

  it('has the correct CSS class applied', () => {
    render(<Spinner />);
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass(styles.spinner);
  });
});
