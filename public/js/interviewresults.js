app.controller('InterviewResultsCtrl', function($scope, $filter, $mdDialog, $mdMedia, $location, $http) {

    $scope.files = [];
    $scope.fileContent = "";
    $scope.filename = "";

    $http.get("/rivescriptviz/interviewresults").then(function(response) {
        $scope.files = response.data.files;
    });

    $scope.write = function() {
        if (!$scope.filename) {
            alert("Choose a file to save");
            return;
        }
        $http.post("/rivescriptviz/interviewresults/" + $scope.filename, {
            data: $scope.fileContent
        }).then(function(response) {
            console.log(response);
        });
    };

    $scope.getFile = function() {
        $http.get("/rivescriptviz/interviewresults/" + $scope.filename).then(function(response) {
            $scope.fileContent = response.data.data;
        });
    };

    $scope.add = function(filename) {

        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.prompt()
            .title('What is the filename?')
            .textContent('Choose a name that do not already exists in your folder.')
            .placeholder('Filename')
            .ariaLabel('Filename')
            .ok('Okay!')
            .cancel('Cancel');
        $mdDialog.show(confirm).then(function(result) {
            $scope.files.push(result + ".html");
            $scope.fileContent = "";
            $scope.filename = result + ".html";
        }, function() {
            //$scope.status = 'You didn\'t name your dog.';
        });

    };


});
