const express = require('express');
const labelPrinter = require("../util/dymoLabel");
const getDateTime = require('../util/getDateTime');
const checkAuth = require('../util/checkAuth');
const returnCode = require('../util/returnCode');
const logger = require('../util/logger')
const router = express.Router();

var constants = require('../constants');
const getDate = require('../util/getDate');
const oneLine = require('../util/oneLine');
const e = require('express');


//Handles PUT requests from the SNow script
router.put('/', (req, res, next) => {
    //Log the IP of invalid requests - skimmer catching
    var logIp = req.socket.remoteAddress;
    //If the IP begins with "::ffff:", trim it off
    if(logIp.substr(0, 7) === '::ffff:') logIp = logIp.substr(7)

    logger.log('info', "\n\n" + getDateTime() + " New PUT (cascade) request from " + logIp + ":");

    //Grab basic ticket info
    const cascadeInfo = {
        oldHost: req.body.oldHost,
        diagsPassed: req.body.diagsPassed,
        otherNotes: req.body.otherNotes,
        authKey: req.body.authKey,
    }

    logger.log('info', cascadeInfo.otherNotes);

    var authed = checkAuth(res, req, cascadeInfo.authKey);
    if(!authed) return;

    //Print the old hostname ticket
    var sucHost;
    if(constants.testing === false) sucHost = labelPrinter(cascadeInfo.oldHost, "Old hostname:");
    if(sucHost) logger.log('info', "Old hostname label printed with value: \"" + cascadeInfo.oldHost + "\".");
    else logger.log('info', "Error printing label. Check printer name and connection.")

    //Print the diagnostic ticket
    var sucDiags;
    var diagString;
    if(cascadeInfo.diagsPassed === "T") diagString = "Diags passed";
    else diagString = "Diags failed";

    if(constants.testing === false) sucDiags = labelPrinter(getDate(), diagString)
    if(sucDiags) logger.log('info', "Diag success label printed with value: \"" + diagString + "\".");
    else logger.log('info', "Error printing label. Check printer name and connection.")

    //Print other notes
    if(cascadeInfo.otherNotes != null){

        var split;

        if(cascadeInfo.otherNotes.contains(", ")){
            split = cascadeInfo.otherNotes.split(", ");
            split.forEach(function(item, index, array) {
                oneLine(item);
                logger.log('info', "Misc. label printed with value: \"" + item + "\". Item pulled from index " + index + ".");
            })
        }
        else{
            oneLine(cascadeInfo.otherNotes);
            logger.log('info', "Misc. label printed with value: \"" + cascadeInfo.otherNotes + "\". Item pulled from index " + index + ".");
        } 
    }
    
    //Log the information
    logger.log('info', cascadeInfo);

    //Success response
    returnCode(200, res, cascadeInfo, 'Label(s) printed')
})

module.exports = router;