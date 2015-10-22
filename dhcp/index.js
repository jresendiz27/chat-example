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

	var splittedContent = leaseFileContent.split("}");
	var ipsDictionary = [];
	var ip = "";
	var start = "";
	var end = "";	
	for(var i = 0; i < splittedContent.length - 1; i++) {
		if(splittedContent[i].indexOf("{")){
			var splittedNewLine = splittedContent[i].trim().split("\n");
			//
			ip = splittedNewLine[0].replace("{","");
			ip = ip.replace("lease","");
			ip = ip.trim();					
			//			
			start = splittedNewLine[1].substring(splittedNewLine[1].indexOf("2015"), splittedNewLine[1].length)			
			//
			end = splittedNewLine[2].replace(";","");
			end = start.replace(/ends [0-9]+/,"");
			end = start.trim();
			ipsDictionary.push({ "ip": ip,"start":start,"end":end });
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