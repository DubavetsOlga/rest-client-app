import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { HttpMethod, HttpMethodType } from '@/shared/models/httpMethod';
import { setMethod } from '@/shared/store/reducers/restClientSlice';
import { MethodSelect } from '@/features/restClient/ui/requestForm/methodSelect/MethodSelect';

jest.mock('@/shared/store/hooks/useAppSelector', () => ({
  useAppSelector: jest.fn(),
}));

describe('MethodSelect Component', () => {
  const mockUseAppSelector =
    require('@/shared/store/hooks/useAppSelector').useAppSelector;
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseAppSelector.mockImplementation((selector: { name: string }) => {
      if (selector.name === 'selectMethod') {
        return HttpMethod.GET;
      }
      return undefined;
    });
  });

  const renderComponent = (method: HttpMethodType = HttpMethod.GET) => {
    mockUseAppSelector.mockImplementation((selector: { name: string }) => {
      if (selector.name === 'selectMethod') {
        return method;
      }
      return undefined;
    });

    const store = configureStore({
      reducer: {
        restClientSlice: () => ({}),
      },
    });
    store.dispatch = mockDispatch;

    return render(
      <Provider store={store}>
        <MethodSelect />
      </Provider>
    );
  };

  it('renders correctly with initial state', () => {
    renderComponent();

    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue(HttpMethod.GET);
    expect(select).toHaveAttribute('aria-label', 'Method');
  });

  it('renders all HTTP method options', () => {
    renderComponent();

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(Object.values(HttpMethod).length);

    Object.values(HttpMethod).forEach((method) => {
      expect(screen.getByText(method)).toBeInTheDocument();
    });
  });

  it('dispatches setMethod action when selection changes', () => {
    renderComponent();

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: HttpMethod.POST } });

    expect(mockDispatch).toHaveBeenCalledWith(setMethod(HttpMethod.POST));
  });

  it('updates value when method changes', () => {
    const { rerender } = renderComponent();
    expect(screen.getByRole('combobox')).toHaveValue(HttpMethod.GET);

    mockUseAppSelector.mockImplementation((selector: { name: string }) => {
      if (selector.name === 'selectMethod') {
        return HttpMethod.PUT;
      }
      return undefined;
    });
    rerender(
      <Provider
        store={configureStore({ reducer: { restClientSlice: () => ({}) } })}
      >
        <MethodSelect />
      </Provider>
    );

    expect(screen.getByRole('combobox')).toHaveValue(HttpMethod.PUT);
  });

  it('applies correct CSS classes based on method', () => {
    const { container } = renderComponent(HttpMethod.GET);
    const select = container.querySelector('select');
    expect(select).toHaveClass('select');
    expect(select).toHaveClass('get');

    const { container: putContainer } = renderComponent(HttpMethod.PUT);
    const putSelect = putContainer.querySelector('select');
    expect(putSelect).toHaveClass('select');
    expect(putSelect).toHaveClass('put');
  });

  it('applies correct CSS classes to options', () => {
    renderComponent();

    Object.values(HttpMethod).forEach((method) => {
      const option = screen.getByText(method);
      expect(option).toHaveClass(method.toLowerCase());
    });
  });
});
