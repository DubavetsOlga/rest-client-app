import { render, screen } from '@testing-library/react';
import { EmptyHistory } from '@/features/history/ui/emptyHistory/EmptyHistory';
import '@testing-library/jest-dom';

describe('EmptyHistory', () => {
  it('renders empty history messages and button', () => {
    render(<EmptyHistory />);

    expect(
      screen.getByText("You haven't executed any requests.")
    ).toBeInTheDocument();
    expect(screen.getByText("It's empty here. Try:")).toBeInTheDocument();

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
  });
});
