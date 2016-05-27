/// <reference path="../../typings/my/angular.d.ts" />

var app = angular.module("plim", ["ionic", "radialIndicator", "ngAnimate", "chart.js"]);
app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state("app", {
            url: "/app",
            abstract: true,
            templateUrl: "templates/menu.html",
            controller: "PLIMController"
        })
        .state("app.user", {
            url: "/user",
            abstract: true,
            templateUrl: "templates/user.html",
            controller: "UserController"
        })
        .state("app.user.info", {
            url: "/info",
            templateUrl: "user"
        })
        .state("app.user.register", {
            url: "/register",
            templateUrl: "user/register"
        })
        .state("app.addPowerLineData", {
            cache: false,
            url: "/addPowerLine/:data",
            templateUrl: "powerLine/add",
            controller: "AddPowerLineController"
        })
        .state("app.powerline", {
            url: "/powerline",
            abstract: true,
            templateUrl: "templates/powerline.html"
        })
        .state("app.powerline.list", {
            url: "/list",
            views: {
                "list-tab": {
                    templateUrl: "powerLine/list",
                    controller: "ListPowerLineController"
                }
            }
        })
        .state("app.powerline.search", {
            url: "/list/:keyWord",
            views: {
                "list-tab": {
                    templateUrl: "powerLine/list",
                    controller: "ListPowerLineController"
                }
            }
        })
        .state("app.powerline.powerline", {
            url: "/powerline/:no",
            views: {
                "list-tab": {
                    templateUrl: function ($stateParams) {
                        return "powerLine/detail/" + $stateParams.no;
                    },
                    controller: "DetailPowerLineController"
                }
            }
        })
        .state("app.maintain", {
            url: "/maintain",
            abstract: true,
            templateUrl: "templates/maintain.html"
        })
        .state("app.maintain.list", {
            url: "/list",
            views: {
                "list-tab": {
                    templateUrl: "maintain/list",
                    controller: "ListMaintainController"
                }
            }
        })
        .state("app.maintain.powerline", {
            url: "/powerline/:no",
            views: {
                "list-tab": {
                    templateUrl: function ($stateParams) {
                        return "maintain/detail/" + $stateParams.no;
                    },
                    controller: "DetailMaintainController"
                }
            }
        })
        .state("app.maintain.position", {
            url: "/position",
            views: {
                "position-tab": {
                    templateUrl: "maintain/position",
                    controller: "PositionMaintainController"
                }
            }
        });
    $urlRouterProvider.when("/app/addPowerLine", "/app/addPowerLine/");
    $urlRouterProvider.otherwise("/app/user/info");
});
app.factory("LeftMenus", function () {
    return {
        all: function () {
            return [
                { "title": "用户中心", "href": "#/app/user" },
                { "title": "线路录入", "href": "#/app/addPowerLine" },
                { "title": "线路维修", "href": "#/app/maintain/list" },
                { "title": "所有线路", "href": "#/app/powerline/list" }
            ];
        }
    }
});