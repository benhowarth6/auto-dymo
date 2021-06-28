const express = require('express');
const router = express.Router();

const labelPrinter = require("../util/dymoLabel");
const getDateTime = require('../util/getDateTime');

router.post('/', (req, res, next) => {

    console.log("\n\n" + getDateTime() + " New POST request:");

    const ticketInfo = {
        ticketNumber: req.body.ticketNumber,
        user: req.body.user,
        postKey: req.body.postKey
    }

    console.log(ticketInfo);

    var numberOfLabels;

    if(req.body.numberOfLabels === undefined) numberOfLabels = 2;
    else numberOfLabels = req.body.numberOfLabels;

    if(ticketInfo.postKey === 'key123'){
        for(let i = 0; i < numberOfLabels; i++){
            //labelPrinter(ticketInfo.ticketNumber, ticketInfo.user);
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

module.exports = router;