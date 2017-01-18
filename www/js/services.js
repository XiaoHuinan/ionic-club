angular.module("services", [])
    // services也没有错误
    .factory("ionicService", ["$http", "$q", "configService", function($http, $q, configService) {
        return {
            getTopics: function(data) {
                console.log(data);
                var deferred = $q.defer();
                var url = configService.get() + "topics";

                $http({
                     method: "GET",    // not important
                     url: url,
                     // not string so auto json string
                     // param -get - url
                     // s
                     params: data   // postData obj
                }).success(function(data, status, header, config) {
                        deferred.resolve(data);
                });
                return deferred.promise;
            },

            getTopicByID: function(ID) {
                var deferred = $q.defer();
                var url = configService.get() + "topic/" + ID;
                $http.get(url).success(function(data) {
                    deferred.resolve(data);
                });
                return deferred.promise;
            },

            postTopic: function(data) {
                var deferred = $q.defer();
                var url = configService.get() + "topics";
                $http({
                    method: "POST",
                    url: url,
                    data: data,
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    transformRequest: function(obj) {
                        var str = [];
                        for (var p in obj)
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        console.log(str.join("&"));
                        // ccesstoken=542e58b6-c46c-4518-9467-4216d9bce8ad&title=%E6%B5%8B%E8%AF%95&tab=bb&content=%E9%83%BD%E6%98%AFf
                        return str.join("&");
                    }
                }).success(function(data) {
                    console.log(data);
                    deferred.resolve(data);
                });
                return deferred.promise;
            },
            
            // 重复收藏？ 改变收藏表示？
            postTopicCollect: function(data) {
                var deferred = $q.defer();
                var url = configService.get() + "topic/collect";
                $http({
                    method: "POST", 
                    url: url,
                    // ?
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    // Content-Type 被指定为 application/x-www-form-urlencoded；其次，提交的数据按照 key1=val1&key2=val2 的方式进行编码，key 和 val 都进行了 URL 转码。
                    // 利用transformRequest在ajax发送数据之前改变数据的格式
                    // 进行表单提交方式的格式转化
                    data: data, // post, request body
                    transformRequest: function(obj) {
                        var str = [];
                        for (var p in obj) 
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                            return str.join("&");
                    }
                }).success(function(data, status, header, config) {
                    deferred.resolve(data);
                });
                return deferred.promise;
            },

            postDeCollect: function(data) {
                console.log("44");
                var deferred = $q.defer();
                var url = configService.get() + "topic/de_collect";
                $http({
                    method: "POST", 
                    url: url,
                    // ?
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    data: data,
                    transformRequest: function(obj) {
                        var str = [];
                        for (var p in obj) 
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));

                            console.log(str.join("&"));
                            return str.join("&");
                    }
                }).success(function(data, status, header, config) {
                    console.log("333");
                    deferred.resolve(data);
                });
                return deferred.promise;
            },

            postReplyUp: function(replyID, accesstoken) {
                var deferred = $q.defer();
                // reply not topic
                var url = configService.get() + "reply/" + replyID + "/ups?accesstoken=" + accesstoken;
                // not post accesstoken
                $http({
                    method: "POST",
                    url: url,
                }).success(function(data, status, header, config) {
                    deferred.resolve(data);
                });
                return deferred.promise;
            },
            postReply: function(topicID, replyData) {
                var deferred = $q.defer();
                var url = configService.get() + "topic/" + topicID + "/replies";
                $http({
                    method: "POST",
                    url:   url,
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    data: replyData,
                    // why do myself
                    transformRequest: function(obj) {
                        console.log(replyData);/* the same as obj*/
                        var str = [];    /*str??*/
                        for (var p in obj)  /*  not {}*/
                            str.push(encodeURIComponent(p)+ "=" + encodeURIComponent(obj[p]));
                            // here?
                            console.log(str);
                            // join把数组的所有元素放入一个字符串。元素通过指定的分隔符进行分隔。
                            // 面试题问原来是这个啊
                            return str.join("&");
                    }
                }).success(function(data, status, header, config) {
                    deferred.resolve(data);
                });
                return deferred.promise;
            },
            // getUserByName: function(loginName) {
            //     var deferred = $q.defer();
            //     var url = configService.get() + "user/" + loginName;
            //     $http:get(url).success(function() {
            //         deferred.resolve(data);
            //     });
            //     return deferred.promise;
            // },
            postUserLogin: function(accesstoken) {
                var deferred = $q.defer();
                var url = configService.get() + "accesstoken?accesstoken=" + accesstoken;
                $http({
                    method: "POST",
                    url: url
                }).success(function(data, status, header, config) {
                    deferred.resolve(data);
                });
                return deferred.promise;
            },
            getUserByName: function(loginname) {
                var deferred = $q.defer();
                var url = configService.get() + "user/" + loginname;
                $http.get(url).success(function(data) {
                    console.log(data);
                    deferred.resolve(data);
                });
                return deferred.promise;
            },
            
            // get???
            // 并没有在url中？
            getMessages: function(accesstoken) {
                var deferred = $q.defer();
                var url = configService.get() + "messages?accesstoken="+accesstoken;
                console.log(url)
                $http.get(url).success(function(data) {
                    console.log(data)
                    deferred.resolve(data);
                });
                return deferred.promise;
            },
            
            // 文档接口都写的不清楚
            postMarkAll: function() {
                var deferred = $q.defer();
                var url = configService.get() + "messages/mark_all?accesstoken="+accesstoken;
                $http.get(url).success(function(data) {
                    deferred.resolve(data);
                });
                return deferred.promise;
            }
        };
    }])
    .factory("configService", function() {
        // 私有变量
        // ioniicchina no cc
        var searchUrl  = "http://ionichina.com" + "/api/v1/";

        return {
            get: function() {
                return searchUrl;
            }
        };
    })
    .factory("tabService", function() {
        var tabs = [{
            value: "share",
            label: "分享"
        },{
            value: "ask",
            label: "问答"
        },{
            value: "job",
            label: "招聘"
        },{
            value: "bb",
            label: "吐槽"
        }];

        return {
            getTabs: function() {
                return tabs;
            }
        };
    });