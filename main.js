const electron = require("electron");
const {app, BrowserWindow, ipcMain} = electron;
const {autoUpdater} = require("electron-updater");

let mainWindow = null;

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("ready", () => {
    mainWindow = new BrowserWindow({width: 450, height: 315, resizable: false, show: false, frame: false});
    mainWindow.loadURL(`file://${ __dirname }/src/index.html`);
    //mainWindow.webContents.openDevTools();
    mainWindow.once("ready-to-show", () => {
        mainWindow.show();
    });
    mainWindow.on("closed", () => {
        mainWindow = null;
    });
    autoUpdater.checkForUpdates();
});

// when the update has been downloaded and is ready to be installed, notify the BrowserWindow.
autoUpdater.on('update-downloaded', (info) => {
    mainWindow.webContents.send('updateReady')
});

// when receiving a quitAndInstall signal, quit and install the new version ;)
ipcMain.on("quitAndInstall", (event, arg) => {
    autoUpdater.quitAndInstall();
});