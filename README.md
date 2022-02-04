### **Overview**

This server is meant to be running on a shared computer or server constantly, and will handle HTTP requests to print labels automatically or semi-automatically to speed up workflow. The server itself is written in NodeJS, and is functionally a RESTful server.

### **Setup for the server**

---
1. The server is written in NodeJS. Use the [the NodeJS installer](https://nodejs.org/en/), and make sure during installation, you install **`npm`**, as this will be needed. If the following commands spit out version numbers, installation completed correctly:

    ```
    node -v
    npm -v
    ```
---
2. The DYMO integration makes use of the DYMO WebService. Install [DYMO Label](https://www.dymo.com/support?cfid=user-guide), as the WebService is packaged in this installation. As part of the DYMO setup for this server, you will need to configure a 'Label Format', which will be used to configure how the label looks when it is printed. For information on how to acquire this XML file, please see the [dymojs Documentation](https://openbase.com/js/dymojs/documentation).

**Once you have this XML file, it will need to be placed in root folder ../auto-dymo/ (the same directory as server.js)**
---
3. Clone the source, and open the root directory in a terminal window.
---
4. The following dependencies are currently required, and must be installed before use (Either **`npm install -g [packagename]`** for each package, or **`npm install`** to tell node to install all dependencies). An up-to-date list of dependencies can always be found at the botton of **`./package.json`**:
    * [`dotenv`](https://www.npmjs.com/package/dotenv)
    * [`dymojs`](https://www.npmjs.com/package/dymojs)
    * [`express`](https://www.npmjs.com/package/express)
    * [`express-winston`](https://www.npmjs.com/package/express-winston)
    * [`morgan`](https://www.npmjs.com/package/morgan)
    * [`node-hide-console-window`](https://www.npmjs.com/package/node-hide-console-window)
    * [`nodemon`](https://www.npmjs.com/package/nodemon)
    * [`winston`](https://www.npmjs.com/package/winston)
    * [`winston-papertrail`](https://www.npmjs.com/winston-papertrail)
---
5. The server is setup to log all events and information to an external [Papertrail](https://papertrailapp.com/) log. To set this up, create a Papertrail account. In <kbd>Settings</kbd> > [<kbd>Log Destiniations</kbd>](https://papertrailapp.com/account/destinations), you will have the option to <kbd>Create Log Destiniation</kbd>. Once you do, you will be provided with a destination URL and a destination port. This information will be needed in the next step.**<sup>[1](#papertrailfootnote)</sup>**
---
6. The **`.env`** file will need to be created (if it does not exist already) in the root of the server (same location as **`app.js`**), and must have the following properties defined:

    ```
    AUTODYMO_AUTH_KEY= #(Authorization key)
    AUTODYMO_PRINTER_NAME= #(Friendly name of Dymo printer, ex: 'DYMO LabelWriter 450')
    AUTODYMO_IP_WHITELIST= #(IP subnet that should be whitelisted, ex: 192.168.4)
    LOGGER_URL= #(URL for Papertrails)
    LOGGER_PORT= #(Port for Papertrails)
    TEST_MODE= #(Whether or not terminal output should be displayed, should be true or false)

    ```

    If you choose to use a custom port for the server (defaulted to 3000), you will also need to define the port with a valid (0 to 65353), unused port number;

    ```
    PORT= #(Server port number)
    ```

    For formatting help, or other issues with the **`.env`** file, see [Node's documentation](https://nodejs.dev/learn/how-to-read-environment-variables-from-nodejs).
---
7. Port 3000 (or the port defined in the environment variables) will need to be opened. Depending on the local machine's firewall, and your networking setup, this process may wildly vary. The base functionality requires that HTTP requests can be both sent and received using the port.
---

### **Server Startup**

* **`npm start`** should be used to start the server, as npm is setup to:

    * Pull the latest version of the server from GitHub before starting the server.
    * Using [nodemon](https://www.npmjs.com/package/nodemon), listen for local changes to code, and restart the server when changes are detected.  
* The server should be running all the time, meaning a startup script to run the server may be ideal. The following is a very basic batch script (theoretically cross-os) that would be placed in the startup folder for a user or the system:

    ```
    cd "[path\to\auto-dymo]"
    npm start
    ```
* In the same startup folder, place a shortcut to the `DYMO WebService`
### **Sending a Print Request to the Server**

The server is made to accept [RESTful HTTP requests](https://www.restapitutorial.com/lessons/httpmethods.html), and thus, to send data to the server, a service that can send REST requests is necessary. For development testing, use [Postman](https://www.postman.com) or another basic request generator. For scripting using Tampermonkey or other injection scripting languages, make use of [`GM.xmlHttpRequest`](https://wiki.greasespot.net/GM.xmlHttpRequest). The main print address for the server will be as follows:

    [hostname]:[port]/print

* For printing labels, send a [PUT request](https://www.restapitutorial.com/lessons/httpmethods.html#put) with the following information:
    * Ticket number
    * Ticket user's name
    * Authentication key (optional inside whitelisted network, but recommended)
    * Number of labels to print (optional, will default to 1 if not provided)
* JSON formatting for PUT request:

    ```javascript
    {
        "ticketNumber": "RITM0012345",
        "user": "FirstName LastName",
        "authKey": "[authentication key here]",
        "numberOfLabels": "[number of labels to be printed]"
    }
    ```
* The data will be returned in the following format:

    ```javascript
    {
        "code": "[200, 401, 400]",
        "message": "[Ticket printed, Invalid authentication method provided, Bad syntax]",
        "ticketInfo": {
            "ticketNumber": "RITM0012345",
            "user": "User Name",
            "authKey": "key123",
            "numberOfLabels": "1"
        }
    }
    ```
* Possible codes returned:
    * 200 (OK): The ticket was printed successfully
    * 401 (Unauthorized): Authentication failed, either the device does not have a whitelisted ip address, or the authentication key is incorrect
    * 400 (Bad Request): The syntax for the ticket number was incorrect

### Footnotes:

**<a name="papertrailfootnote">1</a>**: In theory you can create a token for accessing Papertrail instead of using `URL:port` access, however this is not currently natively integrated.
