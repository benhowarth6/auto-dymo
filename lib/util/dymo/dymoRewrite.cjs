'use strict';

// Initialize the fetcher to interact with the Dymo services
let fetcher = require('node-fetch');

module.exports = class DymoHandler {

    // Construct a new DymoHandler instance
    constructor(options) {
        options = options || {};

        this.hostname = options.hostname;
        this.port = options.port;
        this.printerName = options.printerName;
        if(!this.printerName) throw new Error('Printer name is required, but was not found.');

        // Construct the API URL
        this.apiUrl = `https://${this.hostname}:${this.port}/DYMO/DLS/Printing`;
    }

    // Call Dymo API to print label
    async print(labelXml){
        let label = `printerName=${encodeURIComponent(this.printerName)}&printParamsXml=&labelXml=${encodeURIComponent(labelXml)}`;

        const response = await fetcher(`${this.apiUrl}/PrintLabel`, {
            method: 'POST',
            body: label,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return response.text();
    }
}