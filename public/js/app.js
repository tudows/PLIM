var map;
var app = angular.module('plim', ['ionic', 'ngRoute'])
    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider
                .when('/addPowerLine', {
                    templateUrl: 'powerLine/add',
                    controller: 'PowerLineController'
                })
                .when('/showPowerLine', {
                    templateUrl: 'powerLine/show',
                    controller: 'PowerLineController'
                })
                .when('/location', {
                    templateUrl: 'location.html',
                    controller: 'LocationController'
                })
                .when('/user/login', {
                    templateUrl: 'user/login',
                    controller: 'UserController'
                })
                .when('/user/register', {
                    templateUrl: 'user/register',
                    controller: 'UserController'
                })
                .otherwise({
                    templateUrl: 'powerLine/add',
                    controller: 'PowerLineController'
                });
        }
    ])
    .factory('LeftMenus', function() {
        return {
            all: function() {
                return [
                    { "title": "线路录入", "href": "#addPowerLine" },
                    { "title": "线路定位", "href": "#showPowerLine" },
                    { "title": "登陆", "href": "#user/login" },
                    { "title": "注册", "href": "#user/register" },
                    { "title": "旧版", "href": "index1" },
                    { "title": "登出", "href": "user/logout" },
                    { "title": "定位测试", "href": "#location" }
                ];
            }
        }
    }
);
app.controller('PLIMController', function($scope, $window, LeftMenus, $ionicSideMenuDelegate) {
    // 初始化left menu
    $scope.leftMenus = LeftMenus.all();
    $scope.activeLeftMenu = $scope.leftMenus[0];
    $scope.selectleftMenu = function(leftMenu, index) {
        $scope.activeLeftMenu = leftMenu;
        $ionicSideMenuDelegate.toggleLeft(false);
    };

    // 左侧菜单切换
    $scope.toggleLeftMenu = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };
    
    $scope.refresh = function() {
        $window.location.reload();
    }
});
app.controller('PowerLineController', function($scope, $http, $ionicPopup) {
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
    
    $scope.showCoordinate = function() {
        var alertPopup = $ionicPopup.alert({
            title: "详细坐标",
            templateUrl: "coordinate.html",
            scope: $scope
        });
        alertPopup.then(function(res) {
            
        });
    };
    
    $scope.showError = function(text) {
        $ionicPopup.alert({
            title: "错误",
            template: text,
            scope: $scope
        });
    };
    
    $scope.showSuccess = function(text) {
        $ionicPopup.alert({
            title: "成功",
            template: text,
            scope: $scope
        });
    };
    
    $scope.startLongitude = "无数据";
    $scope.startLatitude = "无数据";
    $scope.endLongitude = "无数据";
    $scope.endLatitude = "无数据";
    
    $scope.getStartPosition = function() {
        map.clearOverlays();
        navigator.geolocation.getCurrentPosition(function(position) {
            BMap.Convertor.translate(new BMap.Point(
                position.coords.longitude,
                position.coords.latitude), 0,
                function(point) {
                    $scope.startLongitude = point.lng;
                    $scope.startLatitude = point.lat;
                    var beginPoint = new BMap.Point(point.lng, point.lat);
                    map.centerAndZoom(beginPoint, 25);
                    map.addOverlay(new BMap.Marker(beginPoint));
            });
        }, function(error) {
            $scope.startLongitude = "无法获取";
            $scope.startLatitude = "无法获取";
            $scope.showError("坐标获取失败");
        });
    }

    $scope.getEndPosition = function() {
        navigator.geolocation.getCurrentPosition(function(position) {
            BMap.Convertor.translate(new BMap.Point(
                position.coords.longitude,
                position.coords.latitude), 0,
                function(point) {
                    $scope.endLongitude = point.lng;
                    $scope.endLatitude = point.lat;
                    var beginPoint = new BMap.Point($scope.startLongitude , $scope.startLatitude);
                    var endPoint = new BMap.Point(point.lng, point.lat);
                    map.addOverlay(new BMap.Marker(endPoint));
                    var polyline = new BMap.Polyline([beginPoint, endPoint], {
                        strokeColor:"red",
                        strokeWeight:5,
                        strokeOpacity:0.5
                    });
                    map.addOverlay(polyline);
            });
        }, function(error) {
            $scope.endLongitude = "无法获取";
            $scope.endLatitude = "无法获取";
            $scope.showError("坐标获取失败");
        });
    }

    $scope.savePowerLine = function() {
        if (isNum($scope.startLongitude)
            && isNum($scope.startLatitude)
            && isNum($scope.endLongitude)
            && isNum($scope.endLatitude)) {
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
                $scope.showSuccess("保存成功");
            });
        } else {
            $scope.showError("坐标有误，请重试");
        }
    }
    
    $scope.showPowerLine = function() {
        $http.get("/powerLine/list?provinceNo=pHD006").success(function(result) {
            map.clearOverlays();
            for (var i = 0; i < result.length; i++) {
                var points = [];
                points.push(new BMap.Point(result[i].location.startLongitude, result[i].location.startLatitude));
                points.push(new BMap.Point(result[i].location.endLongitude, result[i].location.endLatitude));
                if (i == 0) {
                    map.centerAndZoom(points[0], 25);
                }
                var polyline = new BMap.Polyline(points, {
                    strokeColor:"red",
                    strokeWeight:1,
                    strokeOpacity:0.5
                });
                map.addOverlay(polyline);
            }
        });
    }
});
app.controller('LocationController', function($scope) {
    
});
app.directive("appMap", function() {
    return {
        restrict: "E",
        replace: true,
        template: "<div></div>",
        scope: {
            center: "=",		// Center point on the map (e.g. <code>{ latitude: 10, longitude: 10 }</code>).
            markers: "=",	   // Array of map markers (e.g. <code>[{ lat: 10, lon: 10, name: "hello" }]</code>).
            width: "@",		 // Map width in pixels.
            height: "@",		// Map height in pixels.
            zoom: "@",		  // Zoom level (one is totally zoomed out, 25 is very much zoomed in).
            zoomControl: "@",   // Whether to show a zoom control on the map.
            scaleControl: "@",   // Whether to show scale control on the map.
            address: "@"
        },
        link: function(scope, element, attrs) {
            navigator.geolocation.getCurrentPosition(function(position) {
                BMap.Convertor.translate(new BMap.Point(
                    position.coords.longitude,
                    position.coords.latitude), 0,
                    function(point) {
                        initBMap(attrs, new BMap.Point(point.lng, point.lat));
                    });
            }, function(error) {
                initBMap(attrs, new BMap.Point(121.48, 31.22));
            });
        }
    };
});

function initBMap(attrs, beginPoint) {
    map = new BMap.Map(attrs.id); // 创建Map实例
    map.centerAndZoom(beginPoint, 25); // 初始化地图,设置中心点坐标和地图级别
    map.addControl(new BMap.MapTypeControl()); //添加地图类型控件
    map.addOverlay(new BMap.Marker(beginPoint));
    map.setCurrentCity("上海"); // 设置地图显示的城市 此项是必须设置的
    map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
    if (attrs.clickpoint != null) {
        map.addEventListener("click", function(e){ //点击事件
            var startLongitude = document.getElementById("startLongitude");
            var startLatitude = document.getElementById("startLatitude");
            var endLongitude = document.getElementById("endLongitude");
            var endLatitude = document.getElementById("endLatitude");
            if (startLatitude.value == null || startLatitude.value == "") {
                startLongitude.value = e.point.lng;
                startLatitude.value = e.point.lat;
            } else {
                endLongitude.value = e.point.lng;
                endLatitude.value = e.point.lat;
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