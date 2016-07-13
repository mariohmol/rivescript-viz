app.controller('RiveCtrl', function($scope, $filter, $mdDialog, $mdMedia, $location, $http) {
    $scope.topics = [];
    $scope.rivedata = {};

    $scope.gridOptions = {
        appScopeProvider: this,
        data: [{"topic": "", "trigger": "","value": "", "goto": "", "delete": true}]
    };

    $scope.gridOptions.columnDefs = [{
        name: 'topic',
        displayName: 'Topic',
        width: '15%',
        enableCellEdit: true,
        editFileChooserCallback: $scope.storeFile
    }, {
        name: 'trigger',
        displayName: 'Trigger',
        width: '20%',
        enableCellEdit: true
    }, {
        name: 'value',
        displayName: 'Value',
        width: '45%',
        enableCellEdit: true,
        editableCellTemplate: '<textarea ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" ngEnter></textarea>'
    }, {
        name: 'goto',
        displayName: 'Topic Destination',
        width: '10%',
        editableCellTemplate: 'ui-grid/dropdownEditor',
        editDropdownOptionsFunction: function(rowEntity, colDef) {
            if (rowEntity.topic) {
                return $scope.topics;
            } else {
                return $scope.topics;
            }
        }
    }, {
        name: 'Remove',
        width: '10%',
        cellTemplate: '<md-button class="md-raised md-warn" ng-click="grid.appScope.deleteRow(row)">remove</md-button>'
    }];


    $http.get("/rivescriptviz/topics/spreadsheet").then(function(response) {
      console.log(response);
        $scope.gridOptions.data = response.data.data;
        $scope.topics = response.data.topics;
    });

    $scope.write = function() {
        $http.post("/rivescriptviz/write",$scope.gridOptions.data).then(function(response) {
            console.log(response);
        });
    };

    $scope.storeFile = function(gridRow, gridCol, files) {
        // ignore all but the first file, it can only select one anyway
        // set the filename into this column
        gridRow.entity.filename = files[0].name;

        // read the file and set it into a hidden column, which we may do stuff with later
        var setFile = function(fileContent) {
            gridRow.entity.file = fileContent.currentTarget.result;
            // put it on scope so we can display it - you'd probably do something else with it
            $scope.lastFile = fileContent.currentTarget.result;
            $scope.$apply();
        };
        var reader = new FileReader();
        reader.onload = setFile;
        reader.readAsText(files[0]);
    };

    $scope.deleteRow = function(row) {
        var index = $scope.gridOptions.data.indexOf(row.entity);
        $scope.gridOptions.data.splice(index, 1);
    };

    $scope.addRow = function(row) {
        var index = $scope.gridOptions.data.push({
            "topic": "",
            "trigger": "",
            "value": "",
            "goto": "",
            delete: true
        });
    };


});
