const codeToStatus = require("./codeToError");

module.exports = function(code, res, bounceBack, message){
    //Send the response
    res.status(code).json({
        code: code + " (" + codeToStatus(code) + ")",
        message: message,
        bounceBack: bounceBack
    })
    //End the response
    res.end();
}