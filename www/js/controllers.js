
// [] must
// module is the controllers and not previs module.controler
// all module and the child module
// servies and tab serviece

// previous is the module, here is the servicelocalStorageService
angular.module("controllers", [])
    .controller("indexCtrl", ["$scope", "localStorageService", "ionicService", "tabService", function($scope, localStorageService, ionicService, tabService) {
        // $scope.badges = {
        //     message: 0
        // };

        $scope.tabs = tabService.getTabs();
        console.log("indexCtrl");

        var user = JSON.parse(localStorageService.get("user"));

        // if (user) {
        //     ionicService.getMessageCont(user.accesstoken).then(function(data) {
        //         $data.badages.message = dta.data;
        //     });
        // }
    }])


    // 422,402,304,403

.controller("topicsCtrl", ["$scope", "$stateParams", "$state", "$ionicLoading", "$ionicModal", "localStorageService", "ionicService", "tabService", function($scope, $stateParams, $state, $ionicLoading, $ionicModal, localStorageService, ionicService, tabService) {
    console.log("topicsCtrl");
    $scope.postData = {
        // page must ?
        page: 1,    /* 每一页的主题数*/
        tab: "all",
        limit: 10
    };
 
    $scope.topicData = {
        accesstoken: "",   // otherwise 403
        title: "",
        tab: "",
        content: "" 
    };
    if ($stateParams.topicTab !== "") {
        $scope.postData.tab = $stateParams.topicTab;
    }

    var user = JSON.parse(localStorageService.get("user"));

    if (user) {
        $scope.topicData.accesstoken = user.accesstoken;
    }

    $scope.topics = [];
    $scope.more = true;  // must for the first data 

    $scope.loadMore = function() {
        console.log("loadmore");
        ionicService.getTopics($scope.postData).then(function(data) {
            if (data.data.length) {
                console.log($scope.postData);
                console.log(data.data.length);
                $scope.more = true;
                angular.forEach(data.data, function(item) {
                    // console.log(item);
                    $scope.topics.push(item);
                    // ??
                });
                $scope.$broadcast("scroll.infiniteScrollComplete");
                // ??
                $scope.postData.page++;
            } else {
                $scope.more = false;
            }
        });
    };


    $scope.doRefresh = function() {
        $scope.postData.page = 1;
        $scope.topics = [];
        ionicService.getTopics($scope.postData).then(function(data) {
            angular.forEach(data.data, function(item) {
                $scope.topics.push(item);
            });
            $scope.postData.page++;
        });
        $scope.$broadcast("scroll.refreshComplete");
    };

    $ionicModal.fromTemplateUrl("templates/modal/topic-add.html", {
        scope: $scope
    }).then(function(modal) {
        $scope.modalAddTopic = modal;
        $scope.tabs = tabService.getTabs();
    });

    $scope.openModal = function() {
        $scope.modalAddTopic.show();
    };

    $scope.closeModal = function() {
        $scope.modalAddTopic.hide();
    };

    $scope.createTopic = function() {
        $scope.modalAddTopic.hide();
        if (user) {
            ionicService.postTopic($scope.topicData).then(function(data) {
            console.log("33");

                    if (data.success) {
                        $ionicLoading.show({
                            template: "发表成功", duration: 500
                        });
                        $state.go("tab.topicDetail", {
                            topicID: data.topic_id
                        });
                    }
            });
        } else {
            $ionicLoading.show({
                template: "请先登录再发表", duration:1000
            });
        }
    };
}])


// ctrl
.controller("topicDetailCtrl", ["$scope", "$stateParams", "$ionicLoading", "$ionicScrollDelegate", "localStorageService", "ionicService", function($scope, $stateParams, $ionicLoading, $ionicScrollDelegate, localStorageService, ionicService) {
    //用一个覆盖层表示当前处于活动状态，来阻止用户的交互动作。
    $ionicLoading.show({
        content: "Loading",
        /* template具体内容分*/
        animation: "fade-in",
        showBackdrop: false, // trur灰色
        showDelay: 100
    });
    $scope.replyData = {
        accesstoken: "",
        content: "",
        reply_id: ""
    };
    $scope.collectData = {
        accesstoken: "",
        topic_id: $stateParams.topicID
    }; 
    $scope.deCollectData = {
        accesstoken: "",
        topic_id: $stateParams.topicID
    };
    var user = JSON.parse(localStorageService.get("user"));
    console.log(user); // accestolkn logname

    if (user) {
        $scope.replyData.accesstoken = user.accesstoken;
        $scope.collectData.accesstoken = user.accesstoken;
    }

    ionicService.getTopicByID($stateParams.topicID).then(function(data) {
        $scope.topicDetail = data.data;
        $ionicLoading.hide();
    });

    $scope.replyUp = function(replyID) {
        ionicService.postReplyUp(replyID, $scope.replyData.accesstoken).then(function(data) {
            if (data.success) {
                // console.log(data.action);  action up down
                if (data.action == "up") {
                    // loading
                    $ionicLoading.show({
                        template: "赞+1",
                        duration: 500
                    });
                } else {
                    $ionicLoading.show({
                        template: "取消点赞",
                        duration: 500
                    });
                }
            } else {
                $ionicLoading.show({
                    template: data.error_msg,
                    duration: 500
                });
            }
        });
    };


    $scope.reReply = function(replyID, loginname) {
        if ($scope.replyData.accesstoken !== "") { // add
            $scope.replyData.content = "@" + loginname + " ";
            $scope.replyData.reply_id = replyID;
            // console.log($scope.replyData);
        }
    };


    $scope.collect = function() {
        ionicService.postTopicCollect($scope.collectData).then(function(data) {
            if (data.success) {
                $ionicLoading.show({
                    template: "收藏成功",
                    duration: 500
                });
                $scope.deCollectData.accesstoken = $scope.collectData.accesstoken;
                $scope.collectData.accesstoken = "";
            }
        });
    };

    $scope.deCollect = function() {
        ionicService.postDeCollect($scope.deCollectData).then(function(data) {
            if (data.success) {
                $ionicLoading.show({
                    template: "取消收藏",
                    duration: 500
                });
               $scope.collectData.accesstoken = $scope.deCollectData.accesstoken;
               $scope.deCollectData.accesstoken = "";
            }
        });
    };

    $scope.saveReply = function() {
        console.log("save");
        ionicService.postReply($stateParams.topicID, $scope.replyData).then(function(data) {
            if (data.success) {
                $ionicLoading.show({
                    template: "评论成功",
                    duration: 500
                });
                $scope.replyData.content = "";

                ionicService.getTopicByID($stateParams.topicID).then(function(data) {
                    $scope.topicDetail.replies = data.data.replies;
                    $ionicScrollDelegate.scrollBottom();
                });
            }
        });
    };
}])

.controller("loginCtrl", ["$scope", "$ionicPopup", "$state", "localStorageService", "ionicService", "$ionicHistory", function($scope, $ionicPopup, $state, localStorageService, ionicService, $ionicHistory) {
    $scope.login = function(){
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $ionicPopup.show({
            template: "PC登录 http://ionichina.com后，扫描设置页面的Access Token二维码即可完成登录",
            title: "扫描登录",
            scope: $scope, // ?
            buttons: [{
                text: "<b>我知道了</b>",
                type: "button-dark"
            }]
        }).then(function() {
            var user = {
                accesstoken: "",
                loginname: ""
            };
            user.accesstoken = "542e58b6-c46c-4518-9467-4216d9bce8ad";
            ionicService.postUserLogin(user.accesstoken).then(function(data) {
                console.log(data);
                // obj={success,loginname,avatar_url,id}
                user.loginname = data.loginname;
                localStorageService.set("user", JSON.stringify(user));
                $state.go("tab.account");
            });
        });
    };
}])

.controller("accountCtrl", ["ionicService", "localStorageService", "$scope", "$ionicLoading", "$ionicModal", function(ionicService, localStorageService, $scope, $ionicLoading, $ionicModal) {
    var user = JSON.parse(localStorageService.get("user"));
    // console.log(user);    obj onle acctoken

    if (user) {
        ionicService.getUserByName(user.loginname).then(function(data) {
            console.log(data);
            $scope.account = data.data;
        });
        ionicService.getMessages(user.accesstoken).then(function(data) {
            console.log(data)
            $scope.messages = data.data;
        });
    }

    // $scope.setHasRead = function() {
    //     ionicService.postMarkAll(user.accesstoken).then(function(data) {
    //             $ionicLoading.show({
    //                 template: "设置成功", duration: 500
    //             });
    //     });
    // };


    $ionicModal.fromTemplateUrl("templates/modal/topics-collected.html", {
        scope: $scope
    }).then(function(modal) {
        $scope.modal1 = modal;
    }); 

    $ionicModal.fromTemplateUrl("templates/modal/messages.html", {
        scope: $scope
    }).then(function(modal) {
        $scope.modal2 = modal;
    }); 

    $ionicModal.fromTemplateUrl("templates/modal/topics-created.html", {
        scope: $scope
    }).then(function(modal) {
        $scope.modal3 = modal;
    }); 

    $ionicModal.fromTemplateUrl("templates/modal/topics-joined.html", {
        scope: $scope
    }).then(function(modal) {
        $scope.modal4 = modal;
    }); 

    $scope.openModal = function(index) {
        switch (index) {
            case 1: {
                $scope.modal1.show();
                break;
            }
            case 2: {
                $scope.modal2.show();
                break;
            }
            case 3: {
                $scope.modal3.show();
                break;
            }
            case 4: {
                $scope.modal4.show();
                break;
            }
        }   /* :*/
    };

    $scope.deCollect = function(topicID) {
           $scope.deCollectData = {
                  accesstoken:  user.accesstoken,
                  topic_id: topicID
              };        
           ionicService.postDeCollect($scope.deCollectData).then(function(data) {
               if (data.success) {
                   console.log(data); // o-success
                   $ionicLoading.show({
                       template: "取消收藏",
                       duration: 500
                   });

                   // refresh thte collect
                   ionicService.getUserByName(user.loginname).then(function(data) {
                       console.log(data);
                       $scope.account = data.data;
                   });
               }
           });
       };
}])

.controller("logoutCtrl", ["$scope", "$ionicHistory", "$state", "localStorageService", "ionicService", function($scope, $ionicHistory, $state, localStorageService, ionicService) {
    var user = JSON.parse(localStorageService.get("user"));

    if (user) {
        ionicService.getUserByName(user.loginname).then(function(data) {
            // console.log(data);
            $scope.account = data.data;
        });
        // login logout
        $scope.logout = function() {
            localStorageService.remove("user");
            $ionicHistory.nextViewOptions({
                disableBack:true
            });
            // 转到未登录不会有back到注销
            $state.go("tab.login");
        };
    }
}])

.controller("userCtrl", ["$scope", "$stateParams", "ionicService", function($scope, $stateParams, ionicService) {
    ionicService.getUserByName($stateParams.loginname).then(function(data) {
        $scope.account = data.data;
        console.log($scope.account);
    });
}]);


// topicDetail= {
// //     author,author_id,content,create_at,good,id,last_replay_at,tab,title,top,visit_count,reply_count,replies
// }
// 
// 
// reply = {author,contentg,create-at,id,} 