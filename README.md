### **Overview**

This server is meant to be running on DJGorilla and SlimMonkey 24/7, and will handle automatically printing tickets when necessary in the workflow. It also talks to the client program and tampermonkey script when a print request is sent.

### **Setup for the server**

* Port 3000 will need to be opened, or there will need to be another port [set as an environment variable](https://stackoverflow.com/questions/13333221/how-to-change-value-of-process-env-port-in-node-js).
* The current dependencies are required, and must be installed before use (`npm install -g [packagename]`). An up-to-date list of dependencies can always be found at the botton of `./package.json`.
    * `express`
    * `dymojs`
    * `morgan`
    * `nodemon`
* `npm start` should be used to start the server, as this will listen for local changes to the code, and restart the server automatically.
* The constant `printerName` inside of `lib/constants.js` will need to be updated to reflect the printer connected to the machine.
    * For SlimMonkey, the printer name is `DYMO LabelWriter 330 Turbo-USB`. In constants: <br>
        ```
        define("printerName", 'DYMO LabelWriter 330 Turbo-USB');
        ```
    * For DJGorilla, the printer name is `DYMO LabelWriter 450`. In constants: <br>
        ```
        define("printerName", 'DYMO LabelWriter 450');
        ```

### **Valid HTTP requests**

## **`[host or ip]:3000/print`**

* **PUT**
    * Prints a ticket that already exists in the database
    * JSON formatting for PUT request:
        ```javascript
        {
            "ticketNumber": "RITM0012345",
            "user": "David Cole",
            "authKey": "[authentication key here]",
            "numberOfLabels": "[number of labels to be printed]"
        }
        ```
    * The field 'numberOfLabels' is **not required** in this case, and will default to 1
    * The data will be returned in the following format:
        ```javascript
        {
            "message": "Ticket printed",
            "ticketInfo": {
                "ticketNumber": "RITM0012345",
                "user": "User Name",
                "authKey": "key123",
                "numberOfLabels": "1"
            }
        }
        ```
    * Possible codes returned from **PUT**:
        * 200: The ticket was printed successfully
        * 401: The authentication key provided was incorrect
        * 404: The syntax for the ticket number was incorrect
    

    
