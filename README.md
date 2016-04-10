PLIM -- Power Line Inspection and Management GPS System
===================================
PLIM is my university's graduation design.

This project use nodejs + express + ejs. And to the UI framework, use the AngularJS.<br>
DateBase use MongoDB, and operate by mongoose module.<br>
Memory datebase use Redis.<br>
The GIS use BaiduMap.

Usage
------------------------------
1. Please 'npm install' first to install the necessary node_modules
2. Please rename the "config/xxxConfig - 副本.json" to "config/xxxConfig.json"
3. Edit the database's ip, port, database, username and password to your owen in the mongodbConfig.json and redisConfig.json
4. If be necessary, you can change the site port in the globalConfig.json

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

**About Multi Core Balanced Load**
* You can config the cpu core number in the "globalConfig.json".<br/>
If the setting number is greater than 0 and lower or equals than your cpu's real core number (or real thread number of the cpu with multi thread technology),<br/>
the setting will go into effect. Or else, will use all of your cpu's core number or thread number as default.<br/>
So if you don't care how many the core use and want to us the default number, please set the number as 0.

**About Html5 Cache**
* If you use the https protocol, the html5 cache will not work.<br/>
So if you want to cache under the https, please use the reverse proxy or other technology such as config the nginx.

Known Bug
------------------------------
1. When update the GPS information on the map, the map will not be very smooth.
2. Some powerline cant display navigate line.

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
* **I must apologize that although I'm continue developing this project, I was forgotten to update on the github O__O "…**
* Remove the ui-bootstrap and change to use ionic so that the project is fully adapt the mobile platform.
* remove the 'bower_components/'.(I have move all the necesary js&css to the 'public/')
* remove the 'node_modules/'.(before run the project, please 'npm install' first)
* Solve the coordinate-shifting problem of the BMap.
* Success to get the heading of the mobile by html.

**2016-03-20**
* Change the BaiduMapApi from http to https.
* Change to use the BaiduMap's latitude and longitude.
* Add the git ignore list.

**2016-03-31**
* Optimize the controller's allocation.
* Add some common popup.(eg: success popup, error popup, loading popup)
* Merge the two ways of add powerline.

**2016-04-06**
* Adjust the ui design.
* Adjust the route of the ui.
* Change to use the ui-route instead of the ngRoute.
* Add the powerline list page and detail page.
* Add the powerline navigation function.

**2016-04-07**
* Add the encrypt and decipher module -- "crypto".
* Add encrypt and decrypt util.
* Add converter util.
* Encrypt the powerline no by rsa.
* Add the real-time GPS.
* Add the compass head into the real-time GPS.
* Add a test qrcode image in [/public/images/qrtest.png](https://github.com/tudows/PLIM/blob/master/public/images/qrtest.png)

**2016-04-08**
* Change the symbol of the current position in the map.
* Optimize the position page, the page will only load once.
* Optimize the back navigate.
* Change the refresh icon.
* Fix the bug 'Cannot display the navigate line between powerline and current position'.
* Adjust the interval of the real-time GPS.

**2016-04-09**
* Adjust the interval of the real-time GPS.
* Add the html5 cache.(Don't work with https)

**2016-04-09**
* Add the cluster module to do the multi core balanced load.
* Fix the html5 cache bug.


License
------------------------------
[GNU](https://github.com/tudows/PLIM/blob/master/LICENSE)