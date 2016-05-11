app.controller("PositionMaintainController", function ($rootScope, $scope, PowerLine, NowPosition) {
    $rootScope.activeLeftMenu = $rootScope.leftMenus[2];

    $rootScope.showLoading();
    initBMap("bmap1", $scope, function () {
        $rootScope.closeLoading();

        NowPosition.startListener(function () {
            $scope.map.removeOverlay($scope.mapArrow);
            $scope.map.removeOverlay($scope.mapAccuracy);

            if ($scope.mapPolyline != null) {
                $scope.mapPolyline.forEach(function (polyline) {
                    $scope.map.removeOverlay(polyline);
                    $scope.map.addOverlay(polyline);
                });
            }

            var _point = new BMap.Point(NowPosition.getPosition().longitude, NowPosition.getPosition().latitude);

            if (NowPosition.getPosition().compassHead != null) {
                $scope.mapArrow = new BMap.Marker(_point, {
                    icon: new BMap.Symbol(BMap_Symbol_SHAPE_FORWARD_CLOSED_ARROW, {
                        scale: 2,
                        anchor: new BMap.Size(0, 8),
                        strokeWeight: 0,
                        strokeColor: "green",
                        rotation: NowPosition.getPosition().compassHead,
                        fillColor: "green",
                        fillOpacity: 1
                    })
                });
            } else {
                $scope.mapArrow = new BMap.Marker(_point, {
                    icon: new BMap.Symbol(BMap_Symbol_SHAPE_CIRCLE, {
                        scale: 4,
                        strokeWeight: 0,
                        strokeColor: "red",
                        fillColor: "red",
                        fillOpacity: 1
                    })
                });
            }

            $scope.mapAccuracy = new BMap.Circle(_point, NowPosition.getPosition().accuracy, {
                strokeColor: "blue",
                strokeWeight: 1,
                fillOpacity: 0.3
            });

            $scope.map.addOverlay($scope.mapAccuracy);
            $scope.map.addOverlay($scope.mapArrow);
        });

        $scope.showPowerline();
    });

    $scope.showPowerline = function () {
        $rootScope.showLoading();
        $scope.powerline = PowerLine.getPowerline();
        $scope.mapPolyline = [];
        if ($scope.powerline != null) {
            var beginPoint = new BMap.Point(
                $scope.powerline.location.startLongitude,
                $scope.powerline.location.startLatitude);
            var endPoint = new BMap.Point(
                $scope.powerline.location.endLongitude,
                $scope.powerline.location.endLatitude);
            $scope.map.centerAndZoom(beginPoint, 25);
            $scope.map.addOverlay(new BMap.Marker(beginPoint));
            $scope.map.addOverlay(new BMap.Marker(endPoint));
            var polyline = new BMap.Polyline([beginPoint, endPoint], {
                strokeColor: "red",
                strokeWeight: 5,
                strokeOpacity: 0.5
            });
            $scope.map.addOverlay(polyline);

            var routePolicy = [
                BMAP_DRIVING_POLICY_LEAST_TIME,
                BMAP_DRIVING_POLICY_LEAST_DISTANCE,
                BMAP_DRIVING_POLICY_AVOID_HIGHWAYS
            ];
            var driving = new BMap.DrivingRoute(
                $scope.map, {
                    renderOptions: { map: $scope.map, autoViewport: true },
                    policy: routePolicy[0]
                });
            navigator.geolocation.getCurrentPosition(function (position) {
                BMap.Convertor.translate(new BMap.Point(
                    position.coords.longitude,
                    position.coords.latitude), 0,
                    function (point) {
                        driving.search(new BMap.Point(point.lng, point.lat), beginPoint);
                        driving.setPolylinesSetCallback(function () {
                            $scope.map.getOverlays().forEach(function (overlay) {
                                if (overlay.toString() == "[object Polyline]") {
                                    $scope.mapPolyline.push(overlay);
                                }
                            });
                        });
                        $rootScope.closeLoading();
                    });
            }, function (error) {
                $rootScope.closeLoading();
                $rootScope.showError("无法定位，请重试");
            });
        } else {
            $rootScope.closeLoading();
        }
    };

    $scope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
        if (toState.name == "app.maintain.position" && fromState.name == "app.maintain.powerline") {
            if ($scope.map != null) {
                $scope.map.clearOverlays();
                $scope.showPowerline();
            }
        }
    });

    $scope.$on("$destroy", function () {
        NowPosition.stopListener();
    });

});