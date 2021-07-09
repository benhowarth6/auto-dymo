//Helper function for quick return codes
function returnCode(code, res, ticketInfo, message){
    res.status(code).json({
        message: message,
        ticketInfo: ticketInfo
    })
}

module.exports = returnCode;