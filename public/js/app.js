var app = angular.module('plim', ['ionic'])
    .config(function($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state('app', {
                    url: "/app",
                    abstract: true,
                    templateUrl: "templates/menu.html",
                    controller: 'PLIMController'
                })
                .state('app.addPowerLine', {
                    url: "/addPowerLine",
                    templateUrl: 'powerLine/add',
                    controller: 'AddPowerLineController'
                })
                .state('app.addPowerLineData', {
                    url: "/addPowerLine/:data",
                    templateUrl: 'powerLine/add',
                    controller: 'AddPowerLineController'
                })
                .state('app.powerline_maintain', {
                    url: "/powerline_maintain",
                    abstract: true,
                    templateUrl: 'templates/powerline_maintain.html'
                })
                .state('app.powerline_maintain.list', {
                    url: "/list",
                    views: {
                        "list-tab": {
                            templateUrl: 'powerLine/list',
                            controller: 'ListPowerLineController'
                        }
                    }
                })
                .state('app.powerline_maintain.powerline', {
                    url: "/powerline/:no",
                    views: {
                        "list-tab": {
                            templateUrl: function($stateParams) {
                                return 'powerLine/detail/' + $stateParams.no;
                            },
                            controller: 'DetailPowerLineController'
                        }
                    }
                })
                .state('app.powerline_maintain.position', {
                    url: "/position",
                    views: {
                        "position-tab": {
                            templateUrl: 'powerLine/position',
                            controller: 'PositionPowerLineController'
                        }
                    }
                });
            $urlRouterProvider.otherwise('/app/powerline_maintain/list');
    })
    .factory('LeftMenus', function() {
        return {
            all: function() {
                return [
                    { "title": "线路录入", "href": "#/app/addPowerLine" },
                    { "title": "线路维修", "href": "#/app/powerline_maintain/list" }
                ];
            }
        }
    })
    .service('PowerLine', function() {
        var powerline = null;
        
        this.setPowerline = function(powerline) {
            this.powerline = powerline;
        }
        
        this.getPowerline = function() {
            return this.powerline;
        }
    })
    .service('NowPosition', function($interval) {
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

        var getCompass = function(e) {
            position.compassHead = e.webkitCompassHeading;
        };

        this.getPosition = function() {
            return position;
        };

        this.startListener = function(callback) {
            if (timer != null) {
                this.stopListener();
            }

            window.addEventListener('deviceorientation', getCompass);
            
            navigator.geolocation.getCurrentPosition(function(_position) {
                BMap.Convertor.translate(new BMap.Point(
                    _position.coords.longitude,
                    _position.coords.latitude), 0,
                    function(point) {
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
                function() {
                    navigator.geolocation.getCurrentPosition(function(_position) {
                        BMap.Convertor.translate(new BMap.Point(
                            _position.coords.longitude,
                            _position.coords.latitude), 0,
                            function(point) {
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

        this.stopListener = function() {
            $interval.cancel(timer);
            window.removeEventListener('deviceorientation', getCompass);
            timer = null;
        };
    });
app.controller('PLIMController', function($rootScope, $scope, $window, LeftMenus, $ionicSideMenuDelegate, $ionicPopup) {
    // 初始化left menu
    $rootScope.leftMenus = LeftMenus.all();
    $rootScope.activeLeftMenu = $rootScope.leftMenus[0];
    $scope.selectleftMenu = function(leftMenu, index) {
        $rootScope.activeLeftMenu = leftMenu;
        $ionicSideMenuDelegate.toggleLeft(false);
    };

    // 左侧菜单切换
    $scope.toggleLeftMenu = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };
    
    $scope.refresh = function() {
        $window.location.reload();
    };
    
    $rootScope.showError = function(text) {
        $ionicPopup.alert({
            title: "错误",
            template: text
        });
    };
    
    $rootScope.showSuccess = function(text) {
        $ionicPopup.alert({
            title: "成功",
            template: text
        });
    };
    
    $rootScope.showLoading = function() {
        $rootScope.loadingPopup = $ionicPopup.show({
            templateUrl: "loading.html",
            title: "正在加载中..."
        });
    };
    
    $rootScope.closeLoading = function() {
        if ($rootScope.loadingPopup != null) {
            $rootScope.loadingPopup.close();
            $rootScope.loadingPopup = null;
        }
    };

});
app.controller('AddPowerLineController', function($rootScope, $scope, $http, $ionicPopup, $stateParams) {
    $rootScope.activeLeftMenu = $rootScope.leftMenus[0];
    
    $rootScope.showLoading();
    initBMap("bmap", $scope, true, function() {
        if ($stateParams.data != null) {
            $http.get("powerLine/add/" + $stateParams.data)
            .success(function(result) {
                // $scope.no = result.no;
                // $scope.modelNo = result.modelNo;
                // $scope.voltageClass = result.voltageClass;
                // $scope.repairDay = result.repairDay;
                // $scope.maintainDay = result.maintainDay;
                // $scope.designYear = result.designYear;
                // $scope.runningState = result.runningState;
                // $scope.provinceNo = result.provinceNo;
                // $scope.startLongitude = result.startLongitude;
                // $scope.startLatitude = result.startLatitude;
                // $scope.endLongitude = result.endLongitude;
                // $scope.endLatitude = result.endLatitude;
                $scope.powerline = result;
                $scope.map.clearOverlays();
                var beginPoint = new BMap.Point($scope.powerline.startLongitude, $scope.powerline.startLatitude);
                var endPoint = new BMap.Point($scope.powerline.endLatitude, $scope.powerline.endLatitude);
                $scope.map.centerAndZoom(beginPoint, 25);
                $scope.map.addOverlay(new BMap.Marker(beginPoint));
                $scope.map.addOverlay(new BMap.Marker(endPoint));
                $scope.map.addOverlay(new BMap.Marker(endPoint));
                var polyline = new BMap.Polyline([beginPoint, endPoint], {
                    strokeColor:"red",
                    strokeWeight:5,
                    strokeOpacity:0.5
                });
                $scope.map.addOverlay(polyline);
                $rootScope.closeLoading();
            }).error(function(error) {
                $rootScope.closeLoading();
                $rootScope.showError("数据读取失败");
            });
        } else {
            $rootScope.closeLoading();
        }
    });
    
    if ($scope.powerline == null) {
        $scope.powerline = {
            no: "",
            modelNo: "T001",
            voltageClass: "8",
            repairDay: "365",
            maintainDay: "125",
            designYear: "30",
            runningState: "1",
            provinceNo: "pHD006",
            startLongitude: "无数据",
            startLatitude: "无数据",
            endLongitude: "无数据",
            endLatitude: "无数据"
        };
    } else {
        if ($scope.powerline.startLongitude == null || $scope.powerline.startLongitude == '') {
            $scope.powerline.startLongitude = "无数据";
        }
        if ($scope.powerline.startLatitude == null || $scope.powerline.startLatitude == '') {
            $scope.powerline.startLatitude = "无数据";
        }
        if ($scope.powerline.endLongitude == null || $scope.powerline.endLongitude == '') {
            $scope.powerline.endLongitude = "无数据";
        }
        if ($scope.powerline.endLatitude == null || $scope.powerline.endLatitude == '') {
            $scope.powerline.endLatitude = "无数据";
        }
    }
    
    $scope.showCoordinate = function() {
        var alertPopup = $ionicPopup.alert({
            title: "详细坐标",
            templateUrl: "coordinate.html",
            scope: $scope
        });
        alertPopup.then(function(res) {
            
        });
    };
    
    $scope.getStartPosition = function() {
        $rootScope.showLoading();
        $scope.map.clearOverlays();
        navigator.geolocation.getCurrentPosition(function(position) {
            BMap.Convertor.translate(new BMap.Point(
                position.coords.longitude,
                position.coords.latitude), 0,
                function(point) {
                    $scope.powerline.startLongitude = point.lng;
                    $scope.powerline.startLatitude = point.lat;
                    var beginPoint = new BMap.Point(point.lng, point.lat);
                    $scope.map.centerAndZoom(beginPoint, 25);
                    $scope.map.addOverlay(new BMap.Marker(beginPoint));
                    $rootScope.closeLoading();
            });
        }, function(error) {
            $rootScope.closeLoading();
            $scope.powerline.startLongitude = "无法获取";
            $scope.powerline.startLatitude = "无法获取";
            $scope.showError("坐标获取失败");
        });
    }

    $scope.getEndPosition = function() {
        $rootScope.showLoading();
        navigator.geolocation.getCurrentPosition(function(position) {
            BMap.Convertor.translate(new BMap.Point(
                position.coords.longitude,
                position.coords.latitude), 0,
                function(point) {
                    $scope.powerline.endLongitude = point.lng;
                    $scope.powerline.endLatitude = point.lat;
                    var beginPoint = new BMap.Point($scope.powerline.startLongitude , $scope.powerline.startLatitude);
                    var endPoint = new BMap.Point(point.lng, point.lat);
                    $scope.map.addOverlay(new BMap.Marker(endPoint));
                    var polyline = new BMap.Polyline([beginPoint, endPoint], {
                        strokeColor:"red",
                        strokeWeight:5,
                        strokeOpacity:0.5
                    });
                    $scope.map.addOverlay(polyline);
                    $rootScope.closeLoading();
            });
        }, function(error) {
            $rootScope.closeLoading();
            $scope.powerline.endLongitude = "无法获取";
            $scope.powerline.endLatitude = "无法获取";
            $scope.showError("坐标获取失败");
        });
    }
    
    $scope.cleanPowerLine = function() {
        $scope.powerline.startLongitude = "无数据";
        $scope.powerline.startLatitude = "无数据";
        $scope.powerline.endLongitude = "无数据";
        $scope.powerline.endLatitude = "无数据";
        $scope.map.clearOverlays();
    }

    $scope.savePowerLine = function() {
        if (isNum($scope.powerline.startLongitude)
            && isNum($scope.powerline.startLatitude)
            && isNum($scope.powerline.endLongitude)
            && isNum($scope.powerline.endLatitude)) {
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
                    startLongitude: $scope.powerline.startLongitude,
                    startLatitude: $scope.powerline.startLatitude,
                    endLongitude: $scope.powerline.endLongitude,
                    endLatitude: $scope.powerline.endLatitude
                }
            }).success(function(result) {
                $scope.powerline.startLongitude = $scope.powerline.endLongitude;
                $scope.powerline.startLatitude = $scope.powerline.endLatitude;
                $scope.powerline.endLongitude = "无数据";
                $scope.powerline.endLatitude = "无数据";
                $scope.map.clearOverlays();
                $scope.map.addOverlay(new BMap.Marker(new BMap.Point($scope.powerline.startLongitude, $scope.powerline.startLatitude)));
                $rootScope.closeLoading();
                $rootScope.showSuccess("保存成功");
            }).error(function(error) {
                $rootScope.closeLoading();
                $rootScope.showError("出现错误，请重试");
            });
        } else {
            $rootScope.showError("坐标有误，请重试");
        }
    }
});
app.controller('PositionPowerLineController', function($rootScope, $scope, PowerLine, NowPosition) {
    $rootScope.activeLeftMenu = $rootScope.leftMenus[1];
    
    $rootScope.showLoading();
    initBMap("bmap1", $scope, false, function() {
        $rootScope.closeLoading();

        NowPosition.startListener(function() {
            $scope.map.removeOverlay($scope.mapArrow);
            $scope.map.removeOverlay($scope.mapAccuracy);
            
            if ($scope.mapPolyline != null) {
                $scope.mapPolyline.forEach(function(polyline) {
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
                        strokeColor: 'green',
                        rotation: NowPosition.getPosition().compassHead,
                        fillColor: 'green',
                        fillOpacity: 1
                    })
                });
            } else {
                $scope.mapArrow = new BMap.Marker(_point, {
                    icon: new BMap.Symbol(BMap_Symbol_SHAPE_CIRCLE, {
                        scale: 4,
                        strokeWeight: 0,
                        strokeColor: 'red',
                        fillColor: 'red',
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
    
    $scope.showPowerline = function() {
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
                strokeColor:"red",
                strokeWeight:5,
                strokeOpacity:0.5
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
            navigator.geolocation.getCurrentPosition(function(position) {
                BMap.Convertor.translate(new BMap.Point(
                    position.coords.longitude,
                    position.coords.latitude), 0,
                    function(point) {
                        driving.search(new BMap.Point(point.lng, point.lat), beginPoint);
                        driving.setPolylinesSetCallback(function() {
                            $scope.map.getOverlays().forEach(function(overlay) {
                                if (overlay.toString() == "[object Polyline]") {
                                    $scope.mapPolyline.push(overlay);
                                }
                            });
                        });
                        $rootScope.closeLoading();
                    });
            }, function(error) {
                $rootScope.closeLoading();
                $rootScope.showError("无法定位，请重试");
            });
        } else {
            $rootScope.closeLoading();
        }
    };
    
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        if (toState.name == "app.powerline_maintain.position" && fromState.name == "app.powerline_maintain.powerline") {
            if ($scope.map != null){
                $scope.map.clearOverlays();
                $scope.showPowerline();
            }
        }
    });
    
    $scope.$on('$destroy',function() {
        NowPosition.stopListener();
    });
    
});
app.controller('ListPowerLineController', function($rootScope, $scope, $http, $ionicHistory) {
    $rootScope.activeLeftMenu = $rootScope.leftMenus[1];
    
    $ionicHistory.clearHistory();
    $ionicHistory.clearCache();
    
    $rootScope.showLoading();
    $http.get("/powerLine/listPowerLine?provinceNo=pHD006").success(function(result) {
        $scope.powerlines = result;
        $rootScope.closeLoading();
    }).error(function(error) {
        $rootScope.closeLoading();
        $rootScope.showError("出现错误，请重试");
    });
    
    $scope.pullRefresh = function() {
        $http.get("/powerLine/listPowerLine?provinceNo=pHD006").success(function(result) {
            $scope.powerlines = result;
        }).error(function(error) {
            $scope.powerlines = [];
            $rootScope.showError("出现错误，请重试");
        })
        .finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
    }
});
app.controller('DetailPowerLineController', function($rootScope, $scope, $stateParams, $http, $state, PowerLine, $ionicHistory) {
    $rootScope.activeLeftMenu = $rootScope.leftMenus[1];
    
    $rootScope.showLoading();
    $http.get("/powerLine/listPowerLine?no=" + $stateParams.no).success(function(result) {
        if (result != null && result.length == 1) {
            $scope.powerline = result[0];
            $rootScope.closeLoading();
        } else {
            $rootScope.closeLoading();
            $rootScope.showError("出现错误，请重试");
        }
    }).error(function(error) {
        $rootScope.closeLoading();
        $rootScope.showError("出现错误，请重试");
    });
    
    $scope.back = function() {
        if ($ionicHistory.backTitle() == null) {
            $state.go("app.powerline_maintain.list", {});
        } else {
            $ionicHistory.goBack();
        }
    }
    
    $scope.position = function() {
        PowerLine.setPowerline($scope.powerline);
        
        $state.go("app.powerline_maintain.position", {});
    }
});

function initBMap(id, scope, isClick, callback) {
    navigator.geolocation.getCurrentPosition(function(position) {
        BMap.Convertor.translate(new BMap.Point(
            position.coords.longitude,
            position.coords.latitude), 0,
            function(point) {
                _initBMap(id, scope, new BMap.Point(point.lng, point.lat), isClick);
                callback();
            });
    }, function(error) {
        _initBMap(id, scope, new BMap.Point(121.48, 31.22), isClick);
        callback();
    });
}

function _initBMap(id, scope, beginPoint, isClick) {
    scope.map = new BMap.Map(id); // 创建Map实例
    scope.map.centerAndZoom(beginPoint, 25); // 初始化地图,设置中心点坐标和地图级别
    scope.map.addControl(new BMap.MapTypeControl()); //地图类型控件
    scope.map.addControl(new BMap.NavigationControl()); //平移缩放控件
    scope.map.addControl(new BMap.GeolocationControl()); //定位控件
    // scope.map.addOverlay(new BMap.Marker(beginPoint));
    scope.map.setCurrentCity("上海"); // 设置地图显示的城市 此项是必须设置的
    scope.map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
    if (isClick) {
        scope.map.addEventListener("click", function(e){ //点击事件
            if (!isNum(scope.startLongitude) || !isNum(scope.startLatitude)) {
                scope.startLongitude = e.point.lng;
                scope.startLatitude = e.point.lat;
                scope.map.clearOverlays();
                scope.map.addOverlay(new BMap.Marker(new BMap.Point(e.point.lng, e.point.lat)));
            } else {
                scope.endLongitude = e.point.lng;
                scope.endLatitude = e.point.lat;
                scope.map.clearOverlays();
                var beginPoint = new BMap.Point(scope.startLongitude, scope.startLatitude);
                var endPoint = new BMap.Point(e.point.lng, e.point.lat);
                scope.map.addOverlay(new BMap.Marker(beginPoint));
                scope.map.addOverlay(new BMap.Marker(endPoint));
                var polyline = new BMap.Polyline([beginPoint, endPoint], {
                    strokeColor:"red",
                    strokeWeight:5,
                    strokeOpacity:0.5
                });
                scope.map.addOverlay(polyline);
            }
        });
    }
}

function isNum(str) {
    var reg = /(^(\d+)$|^(\d+)\.(\d+)$)/gi;
    if (reg.test(str))
        return true;
    else
        return false;
}