import { jest } from '@jest/globals';

export const useRouter = jest.fn(() => ({
  push: jest.fn(),
  replace: jest.fn(),
}));

export const usePathname = jest.fn(() => '/');
export const notFound = jest.fn();
