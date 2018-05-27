const server = require('http').createServer();
const io = require('socket.io')(server);

io.on('connection', function(client){
    console.log('connected to server');
    client.on('sendTapKey', function(data){
        console.log(data)
    });
    client.on('disconnect', function(){});
});
server.listen(4242);
console.log('server loaded');
//console.log(server);

export default server;