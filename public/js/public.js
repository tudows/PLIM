function initBMap(id, scope, callback) {
    if (scope.map == null) {
        navigator.geolocation.getCurrentPosition(function (position) {
            BMap.Convertor.translate(new BMap.Point(
                position.coords.longitude,
                position.coords.latitude), 0,
                function (point) {
                    _initBMap(id, scope, new BMap.Point(point.lng, point.lat));
                    callback();
                });
        }, function (error) {
            _initBMap(id, scope, new BMap.Point(121.48, 31.22));
            callback();
        });
    }
}

function _initBMap(id, scope, beginPoint) {
    scope.map = new BMap.Map(id); // 创建Map实例
    scope.map.centerAndZoom(beginPoint, 25); // 初始化地图,设置中心点坐标和地图级别
    scope.map.addControl(new BMap.MapTypeControl()); //地图类型控件
    scope.map.addControl(new BMap.NavigationControl()); //平移缩放控件
    scope.map.addControl(new BMap.GeolocationControl()); //定位控件
    // scope.map.addOverlay(new BMap.Marker(beginPoint));
    scope.map.setCurrentCity("上海"); // 设置地图显示的城市 此项是必须设置的
    scope.map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
}

function isNum(str) {
    var reg = /(^(\d+)$|^(\d+)\.(\d+)$)/gi;
    if (reg.test(str))
        return true;
    else
        return false;
}