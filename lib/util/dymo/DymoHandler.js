const constants = require('../other/constants');
const logger = require('../other/logger');
const exec = require('child_process').execFile;

//XML file loading and conversion
const fs = require('fs');
const convert = require('xml-js');
const path = require('path');
const executableName = "DYMO.DLS.Printing.Host.exe";

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
        return(exec(constants.dymoServicePath + executableName, function(err) {  
            if(err) return err;
        }));
    }

    serviceStatus(){
        let platform = process.platform;
        let cmd = '';
        switch(platform){
            case 'win32': cmd = `tasklist`; break;
            case 'darwin' : cmd = `ps -ax | grep ${executableName}`; break;
            default: break;
        }
        try{
            exec(cmd, (err, stdout, stderr) => {
                return (stdout.toLowerCase().indexOf(executableName.toLowerCase()) > -1);
            });
        }
        catch(err){
            logger.log('error', "Error in checkings status of DYMO service: " + err);
            return false;
        }
    }

    // Call Dymo API to print label
    async print(labelXml){
        let label = `printerName=${encodeURIComponent(this.printerName)}&printParamsXml=&labelXml=${encodeURIComponent(labelXml)}`;

        const response = await fetcher(`${this.apiUrl}/PrintLabel`, {
            method: 'POST',
            body: label,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return response.text();
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
                if(!this.serviceStatus()){
                    var res = this.serviceStarter();
                    if(res) throw new Error(res);
                    setTimeout(() => { return(this.print(constants.printerName, labelXml)); }, 1500);
                }
                else return(dymo.print(constants.printerName, labelXml));
            }
            catch(err){
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