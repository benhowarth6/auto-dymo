const express = require('express');
const addTicket = require('../util/dbhandlers/addTicket');
const removeTicket = require('../util/dbhandlers/removeTicket');
const getTickets = require('../util/dbhandlers/getTickets');
const router = express.Router();

const labelPrinter = require("../util/dymoLabel");
const getDateTime = require('../util/getDateTime');

router.post('/', (req, res, next) => {

    console.log("\n\n" + getDateTime() + " New POST request:");

    const ticketInfo = {
        ticketNumber: req.body.ticketNumber,
        user: req.body.user,
        authKey: req.body.authKey
    }

    console.log(ticketInfo);
    var numberOfLabels;

    if(req.body.numberOfLabels === undefined) numberOfLabels = 2;
    else numberOfLabels = req.body.numberOfLabels;

    if(ticketInfo.authKey === 'key123'){

        addTicket(ticketInfo.ticketNumber, ticketInfo.user);

        for(let i = 0; i < numberOfLabels; i++){
            labelPrinter(ticketInfo.ticketNumber, ticketInfo.user);
            console.log('Label printed')
        }
        
        res.status(200).json({
            message: 'Received data',
            ticketInfo: ticketInfo
        })
    }
    else{
        console.log('Authentication failed')
        res.status(401).json({
            message: 'Invalid POST key provided'
        })
    }
    
})

router.delete('/:ticketNumber', (req, res, next) => {
    console.log("\n\n" + getDateTime() + " New DELETE request:");

    const ticketInfo = {
        ticketNumber: req.params.ticketNumber,
        user: req.body.user,
        authKey: req.body.authKey
    }

    console.log(ticketInfo);

    if(ticketInfo.authKey === 'key123'){

        let tickets = getTickets();

        //Shorten string to everything after the ticket number
        let ticketsShortened = tickets.substring(tickets.indexOf(ticketInfo.ticketNumber));
            
        //Get the first name in the string 
        ticketInfo.user = ticketsShortened.substring(ticketsShortened.indexOf('-') + 2, ticketsShortened.indexOf('\n'));  

        removeTicket(ticketInfo.ticketNumber, ticketInfo.user);
        
        res.status(200).json({
            message: 'Ticket deleted',
            ticketInfo: ticketInfo
        })
    }
    else{
        console.log('Authentication failed')
        res.status(401).json({
            message: 'Invalid POST key provided'
        })
    } 

})

router.get('/:ticketNumber', (req, res, next) => {

    console.log("\n\n" + getDateTime() + " New GET request:");

    const ticketInfo = {
        ticketNumber: req.params.ticketNumber,
        user : '',
        authKey: req.body.authKey
    }

    if(ticketInfo.authKey === 'key123'){

        let tickets = getTickets();
        if(tickets.includes(ticketInfo.ticketNumber)){

            //Ticket exists, find user from ticket number

            //Shorten string to everything after the ticket number
            let ticketsShortened = tickets.substring(tickets.indexOf(ticketInfo.ticketNumber));
            
            //Get the first name in the string 
            ticketInfo.user = ticketsShortened.substring(ticketsShortened.indexOf('-') + 2, ticketsShortened.indexOf('\n'));   

            res.status(200).json({
                message: 'Ticket exists in DB',
                ticketInfo: ticketInfo
            });

            console.log(ticketInfo);
        }
        else{
            res.status(404).json({
                message: 'Ticket doesn\'t exist in DB',
                ticketInfo: ticketInfo
            })
        }
    }
    else{
        console.log('Authentication failed')
        res.status(401).json({
            message: 'Invalid POST key provided'
        })
    }
})

module.exports = router;