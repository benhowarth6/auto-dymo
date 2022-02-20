//This library is so horrible jesus christ
const constants = require('../other/constants');
const DymoHandler = require('./dymoRewrite'), dymo = new DymoHandler({
    hostname: constants.dymoHostname ? constants.dymoHostname : '127.0.0.1',
    port: constants.dymoPort ? constants.dymoPort : 41951,
    printerName: constants.printerName ? constants.printerName : null
});
const processChecker = require('./processChecker');
const dymoStarter = require('./dymoServiceStarter');
const logger = require('../other/logger');

//XML file loading and conversion
const fs = require('fs');
const convert = require('xml-js');
const path = require('path');

module.exports = function(name, ticketNumber){
    try{
        //Create JSON data from the XML file
        const jsonLabelData = convert.xml2js(fs.readFileSync(path.join(__dirname, '../../../', '/label_xmls/' + (constants.xmlFileName ? constants.xmlFileName : 'default.xml')), 'utf8'), {compact: true});

        //Replace the ticket number and name strings in the XML file
        jsonLabelData['DieCutLabel']['ObjectInfo']['TextObject']['StyledText']['Element'][0]['String'] = name + "\n" + ticketNumber;

        //Convert the JSON data back to XML
        const labelXml = convert.js2xml(jsonLabelData, {compact: true});

        try{
            //Startup DYMO if it isn't already running
            logger.log('info', ('DYMO Web Service ' + (processChecker('DYMO.DLS.Printing.Host.exe') ? 'was' : 'was not') + ' running already.'));
            if(!processChecker('DYMO.DLS.Printing.Host.exe')){
                var res = dymoStarter();
                if(res) throw new Error(res);
                setTimeout(() => { return(dymo.print(constants.printerName, labelXml)); }, 1500);
            }
            else return(dymo.print(constants.printerName, labelXml));
        }
        catch(err){
            logger.log('error', ('Error starting DYMO. Debug info:')
            + ('\nDYMO Web Service online? : ' + processChecker('DYMO.DLS.Printing.Host.exe'))
            + ('\nDYMO Web Service Path: ' + constants.dymoServicePath)
            + ('\nDYMO.DLS.Printing.Host.exe exists?: ' + fs.existsSync(constants.dymoServicePath + 'DYMO.DLS.Printing.Host.exe')));
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