import { render, act } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import NProgress from 'nprogress';
import LoadingProvider from '@/shared/providers/loadingProvider';

jest.mock('nprogress', () => ({
  start: jest.fn(),
  done: jest.fn(),
  configure: jest.fn(),
}));

describe('LoadingProvider', () => {
  const mockUsePathname = usePathname as jest.Mock;
  const originalWindow = window;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePathname.mockReturnValue('/');
  });

  afterAll(() => {
    global.window = originalWindow;
  });

  it('should start NProgress when pathname changes', () => {
    render(<LoadingProvider />);
    expect(NProgress.start).toHaveBeenCalledTimes(1);

    act(() => {
      mockUsePathname.mockReturnValue('/new-route');
      render(<LoadingProvider />, { wrapper: ({ children }) => children });
    });

    expect(NProgress.start).toHaveBeenCalledTimes(2);
  });

  it('should complete NProgress after timeout', () => {
    jest.useFakeTimers();

    render(<LoadingProvider />);
    expect(NProgress.start).toHaveBeenCalled();
    expect(NProgress.done).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(NProgress.done).toHaveBeenCalled();
    jest.useRealTimers();
  });

  it('should clean up NProgress and timeout on unmount', () => {
    jest.useFakeTimers();
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

    const { unmount } = render(<LoadingProvider />);
    expect(NProgress.start).toHaveBeenCalled();

    act(() => {
      unmount();
    });

    expect(NProgress.done).toHaveBeenCalled();
    expect(clearTimeoutSpy).toHaveBeenCalled();
    jest.useRealTimers();
    clearTimeoutSpy.mockRestore();
  });
});
