app.controller("UserController", function ($rootScope, $scope, $ionicPopup, User, $http) {
    $rootScope.activeLeftMenu = $rootScope.leftMenus[0];
    
    if (User.getUser() == null) {
        $rootScope.showLoading("正在获取设备标识符。。。");
        new Fingerprint2().get(function (result, components) {
            $rootScope.closeLoading();
            $scope.uuid = result;
            $rootScope.showLoading("登录中，请稍后");
            $http({
                method: "post",
                url: "user/login",
                data: {
                    uuid: result
                }
            }).success(function (result) {
                $rootScope.closeLoading();
                if (result != "") {
                    User.setUser(result);
                } else {
                    $rootScope.showError("设备未注册");
                }
            }).error(function (error) {
                $rootScope.showError("登录失败，请重试");
            });
        });
    }

    $scope.showUuid = function () {
        var uuidPopup = $ionicPopup.alert({
            title: "设备信息",
            templateUrl: "uuid.html",
            scope: $scope
        });
    };

    $scope.register = function () {
        $http({
            method: "post",
            url: "user/findNo",
            data: {
                no: document.getElementsByName("userNo")[0].value
            }
        }).success(function (result) {
            $rootScope.closeLoading();
            if (result != "") {
                //User.setUser(result);
            } else {
                $rootScope.showError("工号不存在");
            }
        }).error(function (error) {
            $rootScope.showError("申请失败，请重试");
        });
    };
});