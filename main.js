const { app, BrowserWindow, Menu, shell, dialog, session } = require("electron");
const { autoUpdater } = require("electron-updater");
const path = require("path");
const Store = require("electron-store");

// Environment detection
const isDev = process.env.NODE_ENV === 'development';

// Enable hot reload in development mode
if (isDev) {
  try {
    require('electron-reload')(__dirname, {
      electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
      hardResetMethod: 'exit'
    });
    console.log('[DEV] Hot reload enabled');
  } catch (err) {
    console.log('[DEV] electron-reload not found, hot reload disabled');
  }
}

let mainWindow;
const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36';
const store = new Store.default();

function createWindow() {
  // Get saved window bounds or use defaults
  const windowBounds = store.get("windowBounds", {
    width: 900,
    height: 700
  });

  mainWindow = new BrowserWindow({
    ...windowBounds,
    show: false,
    icon: path.join(__dirname, "logo.png"),
    webPreferences: {
      preload: __dirname + "/preload.js",
      webSecurity: true,
      sandbox: false
    }
  });

  // Intercept headers to bypass CORS for charts while keeping webSecurity enabled
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    const url = details.url;
    const responseHeaders = { ...details.responseHeaders };

    // Add CORS headers to all resources (except Cloudflare auth pages)
    if (!url.includes('challenges.cloudflare.com')) {
      // Clear any existing CORS headers to avoid conflicts
      Object.keys(responseHeaders).forEach(key => {
        if (key.toLowerCase().startsWith('access-control')) {
          delete responseHeaders[key];
        }
      });

      // Set CORS headers to allow requests from chartfox origin
      responseHeaders['access-control-allow-origin'] = ['https://chartfox.org'];
      responseHeaders['access-control-allow-credentials'] = ['true'];
      responseHeaders['access-control-allow-methods'] = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'];
      responseHeaders['access-control-allow-headers'] = ['Content-Type', 'Authorization', 'X-XSRF-Token', 'X-Requested-With'];
      responseHeaders['access-control-expose-headers'] = ['Content-Length', 'Content-Type'];
      responseHeaders['access-control-max-age'] = ['86400'];
    }

    callback({ responseHeaders });
  });

  // Intercept requests to add necessary headers for Cloudflare
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    let requestHeaders = { ...details.requestHeaders };

    // Ensure proper headers for Cloudflare challenge
    requestHeaders['User-Agent'] = userAgent;
    requestHeaders['Accept-Language'] = 'en-US,en;q=0.9';
    requestHeaders['Accept'] = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8';
    requestHeaders['Accept-Encoding'] = 'gzip, deflate, br';
    requestHeaders['Cache-Control'] = 'max-age=0';
    requestHeaders['Sec-Fetch-Dest'] = 'document';
    requestHeaders['Sec-Fetch-Mode'] = 'navigate';
    requestHeaders['Sec-Fetch-Site'] = 'none';
    requestHeaders['Upgrade-Insecure-Requests'] = '1';

    callback({ requestHeaders });
  });

  mainWindow.webContents.userAgent = userAgent;

  // Enable persistent cookies for Cloudflare challenge
  session.defaultSession.cookies.on('changed', () => {
    // Cookies will be automatically persisted
  });

  // Disable cache to ensure fresh Cloudflare challenges are fetched
  mainWindow.webContents.session.clearCache();

  // Check if this is the first launch
  const isFirstLaunch = store.get("isFirstLaunch", true);

  if (isFirstLaunch) {
    // First launch: maximize the window
    mainWindow.maximize();
    store.set("isFirstLaunch", false);
  }

  mainWindow.show();

  // Open DevTools automatically in development mode
  if (isDev) {
    mainWindow.webContents.openDevTools();
    console.log('[DEV] DevTools opened automatically');
  }

  // Save window bounds when resized or moved
  const saveWindowBounds = () => {
    if (!mainWindow.isMaximized() && !mainWindow.isMinimized() && !mainWindow.isFullScreen()) {
      store.set("windowBounds", mainWindow.getBounds());
    }
  };

  mainWindow.on("resize", saveWindowBounds);
  mainWindow.on("move", saveWindowBounds);

  mainWindow.loadURL("https://chartfox.org/");
}

function createMenu() {
  const template = [
    { role: 'fileMenu' },
    { role: 'editMenu' },
    { role: 'viewMenu' },
    { role: 'windowMenu' },
    {
      role: 'help',
      submenu: [
        {
          label: 'Report a bug',
          click: async () => {
            await shell.openExternal('https://github.com/flightwing/chartfox-desktop/issues');
          }
        },
        {
          label: 'About ChartFox Desktop',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About ChartFox Desktop',
              message: 'ChartFox Desktop',
              detail: 'A lightweight, standalone desktop client for ChartFox – the free aeronautical chart aggregator for flight simulation.\n\nNot affiliated with ChartFox or Cobalt Grid.\n\nDeveloped by flightwing.org.',
              buttons: ['OK'],
              icon: path.join(__dirname, "logo.png")
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.on("ready", () => {
  createMenu();
  createWindow();

  autoUpdater.checkForUpdatesAndNotify();
});

autoUpdater.on("update-downloaded", () => {
  autoUpdater.quitAndInstall();
});
