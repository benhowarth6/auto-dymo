const express = require('express');
const addTicket = require('../util/dbhandlers/addTicket');
const removeTicket = require('../util/dbhandlers/removeTicket');
const getTickets = require('../util/dbhandlers/getTickets');
const router = express.Router();

const labelPrinter = require("../util/dymoLabel");
const getDateTime = require('../util/getDateTime');
const { restart } = require('nodemon');
const returnCode = require('../util/httpHelpers/returnCode');
const checkAuth = require('../util/httpHelpers/checkAuth');

//Handle POST requests
router.post('/', (req, res, next) => {

    //Log the IP of invalid requests - skimmer catching
    var logIp = req.socket.remoteAddress;
    //If the IP begins with "::ffff:", trim it off
    if(logIp.substr(0, 7) === '::ffff:') logIp = logIp.substr(7)

    //New request logging
    console.log("\n\n" + getDateTime() + " New POST request from " + logIp + ":");

    //Gets ticket info from the POST
    const ticketInfo = {
        ticketNumber: req.body.ticketNumber,
        user: req.body.user,
        authKey: req.body.authKey
    }

    //Log the info
    console.log(ticketInfo);

    //How many labels should be printed - default is 2. SNow will not POST this value.
    var numberOfLabels;

    if(req.body.numberOfLabels === undefined) numberOfLabels = 2;
    else numberOfLabels = req.body.numberOfLabels;

    //Checks auth key
    var authed = checkAuth(res, req, ticketInfo.authKey);
    if(!authed) return;

    //Substrings to test for validity in ticket number
    var ticketNumRITM = ticketInfo.ticketNumber.substring(0, 4);
    var ticketNumINC = ticketInfo.ticketNumber.substring(0, 3);

    //Conditions must be met to continue
    var validCont = false;

    //User needs to not contain any linebreaks - will break detection methods
    var letters = /^[a-zA-Z\s]*$/;
    if(!ticketInfo.user.match(letters)){
        //Bad syntax in POST request
        returnCode(400, res, ticketInfo, 'Invalid syntax in \"user\" field')
        return;
    }

    if((ticketNumRITM === 'RITM' && !isNaN(ticketInfo.ticketNumber.substring(5, ticketInfo.ticketNumber.length))) 
    || (ticketNumINC === 'INC' && !isNaN(ticketInfo.ticketNumber.substring(4, ticketInfo.ticketNumber.length)))) validCont = true;

    //If conditions are met
    if(validCont){

        var tickets = getTickets();

        if(!tickets.includes(ticketInfo.ticketNumber)){
            addTicket(ticketInfo.ticketNumber, ticketInfo.user);

            //Print however many labels need to be printed
            for(let i = 0; i < numberOfLabels; i++){
                //Send the print command
                labelPrinter(ticketInfo.ticketNumber, ticketInfo.user);
                //Log each print
                console.log('Label printed')
            }
            
            //Send success response
            returnCode(200, res, ticketInfo, 'Ticket was POSTed')         
            return;  
        }
        //Send success response
        returnCode(409, res, ticketInfo, 'Ticket already exists in the DB')
        return;
    }
    //Bad syntax in POST request
    returnCode(400, res, ticketInfo, 'Bad ticket number syntax')
})

//Handle DELETE requests
router.delete('/:ticketNumber', (req, res, next) => {

    //Log the IP of invalid requests - skimmer catching
    var logIp = req.socket.remoteAddress;
    //If the IP begins with "::ffff:", trim it off
    if(logIp.substr(0, 7) === '::ffff:') logIp = logIp.substr(7)

    //Log the new request
    console.log("\n\n" + getDateTime() + " New DELETE request from " + logIp + ":");

    //Grab basic ticket info
    const ticketInfo = {
        ticketNumber: req.params.ticketNumber,
        user: req.body.user,
        authKey: req.body.authKey
    } 

    //Auth key check
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
            removeTicket(ticketInfo.ticketNumber, ticketInfo.user, false);
        }
        else{
            ticketInfo.user = ticketsShortened.substring(ticketsShortened.indexOf('-') + 2, ticketsShortened.length);
            removeTicket(ticketInfo.ticketNumber, ticketInfo.user, true);
        }
        
        //log the information
        console.log(ticketInfo);
    
        //Success response
        returnCode(200, res, ticketInfo, 'Ticket deleted')
        return;
    }
    //Log the invalid ticket
    console.log(ticketInfo);
    //Doesn't exist response, send bad data back to user
    returnCode(404, res, ticketInfo, "Ticket doesn't exist")

})

//Handle GET requests
router.get('/:ticketNumber', (req, res, next) => {

    //Log the IP of invalid requests - skimmer catching
    var logIp = req.socket.remoteAddress;
    //If the IP begins with "::ffff:", trim it off
    if(logIp.substr(0, 7) === '::ffff:') logIp = logIp.substr(7)

    //Log the new request
    console.log("\n\n" + getDateTime() + " New GET request (specific ticket) from " + logIp + ":");

    //Basic ticket info
    const ticketInfo = {
        ticketNumber: req.params.ticketNumber,
        user : '',
        authKey: req.body.authKey
    }

    //Auth
    var authed = checkAuth(res, req, ticketInfo.authKey)
    if(!authed) return;

    //Grab all active tickets
    let tickets = getTickets();

    //Make sure ticket exists
    if(tickets.includes(ticketInfo.ticketNumber)){

        //Ticket exists, find user from ticket number

        //Shorten string to everything after the ticket number
        let ticketsShortened = tickets.substring(tickets.indexOf(ticketInfo.ticketNumber));
        
        //Get the first name in the string 
        ticketInfo.user = ticketsShortened.substring(ticketsShortened.indexOf('-') + 2, ticketsShortened.indexOf('\n'));   

        //log ticket info
        console.log(ticketInfo);

        //Success response
        returnCode(200, res, ticketInfo, 'Ticket exists in DB')
        return;
    }
    //Ticket not found - 404
    returnCode(404, res, ticketInfo, "Ticket doesn't exist in DB")
})

router.get('/', (req, res, next) => {

    //Log the IP of invalid requests - skimmer catching
    var logIp = req.socket.remoteAddress;
    //If the IP begins with "::ffff:", trim it off
    if(logIp.substr(0, 7) === '::ffff:') logIp = logIp.substr(7)

    //Log the new request
    console.log("\n\n" + getDateTime() + " New GET request (all tickets) from " + logIp + ":");

    //Basic ticket info
    const ticketInfo = {
        authKey: req.body.authKey
    }

    //Auth
    var authed = checkAuth(res, req, ticketInfo.authKey);
    if(!authed) return;

    //Get list of all active tickets
    var tickets = getTickets();

    //Send back the list - list will be sent in the following format:
    /*     
        {
        "message": "OK",
        "tickets": "RITM0012345 - User Name\nRITM0012346 - Test user\n"
        }
    */
    returnCode(200, res, tickets, 'OK')
})


module.exports = router;