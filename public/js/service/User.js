app.service("User", function ($rootScope, $interval, $http) {
    var timer = null;
    
    this.stopListener = function () {
        $interval.cancel(timer);
        timer = null;
    };
    
    this.setUser = function (user) {
        $rootScope.user = user;
        $rootScope.$broadcast("hasUser", user);
        
        if (timer != null) {
            this.stopListener();
        }
        
        if (user != null) {
            this.updateLastInfo();
            timer = $interval(
                this.updateLastInfo,
                60000
            );
        }
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
    
    this.updateLastInfo = function () {
        if ($rootScope.user != null && $rootScope.user != "") {
            $http.post("maintain/getMaintainNumber", {
                userId: $rootScope.user._id
            }).success(function (result) {
                if (result == 0) {
                    $rootScope.maintainNumber = "维修任务全部完成";
                } else {
                    $rootScope.maintainNumber = result + " 个维修任务未完成";
                }
            });            
            
            navigator.geolocation.getCurrentPosition(function (_position) {
                BMap.Convertor.translate(new BMap.Point(
                    _position.coords.longitude,
                    _position.coords.latitude), 0,
                    function (point) {
                        try {
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
                        } catch (err) { }
                    });
            });
        }
    };
});