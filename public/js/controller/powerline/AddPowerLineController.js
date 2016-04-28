app.controller("AddPowerLineController", function ($rootScope, $scope, $http, $ionicPopup, $stateParams, $ionicHistory) {
    $rootScope.activeLeftMenu = $rootScope.leftMenus[1];

    $ionicHistory.clearHistory();
    $ionicHistory.clearCache();

    $rootScope.showLoading();
    initBMap("bmap", $scope, function () {
        $scope.map.addEventListener("click", function (e) { //点击事件
            if (!isNum($scope.powerline.location.startLongitude) || !isNum($scope.powerline.location.startLatitude)) {
                $scope.powerline.location.startLongitude = e.point.lng;
                $scope.powerline.location.startLatitude = e.point.lat;
                $scope.map.clearOverlays();
                $scope.map.addOverlay(new BMap.Marker(new BMap.Point(e.point.lng, e.point.lat)));
            } else {
                $scope.powerline.location.endLongitude = e.point.lng;
                $scope.powerline.location.endLatitude = e.point.lat;
                $scope.map.clearOverlays();
                var beginPoint = new BMap.Point($scope.powerline.location.startLongitude, $scope.powerline.location.startLatitude);
                var endPoint = new BMap.Point(e.point.lng, e.point.lat);
                $scope.map.addOverlay(new BMap.Marker(beginPoint));
                $scope.map.addOverlay(new BMap.Marker(endPoint));
                var polyline = new BMap.Polyline([beginPoint, endPoint], {
                    strokeColor: "red",
                    strokeWeight: 5,
                    strokeOpacity: 0.5
                });
                $scope.map.addOverlay(polyline);
            }
        });
        $scope.regionBlock = false;
        $scope.map.addEventListener("touchend", function (type, target, point, pixel) {
            $scope.switchProvince();
        });
        
        async.series([
            function (callback) {
                async.parallel([
                    function (_callback) {
                        $http.get("baseData/getVoltageClass").success(function(result) {
                            $scope.voltageClasses = result;
                            _callback(null, '');
                        }).error(function(err) {
                            _callback(null, '');
                        });;
                    },
                    function (_callback) {
                        $http.get("baseData/getRunningState").success(function(result) {
                            $scope.runningStates = result;
                            _callback(null, '');
                        }).error(function(err) {
                            _callback(null, '');
                        });
                    },
                    function (_callback) {
                        $http.get("baseData/getProvince").success(function(result) {
                            $scope.provinces = result;
                            _callback(null, '');
                        }).error(function(err) {
                            _callback(null, '');
                        });
                    }
                ], function (err, result) {
                    if (result.length == 3) {
                        callback(null, '');
                    }
                });
            },
            function (callback) {
                $rootScope.closeLoading();
                if ($stateParams.data != null && $stateParams.data != "") {
                    $scope.loadDate();
                } else {
                    if ($scope.powerline == null) {
                        $scope.powerline = {
                            no: "",
                            modelNo: "T001",
                            voltageClass: $scope.voltageClasses[0]._id,
                            repairDay: 365,
                            maintainDay: 125,
                            designYear: 30,
                            runningState: $scope.runningStates[0]._id,
                            province: $scope.provinces[0]._id
                        };
                    }
                    
                    $scope.powerline.location = {
                        startLongitude: "无数据",
                        startLatitude: "无数据",
                        endLongitude: "无数据",
                        endLatitude: "无数据"
                    }
                }
                callback(null, '');
            }
        ], function (err, result) {
            if (result.length == 2)
                $scope.switchProvince();
        });
    });
    
    $scope.switchProvince = function () {
        if (!$scope.regionBlock) {
            $scope.regionBlock = true;
            (new BMap.Geocoder()).getLocation($scope.map.getCenter(), function() {
                (new BMap.Geocoder()).getLocation($scope.map.getCenter(), function(location) {
                    var selectProvince = document.getElementsByName("province")[0];
                    var selectProvinceIndex = selectProvince.selectedIndex;
                    if (selectProvinceIndex < 0 ||
                        selectProvince.options[selectProvinceIndex].text != location.addressComponents.province) {
                        $http.post("baseData/getProvince", {
                            "nameCn": location.addressComponents.province
                        }).success(function(provinces) {
                            if (provinces.length > 0) {
                                $scope.powerline.province = provinces[0]._id;
                            }
                            $scope.regionBlock = false;
                        }).error(function(err) {
                            $scope.regionBlock = false;
                        });
                    } else {
                        $scope.regionBlock = false;
                    }
                });
            });
        }
    };
    
    $scope.changeProvince = function () {
        var selectProvince = document.getElementsByName("province")[0];
        var selectProvinceIndex = selectProvince.selectedIndex;
        var selectProvinceName = selectProvince.options[selectProvinceIndex].text;
        (new BMap.Geocoder()).getPoint(selectProvinceName, function(point){
            if (point) {
                $scope.map.centerAndZoom(point, 9);
            }
        }, selectProvinceName);
    };

    $scope.loadDate = function () {
        $rootScope.showLoading();
        $http.get("powerLine/add/" + $stateParams.data)
            .success(function (result) {
                $scope.powerline = result;
                $scope.map.clearOverlays();
                var beginPoint = new BMap.Point($scope.powerline.location.startLongitude, $scope.powerline.location.startLatitude);
                var endPoint = new BMap.Point($scope.powerline.location.endLongitude, $scope.powerline.location.endLatitude);
                $scope.map.centerAndZoom(beginPoint, 25);
                $scope.map.addOverlay(new BMap.Marker(beginPoint));
                $scope.map.addOverlay(new BMap.Marker(endPoint));
                $scope.map.addOverlay(new BMap.Marker(endPoint));
                var polyline = new BMap.Polyline([beginPoint, endPoint], {
                    strokeColor: "red",
                    strokeWeight: 5,
                    strokeOpacity: 0.5
                });
                $scope.map.addOverlay(polyline);
                $rootScope.closeLoading();
            }).error(function (error) {
                $rootScope.closeLoading();
                $rootScope.showError("数据读取失败");
            });
    };

    $scope.showCoordinate = function () {
        var alertPopup = $ionicPopup.alert({
            title: "详细坐标",
            templateUrl: "coordinate.html",
            scope: $scope
        });
        alertPopup.then(function (res) {

        });
    };

    $scope.getStartPosition = function () {
        $rootScope.showLoading();
        $scope.map.clearOverlays();
        navigator.geolocation.getCurrentPosition(function (position) {
            BMap.Convertor.translate(new BMap.Point(
                position.coords.longitude,
                position.coords.latitude), 0,
                function (point) {
                    $scope.powerline.location.startLongitude = point.lng;
                    $scope.powerline.location.startLatitude = point.lat;
                    var beginPoint = new BMap.Point(point.lng, point.lat);
                    $scope.map.centerAndZoom(beginPoint, 25);
                    $scope.map.addOverlay(new BMap.Marker(beginPoint));
                    $rootScope.closeLoading();
                });
        }, function (error) {
            $rootScope.closeLoading();
            $scope.powerline.location.startLongitude = "无法获取";
            $scope.powerline.location.startLatitude = "无法获取";
            $scope.showError("坐标获取失败");
        });
    }

    $scope.getEndPosition = function () {
        $rootScope.showLoading();
        navigator.geolocation.getCurrentPosition(function (position) {
            BMap.Convertor.translate(new BMap.Point(
                position.coords.longitude,
                position.coords.latitude), 0,
                function (point) {
                    $scope.powerline.location.endLongitude = point.lng;
                    $scope.powerline.location.endLatitude = point.lat;
                    var beginPoint = new BMap.Point($scope.powerline.location.startLongitude, $scope.powerline.location.startLatitude);
                    var endPoint = new BMap.Point(point.lng, point.lat);
                    $scope.map.addOverlay(new BMap.Marker(endPoint));
                    var polyline = new BMap.Polyline([beginPoint, endPoint], {
                        strokeColor: "red",
                        strokeWeight: 5,
                        strokeOpacity: 0.5
                    });
                    $scope.map.addOverlay(polyline);
                    $rootScope.closeLoading();
                });
        }, function (error) {
            $rootScope.closeLoading();
            $scope.powerline.location.endLongitude = "无法获取";
            $scope.powerline.location.endLatitude = "无法获取";
            $scope.showError("坐标获取失败");
        });
    }

    $scope.cleanPowerLine = function () {
        $scope.powerline.location.startLongitude = "无数据";
        $scope.powerline.location.startLatitude = "无数据";
        $scope.powerline.location.endLongitude = "无数据";
        $scope.powerline.location.endLatitude = "无数据";
        $scope.map.clearOverlays();
    }

    $scope.savePowerLine = function () {
        if (isNum($scope.powerline.location.startLongitude)
            && isNum($scope.powerline.location.startLatitude)
            && isNum($scope.powerline.location.endLongitude)
            && isNum($scope.powerline.location.endLatitude)) {
            $rootScope.showLoading();
            $http({
                method: "post",
                url: "powerLine/add",
                data: $scope.powerline
            }).success(function (result) {
                $scope.powerline.location.startLongitude = $scope.powerline.location.endLongitude;
                $scope.powerline.location.startLatitude = $scope.powerline.location.endLatitude;
                $scope.powerline.location.endLongitude = "无数据";
                $scope.powerline.location.endLatitude = "无数据";
                $scope.map.clearOverlays();
                $scope.map.addOverlay(new BMap.Marker(new BMap.Point($scope.powerline.location.startLongitude, $scope.powerline.location.startLatitude)));
                $rootScope.closeLoading();
                $rootScope.showSuccess("保存成功");
            }).error(function (error) {
                $rootScope.closeLoading();
                $rootScope.showError("出现错误，请重试");
            });
        } else {
            $rootScope.showError("坐标有误，请重试");
        }
    }
});