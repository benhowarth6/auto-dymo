//Helper function for quick return codes
function returnCode(code, res, bounceBack, message){
    res.status(code).json({
        message: message,
        bounceBack: bounceBack
    })
}

module.exports = returnCode;