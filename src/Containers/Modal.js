import React, {Component} from 'react';

import classes from './Window.module.scss';
import TitleBar from './TitleBar/TitleBar';


let interval;
const images = importAll(require.context('../Assets/backgrounds', false, /\.(png|jpe?g|svg)$/));

function importAll(r) {
    return r.keys().map(r);
}


class Window extends Component {
    state = {
        background: images[0]
    };

    componentDidMount() {
        this.setState({
            background: images[Math.floor(Math.random() * images.length)]
        });
        interval = setInterval(() => {
            const image = images[Math.floor(Math.random() * images.length)];
            this.setState({
                background: image
            })
        }, 30000);
    }

    componentWillUnmount() {
        clearInterval(interval)
    }

    static _handleImageLoadSuccess() {
        console.log("images loaded")
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

export default Window;
