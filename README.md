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
2. The DYMO integration makes use of the DYMO WebService. Install [DYMO Label](https://www.dymo.com/compatibility-chart.html), as the WebService is packaged in this installation. As part of the DYMO setup for this server, you will need to configure a 'Label Format', which will be used to configure how the label looks when it is printed. For information on how to acquire this XML file, please see the [dymojs Documentation](https://openbase.com/js/dymojs/documentation). Two lines of text are printed by the dymojs integration: `name`, and `ticketNumber`. Although both get inserted in the same `<Element>`, the newline character will split them into separate elements, requiring two definitions:

    ```
    <StyledText>
        <Element>
            <String>(You can put any text here, it will be replaced)</String>
            <Attributes> ... </Attributes>
        </Element>
        <Element>
            <String>(Leave the second element in place, with the same formatting)</String>
            <Attributes> ... </Attributes>
        </Element>
    </StyledText>
    ```

    Take a look at `./label_xmls/default.xml` for a detailed example of how this XML file should look.

    **Once you have this XML file, it will need to be placed in the `label_xmls` folder: `./auto-dymo/label_xmls`. Once the file is present here, you will need to update the `.env` file with the full name of the file.**
    
---
3. Clone the source, and open the root directory in a terminal window.
---
4. The following dependencies are currently required, and must be installed before use (Either **`npm install -g [packagename]`** for each package, or **`npm install`** to tell node to install all dependencies). An up-to-date list of dependencies can always be found at the botton of **`./package.json`**:
    * [`dotenv`](https://www.npmjs.com/package/dotenv)
    * [`express`](https://www.npmjs.com/package/express)
    * [`morgan`](https://www.npmjs.com/package/morgan)
    * [`node-fetch@2.6.1`](https://www.npmjs.com/package/node-fetch) **Dependent on version 2.6.1**
    * [`node-hide-console-window`](https://www.npmjs.com/package/node-hide-console-window)
    * [`nodemon`](https://www.npmjs.com/package/nodemon)
    * [`winston@2.4.5`](https://www.npmjs.com/package/winston) **Dependent on version 2.4.5**
    * [`winston-papertrail`](https://www.npmjs.com/winston-papertrail)
    * [`xml-js`](https://www.npmjs.com/package/xml-js)
---
5. The server is setup to log all events and information to an external [Papertrail](https://papertrailapp.com/) log. To set this up, create a Papertrail account. In <kbd>Settings</kbd> > [<kbd>Log Destiniations</kbd>](https://papertrailapp.com/account/destinations), you will have the option to <kbd>Create Log Destiniation</kbd>. Once you do, you will be provided with a destination URL and a destination port. This information will be needed in the next step.**<sup>[1](#papertrailfootnote)</sup>**
---
6. The **`.env`** file will need to be created (if it does not exist already) in the root of the server (same location as **`app.js`**), and must have the following properties defined:

    ```
    AUTODYMO_AUTH_KEY= #(Authorization key)
    DYMO_PRINTER_NAME= #(Friendly name of Dymo printer)
    AUTODYMO_IP_WHITELIST= #(IP subnet that should be whitelisted)
    LOGGER_URL= #(URL for Papertrails)
    LOGGER_PORT= #(Port for Papertrails)
    TEST_MODE= #(Test mode will show terminal, true or false)
    DYMO_SERVICE_PATH = #"(Path to DYMO.DLS.Printing.Host.exe)"

    ```

    If you choose to use a custom port for the server (defaulted to 3000), you will also need to define the port with a valid (0 to 65353), unused port number;

    ```
    PORT= #(Server port number)
    ```

    If you are using a custom XML file for label configurations, you will need to place the file in `./auto-dymo/label_xmls/`, and specify the file's name. Make sure to include the `.xml` file extension in the name.;

    ```
    XML_FILE_NAME= #(Name of XML file)
    ```
    If your DYMO Configuration is customized, or if you are aiming the server to print on a different device, you will need to specify the hostname and port of the DYMO WebService:

    ```
    DYMO_HOSTNAME= #(Hostname of DYMO WebService)
    DYMO_PORT= #(Port of DYMO WebService)
    ```

    <details>
    <summary>(<b><i>Example <code>.env</code> File</i></b>)</summary>
    <!-- have to be followed by an empty line! -->

        AUTODYMO_AUTH_KEY= authKey123 
        AUTODYMO_IP_WHITELIST= 192.168.1.4
        PORT= 4567
        TEST_MODE= false

        LOGGER_URL= logs1.papertrailapp.com
        LOGGER_PORT= 12345

        XML_FILE_NAME= default.xml
        DYMO_PRINTER_NAME= "DYMO LabelWriter 450"
        DYMO_SERVICE_PATH = "C:/Program Files/DYMO/DYMO Label/WebService/"
        DYMO_HOSTNAME= anothercomputer.my.domain
        DYMO_PORT= 41951
    </details>

---
7. Port 3000 (or the port defined in the environment variables) will need to be opened. Depending on the local machine's firewall, and your networking setup, this process may wildly vary. The base functionality requires that HTTP requests can be both sent and received using the port.
---

### **Server Startup**

* **`npm start`** should be used to start the server, as npm is setup to:

    * Pull the latest version of the server from GitHub before starting the server.
    * Install dependencies (if not already installed)
    * Using [nodemon](https://www.npmjs.com/package/nodemon), listen for local changes to code, and restart the server when changes are detected.  
* The server should be running all the time, meaning a startup script to run the server may be ideal. The following is a very basic batch script (theoretically cross-os) that would be placed in the startup folder for a user or the system:

    ```
    cd "[path\to\auto-dymo]"
    npm start
    ```
* In the same startup folder, place a shortcut to the `DYMO WebService`. The raw file for this service will likely be named `DYMO.DLS.Printing.Host.exe`. 
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