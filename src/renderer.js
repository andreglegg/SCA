const fs = require('fs');
const dotenv = require('dotenv');
const envConfig = dotenv.parse(fs.readFileSync('.env.override'));
for (var k in envConfig) {
    process.env[k] = envConfig[k]
}

var robot = require("robotjs");
const socketio = require('socket.io');
const http = require('http');
const platform = require('platform');
const pjson = require('../package.json');
const remote = require('electron').remote;
const {BrowserWindow} = require('electron').remote;
const buildEditorContextMenu = remote.require('electron-editor-context-menu');
const express = require('express');
const ip = require("ip");

const HOST = ip.address(); //'localhost'; //'10.0.0.136';
const PORT = 4242;
let status = false;
const app = express();
const server = http.Server(app);
const sock = socketio(server);

const bodyId = document.getElementById("body");
let minBtn = document.getElementById('min-btn');
let closeBtn = document.getElementById('close-btn');
let openWebLink = document.getElementById('btnWebLink');

let toggleServer = document.getElementById('btnToggleServer');
let textConsole = document.getElementById('console');
textConsole.value = "+-------------------------------------------------+\nStar Citizen Assistant Server version: " + pjson.version + "\nOS version: " + platform.os + "\nStart the server then connect your client to " + HOST + ":" + PORT+"\n+-------------------------------------------------+";

window.addEventListener('contextmenu', function (e) {
    // Only show the context menu in text editors.
    if (!e.target.closest('textarea, input, [contenteditable="true"]')) return;

    const menu = buildEditorContextMenu();

    // The 'contextmenu' event is emitted after 'selectionchange' has fired but possibly before the
    // visible selection has changed. Try to wait to show the menu until after that, otherwise the
    // visible selection will update after the menu dismisses and look weird.
    setTimeout(function () {
        menu.popup(remote.getCurrentWindow());
    }, 30);
});

function startServer() {


    log("Waiting for connection....");
    // Create a server instance, and chain the listen function to it
// The function passed to net.createServer() becomes the event handler for the 'connection' event
// The sock object the callback function receives UNIQUE for each connection
    server.listen(PORT, () => log('Listening on '+ HOST +':'+PORT), {
        'sync disconnect on unload': true });

    console.log(server);
    //server = net.createServer(function(sock) {

    // We have a connection - a socket object is assigned to the connection automatically
    //console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);
    //log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);
    // Add a 'data' event handler to this instance of socket

}

sock.on('connection', (socket) => {

    socket.emit('connected', 'Connected to server');
    //log(sock);
    let clientAddress = socket.handshake.address;
    //const serverAddress = socket.handshake.headers.host;
    if (clientAddress.substr(0, 7) == "::ffff:") {
        clientAddress = clientAddress.substr(7)
    }

    socket.on('message', (data) => {

        //console.log('DATA ' + sock.remoteAddress + ': ' + data);
        log('KEY: ' + data);
        // Write the data back to the socket, the client will receive it as data from the server
        socket.emit('response', 'You pressed: "' + data + '"');
        sendKey(data);

    });

    socket.on('connected', (data) => {
        log('Client connected from ' + clientAddress);
        socket.emit('connected', 'Connected to server');

    });

    socket.on('disconnect', (reason) => {

        log('Client disconnected');
        Object.keys(sock.sockets.connected).forEach(function(id) {
            log('removing : '+id);
            sock.sockets.connected[id].disconnect();
        });

        socket.disconnect();

    });

    /*socket.on('disconnectFromClient', (data) => {
        log('Client '+data);
        log('Client closed connection from: '+clientAddress);
        socket.emit('disconnectFromClient', 'Client closed connection');

    });*/
});

function sendKey(key) {
    robot.keyTap(key);
}

function stopServer() {
    //console.log("Server Closed");
    sock.close();
    server.close();
    log("Server stopped");
}

function toggleServerHandler() {
    //console.log("clicked: " + status);
    if (!status) {
        status = true;
        toggleServer.innerHTML = 'Stop';
        toggleServer.classList.toggle('btnOn');
        toggleServer.classList.toggle('btnOff');
        startServer()
    } else {
        status = false;
        toggleServer.innerHTML = 'Start';
        toggleServer.classList.toggle('btnOn');
        toggleServer.classList.toggle('btnOff');
        stopServer()
    }
}

function addline(sometext) {
    var curtext = textConsole.value;
    var newtext = curtext + "\n" + sometext;
    textConsole.value = newtext;
    textConsole.scrollTop = textConsole.scrollHeight;
}

function log(text) {
    var dt = new Date();
    var timeStamp = dt.getUTCHours() + ":" + dt.getUTCMinutes() + ":" + dt.getUTCSeconds();
    console.log(text);
    addline(timeStamp + ": " + text);
}

const cats = [
    "./images/backgrounds/bg1.jpg",
    "./images/backgrounds/bg2.jpg"
];


const cycleImages = (bgNum, step) => {
    bodyId.classList.toggle('bg'+bgNum);
    let num = Math.floor(Math.random() * 8) + 1;
    bodyId.classList.toggle('bg'+num);
    setTimeout(() => cycleImages(num,step), step * 2)
};

cycleImages(1,30000);


toggleServer.addEventListener('click', toggleServerHandler);
minBtn.addEventListener('click', ()=>{
    let window = remote.getCurrentWindow();
    window.minimize();
});
closeBtn.addEventListener('click', ()=>{
    let window = remote.getCurrentWindow();
    window.close();
});
openWebLink.addEventListener('click', ()=>{
    require('electron').shell.openExternal("http://sca.andreglegg.no")
});

