var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var dhcp = require('./dhcp')
var fs = require('fs');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){  
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
  setInterval(function htmlOutputFile() {
  	fs.readFile(dhcp.htmlOutputFile, 'utf8', function (err, data) {
	  if (err) throw err;	  
	  io.emit("refreshContent", data);
	});	
  }, 3007);
  setInterval(function dhcpLeases(){
  	//var data = dhcp.replaceHtmlContent();
  	var data = ">> " + Math.random();
  	io.emit("refreshTimes", data);  	
  }, 2991);
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
