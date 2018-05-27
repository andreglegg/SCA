import React, {Component} from 'react';

import classes from './App.module.scss'

import Window from '../../Containers/Window';
import Toolbar from '../../Components/Toolbar/Toolbar'
import Clients from '../../Components/Clients/Clients'
import Console from '../../Components/Console/Console'
import WatchJS from 'melanke-watchjs';

var watch = WatchJS.watch;
var unwatch = WatchJS.unwatch;
var callWatchers = WatchJS.callWatchers;
const remote = window.require('electron').remote;
const platform = require('platform');
const settings = remote.require('electron-settings');
const pjson = require('../../../package.json');
const ip = remote.getGlobal('ip');
let PORT = 5050;

const HOST = ip.address();

const server = remote.getGlobal('server');
const io = remote.getGlobal('io');

class App extends Component {

    state = {
        status : false,
        connectedClients: [],
        consoleOutput: []
    };

    componentCleanup() { // this will hold the cleanup code
        // whatever you want to do when the component is unmounted or page refreshes
        this.stopServer()
    }

    componentWillMount () {
        this.stopServer()
    }

    componentDidMount(){
        PORT = settings.get('settings').port;
        this.LOG("\nStar Citizen Assistant Server version: " + pjson.version + "\nOS version: " + platform.os + "\nStart the server then connect your client to " + HOST + ":" + PORT + "\n+-------------------------------------------------+");
        window.addEventListener('beforeunload', this.componentCleanup);
        io.on('connection', (socket) =>{
            this.LOG(socket.handshake.address.substr(7) + ' connected');
            this.setState({
                connectedClients: [...this.state.connectedClients , socket]
            });
            socket.on('ping', () => {
                //log('send pong');
                socket.emit('pong');
            });
            socket.on('sendTapKey', (data) => {
                this.LOG(data.key +' '+ data.action +' '+ data.compound)
            });
            socket.on('sendToggleKey', (data) =>{
                this.LOG(data.key +' '+ data.action +' '+ data.compound)
            });
            socket.on('disconnect', (data) => {
                this.LOG(data);
                window.require('electron').shell.beep();
                const clientsArray = [...this.state.connectedClients];
                const index = clientsArray.indexOf(socket);
                clientsArray.splice(index, 1);
                this.setState({
                    connectedClients: clientsArray
                });
            });
            socket.on('close', () => {
                this.LOG('socket closed');
                //socketlist.splice(socketlist.indexOf(socket), 1);
            });
        });
    }

    componentWillUnmount() {
        this.componentCleanup();
        window.removeEventListener('beforeunload', this.componentCleanup);
    }

    toggleServerHandler () {
        if (this.state.status) {
            this.stopServer();
            this.LOG('Server stopped')
        } else {
            remote.getGlobal('server').listen(PORT);
            this.LOG('Server started and listening on ' + HOST +':'+ PORT)
            //console.log(server.address());
            //console.log(server);
            //console.log(io)
        }
        const serverStatus = server.listening;
        this.setState({
            status: serverStatus
        });
    }

    stopServer () {
        //Stop Server
        Object.keys(io.sockets.sockets).forEach(function(s) {
            if (io.sockets.sockets[s]) {
                io.sockets.sockets[s].disconnect();
            }
        });
        io.close();
        server.close();
        /*Object.keys(io.sockets.connected).forEach(function (id) {
            io.sockets.connected[id].disconnect();
        });*/

        /*socketlist.forEach((socket)=>{
            socket.disconnect()
        });*/
        //socketlist.length = 0;
        const clients = [...this.state.connectedClients];
        clients.length = 0;
        this.setState({
            status: false,
            connectedClients: clients
        })
    }

    LOG(val){
        const dt = new Date();
        const timeStamp = dt.getUTCHours() + ":" + dt.getUTCMinutes() + ":" + dt.getUTCSeconds();
        console.log(val);
        const newConsoleArray = [...this.state.consoleOutput];
        newConsoleArray.push(timeStamp + ": ➤ " + val);
        this.setState({
            consoleOutput: newConsoleArray
        })
    }
    render() {
        return (
            <Window>
                <Toolbar clientCount={this.state.connectedClients.length} status={this.state.status} toggleServer={() => this.toggleServerHandler()}/>
                <div className={classes.Body}>
                     <Clients data={this.state.connectedClients}/>
                <Console output={this.state.consoleOutput}/>
                </div>
            </Window>
        );
    }
}

export default App;
