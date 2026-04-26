/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  globals: {
    __DEV__: 'development',
    'ts-jest': {
      tsconfig: {
        jsx: 'react',
      },
    },
  },
};
