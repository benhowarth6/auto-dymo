
### **Overview**

This server is meant to be running on DJGorilla and SlimMonkey 24/7, and will handle automatically printing tickets when necessary in the workflow. It also talks to the client program when a print or delete is asked.

### **Setup for the server**

* Port 3000 will need to be opened, or there will need to be another port [set as an environment variable](https://stackoverflow.com/questions/13333221/how-to-change-value-of-process-env-port-in-node-js).
* The current dependencies are required, and must be installed before use (`npm install -g [packagename]`). An up-to-date list of dependencies can always be found at the botton of `./package.json`.
    * `express`
    * `dymojs`
    * `morgan`
    * `nodemon`
* `npm start` should be used to start the server, as this will listen for local changes to the code, and restart the server automatically.

### **Valid HTTP requests**

## **`[host or ip]:3000/tickets`**

* **POST**
    * Adds a new ticket to the database, given it does not already exist
    * JSON formatting for POST request:
        ```javascript
        {
            "ticketNumber": "RITM0012345",
            "user": "David Cole",
            "authKey": "[authentication key here]",
            "numberOfLabels": "[number of labels to be printed]"
        }
        ```
    * Ticket _must_ start with RITM or INC followed by 7 numbers
    * The field 'numberOfLabels' is not required, and will default to 2
    * Possible codes returned from **POST**:
        * 200: The ticket was added successfully
        * 400: The syntax for the ticket number was incorrect
        * 401: The authentication key provided was incorrect
<br>

* **GET**
    * Returns a list of all tickets currently in the database
    * JSON formatting for GET request:
        ```javascript
        {
            "authKey": "[authentication key here]",
        }
        ```
    * The data will be returned in the following format:
        ```javascript
        {
            "message": "OK",
            "tickets": "RITM0012345 - User Name\nRITM0012346 - Test user\n"
        }
        ```
    * Possible codes returned from **GET**:
        * 200: The ticket list was retrieved successfully
        * 401: The authentication key provided was incorrect
<br>

## **`[host or ip]:3000/tickets/[ticket number]`**

* **DELETE**
    * Will delete a ticket from the database, given it exists
    * JSON formatting for DELETE request:
        ```javascript
        {
            "authKey": "[authentication key here]",
        }
        ```
    * Possible codes returned from **DELETE**:
        * 200: The ticket was added successfully
        * 401: The authentication key provided was incorrect
        * 404: The syntax for the ticket number was incorrect, or the ticket does not exist
<br>

* **GET**
    * Returns information on the ticket number provided, given it exists
    * JSON formatting for GET request:
        ```javascript
        {
            "authKey": "[authentication key here]",
        }
        ```
    * The data will be returned in the following format:
        ```javascript
        {
            "message": "Ticket exists in DB",
            "ticketInfo": {
                "ticketNumber": "RITM0012345",
                "user": "User Name",
                "authKey": "[authentication key here]"
            }
        }
        ```
    * Possible codes returned from **GET**:
        * 200: The ticket exists in the database
        * 401: The authentication key provided was incorrect
        * 404: The syntax for the ticket number was incorrect, or the ticket does not exist

## **`[host or ip]:3000/print/[ticket number]`**

* **PUT**
    * Prints a ticket that already exists in the database
    * JSON formatting for PUT request:
        ```javascript
        {
            "ticketNumber": "RITM0012345",
            "authKey": "[authentication key here]",
            "numberOfLabels": "[number of labels to be printed]"
        }
        ```
    * The field 'numberOfLabels' is **required** in this case
    * The data will be returned in the following format:
        ```javascript
        {
            "message": "Ticket printed",
            "ticketInfo": {
                "ticketNumber": "RITM0012345",
                "user": "User Name",
                "authKey": "key123"
            }
        }
        ```
    * Possible codes returned from **DELETE**:
        * 200: The ticket was added successfully
        * 401: The authentication key provided was incorrect
        * 404: The syntax for the ticket number was incorrect, or the ticket does not exist
    

    
