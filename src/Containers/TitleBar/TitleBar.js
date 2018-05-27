import React from 'react';
import classes from './TitleBar.module.scss';

const remote = window.require('electron').remote;

const TitleBar = (props) => {

    return (
        <div className={classes.TitleBar}>
            <div className={classes.Title}>{props.title}</div>
            <div className={classes.TitleBarBtns}>
                {props.showMinButton ? <button className={classes.MinBtn} onClick={() => remote.getCurrentWindow().minimize()}>_</button> : null}
                {/*<button id="max-btn">+</button>*/}
                <button onClick={() => remote.getCurrentWindow().close()}>&#x2716;</button>
            </div>
        </div>
    );
};

export default TitleBar;
