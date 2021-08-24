const express = require('express');
const labelPrinter = require("../util/dymoLabel");
const getDateTime = require('../util/getDateTime');
const checkAuth = require('../util/httpHelpers/checkAuth');
const returnCode = require('../util/httpHelpers/returnCode');
const router = express.Router();

var constants = require('../constants');

//Handles PUT requests from the SNow script
router.put('/', (req, res, next) => {

    //Log the IP of invalid requests - skimmer catching
    var logIp = req.socket.remoteAddress;
    //If the IP begins with "::ffff:", trim it off
    if(logIp.substr(0, 7) === '::ffff:') logIp = logIp.substr(7)

    console.log("\n\n" + getDateTime() + " New PUT (print) request from " + logIp + ":");

    //Try to grab number of labels from the HTTP req
    var numberOfLabels = req.body.numberOfLabels;
    //Default to 1
    if(numberOfLabels == null) numberOfLabels = 1;
    //Downflow to 5 if necessary
    else if (numberOfLabels > 5) numberOfLabels = 5;

    //Grab basic ticket info
    const ticketInfo = {
        ticketNumber: req.body.ticketNumber,
        user: req.body.user,
        authKey: req.body.authKey,
        numberOfLabels: req.body.numberOfLabels
    }

    var authed = checkAuth(res, req, ticketInfo.authKey);
    if(!authed) return;

    //Check the validity of ticket's names
    if(ticketInfo.user === null || ticketInfo.ticketNumber === null) returnCode(404, res, ticketInfo, "One or more fields were entered incorrectly");
    
    //Print the ticket - set 'testing' in constants to true to disable printing
    for(var i = 0; i < numberOfLabels; ++i) {
        if(constants.testing === false){
            labelPrinter(ticketInfo.ticketNumber, ticketInfo.user);
        }
        console.log("Label printed (" + i + 1 + ")");
    }
    
    //Log the information
    console.log(ticketInfo);

    //Success response
    returnCode(200, res, ticketInfo, 'Ticket printed')
})

module.exports = router;