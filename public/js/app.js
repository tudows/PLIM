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
                .state('app.powerline_maintain', {
                    url: "/powerline_maintain",
                    abstract: true,
                    templateUrl: 'templates/powerline_maintain.html'
                })
                .state('app.powerline_maintain.my_list', {
                    url: "/my_list",
                    views: {
                        "my_list-tab": {
                            templateUrl: 'powerLine/my_list',
                            controller: 'MyListPowerLineController'
                        }
                    }
                })
                .state('app.powerline_maintain.powerline', {
                    url: "/powerline/:powerline_no",
                    views: {
                        "my_list-tab": {
                            templateUrl: 'templates/powerline/single.html',
                            controller: 'SinglePowerLineController'
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
            $urlRouterProvider.otherwise('/app/powerline_maintain/my_list');
    })
    .factory('LeftMenus', function() {
        return {
            all: function() {
                return [
                    { "title": "线路录入", "href": "#/app/addPowerLine" },
                    { "title": "线路维修", "href": "#/app/powerline_maintain/my_list" },
                    { "title": "登陆", "href": "#/user/login" },
                    { "title": "注册", "href": "#/user/register" },
                    { "title": "旧版", "href": "index1" },
                    { "title": "登出", "href": "#/user/logout" },
                    { "title": "定位测试", "href": "#/location" },
                    { "title": "管理", "href": "#/manage" }
                ];
            }
        }
    }
);
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
    }
    
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
    }
    
    $rootScope.closeLoading = function() {
        if ($rootScope.loadingPopup != null) {
            $rootScope.loadingPopup.close();
            $rootScope.loadingPopup = null;
        }
    }
});
app.controller('AddPowerLineController', function($rootScope, $scope, $http, $ionicPopup) {
    $rootScope.activeLeftMenu = $rootScope.leftMenus[0];
    
    $scope.inputs = [
        { "name": "no" },
        { "name": "modelNo", "value": "T001" },
        { "name": "voltageClass", "value": "8" },
        { "name": "repairDay", "value": "365" },
        { "name": "maintainDay", "value": "125" },
        { "name": "designYear", "value": "30" },
        { "name": "runningState", "value": "1" },
        { "name": "provinceNo", "value": "pHD006" }
    ];
    
    $scope.startLongitude = "无数据";
    $scope.startLatitude = "无数据";
    $scope.endLongitude = "无数据";
    $scope.endLatitude = "无数据";
    
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
                    $scope.startLongitude = point.lng;
                    $scope.startLatitude = point.lat;
                    var beginPoint = new BMap.Point(point.lng, point.lat);
                    $scope.map.centerAndZoom(beginPoint, 25);
                    $scope.map.addOverlay(new BMap.Marker(beginPoint));
                    $rootScope.closeLoading();
            });
        }, function(error) {
            $rootScope.closeLoading();
            $scope.startLongitude = "无法获取";
            $scope.startLatitude = "无法获取";
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
                    $scope.endLongitude = point.lng;
                    $scope.endLatitude = point.lat;
                    var beginPoint = new BMap.Point($scope.startLongitude , $scope.startLatitude);
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
            $scope.endLongitude = "无法获取";
            $scope.endLatitude = "无法获取";
            $scope.showError("坐标获取失败");
        });
    }
    
    $scope.cleanPowerLine = function() {
        $scope.startLongitude = "无数据";
        $scope.startLatitude = "无数据";
        $scope.endLongitude = "无数据";
        $scope.endLatitude = "无数据";
        $scope.map.clearOverlays();
    }
    
    initBMap("bmap", $scope, true);

    $scope.savePowerLine = function() {
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
            }).success(function(result) {
                $scope.startLongitude = $scope.endLongitude;
                $scope.startLatitude = $scope.endLatitude;
                $scope.endLongitude = "无数据";
                $scope.endLatitude = "无数据";
                $scope.map.clearOverlays();
                $scope.map.addOverlay(new BMap.Marker(new BMap.Point($scope.startLongitude, $scope.startLatitude)));
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
app.controller('PositionPowerLineController', function($rootScope, $scope, $http) {
    $rootScope.activeLeftMenu = $rootScope.leftMenus[1];
    
    initBMap("bmap1", $scope, false);
    
    $scope.showPowerLine = function() {
        $rootScope.showLoading();
        $http.get("/powerLine/list?provinceNo=pHD006").success(function(result) {
            $scope.map.clearOverlays();
            for (var i = 0; i < result.length; i++) {
                var points = [];
                points.push(new BMap.Point(result[i].location.startLongitude, result[i].location.startLatitude));
                points.push(new BMap.Point(result[i].location.endLongitude, result[i].location.endLatitude));
                if (i == 0) {
                    $scope.map.addOverlay(new BMap.Marker(points[0]));
                    $scope.map.centerAndZoom(points[0], 25);
                }
                $scope.map.addOverlay(new BMap.Marker(points[1]));
                var polyline = new BMap.Polyline(points, {
                    strokeColor:"red",
                    strokeWeight:5,
                    strokeOpacity:0.5
                });
                $scope.map.addOverlay(polyline);
            }
            $rootScope.closeLoading();
        }).error(function(error) {
            $rootScope.closeLoading();
            $rootScope.showError("出现错误，请重试");
        });
    }
});
app.controller('MyListPowerLineController', function($rootScope, $scope) {
    $rootScope.activeLeftMenu = $rootScope.leftMenus[1];
    
    $scope.powerlines = [
    { name: 'Reggae', no: 1 },
    { name: 'Chill', no: 2 },
    { name: 'Dubstep', no: 3 },
    { name: 'Indie', no: 4 },
    { name: 'Rap', no: 5 },
    { name: 'Cowbell', no: 6 }
  ];
});
app.controller('SinglePowerLineController', function($rootScope, $scope) {
    $rootScope.activeLeftMenu = $rootScope.leftMenus[1];
    
});
app.controller('LocationController', function($rootScope, $scope) {
    
});
app.controller('UserController', function($rootScope, $scope) {
    
});
app.controller('ManageController', function($rootScope, $scope) {
    $rootScope.activeLeftMenu = $rootScope.leftMenus[7];
    
    $scope.removePowerLine = function() {
        $rootScope.showLoading();
        $http.post("/powerLine/remove").success(function(result) {
            $rootScope.closeLoading();
            if (result) {
                $rootScope.showSuccess("清除成功");
            } else {
                $rootScope.showError("清除失败，请重试");
            }
        }).error(function(error) {
            $rootScope.closeLoading();
            $rootScope.showError("出现错误，请重试");
        });
    }
});

function initBMap(id, scope, isClick) {
    navigator.geolocation.getCurrentPosition(function(position) {
        BMap.Convertor.translate(new BMap.Point(
            position.coords.longitude,
            position.coords.latitude), 0,
            function(point) {
                _initBMap(id, scope, new BMap.Point(point.lng, point.lat), isClick);
            });
    }, function(error) {
        _initBMap(id, scope, new BMap.Point(121.48, 31.22), isClick);
    });
}

function _initBMap(id, scope, beginPoint, isClick) {
    scope.map = new BMap.Map(id); // 创建Map实例
    scope.map.centerAndZoom(beginPoint, 25); // 初始化地图,设置中心点坐标和地图级别
    scope.map.addControl(new BMap.MapTypeControl()); //添加地图类型控件
    scope.map.addOverlay(new BMap.Marker(beginPoint));
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

var getHead = function(e) {
    if (document.getElementById("head") != null)
        document.getElementById("head").innerHTML = "<br />电子罗盘：" + e.webkitCompassHeading;
};
var watchPosition;
function start() {
    watchPosition = navigator.geolocation.watchPosition(function(position) {
        if (document.getElementById("location") != null) {
            document.getElementById("location").innerHTML =
            "纬度: " + position.coords.latitude +
            "<br />经度: " + position.coords.longitude +
            "<br />精度: " + position.coords.accuracy +
            "<br />海拔: " + position.coords.altitude +
            "<br />海拔精度: " + position.coords.altitudeAccuracy +
            "<br />方向: " + position.coords.heading +
            "<br />速度: " + position.coords.speed;
        }
    });
    window.addEventListener('deviceorientation', getHead);
}
function stop() {
    navigator.geolocation.clearWatch(watchPosition);
    window.removeEventListener('deviceorientation', getHead);
}

function isNum(str) {
    var reg = /(^(\d+)$|^(\d+)\.(\d+)$)/gi;
    if (reg.test(str))
        return true;
    else
        return false;
}