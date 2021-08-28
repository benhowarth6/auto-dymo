function define(name, value) {
    Object.defineProperty(exports, name, {
        value: value,
        enumerable: true
    });
}

//Program wide use
define("authKey", 'key123');
define("printerName", 'DYMO LabelWriter 450');
define("testing", false);