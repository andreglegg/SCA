import React from 'react';
import { Icon } from 'react-icons-kit'
import {cross} from "react-icons-kit/icomoon/cross";

import classes from './Clients.module.scss';

const Clients = (props) => {
    const renderClientList = props.data.map((item, index) => {
        const address = item.handshake.address.substr(7);
        return(
            <ul key={index}>
                <li onClick={() => item.disconnect()}><span className={classes.Close}><Icon icon={cross}/></span>{address}</li>
            </ul>
        )
    });
    return (
        <div className={classes.Clients}>
            {renderClientList}
        </div>
    );
};

export default Clients;
