var api = {};
global.api = api;
api.net = require('net');

var socket = new api.net.Socket();
var task = [2, 17, 3, 2, 5, 7, 15, 22, 1, 14, 15, 9, 0, 11, 12];

socket.connect({
  port: 2001,
  host: '127.0.0.1',
}, function() {
  console.log('Data sended (by customer): ' + task);
  socket.write(JSON.stringify(task));
  
  socket.on('data', function(data) {
    result = JSON.parse(data);
    console.log('Data received (by customer): ' + result);
    socket.end();
  });
});
