
app.controller('GraphsCtrl', function($scope, $http, $filter, $mdDialog, $mdMedia, $location) {
    $scope.show = false;
    $scope.nodes = [];
    $scope.connections = [];

    $http.get("/rivescriptviz/topics").then(function(response) {

        $scope.nodes = [];
        $scope.connections = [];

        var nodes = {};

        var regexTopic = /{topic=(.*?)}/ig;
        for (var key in response.data) {
            var item = response.data[key];
            console.log(key);
            if (key.indexOf("_") === 0) continue;

            nodes[key] = {
                "name": key,
                "size": 1
            };

            for (var i in item) {
                var trigger = item[i];
                while (match = regexTopic.exec(trigger.reply[0])) {
                    if (nodes[key]) nodes[key].size++;
                    $scope.connections.push({
                        "source": key,
                        "target": match[1],
                        "trigger": trigger.trigger,
                        "strength": 1
                    });
                } //endwhile
            } //end items
        } //endfor response

        for (var node in nodes) {
            $scope.nodes.push(nodes[node]);
        }

        console.log($scope.connections, $scope.nodes);
        $scope.show = true;
        //$scope.$apply();
        $scope.$broadcast("DataReady", {
            elementid: "networktopics",
            edges: {
                "label": "trigger",
                "value": $scope.connections
            },
            edgesarrows: true
        });


    });
});
