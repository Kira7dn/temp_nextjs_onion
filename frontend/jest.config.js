// frontend/jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './', // Next.js app nằm ngay trong thư mục frontend/
});

const customJestConfig = {
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/jest.polyfills.ts'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@domain/(.*)$': '<rootDir>/src/domain/$1',
    '^@application/(.*)$': '<rootDir>/src/application/$1',
    '^@infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
    '^@presentation/(.*)$': '<rootDir>/src/presentation/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
  },
  testPathIgnorePatterns: ['/node_modules/', '/tests/e2e/'],
  collectCoverage: true,
  coverageDirectory: 'test-results/coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  reporters: [
    'default',
    ['jest-junit', { outputDirectory: 'test-results/junit', outputName: 'jest-junit.xml' }],
  ],
};

module.exports = createJestConfig(customJestConfig);
