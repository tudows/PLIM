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
2. Please rename the "config/xxxConfig - example.json" to "config/xxxConfig.json"
3. Edit the database's ip, port, database, username and password to your owen in the mongodbConfig.json and redisConfig.json
4. If be necessary, you can change the site port in the globalConfig.json

**About Debug & Develop**
* If you want to debug by vscode, please move the http method out of the cluster(like the annotation).
* There is a existing typings.json, you can "typings install" directly.
* The custom "*.d.ts" is in the "typings/my/".

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
* If you use the https protocol, the html5 cache may be not work.<br/>
If dont work, you can try to use the reverse proxy or other technology such as config the nginx.

**About Encrypt & Decrypt**
* The encrypt use the private key encrypt and through the **RSA** algorithm.
* The decrypt use the public key encrypt and through the **RSA** algorithm.
* The private and public keys use the https ssl key. Of course you can change to use personal keys easily.
* Significantly, the encrypted data size is limited by the key's size. If you have not enough size of the key, you can not encrypt too big data.

**QRCode API**
* Smart Analyse<br/>
Smart identify the qrcode and redirect to the correct url.
> **Usage:** "/qrcode/analyse/xxx"<br/>
> * xxx is the qrcode. Must know that this qrcode will be decrypted in the system, so the qrcode must be an encrypted code.
> * The first five chars of the qrcode is the identifier. For example:<br/>
The encrypted code is "Wm0CgT8pz%7CDI8MZy3NwolNcyQRNb"<br/>
Then the qrcode is "**APLXX**Wm0CgT8pz%7CDI8MZy3NwolNcyQRNb", with the "**APLXX**" system can analyse the encrypted code meaning.<br/>
So the qrcode should be generate by the code "**APLXX**Wm0CgT8pz%7CDI8MZy3NwolNcyQRNb" rather than "Wm0CgT8pz%7CDI8MZy3NwolNcyQRNb".<br/>
The identifier can be changed in the system.

* Encrypt<br/>
Encrypt the date by the rsa and return the trsult
> **Usage** "/qrcode/encrypt/xxx"<br/>
> * The key use the https ssl key.
> * The detail of the encrypt please reference the "**About Encrypt & Decrypt**".

* Decrypt<br/>
Decrypt the date by the rsa and return the trsult
> **Usage** "/qrcode/decrypt/xxx"<br/>
> * The key use the https ssl key.
> * The detail of the decrypt please reference the "**About Encrypt & Decrypt**".


**Operation Parameter Interface**
> **Usage** "/powerLine/updateOperationParameter"<br/>
> * Only receive post
> * the data as follow: <br/>
{<br/>
&#160; &#160; &#160; &#160;_id: _id,<br/>
&#160; &#160; &#160; &#160;volt: volt,<br/>
&#160; &#160; &#160; &#160;ampere: ampere,<br/>
&#160; &#160; &#160; &#160;ohm: ohm,<br/>
&#160; &#160; &#160; &#160;celsius: celsius,<br/>
&#160; &#160; &#160; &#160;pullNewton: pullNewton<br/>
}

Known Bug
------------------------------
1. When update the GPS information on the map, the map will not be very smooth.
2. Some powerline cant display navigate line.

Future ( I don't promiss I will realize it :) )
------------------------------
N/A

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
* Add a get_powerline test qrcode image in [/test/qrcode/get_powerline.png](https://github.com/tudows/PLIM/blob/master/test/qrcode/get_powerline.png)

**2016-04-08**
* Change the symbol of the current position in the map.
* Optimize the position page, the page will only load once.
* Optimize the back navigate.
* Change the refresh icon.
* Fix the bug 'Cannot display the navigate line between powerline and current position'.
* Adjust the interval of the real-time GPS.

**2016-04-09**
* Adjust the interval of the real-time GPS.
* Add the html5 cache.(May be don't work with https)

**2016-04-09**
* Add the cluster module to do the multi core balanced load.
* Fix the html5 cache bug.

**2016-04-11**
* Can add the powerline by scan the qr code.
* Unify the qr code interface. Smart judge the qr meaning then automatically jump the corresponding url.
* Add a open interface of the qrcode.
* Add a add_powerline test qrcode image in [/test/qrcode/add_powerline.png](https://github.com/tudows/PLIM/blob/master/test/qrcode/add_powerline.png)

**2016-04-24**
* Divide the app.js to controller, service.
* Add the fingerprint2 to the project.
* Adjust the position of the js in the project.

**2016-04-25**
* Add the generate-salt method and generate-sha256 method in "cryptoUtil".
* Add the auto login system by device-finger(generate by fingerprint2).
* Add the device register system.

**2016-04-26**
* Add the function of updating the user's last information into the database.

**2016-04-27**
* Add "Async" module.
* Restruct the model by using the mongodb's reference.
* Fix a login bug.
* Add the bmap Geocoder function.
* Add the baseDataDAO.
* Use the advanced query method on the province query.
* Adjust the ui of the add-powerline page.

**2016-04-29**
* Add the global exception catch.

**2016-04-30**
* Add the VS Code debug config.
* Add the typings.json.
* Add custom "*.d.ts".
* Import baidu weather api, the powerline weather information is from baidu.
* Add the function to update the powerline's parameter at regular time.

**2016-05-02**
* Open the interface of powerline operation parameter entering.
* Add momently monitor of powerline operation parameter.
* Add the standard operation parameter of the powerline.

**2016-05-03**
* Add a angular plugn - "radialIndicator".
* Graphical display the momently parameter of the powerline in the powerline detail page.
* Optimize the process of register.

**2016-05-04**
* Add the function of unbind device.

**2016-05-08**
* Add the hadoop into the project. The hadoop project is in the "hadoop/", code by java. You can build by "mvn assembly:assembly" and run by "yarn jar xxx".
* Add the healthy calculate by hadoop.

**2016-05-09**
* Independent the interval job into the "jobs/" (not Steve Jobs :) ).
* Add the smart maintain analyze.

**2016-05-10**
* Adjust the dao.


License
------------------------------
[GNU](https://github.com/tudows/PLIM/blob/master/LICENSE)
