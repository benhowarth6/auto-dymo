function getDateTime(){

    let date_ob = new Date();

    //Return formatted date and time for console
    return("[" + ("0" + (date_ob.getMonth() + 1)).slice(-2) + "-" //Month
    + ("0" + date_ob.getDate()).slice(-2) + " "  //Day
    + ("0" + date_ob.getHours()).slice(-2) + ":"  //Hours
    + ("0" + date_ob.getMinutes()).slice(-2) + ":"  //Minutes
    + ("0" + date_ob.getSeconds()).slice(-2) + "]"); //Seconds
}

function getDate(){

    let date_ob = new Date();

    return("[" + ("0" + (date_ob.getMonth() + 1)).slice(-2) + "-" //Month
    + ("0" + date_ob.getDate()).slice(-2) + "]");
}

module.exports = getDateTime;
