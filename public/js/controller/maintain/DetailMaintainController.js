/// <reference path="../../../../typings/my/angular.d.ts" />

app.controller("DetailMaintainController", function ($filter, $rootScope, $scope, $stateParams, $http, $state, PowerLine, $ionicHistory, $interval, radialIndicatorInstance, $ionicModal, User) {
    $rootScope.activeLeftMenu = $rootScope.leftMenus[2];
    
    $scope.indicatorOptionK = {
        radius: 20,
        minValue: 0,
        maxValue: 1000,
        initValue: 500,
        barColor: {
            0: "#33CC33",
            300: "#0066FF",
            600: "#FFFF00",
            1000: "#FF0000"
        },
        roundCorner: true,
        format: function (value) {
            if (value <= 1000) {
                return value + "%";
            } else {
                return "∞"
            }
        }
    };
    
    $scope.indicatorOptionH = {
        radius: 20,
        minValue: 0,
        maxValue: 100,
        initValue: 50,
        percentage: true,
        barColor: {
            0: "#FF0000",
            30: "#FFFF00",
            60: "#0066FF",
            100: "#33CC33"
        },
        roundCorner: true
    };
    
    $ionicModal.fromTemplateUrl("moreInfo.html", {
        scope: $scope,
        animation: "slide-in-up"
    }).then(function (modal) {
        $scope.moreInfoModal = modal;
    });
    
    $ionicModal.fromTemplateUrl("maintainInfo.html", {
        scope: $scope,
        animation: "slide-in-up"
    }).then(function (modal) {
        $scope.maintainInfoModal = modal;
    });
    
    $ionicModal.fromTemplateUrl("weather.html", {
        scope: $scope,
        animation: "slide-in-up"
    }).then(function (modal) {
        $scope.weatherModal = modal;
    });
    
    $scope.powerlineDetailBlock = false;
    
    $scope.getDetail = function() {
        try {
            if (!$scope.powerlineDetailBlock) {
                $scope.powerlineDetailBlock = true;
                if ($scope.powerline == null) {
                    $rootScope.showLoading();
                }
                async.series([
                    function (_call1) {
                        if ($scope.maintainTypes == null) {
                            $http.get("baseData/getMaintainType").success(function (result) {
                                $scope.maintainTypes = result;
                                _call1(null);
                            });
                        } else {
                            _call1(null);
                        }
                    }
                ], function (err) {
                    $http.get("/powerLine/listPowerLine?no=" + $stateParams.no).success(function (result) {
                        if (result != null && result.length > 0) {
                            $scope.powerline = result[0];
                            
                            $http.post("maintain/getMaintainInfo", {powerLineId: $scope.powerline._id}).success(function (result) {
                                $scope.maintain = result;
                                if ($scope.maintainCompleteIllustration == null || $scope.maintainCompleteIllustration == "") {
                                    $scope.maintainCompleteIllustration = "";
                                }
                            });
                            
                            var healthy = $scope.powerline.operationParameter.healthy;
                            radialIndicatorInstance["healthyIndicator"].animate(healthy);
                            if (healthy < 20) {
                                $scope.healthyText = "警告";
                            } else if (healthy < 40) {
                                $scope.healthyText = "注意";
                            } else if (healthy < 60) {
                                $scope.healthyText = "一般";
                            } else if (healthy < 80) {
                                $scope.healthyText = "普通";
                            } else {
                                $scope.healthyText = "健康";
                            }
                            
                            
                            var repairDayDiff = ((new Date()).getTime() -
                                ($scope.powerline.lastRepairDay == null ?
                                (new Date($scope.powerline.serviceDate)).getTime() : (new Date($scope.powerline.lastRepairDay)).getTime())) / (1000 * 60 * 60 * 24);
                            radialIndicatorInstance["repairIndicator"].animate(parseInt(($scope.powerline.repairDay - repairDayDiff) / $scope.powerline.repairDay * 100));
                            $scope.repairText = "还剩" + parseInt($scope.powerline.repairDay - repairDayDiff) + "天";
                            
                            var maintainDayDiff = ((new Date()).getTime() -
                                ($scope.powerline.lastMaintainDay == null ?
                                (new Date($scope.powerline.serviceDate)).getTime() : (new Date($scope.powerline.lastMaintainDay)).getTime())) / (1000 * 60 * 60 * 24);
                            radialIndicatorInstance["maintainIndicator"].animate(parseInt(($scope.powerline.maintainDay - maintainDayDiff) / $scope.powerline.maintainDay * 100));
                            $scope.maintainText = "还剩" + parseInt($scope.powerline.maintainDay - maintainDayDiff) + "天";
                            
                            var serviceDate = new Date($scope.powerline.serviceDate);
                            var nowDate = new Date();
                            var serviceYearDiff = nowDate.getFullYear() - serviceDate.getFullYear();
                            var serviceYearPercentage = parseInt(serviceYearDiff / $scope.powerline.designYear * 100);
                            radialIndicatorInstance["serviceYearIndicator"].animate(100 - serviceYearPercentage);
                            $scope.serviceYearText = serviceYearDiff + "/" + $scope.powerline.designYear + " 年";
                            
                            var voltDiffUp = $scope.powerline.operationParameter.volt - $scope.powerline.standardOperationParameter.minVolt;
                            var voltDiffDown = $scope.powerline.standardOperationParameter.maxVolt - $scope.powerline.standardOperationParameter.minVolt;
                            radialIndicatorInstance["voltIndicator"].animate(parseInt(voltDiffUp / voltDiffDown * 100));
                            $scope.voltText = parseInt($scope.powerline.operationParameter.volt) + " V";
                            
                            var ampereDiffUp = $scope.powerline.operationParameter.ampere - $scope.powerline.standardOperationParameter.minAmpere;
                            var ampereDiffDown = $scope.powerline.standardOperationParameter.maxAmpere - $scope.powerline.standardOperationParameter.minAmpere;
                            radialIndicatorInstance["ampereIndicator"].animate(parseInt(ampereDiffUp / ampereDiffDown * 100));
                            $scope.ampereText = parseInt($scope.powerline.operationParameter.ampere) + " A";
                            
                            var celsiusDiffUp = $scope.powerline.operationParameter.celsius - $scope.powerline.standardOperationParameter.minCelsius;
                            var celsiusDiffDown = $scope.powerline.standardOperationParameter.maxCelsius - $scope.powerline.standardOperationParameter.minCelsius;
                            radialIndicatorInstance["celsiusIndicator"].animate(parseInt(celsiusDiffUp / celsiusDiffDown * 100));
                            $scope.celsiusText = parseInt($scope.powerline.operationParameter.celsius) + " ℃";
                            
                            var pullNewtonDiffUp = $scope.powerline.operationParameter.pullNewton - $scope.powerline.standardOperationParameter.minPullNewton;
                            var pullNewtonDiffDown = $scope.powerline.standardOperationParameter.maxPullNewton - $scope.powerline.standardOperationParameter.minPullNewton;
                            radialIndicatorInstance["pullNewtonIndicator"].animate(parseInt(pullNewtonDiffUp / pullNewtonDiffDown * 100));
                            $scope.pullNewtonText = parseInt($scope.powerline.operationParameter.pullNewton) + " N";
                            
                            $scope.operateData();
                            
                            $rootScope.closeLoading();
                            $scope.powerlineDetailBlock = false;
                            $scope.$broadcast("scroll.refreshComplete");
                        } else {
                            $scope.powerlineDetailBlock = false;
                            $scope.$broadcast("scroll.refreshComplete");
                            $rootScope.closeLoading();
                            $rootScope.showError("出现错误，请重试");
                        }
                    }).error(function (error) {
                        $rootScope.closeLoading();
                        $scope.powerlineDetailBlock = false;
                        $scope.$broadcast("scroll.refreshComplete");
                        $rootScope.showError("出现错误，请重试");
                    });
                });
            }
        } catch (exception) {}
    };
    
    $scope.operateData = function () {
        if ($scope.powerline.lastRepairDay == null) {
            $scope.powerline.lastRepairDay = "从未维修过";
        } else {
            $filter("date")($scope.powerline.lastMaintainDay, "yyyy-MM-dd");
        }
        if ($scope.powerline.lastMaintainDay == null) {
            $scope.powerline.lastMaintainDay = "从未保养过";
        } else {
            $filter("date")($scope.powerline.lastMaintainDay, "yyyy-MM-dd");
        }
    }
    
    if (User.getUser() != null) {
        $scope.getDetail();
    }
    
    $scope.timer = $interval($scope.getDetail, 10000);

    $scope.back = function () {
        if ($ionicHistory.backTitle() != "维修线路列表") {
            $state.go("app.maintain.list", {});
            // $ionicHistory.clearCache();
        } else {
            $ionicHistory.goBack();
        }
    }

    $scope.position = function () {
        PowerLine.setPowerline($scope.powerline);
        $state.go("app.maintain.position", {});
    }
    
    $scope.maintainPowerline = function () {
        $rootScope.showLoading();
        var code = null;
        var postData = null;
        switch ($scope.maintain.maintainState.code) {
            case 2:
                code = 3;
                postData = {
                    maintanId: $scope.maintain._id,
                    maintainStateCode: code,
                    maintainTypeId: $scope.maintain.maintainType._id,
                    powerLineId: $scope.powerline._id,
                    user: User.getUser()
                };
                break;
            case 3:
                code = 4;
                postData = {
                    maintanId: $scope.maintain._id,
                    maintainStateCode: code,
                    maintainCompleteIllustration: document.getElementsByName("maintainCompleteIllustration")[0].value,
                    powerLineId: $scope.powerline._id,
                    user: User.getUser()
                };
                break;
        }
        if (code != null) {
            // console.log(document.cookie);
            $http.post("maintain/changeMaintain", postData).success(function (result) {
                if (result) {
                    if (code == 4) {
                        $state.go("app.powerline.powerline", { no: $scope.powerline.encrypt });
                        $scope.maintainInfoModal.hide();
                    } else {
                        $scope.maintain = result;
                        $scope.maintainCompleteIllustration = $scope.maintain.maintainCompleteIllustration;
                    }
                    $rootScope.closeLoading();
                } else {
                    $rootScope.closeLoading();
                    $rootScope.showError("出现错误，请重试");
                }
            }).error(function (result) {
                $rootScope.closeLoading();
                $rootScope.showError("出现错误，请重试");
            });
        }
    }

    $scope.$on("$destroy", function () {
        $interval.cancel($scope.timer);
        $scope.timer = null;
    });
    
    $rootScope.$on('hasUser', function (event,data) {
        $scope.getDetail();
    });
    
    $scope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
        if (toState.name == "app.maintain.powerline") {
            if ($scope.timer == null) {
                $scope.getDetail();
                $scope.timer = $interval($scope.getDetail, 10000);
            }
        }
    });
});