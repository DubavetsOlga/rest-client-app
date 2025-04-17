import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BodyEditor } from '@/features/restClient/ui/tabs/bodyEditor/BodyEditor';
import { useAppDispatch } from '@/shared/store/hooks/useAppDispatch';
import { useAppSelector } from '@/shared/store/hooks/useAppSelector';
import {
  selectBody,
  selectIsJsonMode,
} from '@/shared/store/selectors/restClientSelectors';
import React from 'react';

jest.mock('@/shared/store/hooks/useAppDispatch');
jest.mock('@/shared/store/hooks/useAppSelector');
jest.mock('@/shared/utils/getBeautifiedJson', () => ({
  getBeautifiedJson: jest.fn(),
}));

jest.mock(
  '@uiw/react-codemirror',
  () =>
    ({
      value,
      onChange,
      onBlur,
      className,
    }: {
      value: string;
      onChange: (newValue: string) => void;
      onBlur: () => void;
      className: string;
    }) => (
      <div data-testid="mock-code-mirror">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={className}
        />
      </div>
    )
);

describe('BodyEditor Component', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useAppSelector as jest.Mock) = jest.fn((selector) => {
      if (selector === selectBody) return '{ "key": "value" }';
      if (selector === selectIsJsonMode) return true;
      return {};
    });
  });

  it('should update value on editor change', () => {
    render(<BodyEditor />);

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, {
      target: { value: '{ "newKey": "newValue" }' },
    });

    expect(textarea).toHaveValue('{ "newKey": "newValue" }');
  });
});
