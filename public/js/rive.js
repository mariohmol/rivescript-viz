app.controller('RiveCtrl', function($scope, $filter, $mdDialog, $mdMedia, $location) {
    $scope.topics = ["interview2"];


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

    $scope.gridOptions = {};
    $scope.gridOptions.columnDefs = [{
        name: 'topic',
        displayName: 'Topic',
        width: '15%',
        enableCellEdit: true,
        editFileChooserCallback: $scope.storeFile
    }, {
        name: 'topicext',
        displayName: 'Topic Ext',
        width: '10%',
        enableCellEdit: true
    }, {
        name: 'trigger',
        displayName: 'Trigger',
        width: '10%',
        enableCellEdit: true
    }, {
        name: 'value',
        displayName: 'Value',
        width: '50%',
        enableCellEdit: true
    }, {
        name: 'goto',
        displayName: 'Trigger Destination',
        width: '15%',
        editableCellTemplate: 'ui-grid/dropdownEditor',
        editDropdownOptionsFunction: function(rowEntity, colDef) {
            if (rowEntity.topic) {
                return $scope.topics;
            } else {
                return $scope.topics;
            }
        }
    }];

    $scope.gridOptions.data = [{
        "topic": "topic2",
        "topicext": "includes interview_common",
        "trigger": "trigger",
        "value": "trigger",
        "goto": "trigger"
    }];

});
