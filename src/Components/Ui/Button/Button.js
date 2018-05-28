import React from 'react';


import classes from './Button.module.scss';

const Button = (props) => {
    const returnClass = () => {
        if (props.type === "connection") return props.status ? classes.Connected : classes.Disconnected;
    };
    return (
        <div>
        <a onClick={props.onClick}
           className={[classes.Button, returnClass()].join(' ')}>
            {props.children}
        </a>
        </div>
    );
};
export default Button