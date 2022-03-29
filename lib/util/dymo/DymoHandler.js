const constants = require('../other/constants');
const logger = require('../other/logger');
const exec = require('child_process').execFile;

//XML file loading and conversion
const fs = require('fs');
const convert = require('xml-js');
const path = require('path');
const executableName = "DYMO.DLS.Printing.Host.exe";
const executableNameNoExt = "DYMO.DLS.Printing.Host";

let fetcher;

if (typeof fetch === 'undefined') {
	fetcher = require('node-fetch');
} else {
	fetcher = fetch;
}

module.exports = class DymoHandler {

    // Construct a new DymoHandler instance
    constructor() {
        this.hostname = constants.dymoHostname ? constants.dymoHostname : '127.0.0.1';
        this.port = constants.dymoPort ? constants.dymoPort : 41951;
        this.printerName = constants.printerName ? constants.printerName : null;
        if(!this.printerName) throw new Error('Printer name is required, but was not found.');

        // Construct the API URL
        this.apiUrl = `https://${this.hostname}:${this.port}/DYMO/DLS/Printing`;
    }

    // Attempt to start DYMO Web Service
    serviceStarter(){
        exec(constants.dymoServicePath + executableName, function(err, data) {  
            logger.log('error', 'ServiceStarter error: ' + err);
            logger.log('info', 'ServiceStarter data: ' + data);
        });
    }

    serviceStatus(){
        let platform = process.platform;
        let cmd = '';
        switch(platform){
            case 'win32': cmd = `tasklist`; break;
            case 'darwin' : cmd = `ps -ax | grep ${executableNameNoExt}`; break;
            default: break;
        }
        try{
            return Boolean(exec(cmd, (_err, stdout, _stderr) => {
                return stdout.toLowerCase().indexOf(executableNameNoExt.toLowerCase()) > -1;
            }));
        }
        catch(err){
            logger.log('error', "Error in checkings status of DYMO service: " + err);
            return false;
        }
    }

    // Call Dymo API to print label
    print(labelXml){
        let label = `printerName=${encodeURIComponent(this.printerName)}&printParamsXml=&labelXml=${encodeURIComponent(labelXml)}&labelSetXml=${encodeURIComponent('')}`;

        if (typeof process !== 'undefined' && process.env) {
    	    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // TODO: Bundle the certificates.
        }

        return fetcher(`${this.apiUrl}/PrintLabel`, {
            method: 'POST',
            body: label,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(response => response.text()).then(result => result);
    }

    // Externally callable - friendly way to interact with DymoHandler
    printLabel(name, ticketNumber){
        try{
            //Create JSON data from the XML file
            const jsonLabelData = convert.xml2js(fs.readFileSync(path.join(__dirname, '../../../', '/label_xmls/' + (constants.xmlFileName ? constants.xmlFileName : 'default.xml')), 'utf8'), {compact: true});
    
            //Replace the ticket number and name strings in the XML file
            jsonLabelData['DieCutLabel']['ObjectInfo']['TextObject']['StyledText']['Element'][0]['String'] = name + "\n" + ticketNumber;
    
            //Convert the JSON data back to XML
            const labelXml = convert.js2xml(jsonLabelData, {compact: true});
    
            try{
                //Startup DYMO if it isn't already running
                logger.log('info', ('DYMO Web Service ' + (this.serviceStatus() ? 'was' : 'was not') + ' running already.'));
                if(!this.serviceStatus() == 'true'){
                    var res = this.serviceStarter();
                    //if(res) throw res;
                    setTimeout(() => { return(this.print(labelXml)); }, 1500);
                }
                else return(this.print(labelXml));
            }
            catch(err){
                logger.log('error', err);
                logger.log('error', ('Error starting DYMO. Debug info:')
                + ('\nDYMO Web Service online? : ' + this.serviceStatus())
                + ('\nDYMO Web Service Path: ' + constants.dymoServicePath)
                + ('\n' + executableName + 'exists?: ' + fs.existsSync(constants.dymoServicePath + executableName)));
                return -1;
            }
            
        }
        catch(err){
            logger.log('error', ('Error reading/converting XML file: ' + err + '\nDebug info:')
            + ('\nXML Filename: ' + constants.xmlFileName)
            + ('\nXML File Path: ' + path.join(__dirname, '../../', '/label_xmls/' + (constants.xmlFileName ? constants.xmlFileName : 'default.xml'))));
            return -1;
        }
    }
}