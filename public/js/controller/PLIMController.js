app.controller("PLIMController", function ($rootScope, $scope, $window, LeftMenus, $ionicSideMenuDelegate, $ionicPopup) {
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

});