const getDateTime = require('./getDateTime');
const returnCode = require('./returnCode');

var constants = require('../constants');
const logger = require('./logger');

//Helper function for checking auth
function checkAuth(res, req, provAuthKey){

    //IP must either match the whitelist, or the authkey must be provided
    if(req.socket.remoteAddress.replace("::ffff",'').substr(0,10) === constants.whitelist || (provAuthKey === constants.authKey)) return true;

    //Bad auth key was provided, or sender does not have a whitelisted ip
    logger.log('info', "\n\n" + getDateTime() + " Authentication failed from " + req.socket.remoteAddress.replace("::ffff",'') + ":")
    logger.log('info', req.body)
    returnCode(401, res, null, 'Invalid authentication method provided')
    return false;
}

module.exports = checkAuth;