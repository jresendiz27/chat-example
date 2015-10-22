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
	var splittedContent = leaseFileContent.split("\n");
	var ipsDictionary = [];
	var ip = "";
	var start = "";
	var end = "";
	var cont = 0;
	for(var i = 0; i < splittedContent.length; i++) {
		if(splittedContent[i].indexOf("lease") >= 0) {
			ip = splittedContent[i].substring(splittedContent[i].indexOf("lease") + 5, splittedContent[i].length-1);			
			ip = ip.trim();
			cont += 1;
		}
		if(splittedContent[i].indexOf("starts") >= 0) {
			start = splittedContent[i].substring(splittedContent[i].indexOf("2015"), splittedContent[i].indexOf(";"));
			cont += 1;
		}
		if(splittedContent[i].indexOf("ends") >= 0) {
			end = splittedContent[i].substring(splittedContent[i].indexOf("2015"), splittedContent[i].indexOf(";"));
			cont += 1;
		}
		if(cont == 3) {
			var startDate = (new Date());
			var endDate = (new Date(end));
			console.log("Start date: > " + startDate);
			console.log("End date: > " + endDate);
			var timeDiff = (endDate.getTime() - startDate.getTime());
			console.log("timeDiff: > " + timeDiff);
			var dateDiff = Math.floor(timeDiff / (1000 * 60));		
			console.log("dateDiff: > " + dateDiff);
			ipsDictionary.push({
				"ip": ip,
				"start":start,
				"end":end,
				"diff":dateDiff,
				"expired": timeDiff <= 0 ? true : false,
			});
			cont = 0;
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