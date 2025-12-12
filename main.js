const { app, BrowserWindow, Menu, shell, dialog } = require("electron");
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
      webSecurity: false // Disables CORS restrictions, similar to the extension's rule.json
    }
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
