import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom'
import App from './BrowserWindows/Main/App';
import Settings from './BrowserWindows/Settings/Settings';

class ViewManager extends Component {

    static Views() {
        return {
            main: <App/>,
            settings: <Settings/>
        }
    }

    static View(props) {
        let name = props.location.search.substr(1);
        let view = ViewManager.Views()[name];
        if(view == null)
            throw new Error("View '" + name + "' is undefined");
        return view;
    }

    render() {
        return (
            <Router>

                    <Route path='/' component={ViewManager.View}/>

            </Router>
        );
    }
}

export default ViewManager