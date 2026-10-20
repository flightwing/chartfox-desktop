const { defineConfig } = require('playwright/test');

module.exports = defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure'
  }
});
