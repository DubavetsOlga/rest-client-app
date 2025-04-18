import { render, screen } from '@testing-library/react';
import { VariablesListHeader } from '@/features/variables/ui/variablesListHeader/VariablesListHeader';
import '@testing-library/jest-dom';

describe('VariablesListHeader', () => {
  const mockOnChange = jest.fn();

  const defaultProps = {
    value: '',
    onChange: mockOnChange,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    render(<VariablesListHeader {...defaultProps} />);

    expect(screen.getByText('Variable')).toBeInTheDocument();
    expect(screen.getByText('Value')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Filter variables')).toBeInTheDocument();
  });

  it('displays the correct initial value', () => {
    render(<VariablesListHeader value="test filter" onChange={mockOnChange} />);

    const input = screen.getByPlaceholderText('Filter variables');
    expect(input).toHaveValue('test filter');
  });

  it('has the correct input type', () => {
    render(<VariablesListHeader {...defaultProps} />);

    const input = screen.getByPlaceholderText('Filter variables');
    expect(input).toHaveAttribute('type', 'search');
  });
});
