app.controller("AddPowerLineController", function ($rootScope, $scope, $http, $ionicPopup, $stateParams, $ionicHistory) {
    $rootScope.activeLeftMenu = $rootScope.leftMenus[1];

    $ionicHistory.clearHistory();
    $ionicHistory.clearCache();

    $rootScope.showLoading();
    initBMap("bmap", $scope, true, function () {
        $rootScope.closeLoading();
        if ($stateParams.data != null && $stateParams.data != "") {
            $scope.loadDate();
        } else {
            if ($scope.powerline == null) {
                $scope.powerline = {
                    no: "",
                    modelNo: "T001",
                    voltageClass: "8",
                    repairDay: "365",
                    maintainDay: "125",
                    designYear: "30",
                    runningState: "1",
                    provinceNo: "pHD006"
                };
            }
            $scope.startLongitude = "无数据";
            $scope.startLatitude = "无数据";
            $scope.endLongitude = "无数据";
            $scope.endLatitude = "无数据";
        }
    });
    
    $http.get("baseData/getVoltageClass").success(function(result) {
        $scope.voltageClasses = result;
    });

    $scope.loadDate = function () {
        $rootScope.showLoading();
        $http.get("powerLine/add/" + $stateParams.data)
            .success(function (result) {
                $scope.powerline = result;
                $scope.startLongitude = $scope.powerline.location.startLongitude;
                $scope.startLatitude = $scope.powerline.location.startLatitude;
                $scope.endLongitude = $scope.powerline.location.endLongitude;
                $scope.endLatitude = $scope.powerline.location.endLatitude;
                $scope.map.clearOverlays();
                var beginPoint = new BMap.Point($scope.startLongitude, $scope.startLatitude);
                var endPoint = new BMap.Point($scope.endLongitude, $scope.endLatitude);
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
                    $scope.startLongitude = point.lng;
                    $scope.startLatitude = point.lat;
                    var beginPoint = new BMap.Point(point.lng, point.lat);
                    $scope.map.centerAndZoom(beginPoint, 25);
                    $scope.map.addOverlay(new BMap.Marker(beginPoint));
                    $rootScope.closeLoading();
                });
        }, function (error) {
            $rootScope.closeLoading();
            $scope.startLongitude = "无法获取";
            $scope.startLatitude = "无法获取";
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
                    $scope.endLongitude = point.lng;
                    $scope.endLatitude = point.lat;
                    var beginPoint = new BMap.Point($scope.startLongitude, $scope.startLatitude);
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
            $scope.endLongitude = "无法获取";
            $scope.endLatitude = "无法获取";
            $scope.showError("坐标获取失败");
        });
    }

    $scope.cleanPowerLine = function () {
        $scope.startLongitude = "无数据";
        $scope.startLatitude = "无数据";
        $scope.endLongitude = "无数据";
        $scope.endLatitude = "无数据";
        $scope.map.clearOverlays();
    }

    $scope.savePowerLine = function () {
        if (isNum($scope.startLongitude)
            && isNum($scope.startLatitude)
            && isNum($scope.endLongitude)
            && isNum($scope.endLatitude)) {
            $rootScope.showLoading();
            var input = document.getElementById("input").getElementsByTagName("input");
            $http({
                method: "post",
                url: "powerLine/add",
                data: {
                    no: input[0].value,
                    modelNo: input[1].value,
                    voltageClass: input[2].value,
                    repairDay: input[3].value,
                    maintainDay: input[4].value,
                    designYear: input[5].value,
                    runningState: input[6].value,
                    provinceNo: input[7].value,
                    startLongitude: $scope.startLongitude,
                    startLatitude: $scope.startLatitude,
                    endLongitude: $scope.endLongitude,
                    endLatitude: $scope.endLatitude
                }
            }).success(function (result) {
                $scope.startLongitude = $scope.endLongitude;
                $scope.startLatitude = $scope.endLatitude;
                $scope.endLongitude = "无数据";
                $scope.endLatitude = "无数据";
                $scope.map.clearOverlays();
                $scope.map.addOverlay(new BMap.Marker(new BMap.Point($scope.startLongitude, $scope.startLatitude)));
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