app.controller("ListPowerLineController", function ($rootScope, $scope, $http, $ionicHistory) {
    $rootScope.activeLeftMenu = $rootScope.leftMenus[2];

    $ionicHistory.clearHistory();
    $ionicHistory.clearCache();

    $rootScope.showLoading();
    $http.get("/powerLine/listPowerLine?provinceNo=pHD006").success(function (result) {
        $scope.powerlines = result;
        $rootScope.closeLoading();
    }).error(function (error) {
        $rootScope.closeLoading();
        $rootScope.showError("出现错误，请重试");
    });

    $scope.pullRefresh = function () {
        $http.get("/powerLine/listPowerLine?provinceNo=pHD006").success(function (result) {
            $scope.powerlines = result;
        }).error(function (error) {
            $scope.powerlines = [];
            $rootScope.showError("出现错误，请重试");
        })
            .finally(function () {
                $scope.$broadcast("scroll.refreshComplete");
            });
    }
});