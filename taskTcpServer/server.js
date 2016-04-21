var api = {};
global.api = api;
api.net = require('net');

var sockets = [];
var customers = [];
var results = [];

var sCou = count();
var server = api.net.createServer(function(socket) {
  sockets.push({socketID: sCou(),
                socket: socket,
                status: 0});
  console.log('Connected: ' + socket.localAddress);
  console.log('Current connected : ' + sockets.length + ' workers');
  
  socket.on('data', function(data) {
    result = JSON.parse(data);
    console.log('Data resiever (by server): ' + result.task);  
      
    sockets[result.socketID].status = 0;  
    results[result.customerID].push(result);
      
    sendIfFull(result.customerID);  
  });

  socket.on('end', function(){
    console.log('Worker disconnected\n'); 
  });
}).listen(2000);

var bCou = count();
var broker = api.net.createServer(function(socket) {
  var customerID = bCou();
  customers[customerID] = {customerID: customerID,
                   socket: socket,
                   task: []};
    
  results[customerID] = [];
  console.log('Connected: ' + socket.localAddress);
  console.log('Current connected : ' + customers.length + ' customers');
    
  socket.on('data', function(task) {
    console.log('Task resieved (by server): ' + task);
    if(freeSockets() === 0){
     socket.write(JSON.stringify('No free workers now'));
     console.log('Completed task sended (by server): No free workers now');
     return;    
    }
    var maxWorkers = task.length / 5;
    var customer;
      
    customers.forEach(function(element, index) {
      if (element.socket == socket) {
          customers[index].task = JSON.parse(task);
          customer = element;
      }});
    
    var fSocket = freeSockets();
    if (fSocket > maxWorkers) {
      splitAndSend(customer, maxWorkers);
    } else {
      splitAndSend(customer, fSocket);
    }
  });
    
  socket.on('end', function(){
    console.log('Client disconnected\n'); 
  });      
}).listen(2001);
    
function splitAndSend (customer, count) {
  var size = customer.task.length/count;
  var index = 0;
  sockets.forEach(function(element) {
    if(element.status == 0){
      element.socket.write(JSON.stringify(
      {pascageID: index,
       socketID: element.socketID,
       customerID: customer.customerID,
       task: customer.task.slice(size*index, size*(index+1))
      }));
    console.log('Data sended (by server): ' +       customer.task.slice(size*index, size*(index+1)))
    element.status = 1;
    index += 1;
    }
  });    
}    

function freeSockets(){
  var c = 0;
  for(var i = 0; i<sockets.length; i++) {
    if(sockets[i].status == 0){
      c++;      
    }
  }
  return c;
}

function count() {
  var c = 0;
  return function() {
    return c++;
  };
}

function sendIfFull(customerID) {
  var taskLength = customers[customerID].task.length;
  var resultLength = 0;
    results[customerID].forEach(function(result) {
      resultLength += result.task.length; 
    });
    
  if(taskLength == resultLength) {
    var result = [];
    for(var i = 0; i < results[customerID].length; i++) {   
      results[customerID].forEach(function(e) {
        if (e.pascageID == i) {
          for(var j = 0; j < e.task.length; j++){
            result.push(e.task[j]);
          }
        }
      });
    }
    customers[customerID].socket.write(JSON.stringify(result)); 
    console.log('Completed task resiever (by server): ' + result); 
  }
}
