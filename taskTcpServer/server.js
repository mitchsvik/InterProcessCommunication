var api = {};
global.api = api;
api.net = require('net');

var task = [2, 17, 3, 2, 5, 7, 15, 22, 1, 14, 15, 9, 0, 11];
var results = [];

var server = api.net.createServer(function(socket) {
  console.log('Connected: ' + socket.localAddress);
  socket.write(JSON.stringify(task));
  console.log('Data sended (by server): ' + task)
  
  socket.on('data', function(data) {
    var result = JSON.parse(data);
    console.log('Data resiever (by server): ' + result);
  });

  socket.on('end', function(){
     console.log('User disconnected\n'); 
  });
}).listen(2000);
