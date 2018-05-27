import React, {Component} from 'react';
import Modal from '../../Containers/Modal';
import classes from './Settings.module.scss'

const remote = window.require('electron').remote;
const settings = remote.require('electron-settings');
const defaultPort = '4242';

class Settings extends Component {

    componentDidMount() {
        this.Setup()
        // Do stuff!
    }

    Setup() {
        const portInput = this.refs.portInput;
        let theVar =  settings.get('settings');
        //console.log(theVar.port);
        if (!theVar) {
            settings.set('foo', { port: defaultPort });
            portInput.value = defaultPort;
        }else {
            portInput.value = theVar.port;
        }
    }

    _portChangeHandler = (event) => {
        settings.set('settings', { port: event.target.value });
    };

    render() {
        return (
            <Modal>
                <div className={classes.Settings}>
                    <h4>Edit Port</h4>
                    <input
                        className={classes.PortInput}
                        type="text"
                        ref='portInput'
                        placeholder={'4242'}
                    onChange={this._portChangeHandler}/>
                    <p><small>*Settings are saved automatically. <br/>*Restart the server for changes to take effect.</small></p>
                </div>
            </Modal>
        )
    }
};

export default Settings;