app.controller('RiveCtrl', function($scope, $filter, $mdDialog, $mdMedia, $location, $http) {
    $scope.topics = [];
    $scope.rivedata = {};

    $scope.gridOptions = {
        appScopeProvider: this,
        data: []
    };

    $scope.gridOptions.columnDefs = [{
        name: 'topic',
        displayName: 'Topic',
        width: '12%',
        enableCellEdit: true,
        editFileChooserCallback: $scope.storeFile
    }, {
        name: 'trigger',
        displayName: 'Trigger',
        width: '12%',
        enableCellEdit: true
    }, {
        name: 'condition',
        displayName: 'Condition',
        width: '25%',
        enableCellEdit: true,
        editableCellTemplate: '<textarea ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" ngEnter></textarea>'
    }, {
        name: 'value',
        displayName: 'Reply',
        width: '35%',
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
        width: '6%',
        cellTemplate: '<md-button class="md-raised md-warn" ng-click="grid.appScope.deleteRow(row)">-</md-button><md-button class="md-raised md-primary" ng-click="alert(\'Conf not implemented yet\')">?</md-button>'
    }];


    $http.get("/rivescriptviz/topics/spreadsheet").then(function(response) {
        $scope.gridOptions.data = response.data.data;
        $scope.topics = response.data.topics;
        console.log(response.data);
    });

    $scope.write = function() {
        $http.post("/rivescriptviz/topics",$scope.gridOptions.data).then(function(response) {
          alert("Data saved sucessfully");
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
            "condition": "",
            "value": "",
            "goto": "",
            delete: true
        });
    };


});
