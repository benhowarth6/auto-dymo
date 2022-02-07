//This library is so horrible jesus christ
const Dymo = require('dymojs'), dymo = new Dymo();
const constants = require('../constants');
const fs = require('fs');
const logger = require('./logger');

module.exports = function(name, ticketNumber){

    var labelXml = 
    `<?xml version="1.0" encoding="utf-8"?>\
    <DieCutLabel Version="8.0" Units="twips">\
        <PaperOrientation>Landscape</PaperOrientation>\
        <Id>Address</Id>\
        <IsOutlined>false</IsOutlined>\
        <PaperName>30252 Address</PaperName>\
        <DrawCommands>\
            <RoundRectangle X="0" Y="0" Width="1581" Height="5040" Rx="270" Ry="270" />\
        </DrawCommands>\
        <ObjectInfo>\
            <TextObject>\
                <Name>Text</Name>\
                <ForeColor Alpha="255" Red="0" Green="0" Blue="0" />\
                <BackColor Alpha="0" Red="255" Green="255" Blue="255" />\
                <LinkedObjectName />\
                <Rotation>Rotation0</Rotation>\
                <IsMirrored>False</IsMirrored>\
                <IsVariable>True</IsVariable>\
                <GroupID>-1</GroupID>\
                <IsOutlined>False</IsOutlined>\
                <HorizontalAlignment>Center</HorizontalAlignment>\
                <VerticalAlignment>Middle</VerticalAlignment>\
                <TextFitMode>ShrinkToFit</TextFitMode>\
                <UseFullFontHeight>True</UseFullFontHeight>\
                <Verticalized>False</Verticalized>\
                <StyledText>\
                <Element>\
                <String>${name}\n</String>\
                <Attributes>\
                    <Font Family="Arial" Size="24"\
                        Bold="False" Italic="False" Underline="False" Strikeout="False"/>\
                    <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/>\
                </Attributes>\
                </Element>\
                <Element>\
                <String>${ticketNumber}</String>\
                <Attributes>\
                    <Font Family="Arial" Size="24" \
                        Bold="False" Italic="False" Underline="False" Strikeout="False"/>\
                    <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/>\
                </Attributes>\
                </Element>\
            </StyledText>\
            </TextObject>\
            <Bounds X="331" Y="150" Width="4560" Height="1343" />\
        </ObjectInfo>\
    </DieCutLabel>
    `
    //labelXml.replace('[xml here]', fs.readFileSync(process.cwd() + '\\label_xml.xml', { encoding: 'utf8'}));
    //labelXml = labelXml.toString().replace('${name}', name);
    //labelXml = labelXml.toString().replace('${ticketNumber}', ticketNumber);

    return(dymo.print(constants.printerName, labelXml));
}