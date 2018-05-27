import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ViewManager from './ViewManager';
import registerServiceWorker from './registerServiceWorker';

registerServiceWorker();



function render(Component) {
    ReactDOM.render(
        <Component />,
        document.getElementById('root')
    );
}

render(ViewManager);

if (module.hot) {
    module.hot.accept('./BrowserWindows/Main/App', () => {
        const NextApp = require('./BrowserWindows/Main/App').default;
        render(NextApp);
    })
}

/*

function ready() {
    // do your stuff
    setTimeout(console.log(server),3000);
    console.log("wowowowow")
}

// this is required for the (not so) edge case where your script is loaded after the document has loaded
// https://developer.mozilla.org/en/docs/Web/API/Document/readyState
if (document.readyState !== 'loading') {
    ready()
} else {
    // the document hasn't finished loading/parsing yet so let's add an event handler
    document.addEventListener('DOMContentLoaded', ready)
}
*/
