const electron = require("electron");
const {app, BrowserWindow, ipcMain} = electron;
const {autoUpdater} = require("electron-updater");

const path = require('path');
const modal = require('electron-modal');

let mainWindow = null;

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("ready", () => {
    modal.setup();
    mainWindow = new BrowserWindow({
        width: 600,
        height: 415,
        resizable: false,
        show: false,
        frame: false
        //icon: path.join(__dirname, 'assets/icons/win/icon2.ico')
    });
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