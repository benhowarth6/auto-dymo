const express = require('express');
const getTickets = require('../util/dbhandlers/getTickets');
const labelPrinter = require("../util/dymoLabel");
const getDateTime = require('../util/getDateTime');
const checkAuth = require('../util/httpHelpers/checkAuth');
const returnCode = require('../util/httpHelpers/returnCode');
const router = express.Router()

//Handle DELETE requests
router.put('/:ticketNumber', (req, res, next) => {

    //Log the IP of invalid requests - skimmer catching
    var logIp = req.socket.remoteAddress;
    //If the IP begins with "::ffff:", trim it off
    if(logIp.substr(0, 7) === '::ffff:') logIp = logIp.substr(7)

    console.log("\n\n" + getDateTime() + " New PUT (print) request from " + logIp + ":");

    var numberOfLabels = req.body.numberOfLabels;
    if(numberOfLabels == null) numberOfLabels = 1;

    //Grab basic ticket info
    const ticketInfo = {
        ticketNumber: req.params.ticketNumber,
        user: req.body.user,
        authKey: req.body.authKey
    }

    var authed = checkAuth(res, req, ticketInfo.authKey);
    if(!authed) return;

    //Grab a list of all active tickets
    let tickets = getTickets();

    //If the ticket is active
    if(tickets.includes(ticketInfo.ticketNumber)){

        //Shorten string to everything after the ticket number
        let ticketsShortened = tickets.substring(tickets.indexOf(ticketInfo.ticketNumber));
            
        //Get the first name in the string 
        if(ticketsShortened.includes('\n')){
            ticketInfo.user = ticketsShortened.substring(ticketsShortened.indexOf('-') + 2, ticketsShortened.indexOf('\n'));
        }
        else{
            ticketInfo.user = ticketsShortened.substring(ticketsShortened.indexOf('-') + 2, ticketsShortened.length);
        }

        console.log("Number of labels: " + numberOfLabels)

        for(let i = 0; i < numberOfLabels; i++){
            //Send the print command
            labelPrinter(ticketInfo.ticketNumber, ticketInfo.user);
            //Log each print
            console.log('Label printed')
        }

        //log the information
        console.log(ticketInfo);
    
        //Success response
        returnCode(200, res, ticketInfo, 'Ticket printed')
        return;
    }
    //Log the invalid ticket
    console.log(ticketInfo);

    //Doesn't exist response, send bad data back to user
    returnCode(404, res, ticketInfo, "Ticket doesn't exist in DB")
});

module.exports = router;