var api = {};
global.api = api;
api.net = require('net');

var socket = new api.net.Socket();
var result;

socket.connect({
  port: 2000,
  host: '127.0.0.1',
}, function() {
    socket.on('data', function(data) {
    paskage = JSON.parse(data);
    console.log('Data received (by worker): ' + paskage.task);
      
    paskage.task = paskage.task.map(function(item) {
      return item * 2;}) 
    
    console.log('Data sended (by worker): ' + paskage.task);
    socket.write(JSON.stringify(paskage));
  });
});
