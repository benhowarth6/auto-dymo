require('dotenv').config();

function define(name, value) {
    Object.defineProperty(exports, name, {
        value: value,
        enumerable: true
    });
}

//Program wide use
define("authKey", process.env.AUTODYMO_AUTH_KEY);
define("printerName", process.env.AUTODYMO_PRINTER_NAME);
define("whitelist", process.env.AUTODYMO_IP_WHITELIST)
define("loggerUrl", process.env.LOGGER_URL)
define("loggerPort", process.env.LOGGER_PORT)
define("testing", process.env.TEST_MODE === "true");
define("labelPath", process.env.LABEL_PATH);