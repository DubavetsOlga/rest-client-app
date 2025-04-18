import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Tabs } from '@/features/restClient/ui/tabs/Tabs';
import restClientReducer from '@/shared/store/reducers/restClientSlice';

jest.mock('@/features/restClient/ui/tabs/codeGenerator/CodeGenerator', () => ({
  CodeGenerator: () => <div>Mocked Code Generator</div>,
}));

describe('Tabs Component', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: { restClientReducer },
    });
  });

  it('renders all tabs correctly', () => {
    render(
      <Provider store={store}>
        <Tabs />
      </Provider>
    );

    expect(screen.getByText('Headers')).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
    expect(screen.getByText('Code')).toBeInTheDocument();
  });

  it('sets the first tab as active by default', () => {
    render(
      <Provider store={store}>
        <Tabs />
      </Provider>
    );

    const headersTab = screen.getByText('Headers');
    expect(headersTab).toHaveClass('activeTab');
  });

  it('switches between tabs when clicked', () => {
    render(
      <Provider store={store}>
        <Tabs />
      </Provider>
    );

    const headersTab = screen.getByText('Headers');
    const bodyTab = screen.getByText('Body');
    const codeTab = screen.getByText('Code');

    expect(headersTab).toHaveClass('activeTab');
    expect(screen.getByText('Body')).not.toHaveClass('activeTab');
    expect(screen.getByText('Code')).not.toHaveClass('activeTab');

    fireEvent.click(codeTab);
    expect(codeTab).toHaveClass('activeTab');
    expect(bodyTab).not.toHaveClass('activeTab');
    expect(headersTab).not.toHaveClass('activeTab');

    expect(screen.getByText('Mocked Code Generator')).toBeInTheDocument();
  });

  it('displays correct content when a tab is active', () => {
    render(
      <Provider store={store}>
        <Tabs />
      </Provider>
    );

    expect(screen.getByText('Headers')).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
    expect(screen.getByText('Code')).toBeInTheDocument();
    expect(screen.getByText('Headers')).toBeVisible();
  });
});
