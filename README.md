PLIM -- Power Line Inspection and Management GPS System
===================================
PLIM is my university's graduation design. And this project is the background system of the design.

This project use nodejs + express + ejs. And to the UI, use the AngularJS.<br>
DateBase I use MongoDB, and nodejs use mongoose module.<br>
The GPS is achieved by BaiduMap API.

Log
------------------------------
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

License
------------------------------
[GNU](https://github.com/tudows/PLIM/blob/master/LICENSE)