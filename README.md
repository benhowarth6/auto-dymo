### **Overview**

This server is meant to be running on DJGorilla and SlimMonkey 24/7, and will handle automatically printing tickets when necessary in the workflow. It also receives requests from the tampermonkey script when the <kbd>Print Label</kbd> button is pressed.

### **Setup for the server**

* Port 3000 will need to be opened, or there will need to be another port set as a local environment variable.
* The following dependencies are currently required, and must be installed before use (`npm install -g [packagename]`). An up-to-date list of dependencies can always be found at the botton of `./package.json`:
    * `express`
    * `dotenv`
    * `dymojs`
    * `morgan`
    * `nodemon`
    * `winston`
    * `express-winston`
* `npm start` should be used to start the server, as this will listen for local changes to the code, and restart the server automatically.
* The `.env` file will need to be created in the root of the server (same folder location as `app.js`) **only if it does not already exist**, and must have the following properties defined:
    * `AUTODYMO_AUTH_KEY= (Authorization key)`
    * `AUTODYMO_PRINTER_NAME= (Friendly name of Dymo printer, ex: 'DYMO LabelWriter 450')`
    * `AUTODYMO_IP_WHITELIST= (IP subnet that should be whitelisted, ex: 192.168.4)` 
    * `LOGGER_URL= (URL for Papertrails)`
    * `LOGGER_PORT= (Port for Papertrails)`
    * If port 3000 is not being used for runtime, `PORT= ...` must also be defined with a valid port number (0 to 65353).


### **Sending a Print Request to the Server**

## **Full HTTP Address: `[hostname]:3000/print`**

* **PUT**
    * Print a label for a ticket given an RITM or INC number, and a user's name
    * JSON formatting for PUT request:
        ```javascript
        {
            "ticketNumber": "RITM0012345",
            "user": "FirstName LastName",
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
        * 401: Authentication failed
        * 404: The syntax for the ticket number was incorrect
    

    
