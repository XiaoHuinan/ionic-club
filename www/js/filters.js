angular.module("filters", [])
    // the parm into the function(param)
    // filter is return a func and the func return the conducted param
    .filter("tabName", ["tabService", function(tabService) {
        // console.log("filter1")
        var tabs = tabService.getTabs();
        return function(tab) {
            // console.log(tab);
            for (var i in tabs) {
                if (tabs[i].value == tab) {
                    // console.log(tabs[i].label);
                    // not tab.lable
                    return tabs[i].label;
                }
            }
        };
    }])
    .filter("link", ["$sce", function($sce) {
        return function(content) {
            // replace the @userlink\
            // ??
            var userLinkRegex = /href="\/user\/([\S]+)"/gi;
            // replace the extenerlink
            var externalLinkRegex = /href="((?!#\/user\/)[\S]+)"/gi; /*??*/
            return $sce.trustAsHtml(
                content // 使用第一个捕获组的记过
                    // 加了个#号?
                    .replace(userLinkRegex, 'href="#/user/$1"')
                    .replace(externalLinkRegex, "onclick=\"window.open('$1', '_blank', 'location=yes')\"")
            );
        };
    }]);