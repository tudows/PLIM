app.controller("ListPowerLineController", function ($rootScope, $scope, $http, $ionicHistory, User) {
    $rootScope.activeLeftMenu = $rootScope.leftMenus[2];

    $ionicHistory.clearHistory();

    $scope.pullRefresh = function () {
        $http.post("/maintain/listMainPowerLine", { userId: User.getUser()._id }).success(function (result) {
            $scope.powerlines = result;
        }).error(function (error) {
            $scope.powerlines = [];
            $rootScope.showError("出现错误，请重试");
        }).finally(function () {
            $scope.$broadcast("scroll.refreshComplete");
        });
    }
    
    $rootScope.showLoading();
    
    if (User.getUser() != null) {
        $http.post("/maintain/listMainPowerLine", { userId: User.getUser()._id }).success(function (result) {
            $scope.powerlines = result;
            $rootScope.closeLoading();
        }).error(function (error) {
            $rootScope.closeLoading();
            $rootScope.showError("出现错误，请重试");
        });
    }
    
    $rootScope.$on('hasUser', function (event,data) {
        $http.post("/maintain/listMainPowerLine", { userId: User.getUser()._id }).success(function (result) {
            $scope.powerlines = result;
            $rootScope.closeLoading();
        }).error(function (error) {
            $rootScope.closeLoading();
            $rootScope.showError("出现错误，请重试");
        });
    });
});