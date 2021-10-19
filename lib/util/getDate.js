function getDate(){

    let date_ob = new Date();

    return("[" + ("0" + (date_ob.getMonth() + 1)).slice(-2) + "-" //Month
    + ("0" + date_ob.getDate()).slice(-2) + "]");
}

module.exports = getDate;