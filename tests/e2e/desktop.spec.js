const { test, expect, _electron: electron } = require('playwright/test');
const fs = require('fs');
const http = require('http');
const os = require('os');
const path = require('path');

function startFixture() {
  const server = http.createServer((request, response) => {
    const isAirportPage = request.url === '/airport/LKPR';
    response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    response.end(`<!doctype html>
      <title>${isAirportPage ? 'LKPR charts' : 'ChartFox test home'}</title>
      <main>
        <h1>${isAirportPage ? 'Prague airport charts' : 'ChartFox test home'}</h1>
        ${isAirportPage ? '<a href="/">Back</a>' : '<a href="/airport/LKPR">Open Prague charts</a>'}
      </main>`);
  });

  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      resolve({ server, url: `http://127.0.0.1:${port}/` });
    });
  });
}

test('opens the desktop window and follows a chart link', async () => {
  const fixture = await startFixture();
  const profileDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chartfox-e2e-'));
  let app;

  try {
    app = await electron.launch({
      args: ['.'],
      cwd: path.resolve(__dirname, '../..'),
      env: {
        ...process.env,
        E2E_TEST: '1',
        E2E_USER_DATA_DIR: profileDir,
        CHARTFOX_URL: fixture.url
      }
    });

    const window = await app.firstWindow();
    await expect(window.getByRole('heading', { name: 'ChartFox test home' })).toBeVisible();
    await window.getByRole('link', { name: 'Open Prague charts' }).click();
    await expect(window).toHaveURL(/\/airport\/LKPR$/);
    await expect(window.getByRole('heading', { name: 'Prague airport charts' })).toBeVisible();
  } finally {
    await app?.close();
    await new Promise((resolve) => fixture.server.close(resolve));
    fs.rmSync(profileDir, { recursive: true, force: true });
  }
});

test('opens the live ChartFox sign-in flow and redirects to VATSIM', async () => {
  test.skip(process.env.LIVE_E2E !== '1', 'Run with npm run test:e2e:live');

  const profileDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chartfox-live-e2e-'));
  let app;

  try {
    app = await electron.launch({
      args: ['.'],
      cwd: path.resolve(__dirname, '../..'),
      env: {
        ...process.env,
        E2E_TEST: '1',
        E2E_USER_DATA_DIR: profileDir
      }
    });

    const window = await app.firstWindow();
    await expect(window).toHaveTitle(/ChartFox/i);
    await window.getByRole('link', { name: /sign in/i }).first().click();
    await expect(window).toHaveURL(/\/login$/);
    await window.getByRole('button', { name: /sign in with/i }).click();
    await expect(window).toHaveURL(/^https:\/\/auth\.vatsim\.net\/login/);
  } finally {
    await app?.close();
    fs.rmSync(profileDir, { recursive: true, force: true });
  }
});
