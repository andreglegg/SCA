import React, {Component} from 'react';

import classes from './Window.module.scss';
import TitleBar from './TitleBar/TitleBar';

class Modal extends Component {

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {

        return (
            <div className={classes.Window}>
                <TitleBar title={"Settings"} showMinButton={false}/>
                <div className={classes.Wrapper}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default Modal;
