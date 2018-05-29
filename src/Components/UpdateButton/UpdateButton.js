import React, {Component} from 'react'

import classes from './UpdateButton.module.scss'

const ipcRenderer = window.require('electron').ipcRenderer;

export default class UpdateButton extends Component {
    state = {
        updateReady: false,
        updateMessage: 'A new version is ready, click here to restart and update!'
    }

    componentDidMount = () => {
        // wait for an updateReady message
        ipcRenderer.on('updateReady', (event, text) => {
            // ready to update
            //console.log('update ready')
            this.setState({
                updateReady: true
            })
        })

        //Test animation
        /*setTimeout(
            () => this.setState({
                updateReady: true
            })
        , 2000)*/
    }

    update = () => {
        ipcRenderer.send('quitAndInstall')
        console.log('run update')
    }

    render() {
        return (
            <div className={classes.UpdateButton} onClick={() => this.update()}>
                {this.state.updateReady ? this.state.updateMessage : null}
            </div>
        )


    }
}