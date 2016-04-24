function initBMap(id, scope, isClick, callback) {
    if (scope.map == null) {
        navigator.geolocation.getCurrentPosition(function (position) {
            BMap.Convertor.translate(new BMap.Point(
                position.coords.longitude,
                position.coords.latitude), 0,
                function (point) {
                    _initBMap(id, scope, new BMap.Point(point.lng, point.lat), isClick);
                    callback();
                });
        }, function (error) {
            _initBMap(id, scope, new BMap.Point(121.48, 31.22), isClick);
            callback();
        });
    }
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
        scope.map.addEventListener("click", function (e) { //点击事件
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
                    strokeColor: "red",
                    strokeWeight: 5,
                    strokeOpacity: 0.5
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