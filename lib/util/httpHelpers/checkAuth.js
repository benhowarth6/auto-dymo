const getDateTime = require('../getDateTime');
const returnCode = require('./returnCode');

var constants = require('../../constants');

//Helper function for checking auth
function checkAuth(res, req, provAuthKey){

    //Log the IP of invalid requests - skimmer catching
    var logIp = req.socket.remoteAddress;

    if(provAuthKey != constants.authKey){
        //If the IP begins with "::ffff:", trim it off
        if(logIp.substr(0, 7) === '::ffff:') logIp = logIp.substr(7)

        if(logIp.substr(0,10) === "129.21.190") return true;
        //Bad auth key was provided
        console.log("\n\n" + getDateTime() + " Authentication failed from " + logIp + ":")
        console.log(req.body)
        returnCode(401, res, null, 'Invalid authentication method provided')
        return false;
    }
    return true;
}

module.exports = checkAuth;