var api = {};
global.api = api;
api.net = require('net');

var task = [2, 17, 3, 2, 5, 7, 15, 22, 1, 14, 15, 9, 0, 11];
var sockets = [];
var results = [];

var server = api.net.createServer(function(socket) {
  sockets.push(socket);
  console.log('Connected: ' + socket.localAddress);
  console.log('Current connected : ' + sockets.length + ' clients');
  results = [];
    
  var size = task.length/sockets.length;
  sockets.forEach(function(socket, index) {
    socket.write(JSON.stringify(task.slice(size*index, size*(index+1))));
    console.log('Data sended (by server): ' + task.slice(size*index, size*(index+1)))          
  });
  
  socket.on('data', function(data) {
    results.push(JSON.parse(data));
    console.log('Data resiever (by server): ' + results);
  });

  socket.on('end', function(){
    console.log('User disconnected\n'); 
  });
}).listen(2000);
