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
    task = JSON.parse(data);
    console.log('Data received (by client): ' + task);
      
    result = task.map(function(item) {
      return item * 2;}) 
    
    console.log('Data sended (by client): ' + result);
    socket.write(JSON.stringify(result));
  });
});
