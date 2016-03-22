PLIM -- Power Line Inspection and Management GPS System
===================================
PLIM is my university's graduation design. And this project is the background system of the design.

This project use nodejs + express + ejs. And to the UI, use the AngularJS.<br>
DateBase I use MongoDB, and nodejs use mongoose module.<br>
The GPS is achieved by BaiduMap API.

Usage
------------------------------
* Please 'npm install' first to install the necessary node_modules
* Please rename the "config/xxxConfig - 副本.json" to "config/xxxConfig.json"
* Edit the database's ip, port, database, username and password to your owen in the mongodbConfig.json and redisConfig.json
* If be necessary, you can change the site port in the globalConfig.json

**How to use https**
* Create the https certificate and place them to the "key/".
* If you change the key's file or key's name, you must change the related setting in the globalConfig.json.

**How to generate https certificate**
* open your terminal, and then:
    1. openssl genrsa -des3 -out server.key 1024
    2. openssl req -new -key server.key -out server.csr
    3. openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt
    4. cp server.key server.key.orig
    5. openssl rsa -in server.key.orig -out server.key

Log
------------------------------
**2016-01-22**
* Add HTTPS to the project.

**2016-01-18:**
* Add the BaiduMap to the project.

**2016-01-15:**
* Add the session module to the project.(The session is stored in the Redis and implemented via 'Hashing Ring'.)
* Add the ui-bootstrap to the project.

**2016-01-14:**
* Construct a auto route match like the .Net MVC.
* Change the mongodb connect to auth.
* Add the angular to the project.
* Add the bower to manager the UI package.(jquery, angular, less and bootstrap)

**2016-01-13:**
* Finish repositorie's creation on github.
* Officially changed the project's name to 'PLIM'.

**2016-01-12:**
* Finish the construct of nodejs, express, ejs and mongoose.

**2016-03-22:**
* I must apologize that although I'm continue developing this project, I was forgotten to update on the github O__O "…
* Remove the ui-bootstrap and change to use ionic so that the project is fully adapt the mobile platform.
* remove the 'bower_components/'.(I have move all the necesary js&css to the 'public/')
* remove the 'node_modules/'.(before run the project, please 'npm install' first)


License
------------------------------
[GNU](https://github.com/tudows/PLIM/blob/master/LICENSE)