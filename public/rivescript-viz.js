var rivescriptjs = angular.module('rivescriptjs', ['ngMaterial', 'ngMessages', 'angular-d3plus']);
rivescriptjs.config(function($mdThemingProvider) {


    // Configure a dark theme with primary foreground yellow
    $mdThemingProvider.theme('docs-dark', 'default')
        .primaryPalette('yellow')
        .dark();
});

rivescriptjs.controller('MainCtrl', function($scope, $http, $filter, $mdDialog, $mdMedia, $location) {
    $scope.show = false;
    $scope.nodes = [];
    $scope.connections = [];

    $http.get("/topics").then(function(response) {

        $scope.nodes = [];
        $scope.connections = [];

        var regexTopic = /{topic=(.*?)}/ig;
        for (var key in response.data) {
            var item = response.data[key];
            console.log(key);
            if (key.indexOf("_") === 0) continue;

            $scope.nodes.push({
                "name": key,
                "size": 1
            });

            for (var i in item) {
                var trigger = item[i];
                while (match = regexTopic.exec(trigger.reply[0])) {
                    $scope.connections.push({
                        "source": key,
                        "target": match[1],
                        "trigger": trigger.trigger
                    });
                } //endwhile
            } //end items
        } //endfor response

        console.log($scope.connections, $scope.nodes);
        $scope.show = true;
        //$scope.$apply();
        $scope.$broadcast("DataReady", {
            elementid: "networktopics",
            edges: $scope.connections,
            edgesarrows: true
        });


    });
});
