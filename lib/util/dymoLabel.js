//This library is so horrible jesus christ
const Dymo = require('dymojs'), dymo = new Dymo();
const constants = require('../constants')

module.exports = function(name, ticketNumber){
    const labelXml = loadXMLDoc(constants.labelPath);
    const custFields = labelXml.getElementsByTagType("String");

    custFields[0].setValue(name);
    custFields[1].setValue(ticketNumber);

    return(dymo.print(constants.printerName, labelXml));
}