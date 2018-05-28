import React from 'react';
import { Icon } from 'react-icons-kit'
import {cross} from "react-icons-kit/icomoon/cross";

import classes from './Clients.module.scss';

const Clients = (props) => {
    const renderClientList = props.data.map((item, index) => {
        const address = item.handshake.address.substr(7);
        return(
                <li key={index} onClick={() => item.disconnect()}><span className={classes.Close}><Icon icon={cross}/></span>{address}</li>
        )
    });

    let Ul = null;
    if (renderClientList.length !== 0) {
        Ul = (<ul>{renderClientList}</ul>)
    }

    return (
        <div className={classes.Clients}>
            {Ul}
        </div>
    );
};

export default Clients;
