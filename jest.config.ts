import nextJest from 'next/jest';

module.exports = nextJest({
  dir: './',
})({
  preset: 'ts-jest/presets/js-with-babel',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '^next-intl/(.*)$': '<rootDir>/src/__mocks__/next-intl.tsx',
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'],
  collectCoverageFrom: [
    '**/*.tsx',
    '!**/*.config.ts',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/*.test.tsx',
    '!**/*.spec.tsx',
    '!src/__tests__/setup.ts',
  ],
});
