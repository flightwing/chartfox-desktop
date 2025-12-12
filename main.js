const { app, BrowserWindow, Menu, shell, dialog, session } = require("electron");
const { autoUpdater } = require("electron-updater");
const path = require("path");

let mainWindow;
const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36';

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    show: false,
    icon: path.join(__dirname, "logo.png"),
    webPreferences: {
      preload: __dirname + "/preload.js",
      webSecurity: true, // Re-enable webSecurity for Cloudflare Turnstile
      sandbox: false // Disable renderer sandbox to allow Turnstile iframe permissions
    }
  });

  // Intercept headers to bypass CORS for charts while keeping webSecurity enabled
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    const responseHeaders = { ...details.responseHeaders };

    // Replace CORS headers instead of adding to them to avoid duplicates
    responseHeaders['Access-Control-Allow-Origin'] = ['*'];
    responseHeaders['Access-Control-Allow-Headers'] = ['*'];
    responseHeaders['Access-Control-Allow-Methods'] = ['*'];

    callback({ responseHeaders });
  });

  mainWindow.webContents.userAgent = userAgent;

  mainWindow.maximize();
  mainWindow.show();

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
              message: 'ChartFox Desktop v0.1.0',
              detail: 'A lightweight, standalone desktop client for ChartFox – the free aeronautical chart aggregator for flight simulation.\n\nNot affiliated with ChartFox or Cobalt Grid.\n\nDeveloped by flightwing.',
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
