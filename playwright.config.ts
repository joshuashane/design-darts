import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/playwright',
  use: {
    baseURL: 'http://localhost:3333',
  },
  webServer: {
    command: 'npx serve . -p 3333',
    url: 'http://localhost:3333',
    reuseExistingServer: true,
  },
});
