import type { Config } from '@jest/types';

const jestConfig: Config.InitialOptions = {
  preset: 'ts-jest',
  roots: ['<rootDir>/src'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/**/index.*',
  ],
  coverageReporters: ['cobertura', 'text', 'lcov'],
  reporters: ['default', ['jest-junit', { outputName: './coverage/junit.xml' }]],
  testRunner: 'jest-circus/runner',
  testMatch: ['<rootDir>/src/**/*.test.{js,jsx,ts,tsx}'],
  testPathIgnorePatterns: ['/node_modules/', '/build/'],
  testEnvironment: 'jsdom',
  modulePaths: [],
  moduleDirectories: ['node_modules', 'src'],
  moduleFileExtensions: ['js', 'ts', 'tsx', 'json', 'jsx'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/jest/fileMocks.ts',
  },
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
  automock: false,
  resetMocks: false,
  globals: {
    IS_PROD: true,
    CI_PIPELINE_ID: 'ci-test',
    ENVIRONMENT: 'unit-test',
  },
};

export default jestConfig;