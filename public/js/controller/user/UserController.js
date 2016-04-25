app.controller("UserController", function ($rootScope, $scope, $ionicPopup, User, $http, $ionicHistory) {
    $rootScope.activeLeftMenu = $rootScope.leftMenus[0];
    
    // $http.post("user/addUser", {
    //     no: "20160001",
    //     name: "admin"
    // });
    // $http.post("user/addUser", {
    //     no: "20160002",
    //     name: "郑冉"
    // });
    
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
                    $scope.user = result;
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
    
    $scope.showInfoConfirm = function () {
        var infoConfirmPopup = $ionicPopup.confirm({
            title: "信息确认",
            templateUrl: "infoConfirm.html",
            scope: $scope
        });
        infoConfirmPopup.then(function (res) {
            if (res) {
                $rootScope.showLoading();
                $http({
                    method: "post",
                    url: "user/register",
                    data: {
                        no: document.getElementsByName("userNo")[0].value,
                        uuid: $scope.uuid
                    }
                }).success(function (result) {
                    $rootScope.closeLoading();
                    if (result != "") {
                        User.setUser(result);
                        $scope.user = result;
                        $ionicHistory.goBack();
                    } else {
                        $rootScope.showError("申请失败，请重试");
                    }
                }).error(function (error) {
                    $rootScope.closeLoading();
                    $rootScope.showError("申请失败，请重试");
                });
            }
        });
    };

    $scope.register = function () {
        if (document.getElementsByName("userNo")[0].value != null &&
                document.getElementsByName("userNo")[0].value != "") {
            $rootScope.showLoading();
            $http({
                method: "post",
                url: "user/findNo",
                data: {
                    no: document.getElementsByName("userNo")[0].value
                }
            }).success(function (result) {
                $rootScope.closeLoading();
                if (result != "") {
                    $scope.confirmUser = result;
                    $scope.showInfoConfirm();
                } else {
                    $rootScope.showError("工号不存在");
                }
            }).error(function (error) {
                $rootScope.closeLoading();
                $rootScope.showError("信息获取失败，请重试");
            });
        } else {
            $rootScope.showError("请填写工号");
        }
    };
});