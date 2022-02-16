//This library is so horrible jesus christ
const Dymo = require('dymojs'), dymo = new Dymo();
const constants = require('../constants');
const processChecker = require('./processChecker');
const dymoStarter = require('./dymoServiceStarter');

//XML file loading and conversion
const fs = require('fs');
const convert = require('xml-js');
const logger = require('./logger');
const path = require('path');

module.exports = function(name, ticketNumber){

    //Get the status of the service before attempting anything
    dymo.getStatus().then(function(result){ logger.log('info', ('Dymo' + (result ? ' is ' : ' is not ') + ' Active.'))});
    dymo.getPrinters().then(function(result) {logger.log('info', 'Dymo Printer List contains printer ?: ' + result.toString().contains(constants.printerName))});

    try{
        //Create JSON data from the XML file
        const jsonLabelData = convert.xml2js(fs.readFileSync(path.join(__dirname, '../../', '/label_xmls/' + (constants.xmlFileName ? constants.xmlFileName : 'default.xml')), 'utf8'), {compact: true});

        //Replace the ticket number and name strings in the XML file
        jsonLabelData['DieCutLabel']['ObjectInfo']['TextObject']['StyledText']['Element'][0]['String'] = name + "\n" + ticketNumber;

        const labelXML = convert.js2xml(jsonLabelData, {compact: true})

        //Startup DYMO if it isn't already running
        logger.log('Dymo server was ' + processChecker('DYMO.DLS.Printing.Host.exe') ? 'not ' : 'already' + 'running before this request.');
        if(!processChecker('DYMO.DLS.Printing.Host.exe')) {
            dymoStarter(); 
            //Print after 1500ms, to give the service time to start up - printerName, labelXML (converted back to XML from json)
            setTimeout(() => { return(dymo.print(constants.printerName, labelXML)); }, 1500);
        }
        else return(dymo.print(constants.printerName, labelXML));

        
    }
    catch(err){
        logger.log('error', 'Error reading/converting XML file: ' + err);
        logger.log('debug', ('XML Filename: ' + constants.xmlFileName));
        return;
    }
}