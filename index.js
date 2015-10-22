var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var dhcp = require('./dhcp')
var fs = require('fs');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
app.get('/jquery/jquery.js', function(req, res){
  res.sendFile(__dirname + '/jquery.js');
});

io.on('connection', function(socket){    
  setInterval(function htmlOutputFile() {
  	dhcp.refreshHtmlContent();
  	fs.readFile(dhcp.htmlOutputFile, 'utf8', function (err, data) {
	  if (err) throw err;	  
	  io.emit("refreshContent", data);
	});	
  }, 2009);
  setInterval(function dhcpLeases(){
  	var data = dhcp.parseDHCPLeases();
  	io.emit("refreshTimes", data);  	
  }, 3007);
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
