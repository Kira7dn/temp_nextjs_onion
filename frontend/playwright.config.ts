// frontend/playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: ['**/*.spec.ts'],
  timeout: 60_000,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  outputDir: 'test-results/artifacts',
  reporter: [
    ['list'],
    ['html', { outputFolder: 'test-results/html', open: 'never' }],
    ['junit', { outputFile: 'test-results/junit/results.xml' }],
  ],
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
