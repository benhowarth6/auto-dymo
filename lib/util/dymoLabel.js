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

        //Convert the JSON data back to XML
        const labelXml = convert.js2xml(jsonLabelData, {compact: true});

        //Startup DYMO if it isn't already running
        if(!processChecker('DYMO.DLS.Printing.Host.exe')){
            logger.log('info', 'DYMO Service was not started before this request.')
            dymoStarter();
            setTimeout(() => { return(dymo.print(constants.printerName, labelXml)); }, 1500);
        }
        else{
            logger.log('info', 'DYMO Service is running.')
            return(dymo.print(constants.printerName, labelXml));
        }
    }
    catch(err){
        logger.log('error', 'Error reading/converting XML file: ' + err);
        logger.log('debug', ('XML Filename: ' + constants.xmlFileName));
        return;
    }
}