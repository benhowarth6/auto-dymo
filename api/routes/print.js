const express = require('express');
const getTickets = require('../util/dbhandlers/getTickets');
const labelPrinter = require("../util/dymoLabel");
const getDateTime = require('../util/getDateTime');
const router = express.Router()

//Handle DELETE requests
router.put('/:ticketNumber', (req, res, next) => {

    console.log("\n\n" + getDateTime() + " New PUT (print) request:");

    const numberOfLabels = req.body.numberOfLabels;

    //Grab basic ticket info
    const ticketInfo = {
        ticketNumber: req.params.ticketNumber,
        user: req.body.user,
        authKey: req.body.authKey
    }

    //Auth key check
    if(ticketInfo.authKey === 'key123'){

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
            res.status(200).json({
                message: 'Ticket printed',
                ticketInfo: ticketInfo
            })
        }
        else{

            //Log the invalid ticket
            console.log(ticketInfo);

            //Doesn't exist response, send bad data back to user
            res.status(404).json({
                message: 'Ticket doesn\'t exist',
                ticketInfo: ticketInfo
            })
        }  
    }
    else{
        //Auth key failed
        console.log('Authentication failed')
        res.status(401).json({
            message: 'Invalid POST key provided'
        })
    }

});

module.exports = router;