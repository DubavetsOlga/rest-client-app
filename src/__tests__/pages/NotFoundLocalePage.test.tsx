import { render, screen } from '@testing-library/react';
import Page from '@/app/[locale]/not-found';
import '@testing-library/jest-dom';

jest.mock('@/widgets/notFound/NotFound', () => ({
  NotFound: ({ text, linkText }: { text: string; linkText: string }) => (
    <div data-testid="not-found">
      <span>{text}</span>
      <a>{linkText}</a>
    </div>
  ),
}));

describe('Page (NotFound)', () => {
  it('renders NotFound with translated text and linkText', () => {
    render(<Page />);

    expect(screen.getByTestId('not-found')).toBeInTheDocument();
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    expect(screen.getByText('Go to Main')).toBeInTheDocument();
  });
});
