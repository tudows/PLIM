app.controller("DetailPowerLineController", function ($rootScope, $scope, $stateParams, $http, $state, PowerLine, $ionicHistory) {
    $rootScope.activeLeftMenu = $rootScope.leftMenus[2];

    $rootScope.showLoading();
    $http.get("/powerLine/listPowerLine?no=" + $stateParams.no).success(function (result) {
        if (result != null && result.length == 1) {
            $scope.powerline = result[0];
            $rootScope.closeLoading();
        } else {
            $rootScope.closeLoading();
            $rootScope.showError("出现错误，请重试");
        }
    }).error(function (error) {
        $rootScope.closeLoading();
        $rootScope.showError("出现错误，请重试");
    });

    $scope.back = function () {
        if ($ionicHistory.backTitle() == null) {
            $state.go("app.powerline_maintain.list", {});
        } else {
            $ionicHistory.goBack();
        }
    }

    $scope.position = function () {
        PowerLine.setPowerline($scope.powerline);

        $state.go("app.powerline_maintain.position", {});
    }
});