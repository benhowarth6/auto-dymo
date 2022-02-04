//This library is so horrible jesus christ
const Dymo = require('dymojs'), dymo = new Dymo();
const constants = require('../constants');
const fs = require('fs');

module.exports = function(name, ticketNumber){

    var labelXml = fs.readFileSync(process.cwd() + '\\label_xml.xml', 'utf8');

    labelXml = labelXml.toString().replace('${name}', name);
    labelXml = labelXml.toString().replace('${ticketNumber}', ticketNumber);

    return(dymo.print(constants.printerName, labelXml));
}