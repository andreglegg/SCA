import React from 'react';
import styles from 'react-awesome-button/src/styles/themes/theme-blue';


import classes from './Button.module.scss';

const Button = (props) => {
    const returnClass = () => {
        if (props.type === "connection") return props.status ? classes.Connected : classes.Disconnected;
    };
    return (
        <a href='#' onClick={props.onClick}
           className={[classes.Button, returnClass()].join(' ')}>
            {props.children}
        </a>
    );
};
export default Button