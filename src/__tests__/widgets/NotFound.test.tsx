import { render, screen } from '@testing-library/react';
import { NotFound } from '@/widgets/notFound/NotFound';
import '@testing-library/jest-dom';

describe('NotFound Component', () => {
  it('renders with default props', () => {
    render(<NotFound />);

    expect(screen.getByText('404')).toBeInTheDocument();

    expect(screen.getByText('Page Not Found')).toBeInTheDocument();

    expect(screen.getByText('Go to Main')).toBeInTheDocument();

    const link = screen.getByRole('link', { name: 'Go to Main' });
    expect(link).toHaveAttribute('href', '/');
  });

  it('renders with custom props', () => {
    const customText = 'Custom Not Found Message';
    const customLinkText = 'Back to Home';

    render(<NotFound text={customText} linkText={customLinkText} />);

    expect(screen.getByText('404')).toBeInTheDocument();

    expect(screen.getByText(customText)).toBeInTheDocument();

    expect(screen.getByText(customLinkText)).toBeInTheDocument();

    const link = screen.getByRole('link', { name: customLinkText });
    expect(link).toHaveAttribute('href', '/');
  });
});
