app.service("NowPosition", function ($interval) {
    var position = {
        latitude: null,
        longitude: null,
        accuracy: null,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
        compassHead: null
    }

    var timer = null;

    var getCompass = function (e) {
        position.compassHead = e.webkitCompassHeading;
    };

    this.getPosition = function () {
        return position;
    };

    this.startListener = function (callback) {
        if (timer != null) {
            this.stopListener();
        }

        window.addEventListener("deviceorientation", getCompass);

        navigator.geolocation.getCurrentPosition(function (_position) {
            BMap.Convertor.translate(new BMap.Point(
                _position.coords.longitude,
                _position.coords.latitude), 0,
                function (point) {
                    position.latitude = point.lat;
                    position.longitude = point.lng;
                    position.accuracy = _position.coords.accuracy;
                    position.altitude = _position.coords.altitude;
                    position.altitudeAccuracy = _position.coords.altitudeAccuracy;
                    position.heading = _position.coords.heading;
                    position.speed = _position.coords.speed;
                    callback();
                });
        });

        timer = $interval(
            function () {
                navigator.geolocation.getCurrentPosition(function (_position) {
                    BMap.Convertor.translate(new BMap.Point(
                        _position.coords.longitude,
                        _position.coords.latitude), 0,
                        function (point) {
                            position.latitude = point.lat;
                            position.longitude = point.lng;
                            position.accuracy = _position.coords.accuracy;
                            position.altitude = _position.coords.altitude;
                            position.altitudeAccuracy = _position.coords.altitudeAccuracy;
                            position.heading = _position.coords.heading;
                            position.speed = _position.coords.speed;
                            callback();
                        });
                });
            },
            10000
        );
    };

    this.stopListener = function () {
        $interval.cancel(timer);
        window.removeEventListener("deviceorientation", getCompass);
        timer = null;
    };
});