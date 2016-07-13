app.controller('RiveCtrl', function($scope, $filter, $mdDialog, $mdMedia, $location,$http) {
    $scope.topics = [{"interview2": "interview2"}];
    $scope.gridOptions = {};
    $scope.rivedata={};

    $scope.gridOptions.data = [{
        "topic": "topic2",
        "trigger": "trigger",
        "value": "trigger \n aiaijaijaija \n sisijsij",
        "goto": "trigger"
    }];

    $http.get("/deparsed").then(function(response) {
      $scope.gridOptions.data=[];
      $scope.rivedata=response.data;
      console.log($scope.rivedata);
      var topics = $scope.rivedata.topics;
      for(var itemtopic in topics){
        var topic = topics[itemtopic];
        for(var item in topic){
          var newobj = {};
          newobj.topic=itemtopic;
          newobj.value=topic[item].reply[0];

          newobj.trigger=topic[item].trigger;

          var regexTopic = /{topic=(.*?)}/ig;
          while (match = regexTopic.exec(newobj.value)) {
              newobj.goto=match[1];
              newobj.value=newobj.value.replace(match[0],"");
              console.log(match);
          }
          $scope.gridOptions.data.push(newobj);
          console.log(topic[item]);
        }

      }
      //$scope.gridOptions.data =
    });

    $scope.write = function(){
      $http.get("/write").then(function(response) {
        console.log(response);
        //$scope.gridOptions.data =
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
        width: '50%',
        enableCellEdit: true,
        editableCellTemplate: '<textarea ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" ngEnter></textarea>'
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



});
