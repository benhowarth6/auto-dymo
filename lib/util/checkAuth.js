const getDateTime = require('./getDateTime');
const returnCode = require('./returnCode');

var constants = require('../constants');
const logger = require('./logger');

//Helper function for checking auth
function checkAuth(res, req, provAuthKey){

    //Log the IP of invalid requests - skimmer catching
    var logIp = req.socket.remoteAddress;

    //If the IP begins with "::ffff:", trim it off
    if(logIp.substr(0, 7) === '::ffff:') logIp = logIp.substr(7)
    if(logIp.substr(0,10) === "129.21.190" || (provAuthKey === constants.authKey)) return true;

    //Bad auth key was provided
    logger.log('info', "\n\n" + getDateTime() + " Authentication failed from " + logIp + ":")
    logger.log('info', req.body)
    returnCode(401, res, null, 'Invalid authentication method provided')
    return false;
}

module.exports = checkAuth;