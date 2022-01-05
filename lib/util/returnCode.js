const codeToStatus = require("./codeToError");

//Helper function for quick return codes
function returnCode(code, res, bounceBack, message){
    //Send the response
    res.status(code).json({
        code: code + " (" + codeToStatus(code) + ")",
        message: message,
        bounceBack: bounceBack
    })
    //End the response
    res.end();
}

module.exports = returnCode;