// index.js
var sys = require('sys')

var exec = require('child_process').exec;

var dhcpToolsCmd = "./dhcpd-pools -c /etc/dhcp/dhcpd.conf -l /var/lib/dhcp/dhcpd.leases -o /home/gustavo/Desktop/log.html -f h"
//var htmlOutputFile = "/home/gustavo/Desktop/log.html";
var htmlOutputFile = "/home/alberto/Desktop/log.html";
function puts(error, stdout, stderr) { 
	if(stderr) {
		console.error("error!!");
		console.error(stderr);
	}
	
}

var refreshHtmlContent = function refreshHtmlContent () {
	exec("ls -la", puts);
	//exec(dhcpToolsCmd, puts);
}

var dhcpObject = {
	dhcpToolsCmd: dhcpToolsCmd,
	htmlOutputFile: htmlOutputFile,
	refreshHtmlContent: refreshHtmlContent
}
module.exports = dhcpObject;