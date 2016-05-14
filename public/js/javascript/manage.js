var block = false;
var map = new BMap.Map("map");
var point = new BMap.Point(121.472724, 31.243219);
map.enableScrollWheelZoom();
map.enableContinuousZoom();
map.addControl(new BMap.NavigationControl());
var scale = 10;
var height = null;
map.centerAndZoom(point, scale);
var type = 1;

var previousFrame = null;
var paused = false;
var pauseOnGesture = false;

var controllerOptions = { enableGestures: true };

Leap.loop(controllerOptions, function (frame) {
    if (paused) {
        return; // Skip this update
    }

    if (frame.hands.length > 0) {
        var hand = frame.hands[0];
        var palm = vectorToArray(hand.palmPosition);
        var palmNormal = vectorToArray(hand.palmNormal);
        var radius = hand.sphereRadius;
        var direction = vectorToArray(hand.direction, 2);
        var pitchRadians = direction[0];
        var yawRadians = direction[1];
        var rollRadians = direction[2];

        if (radius > 50) {
            if (palmNormal[1] > 0.7) {
                if (!block) {
                    block = true;
                    // if (height > palm[1]) {
                    //     $("#map").trigger("mousewheel", [120]);
                    // } else if (height < palm[1]) {
                    //     $("#map").trigger("mousewheel", [-120]);
                    // }
                    scale = 15 + parseInt((height - palm[1]) / 20) * 20 / 100 * 7.5;
                    map.centerAndZoom(map.getCenter(), scale);
                    console.log(scale);
                    // var h = parseInt((height - palm[1]) / 20);
                    // console.log(height - palm[1]);
                    // if (h > 0) {
                    //     map.zoomIn();
                    // } else if (h < 0) {
                    //     map.zoomOut();
                    // }
                    // height = palm[1];
                    block = false;
                    type = 0;
                }
            } else if (palmNormal[1] < -0.6) {
                var func = function () {
                    if (pitchRadians >= 0) {
                        pitchRadians = Math.abs(pitchRadians) * -1;
                    } else {
                        pitchRadians = Math.abs(pitchRadians);
                    }
                    pitchRadians = parseInt(pitchRadians * 100 / 20) * 20;

                    if (yawRadians >= 0) {
                        yawRadians = Math.abs(yawRadians);
                    } else {
                        yawRadians = Math.abs(yawRadians) * -1;
                    }
                    yawRadians = parseInt(yawRadians * 100 / 20) * 20;

                    if (!block) {
                        block = true;
                        map.panBy(pitchRadians * 10, yawRadians * 10);
                        setTimeout(function () {
                            block = false;
                        }, 500);
                    }
                }

                if (type == 0) {
                    setTimeout(func, 5000);
                } else {
                    func();
                }
                height = palm[1];
                type = 1;

            }
        } else {
            if (frame.gestures.length > 0) {
                for (var i = 0; i < frame.gestures.length; i++) {
                    var gesture = frame.gestures[i];
                    switch (gesture.type) {
                        case "circle":
                            if (gesture.state == "stop") {
                                showPowerLine();
                                showUser();
                            }
                            break;
                        default: break;
                    }
                }
            }
        }
    }
    previousFrame = frame;
});

function vectorToArray(vector, digits) {
    if (typeof digits === "undefined") {
        digits = 1;
    }
    return [parseFloat(vector[0].toFixed(digits)), parseFloat(vector[1].toFixed(digits)), parseFloat(vector[2].toFixed(digits))]
}

function togglePause() {
    paused = !paused;
}

var showBlock1 = false;
var isShow1 = false;
var showBlock2 = false;
var isShow2 = false;
var lines = [];
var markers = [];
var opts = {
    width: 250,
    height: 80,
    title: "线路信息",
    enableMessage: true //设置允许信息窗发送短息
};
function addClickHandler(content, marker) {
    marker.addEventListener("click", function (e) {
        var p = e.target;
        var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
        var infoWindow = new BMap.InfoWindow(content, opts);
        map.openInfoWindow(infoWindow, point);
    });
}
function showPowerLine() {
    if (!showBlock1) {
        if (!isShow1) {
            showBlock1 = true;
            $.get("powerLine/listPowerLine", function (data, status) {
                data.forEach(function (powerline) {
                    var startLongitude = parseFloat(powerline.location.startLongitude);
                    var startLatitude = parseFloat(powerline.location.startLatitude);
                    var endLongitude = parseFloat(powerline.location.endLongitude);
                    var endLatitude = parseFloat(powerline.location.endLatitude);
                    
                    var polyline = new BMap.Polyline([
                        new BMap.Point(startLongitude, startLatitude),
                        new BMap.Point(endLongitude, endLatitude)
                    ], {
                        strokeColor: "blue", strokeWeight: 6, strokeOpacity: 0.5
                    });
                    var marker = new BMap.Marker(new BMap.Point(
                        (startLongitude + endLongitude) / 2,
                        (startLatitude + endLatitude) / 2
                    ));

                    lines.push(polyline);
                    markers.push(marker);

                    map.addOverlay(polyline);
                    map.addOverlay(marker);
                    addClickHandler(powerline.no + "<br />" + powerline.runningState.nameCn, marker);
                });
                setTimeout(function() {
                    showBlock1 = false;
                    isShow1 = true;
                }, 2000);
            });
        } else {
            showBlock1 = true;
            for (var i = 0; i < lines.length; i++) {
                map.removeControl(lines[i]);
                map.removeControl(markers[i]);
            }
            lines = [];
            markers = [];
            setTimeout(function() {
                isShow1 = false;
                showBlock1 = false;
            }, 2000);
        }
    }
}

var points = [];
var opts1 = {
    width: 250,
    height: 80,
    title: "人员信息",
    enableMessage: true
};
function addClickHandler1(content, marker) {
    marker.addEventListener("click", function (e) {
        var p = e.target;
        var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
        var infoWindow = new BMap.InfoWindow(content, opts1);
        map.openInfoWindow(infoWindow, point);
    });
}
function showUser() {
    if (!showBlock2) {
        if (!isShow2) {
            showBlock2 = true;
            $.get("user/listUser", function (data, status) {
                data.forEach(function (user) {
                    if (user.lastLocation != null) {
                        var point = new BMap.Marker(new BMap.Point(user.lastLocation.longitude, user.lastLocation.latitude), {
                            icon: new BMap.Symbol(BMap_Symbol_SHAPE_CIRCLE, {
                                scale: 5,
                                strokeWeight: 1,
                                fillColor: '#d340c3',
                                fillOpacity: 0.8
                            })
                        });
                        points.push(point);
                        map.addOverlay(point);
                        addClickHandler1(user.name, point);
                    }
                });
                setTimeout(function() {
                    showBlock2 = false;
                    isShow2 = true;
                }, 2000);
            });
        } else {
            showBlock2 = true;
            points.forEach(function (point) {
                map.removeControl(point);
            });
            points = [];
            setTimeout(function() {
                isShow2 = false;
                showBlock2 = false;
            }, 2000);
        }
    }
}