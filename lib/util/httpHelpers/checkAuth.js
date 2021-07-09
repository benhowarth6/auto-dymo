//Helper function for checking auth
function checkAuth(res, req, provAuthKey){

    var constants = require('../../constants');

    //Log the IP of invalid requests - skimmer catching
    var logIp = req.socket.remoteAddress;

    if(provAuthKey != constants.authKey){
        //If the IP begins with "::ffff:", trim it off
        if(logIp.substr(0, 7) === '::ffff:') logIp = logIp.substr(7)

        //Bad auth key was provided
        console.log("\n\n" + getDateTime() + " Authentication failed from " + logIp + ":")
        returnCode(401, res, null, 'Invalid auth key provided')
        return false;
    }
    return true;
}

module.exports = checkAuth;