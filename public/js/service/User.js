app.service("User", function ($rootScope, $interval, $http) {
    var timer = null;
    
    this.stopListener = function () {
        $interval.cancel(timer);
        timer = null;
    };
    
    this.setUser = function (user) {
        $rootScope.user = user;
        
        if (timer != null) {
            this.stopListener();
        }
        
        timer = $interval(
            function () {
                if ($rootScope.user != null && $rootScope.user != "") {
                    navigator.geolocation.getCurrentPosition(function (_position) {
                        BMap.Convertor.translate(new BMap.Point(
                            _position.coords.longitude,
                            _position.coords.latitude), 0,
                            function (point) {
                                $rootScope.user.lastLoginDate = new Date();
                                $rootScope.user.lastLocation = {
                                    longitude: point.lng,
                                    latitude: point.lat
                                };
                                $rootScope.user.lastDevice = $rootScope.uuid;
                                
                                $http.post("user/updateLastInfo", {
                                    no: $rootScope.user.no,
                                    lastLoginDate: $rootScope.user.lastLoginDate,
                                    lastLocation: $rootScope.user.lastLocation,
                                    lastDevice: $rootScope.user.lastDevice
                                });
                            });
                    });
                }
            },
            10000
        );
    }

    this.getUser = function () {
        return $rootScope.user;
    }
    
    this.setUuid = function (uuid) {
        $rootScope.uuid = uuid;
    }
    
    this.getUuid = function () {
        return $rootScope.uuid;
    };
});