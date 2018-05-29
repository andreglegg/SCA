import React from 'react';
import classes from './TitleBar.module.scss';

const remote = window.require('electron').remote;

const TitleBar = (props) => {
    const minButton = <button className={classes.MinBtn} onClick={() => remote.getCurrentWindow().minimize()}>_</button>
    return (
        <div className={classes.TitleBar}>
            <div className={classes.Title}>{props.title}</div>
            <div className={classes.TitleBarBtns}>
                {props.showMinButton ? minButton : null}
                {/*<button id="max-btn">+</button>*/}
                <button onClick={() => remote.getCurrentWindow().close()}>&#x2716;</button>
            </div>
        </div>
    );
};

export default TitleBar;
