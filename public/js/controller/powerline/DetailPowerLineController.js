app.controller("DetailPowerLineController", function ($filter, $rootScope, $scope, $stateParams, $http, $state, PowerLine, $ionicHistory) {
    $rootScope.activeLeftMenu = $rootScope.leftMenus[2];
        
    $scope.indicatorValue = 70;
    
    $scope.getDetail = function() {
        $rootScope.showLoading();
        $http.get("/powerLine/listPowerLine?no=" + $stateParams.no).success(function (result) {
            if (result != null && result.length > 0) {
                $scope.powerline = result[0];
                if ($scope.powerline.lastRepairDay == null) {
                    $scope.powerline.lastRepairDay = "从未维修过";
                } else {
                    $filter('date')($scope.powerline.lastMaintainDay, 'yyyy-MM-dd');
                }
                if ($scope.powerline.lastMaintainDay == null) {
                    $scope.powerline.lastMaintainDay = "从未保养过";
                } else {
                    $filter('date')($scope.powerline.lastMaintainDay, 'yyyy-MM-dd');
                }
                $rootScope.closeLoading();
                $scope.$broadcast("scroll.refreshComplete");
            } else {
                $rootScope.closeLoading();
                $rootScope.showError("出现错误，请重试");
                $scope.$broadcast("scroll.refreshComplete");
            }
        }).error(function (error) {
            $rootScope.closeLoading();
            $rootScope.showError("出现错误，请重试");
            $scope.$broadcast("scroll.refreshComplete");
        });
    };
    
    $scope.getDetail();

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
    
    $scope.detailInfo = false;
    $scope.moreInfo = function ($event) {
        $scope.detailInfo = !$scope.detailInfo;
        if ($scope.detailInfo) {
            angular.element($event.target).html("隐藏信息");
        } else {
            angular.element($event.target).html("更多信息");
        }
    }
});