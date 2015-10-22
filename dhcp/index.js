// index.js
var sys = require('sys');
var exec = require('child_process').exec;
var fs = require('fs');

var dhcpToolsCmd = "./dhcpd-pools -c /etc/dhcp/dhcpd.conf -l /var/lib/dhcp/dhcpd.leases -o /home/gustavo/Desktop/log.html -f h"
var htmlOutputFile = "/home/alberto/Desktop/log.html"; //"/home/gustavo/Desktop/log.html";
var leasesFile = "/home/alberto/Desktop/dhcpd.leases";//"/var/lib/dhcp/dhcpd.leases"; 
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
var parseDHCPLeases = function parseDHCPLeases() {
	var leaseFileContent = fs.readFileSync(leasesFile, 'utf8');
	leaseFileContent = leaseFileContent.replace(" The format of this file is documented in the dhcpd.leases(5) manual page.","");	
	leaseFileContent = leaseFileContent.replace(" This lease file was written by isc-dhcp-4.1-ESV-R4","");	
	leaseFileContent = leaseFileContent.replace(" This lease file was written by isc-dhcp-4.1-ESV-R4","");	
	leaseFileContent = leaseFileContent.replace(/\#/g,"");	
	leaseFileContent = leaseFileContent.trim();
	leaseFileContent = leaseFileContent.substring(leaseFileContent.indexOf("lease"), leaseFileContent.length)		
	var splittedContent = leaseFileContent.split("{");
	var ipsDictionary = [];
	var ip = "";
	var start = "";
	var end = "";	
	for(var i = 0; i < splittedContent.length; i++) {
		var splittedNewLine = splittedContent[i].split("\n");
		if(splittedNewLine.length == 1 && splittedNewLine[0].indexOf("lease") >= 0) {
			ip = splittedNewLine[0].substring(splittedNewLine[0].indexOf("lease") + 5, splittedNewLine[0].length-1);			
			ip = ip.trim();			
			continue;
		}
		if(splittedNewLine.length > 1){
			//					
			console.log("[0] >> " + splittedNewLine[1]);
			start = splittedNewLine[1].substring(splittedNewLine[1].indexOf("2015"), splittedNewLine[1].length-1);
			console.log(start);
			//
			console.log("[1] >> " + splittedNewLine[2]);
			end = splittedNewLine[2].substring(splittedNewLine[2].indexOf("2015"), splittedNewLine[2].length-1);
			console.log(end);
			//			
			var timeDiff = ((new Date()).getTime() - (new Date(end)).getTime());
			var dateDiff = Math.ceil(timeDiff / (1000 * 3600));		
			ipsDictionary.push({
				"ip": ip,
				"start":start,
				"end":end,
				"diff":dateDiff,
				"expired": dateDiff <= 0 ? true : false,
			});
		}
		
	}	
	return ipsDictionary;
}

var dhcpObject = {
	dhcpToolsCmd: dhcpToolsCmd,
	htmlOutputFile: htmlOutputFile,
	leasesFile: leasesFile,
	refreshHtmlContent: refreshHtmlContent,
	parseDHCPLeases: parseDHCPLeases
}
module.exports = dhcpObject;