app.controller("ListMaintainController", function ($rootScope, $scope, $http, $ionicHistory, User) {
    $rootScope.activeLeftMenu = $rootScope.leftMenus[2];

    $ionicHistory.clearHistory();

    $scope.pullRefresh = function () {
        $http.post("/maintain/listMainPowerLine", { userId: User.getUser()._id }).success(function (result) {
            $scope.powerlines = result;
            $rootScope.closeLoading();
        }).error(function (error) {
            $scope.powerlines = [];
            $rootScope.closeLoading();
            $rootScope.showError("出现错误，请重试");
        }).finally(function () {
            $scope.$broadcast("scroll.refreshComplete");
        });
    }
    
    $rootScope.showLoading();
    
    if (User.getUser() != null) {
        $scope.pullRefresh();
    }
    
    $rootScope.$on('hasUser', function (event,data) {
        $scope.pullRefresh();
    });
    
    $scope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
        if (toState.name == "app.maintain.list") {
            $rootScope.showLoading();
            $scope.pullRefresh();
        }
    });
});