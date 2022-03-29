require('dotenv').config();

//Define vars used for program wide use
function define(name, value) {
    Object.defineProperty(exports, name, {
        value: value,
        enumerable: true
    });
}

// Dymo constants
define("xmlFileName", process.env.XML_FILE_NAME);
define("printerName", process.env.DYMO_PRINTER_NAME);
define("dymoServicePath", process.env.DYMO_SERVICE_PATH);
define("dymoHostname", process.env.DYMO_HOSTNAME);
define("dymoPort", process.env.DYMO_PORT);

// Server constants
define("protocol", process.env.AUTODYMO_PROTOCOL ? process.env.AUTODYMO_PROTOCOL : "http");
define("testing", process.env.TEST_MODE === "true");
define("authKey", process.env.AUTODYMO_AUTH_KEY);
define("whitelist", process.env.AUTODYMO_IP_WHITELIST)
define("loggerUrl", process.env.LOGGER_URL)
define("loggerPort", process.env.LOGGER_PORT)

