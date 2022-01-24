const express = require('express');
const labelPrinter = require("../util/dymoLabel");
const getDateTime = require('../util/getDateTime');
const checkAuth = require('../util/checkAuth');
const returnCode = require('../util/returnCode');
const logger = require('../util/logger');
const router = express.Router();

const constants = require('../constants');
const checkSyntax = require('../util/checkTicketValid');

//Handles PUT requests from the SNow script
router.put('/', (req, res) => {

    //Log the IP of invalid requests - skimmer catching
    logger.log('info', "\n\n" + getDateTime() + " New PUT (print) request from " + req.socket.remoteAddress.replace("::ffff",'') + ":");

    //Try to grab number of labels from the HTTP req -- default to 1, downflow to 6
    var numberOfLabels = req.body.numberOfLabels == null ? 1 : (req.body.numberOfLabels > 6 ? 6 : req.body.numberOfLabels);

    //Grab basic ticket info
    const ticketInfo = {
        ticketNumber: req.body.ticketNumber,
        user: req.body.user,
        authKey: req.body.authKey,
        numberOfLabels: numberOfLabels
    }

    //Makes sure required fields are present - this code works, but uh... it's not pretty
    if(Object.values(ticketInfo).includes(undefined)) return returnCode(400, res, ticketInfo, "Missing required fields: [".concat(Object.keys(ticketInfo).filter(key => ticketInfo[key] == null).join(", "), "]"));

    //Auth check
    if(!checkAuth(res, req, ticketInfo.authKey)) return;

    //List of valid start chars
    const startChars = ['RITM', 'INC'];

    //Check if ticket number is valid
    if(!checkSyntax(res, ticketInfo, ticketInfo.ticketNumber, startChars.map(function(word) {return word.length + 7;}), startChars)) return;

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