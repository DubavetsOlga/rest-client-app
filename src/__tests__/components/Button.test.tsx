import '@testing-library/jest-dom';
import { Button } from '@/shared/components';
import { render, screen } from '@testing-library/react';

describe('Button component', () => {
  it('renders a button with children', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Click me');
  });

  it('renders a link when "href" is provided', () => {
    render(<Button href="https://example.com">Go to Example</Button>);
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveTextContent('Go to Example');
  });

  it('applies the correct variant class for "primary"', () => {
    render(<Button variant="primary">Primary Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('primary');
  });

  it('applies the correct variant class for "secondary"', () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('secondary');
  });

  it('applies additional custom className if provided', () => {
    render(<Button className="custom-class">Custom Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('does not render an "href" attribute when "href" is not passed', () => {
    render(<Button>Button without href</Button>);
    const button = screen.getByRole('button');
    expect(button).not.toHaveAttribute('href');
  });
});
