import React from 'react';
import classes from './Toolbar.module.scss'
import Button from '../Ui/Button/Button'

var remote = window.require('electron').remote;
const path = remote.getGlobal('settingsPath');

const Toolbar = (props) => {
    const connectText = props.status ? "Online [" + props.clientCount + "]" : "Offline";
    const isDev = () => {
        return !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
    };

    function openModal() {
        let win = new remote.BrowserWindow({
            parent: remote.getCurrentWindow(),
            modal: true,
            width: 450,
            height: 250,
            resizable: false,
            frame: false,
            show: false
            // icon: path.join(__dirname, 'assets/icons/win/icon2.ico')
        });
        //win.webContents.openDevTools();
        win.loadURL(path);
        win.once("ready-to-show", () => {
            win.show();
        });
        win.on("closed", () => {
            win = null;
        });
        // Emitted when the window is closed.
        win.on('closed', function () {
            // Dereference the window object, usually you would store windows
            // in an array if your app supports multi windows, this is the time
            // when you should delete the corresponding element.
            win = null
        })
    }

    return (
        <div className={classes.Toolbar}>
            <div className={classes.ConnectWrap}><Button type="connection" status={props.status} onClick={props.toggleServer}> {connectText}  </Button></div>
            <div className={classes.Space}></div>
            <Button onClick={() => window.require('electron').shell.openExternal("http://sca.andreglegg.no")}> Help </Button>
            <Button onClick={() => openModal()}> Settings </Button>
        </div>
    );
};

export default Toolbar;


