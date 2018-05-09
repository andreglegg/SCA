const remote = require('electron').remote;
const settings = remote.require('electron-settings');


let minBtn = document.getElementById('min-btn');
let closeBtn = document.getElementById('close-btn');
let portInput = document.getElementById('portInput');


closeBtn.addEventListener('click', ()=>{
    let window = remote.getCurrentWindow();
    window.close();
});

function Setup() {
    let theVar =  settings.get('foo');
    console.log(theVar.port)
    if (!theVar) {
        settings.set('foo', { port: '4242' });
    }else {
        portInput.value = theVar.port;
    }
}

Setup();

portInput.focus()
portInput.addEventListener('input', () => {
    settings.set('foo', { port: portInput.value });
    console.log("wow" + portInput.value)
    //Setup();
})