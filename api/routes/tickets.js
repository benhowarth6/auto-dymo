const express = require('express');
const addTicket = require('../util/dbhandlers/addTicket');
const removeTicket = require('../util/dbhandlers/removeTicket');
const getTickets = require('../util/dbhandlers/getTickets');
const router = express.Router();

const labelPrinter = require("../util/dymoLabel");
const getDateTime = require('../util/getDateTime');
const { restart } = require('nodemon');

//Handle POST requests
router.post('/', (req, res, next) => {

    //New request logging
    console.log("\n\n" + getDateTime() + " New POST request:");

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

    //Check for auth key - Waiting on helming for a _real_ auth key
    if(ticketInfo.authKey === 'key123'){

        //Substrings to test for validity in ticket number
        var ticketNumRITM = ticketInfo.ticketNumber.substring(0, 4);
        var ticketNumINC = ticketInfo.ticketNumber.substring(0, 3);

        //Conditions must be met to continue
        var validCont = false;

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
                res.status(200).json({
                    message: 'Ticket was POSTed',
                    ticketInfo: ticketInfo
                })                
            }
            else{
                //Send success response
                res.status(409).json({
                    message: 'Ticket already exists in the DB',
                    ticketInfo: ticketInfo
                })   
            }

        }
        else{

            //Bad syntax in POST request
            res.status(400).json({
                message: 'Bad ticket number syntax',
                ticketInfo: ticketInfo
            })
        }
    }
    else{

        //Bad auth key was provided
        console.log('Authentication failed')
        res.status(401).json({
            message: 'Invalid POST key provided'
        })
    }
    
})

//Handle DELETE requests
router.delete('/:ticketNumber', (req, res, next) => {

    //Log the new request
    console.log("\n\n" + getDateTime() + " New DELETE request:");

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
                removeTicket(ticketInfo.ticketNumber, ticketInfo.user, false);
            }
            else{
                ticketInfo.user = ticketsShortened.substring(ticketsShortened.indexOf('-') + 2, ticketsShortened.length);
                removeTicket(ticketInfo.ticketNumber, ticketInfo.user, true);
            }
            
            //log the information
            console.log(ticketInfo);
        
            //Success response
            res.status(200).json({
                message: 'Ticket deleted',
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

})

//Handle GET requests
router.get('/:ticketNumber', (req, res, next) => {

    //log the new request
    console.log("\n\n" + getDateTime() + " New GET request (specific ticket):");

    //Basic ticket info
    const ticketInfo = {
        ticketNumber: req.params.ticketNumber,
        user : '',
        authKey: req.body.authKey
    }

    //Auth
    if(ticketInfo.authKey === 'key123'){

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
            res.status(200).json({
                message: 'Ticket exists in DB',
                ticketInfo: ticketInfo
            });
        }
        else{
            //Ticket not found - 404
            res.status(404).json({
                message: 'Ticket doesn\'t exist in DB',
                ticketInfo: ticketInfo
            })
        }
    }
    else{
        //Failed auth key
        console.log('Authentication failed')
        res.status(401).json({
            message: 'Invalid POST key provided'
        })
    }
})

router.get('/', (req, res, next) => {

    //log the new request
    console.log("\n\n" + getDateTime() + " New GET request (specific ticket):");

    //Basic ticket info
    const ticketInfo = {
        authKey: req.body.authKey
    }

    //Auth
    if(ticketInfo.authKey === 'key123'){

        //Get list of all active tickets
        var tickets = getTickets();

        //Send back the list - list will be sent in the following format:
        /*     
            {
            "message": "OK",
            "tickets": "RITM0012345 - User Name\nRITM0012346 - Test user\n"
            }
        */

        res.status(200).json({
            message: 'OK',
            tickets: tickets
        })

    }
    else{
        //Failed auth key
        console.log('Authentication failed')
        res.status(401).json({
            message: 'Invalid auth key provided'
        })
    }

})


module.exports = router;
