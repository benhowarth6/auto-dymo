function getDateTime(){

    //Return formatted date and time for console
    return("[" + ("0" + (new Date().getMonth() + 1)).slice(-2) + "-" + //Month
    ("0" + new Date().getDate()).slice(-2) + " "  //Day
    + new Date().getHours() + ":" //Hour
    + new Date().getMinutes() + ":" + new Date().getSeconds() + "]"); //Minute
}

module.exports = getDateTime;
