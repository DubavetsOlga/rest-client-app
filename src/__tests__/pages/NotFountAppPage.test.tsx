import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Page from '@/app/not-found';

jest.mock('@/widgets/notFound/NotFound', () => ({
  NotFound: () => <div data-testid="not-found">Not Found</div>,
}));

describe('Page component', () => {
  it('renders NotFound component', () => {
    render(<Page />);

    expect(screen.getByTestId('not-found')).toBeInTheDocument();
    expect(screen.getByText('Not Found')).toBeInTheDocument();
  });
});
