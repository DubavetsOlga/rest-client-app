import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BodyTypeInput } from '@/features/restClient/ui/tabs/bodyEditor/bodyTypeInput/BodyTypeInput';
import { useAppSelector } from '@/shared/store/hooks/useAppSelector';
import { useAppDispatch } from '@/shared/store/hooks/useAppDispatch';
import { setIsJsonMode } from '@/shared/store/reducers/restClientSlice';
import { selectIsJsonMode } from '@/shared/store/selectors/restClientSelectors';

jest.mock('@/shared/store/hooks/useAppDispatch', () => ({
  useAppDispatch: jest.fn(),
}));

jest.mock('@/shared/store/hooks/useAppSelector', () => ({
  useAppSelector: jest.fn(),
}));

describe('BodyTypeInput Component', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);

    (useAppSelector as jest.Mock).mockImplementation((selector) => {
      if (selector === selectIsJsonMode) return true;
      return {};
    });
  });

  it('should render JSON and alternative input options', () => {
    render(<BodyTypeInput />);

    const jsonRadioButton = screen.getByLabelText('JSON');
    expect(jsonRadioButton).toBeInTheDocument();
    expect(jsonRadioButton).toBeChecked();

    const alternativeRadioButton = screen.getByLabelText('Text');
    expect(alternativeRadioButton).toBeInTheDocument();
    expect(alternativeRadioButton).not.toBeChecked();
  });

  it('should dispatch setIsJsonMode with true when JSON option is selected', () => {
    (useAppSelector as jest.Mock).mockReturnValue(false);

    render(<BodyTypeInput />);

    const jsonRadioButton = screen.getByLabelText('JSON');
    fireEvent.click(jsonRadioButton);

    expect(mockDispatch).toHaveBeenCalledWith(setIsJsonMode(true));
  });

  it('should dispatch setIsJsonMode with false when alternative option is selected', () => {
    render(<BodyTypeInput />);

    const alternativeRadioButton = screen.getByLabelText('Text');
    fireEvent.click(alternativeRadioButton);

    expect(mockDispatch).toHaveBeenCalledWith(setIsJsonMode(false));
  });

  it('should render translated text from useLocale', () => {
    render(<BodyTypeInput />);
    expect(screen.getByText('Text')).toBeInTheDocument();
  });

  it('should not call dispatch when the selected option is already active', () => {
    render(<BodyTypeInput />);

    const jsonRadioButton = screen.getByLabelText('JSON');
    fireEvent.click(jsonRadioButton);

    expect(mockDispatch).not.toHaveBeenCalled();
  });
});
