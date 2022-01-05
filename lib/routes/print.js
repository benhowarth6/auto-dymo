const express = require('express');
const labelPrinter = require("../util/dymoLabel");
const getDateTime = require('../util/getDateTime');
const checkAuth = require('../util/checkAuth');
const returnCode = require('../util/returnCode');
const logger = require('../util/logger');
const router = express.Router();

var constants = require('../constants');
const check = require('../util/checkTicketValid');

//Handles PUT requests from the SNow script
router.put('/', (req, res, next) => {

    //Log the IP of invalid requests - skimmer catching
    logger.log('info', "\n\n" + getDateTime() + " New PUT (print) request from " + req.socket.remoteAddress.replace("::ffff",'') + ":");

    //Try to grab number of labels from the HTTP req
    var numberOfLabels = req.body.numberOfLabels;
    //Default to 1
    if(numberOfLabels == null) numberOfLabels = 1;
    //Downflow to 5 if necessary
    else if (numberOfLabels > 6) numberOfLabels = 6;

    //Grab basic ticket info
    const ticketInfo = {
        ticketNumber: req.body.ticketNumber,
        user: req.body.user,
        authKey: req.body.authKey,
        numberOfLabels: numberOfLabels
    }

    //Auth check
    if(!checkAuth(res, req, ticketInfo.authKey)) return;

    const lengths = [11, 10];
    const startChars = ['RITM', 'INC'];

    //Check if ticket number is valid
    if(!check(res, ticketInfo, ticketInfo.ticketNumber, lengths, startChars)) return;

    //Print the ticket - set 'testing' in constants to true to disable printing
    for(var numPrints = 0; numPrints < numberOfLabels; ++numPrints) {
        if(constants.testing === false) labelPrinter(ticketInfo.ticketNumber, ticketInfo.user);
        logger.log('info', "Label printed (" + (numPrints + 1) + ")"); //(numPrints + 1) prevents literal "{$numPrints} + 1" from being printed
    }
    
    //Log the information
    logger.log('info', ticketInfo);

    //Success response
    returnCode(200, res, ticketInfo, 'Ticket(s) printed');
})

module.exports = router;