const { app, BrowserWindow } = require("electron");
const { autoUpdater } = require("electron-updater");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: __dirname + "/preload.js",
      webSecurity: false // Disables CORS restrictions, similar to the extension's rule.json
    }
  });

  mainWindow.loadURL("https://chartfox.org/");
}

app.on("ready", () => {
  createWindow();

  autoUpdater.checkForUpdatesAndNotify();
});

autoUpdater.on("update-downloaded", () => {
  autoUpdater.quitAndInstall();
});
