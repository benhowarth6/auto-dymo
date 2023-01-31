const express = require('express');
const constants = require('../util/other/constants');
const DymoHandler = require('../util/dymo/DymoHandler'), dymo = new DymoHandler();
const checkAuth = require('../util/http/checkAuth');
const returnCode = require('../util/http/returnCode');
const logger = require('../util/other/logger');
const router = express.Router();

const checkSyntax = require('../util/tickets/checkTicketValid');

//Handles PUT requests from the SNow script
router.put('/', (req, res) => {

    //Log the IP of invalid requests - skimmer catching
    logger.log('info', "\n\nNew PUT (print) request from " + req.socket.remoteAddress.replace("::ffff",'') + ":");

    //Try to grab number of labels from the HTTP req -- default to 1, downflow to 6
    var numberOfLabels = req.body.numberOfLabels == null ? 1 : (req.body.numberOfLabels > 6 ? 6 : req.body.numberOfLabels);

    //Grab basic ticket info
    const ticketInfo = {
        ticketNumber: req.body.ticketNumber,
        device: req.body.device,
        contact_number: req.body.contact_number,
        repair: req.body.repair,
        cost: req.body.cost,
        user: req.body.user,
        authKey: req.body.authKey,
        date: req.body.date,
        numberOfLabels: numberOfLabels
    }

    //Makes sure required fields are present - this code works, but uh... it's not pretty
    if(Object.values(ticketInfo).includes(undefined)) return returnCode(400, res, ticketInfo, "Missing required fields: [" + Object.keys(ticketInfo).filter(key => ticketInfo[key] == null).join(", ") + "]");

    //Auth check
    if(!checkAuth(res, req, ticketInfo.authKey)) return;



    //Print the ticket - set 'testing' in constants to true to disable printing
    for(var numPrints = 0; numPrints < numberOfLabels; ++numPrints) {
        var result;
        if(constants.testing === false) result = dymo.printLabel(ticketInfo.user, ticketInfo.ticketNumber, ticketInfo.device, ticketInfo.repair, ticketInfo.contact_number, ticketInfo.cost, ticketInfo.date);
        if(result == -1) return returnCode(500, res, ticketInfo, "Error printing label, please see log for details");
        logger.log('info', "Label printed (" + (numPrints + 1) + ")"); //(numPrints + 1) prevents literal "{$numPrints} + 1" from being printed
    }
    
    //Log the information
    logger.log('info', ticketInfo);

    //Success response
    returnCode(200, res, ticketInfo, 'Ticket(s) printed');
})

module.exports = router;