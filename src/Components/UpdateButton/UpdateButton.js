import React, {Component} from 'react'

import classes from './UpdateButton.module.scss'

const ipcRenderer = window.require('electron').ipcRenderer;


function precisionRound(number, precision) {
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
}

function formatBytes(a,b){if(0==a)return"0 Bytes";var c=1024,d=b||2,e=["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"],f=Math.floor(Math.log(a)/Math.log(c));return parseFloat((a/Math.pow(c,f)).toFixed(d))+" "+e[f]}

export default class UpdateButton extends Component {
    state = {
        showStatus: false,
        updateReady: false,
        updateMessage: '',
        downloadPercent: 0,
        downloadSpeed: 0,
        downloadingUpdate: false,
    }

    componentDidMount = () => {
        // wait for an updateReady message
        ipcRenderer.on('checking-for-update', (event, data) => {
            // ready to update
            //console.log('update ready')
            this.setState({
                showStatus: true,
                updateMessage: data.message
            })
        })

        ipcRenderer.on('update-available', (event, data) => {
            // ready to update
            //console.log('update ready')
            this.setState({
                downloadingUpdate: true,
                updateMessage: data.message
            })
        })

        ipcRenderer.on('update-not-available', (event, data) => {
            // ready to update
            //console.log('update ready')
            this.setState({
                showStatus: false,
                updateMessage: data.message
            })


        })

        ipcRenderer.on('download-progress', (event, data) => {
            // ready to update
            //console.log(data.percentDown)
            this.setState({
                updateMessage: 'Downloading update: ',
                downloadPercent: data.percentDown,
                downloadSpeed: data.speed
            })
        })

        ipcRenderer.on('update-downloaded', (event, data) => {
            // ready to update
            //console.log(data)
            this.setState({
                updateMessage: 'A new version is ready, click here to restart and update!',
                updateReady: true,
                downloadingUpdate: false,
            })
        })

        //Test animation
        /*setTimeout(
            () => this.setState({
                showStatus: true
            })
        , 2000)*/
    }

    update = () => {
        if (this.state.updateReady) {
            ipcRenderer.send('quitAndInstall')
            console.log('run update')
        }
    }

    render() {
        return (
            <React.Fragment>
                {this.state.showStatus ?
            <div className={classes.UpdateButton} onClick={() => this.update()}>
                <div style={{background: 'rgba(191, 167, 57, 0.1)', position: 'absolute', bottom: 0, left: 0, width: this.state.downloadPercent+'%', height: '29px', zIndex: 2, transition: 'all 300ms ease-in'}}>
                </div>
                <span style={{position: 'absolute', left: 0, right: 0, bottom: 0,zIndex: 3, padding:'6px'}}>
                    {this.state.updateMessage} {this.state.downloadingUpdate ? precisionRound(this.state.downloadPercent, -1)+'% at '+formatBytes(precisionRound(this.state.downloadSpeed, -1))+'/s' : null }
                </span>
            </div>
                    : null}
            </React.Fragment>
        )
    }
}