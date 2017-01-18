// here is define a module ,[]must
angular.module("routers", [])
    .config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state("tab", {
                url: "/tab",
                // to index side-content-nav-view?  .3 1
                // tab has two view and conrresponding to different view
                templateUrl: "templates/tabs.html"
            })
            .state("tab.topics", {
                url: "/topics/:topicTab",
                views: {
                    "topic": {   // here
                        templateUrl: "templates/tab/tab-topics.html",
                        controller: "topicsCtrl"
                    }
                }
            })
            .state("tab.topicDetail", {
                url: "/topic/:topicID",
                views: {
                    "topic": {  // here
                        templateUrl: "templates/tab/tab-topic-detail.html",
                        controller: "topicDetailCtrl"
                    }
                },
                // resolve??
            })
            .state("tab.login", {
                // / must tab no need
                url: "/login",
                views: {
                    "account": { // here
                        templateUrl: "templates/tab/tab-account-login.html",
                        controller: "loginCtrl"
                    }
                }
            })
            .state("tab.account", {
                url: "/account",
                views: {
                    "account": { // here
                        templateUrl: "templates/tab/tab-account-detail.html",
                        controller: "accountCtrl"
                    }
                }
            })
            .state("tab.logout", {
                url: "/account/detail",
                //views
                views: {
                    "account": {
                        templateUrl: "templates/tab/tab-account-logout.html",
                        controller: "logoutCtrl"
                    }
                }
            })
            // tab - all?
            .state("user", {
                url: "/user/:loginname",
                templateUrl: "templates/user.html",
                controller: "userCtrl"
            });

        $urlRouterProvider.otherwise("tab/topics/all");
    }]);
