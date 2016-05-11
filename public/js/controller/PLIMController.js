app.controller("PLIMController", function ($rootScope, $scope, $http, $window, User, LeftMenus, $ionicSideMenuDelegate, $ionicPopup, $state, $ionicHistory) {
    // 初始化left menu
    $rootScope.leftMenus = LeftMenus.all();
    $rootScope.activeLeftMenu = $rootScope.leftMenus[0];
    $scope.selectleftMenu = function (leftMenu, index) {
        $rootScope.activeLeftMenu = leftMenu;
        $ionicSideMenuDelegate.toggleLeft(false);
    };

    // 左侧菜单切换
    $scope.toggleLeftMenu = function () {
        $ionicSideMenuDelegate.toggleLeft();
    };

    $scope.refresh = function () {
        $window.location.reload();
    };
    
    $scope.random = function () {
        $http.get("powerline/random");
    };

    $rootScope.showError = function (text) {
        $ionicPopup.alert({
            title: "错误",
            template: text
        });
    };

    $rootScope.showSuccess = function (text) {
        $ionicPopup.alert({
            title: "成功",
            template: text
        });
    };

    $rootScope.showLoading = function (text) {
        if (text == null) {
            text = "正在加载中...";
        }
        $rootScope.loadingPopup = $ionicPopup.show({
            templateUrl: "loading.html",
            title: text
        });
    };

    $rootScope.closeLoading = function () {
        if ($rootScope.loadingPopup != null) {
            $rootScope.loadingPopup.close();
            $rootScope.loadingPopup = null;
        }
    };
    
    if (User.getUser() == null) {
        // $rootScope.showLoading("正在获取设备标识符。。。");
        new Fingerprint2().get(function (result, components) {
            // $rootScope.closeLoading();
            User.setUuid(result);
            // $rootScope.showLoading("登录中，请稍后");
            $http({
                method: "post",
                url: "user/login",
                data: {
                    uuid: result
                }
            }).success(function (result) {
                // $rootScope.closeLoading();
                if (result != "") {
                    User.setUser(result);
                } else {
                    $state.go("app.user.register", {});
                    $rootScope.showError("设备未注册");
                }
            }).error(function (error) {
                $rootScope.showError("登录失败，请重试");
            });
        });
    }

});