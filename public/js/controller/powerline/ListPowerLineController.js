app.controller("ListPowerLineController", function ($rootScope, $scope, $http, $ionicHistory, User, $stateParams) {
    $rootScope.activeLeftMenu = $rootScope.leftMenus[3];

    $ionicHistory.clearHistory();

    $scope.pullRefresh = function () {
        var url = "";
        if ($stateParams.keyWord != null) {
            url = "/manage/searchPowerLine?keyWord=" + $stateParams.keyWord;
            $scope.keyWord = $stateParams.keyWord;
        } else {
            url = "/powerLine/listPowerLine";
        }
        $http.get(url).success(function (result) {
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
    
    $scope.search = function () {
        $http.get("/manage/searchPowerLine?keyWord=" + document.getElementById("keyWord").value).success(function (result) {
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
        if (toState.name == "app.powerline.list") {
            $rootScope.showLoading();
            $scope.pullRefresh();
        }
    });
});