const returnCode = require('../util/returnCode');

module.exports = function(res, ticketInfo, ticketNum, lengths, startChars ){
    var validIndex = -1;
    startChars.forEach( element =>{ if(ticketNum.startsWith(element)) validIndex = startChars.indexOf(element);});

    //Prefix must be valid
    if(validIndex == -1) return returnCode(400, res, ticketInfo, 'Invalid ticket prefix. Ticket number must start with one of the following: [' + startChars + ']');
    //Ticket must be the correct length
    else if (ticketNum.length !== lengths[validIndex]) return returnCode(400, res, ticketInfo, 'Invalid ticket length (' + ticketNum.length + ') for prefix ' + startChars[validIndex] + '. Ticket must be ' + lengths[validIndex] + ' characters long.');
    //All data following prefix must be numeric
    else if(ticketNum.substr(startChars[validIndex].length).match(/[^0-9]/)) return returnCode(400, res, ticketInfo, 'Invalid ticket number (' + ticketNum.substring(startChars[validIndex].length) + '). Ticket number must be numeric.');
    //All tests passed
    else return true;
}