const electron = require('electron');
const { ipcMain } = require('electron');
const {autoUpdater} = require("electron-updater");
const isDev = require('electron-is-dev');

const app = electron.app;

const log = require('electron-log');
const path = require('path');
const url = require('url');

global.server = require('http').createServer();
global.io = require('socket.io')(global.server);
global.ip = require("ip");
global.sharedObj = {status: false};
global.ks = require('./key-sender');
global.settingsPath = isDev ? 'http://localhost:3000?settings' : `file://${path.join(__dirname, '../build/index.html?settings')}`;
let connectionStatus = false;

/*io.on('connection', function(client){
    console.log('connected to server');
    connectionStatus = true;
    global.sharedObj.status = true
    client.on('sendTapKey', function(data){
        console.log(data)
    });
    client.on('disconnect', function(){

    });
});*/


/*const { ipcMain } = require('electron');
//ipcMain.on('startServer', () => global.server.listen(4242));
ipcMain.on('stopServer', () => {
    Object.keys(io.sockets.connected).forEach(function (id) {
        //log(reason);
        io.sockets.connected[id].disconnect();
    });
    connectionStatus = false;
    global.sharedObj = false;
    global.server.close()
});*/

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');


// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;



// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function sendStatusToWindow(tag, data) {
    log.info(data);
    mainWindow.webContents.send(tag, data);
}

function createWindow () {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 600,
        height: 415,
        resizable: false,
        show: false,
        frame: false
    });

    // load the index.html of the app.
    /*const startUrl = process.env.ELECTRON_START_URL || url.format({
        pathname: isDev ? 'http://localhost:3000?main' : `file://${path.join(__dirname, '../build/index.html?viewA')}`
        //protocol: 'file:',
        //slashes: true
    });*/
    mainWindow.loadURL(isDev ? 'http://localhost:3000?main' : `file://${path.join(__dirname, '../build/index.html?main')}`);

    // Open the DevTools.

    //mainWindow.webContents.openDevTools();

    mainWindow.once("ready-to-show", () => {
        mainWindow.show();
    });
    mainWindow.on("closed", () => {
        mainWindow = null;
    });
    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}

//autoUpdater.checkForUpdates();
autoUpdater.on('checking-for-update', () => {
    sendStatusToWindow('checking-for-update',{message: 'Checking for update...'});
})
autoUpdater.on('update-available', (info) => {
    sendStatusToWindow('update-available',{message: 'Update available.'});
    //appUpdater.downloadUpdate();
    //appUpdater.downloadUpdate(cancellationToken)
    autoUpdater.downloadUpdate()
})
autoUpdater.on('update-not-available', (info) => {
    sendStatusToWindow('update-not-available',{message: 'Update not available.'});
})
autoUpdater.on('error', (err) => {
    sendStatusToWindow('error',{message: 'Error in auto-updater. ' + err});
})
autoUpdater.on('download-progress', (progressObj) => {
    /*let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';*/
    sendStatusToWindow('download-progress',{percentDown: progressObj.percent, speed: progressObj.bytesPerSecond });
})
// when the update has been downloaded and is ready to be installed, notify the BrowserWindow
autoUpdater.on('update-downloaded', (info) => {
    sendStatusToWindow('update-downloaded',{message: 'updateReady'})
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function () {
    //autoUpdater.checkForUpdates();

    createWindow()
    mainWindow.webContents.on('did-finish-load', () => {
        autoUpdater.autoDownload = false;
        autoUpdater.allowPrerelease = true;
        autoUpdater.checkForUpdatesAndNotify();

    })
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
});




// when receiving a quitAndInstall signal, quit and install the new version ;)
ipcMain.on("quitAndInstall", (event, arg) => {
    autoUpdater.quitAndInstall();
})
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.