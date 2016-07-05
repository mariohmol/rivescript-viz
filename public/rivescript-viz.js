var rivescriptjs = angular.module('rivescriptjs', ['ngMaterial', 'ngMessages' ,'angular-d3plus']);
rivescriptjs.config(function($mdThemingProvider) {


    // Configure a dark theme with primary foreground yellow
    $mdThemingProvider.theme('docs-dark', 'default')
        .primaryPalette('yellow')
        .dark();
});

rivescriptjs.controller('MainCtrl', function($scope, $http,$filter, $mdDialog, $mdMedia, $location) {

  $http.get("/topics").then(function(response){

    //var sample_data = [{"name": "alpha", "size": 10},]
    $scope.nodes = [];

    //var connections = [{"source": "alpha", "target": "beta"},]
    $scope.connections = [];

    var regexTopic=/{topic=(.*?)}/ig;
    for(var key in response.data){
      var item = response.data[key];
      if(key.indexOf("_")===0) continue;

      $scope.nodes.push({"name": key, "size": 1});

      for(var i in item){
        var trigger = item[i];
        while (match = regexTopic.exec(trigger.reply[0])) {
          $scope.connections.push({"source": key, "target": match[1], "trigger": trigger.trigger});
        }//endwhile
      }//end items
    } //endfor response

    console.log($scope.connections,$scope.nodes);
    $scope.$broadcast("DataReady",{elementid: "networktopics", nodes: $scope.nodes, edges: $scope.connections });  

  });
});
