app.controller('InterviewCtrl', function($scope, $filter, $mdDialog, $mdMedia, $location) {

    $scope.opcoes = {};
    $scope.triggers = null;
    $scope.messages = [];
    $scope.socket = io.connect(socketurl);
    $scope.iniciado = false;
    $scope.nome = "";
    $scope.email = "";
    $scope.mensagem = "";
    $scope.select = {};
    $scope.end;

    $scope.iniciar = function() {
        $scope.iniciado = true;

        $scope.socket.emit('send', {
            message: "iniciar!  ",
            who: $scope.email
        });


        $scope.socket.on('message', function(data) {
            //{message: reply, topics: topics, uservars: uservars})
            console.log(data);
            if (data.message) {
                $scope.messages.push({
                    "who": "bot",
                    "message": data.message
                });
                $scope.triggers = [];
                data.triggers.forEach(function(item) {
                    if (item[0].indexOf("|") != -1) {
                        item[0].split("|").forEach(function(itemsplit) {
                            itemsplit = itemsplit.replace(")", "").replace("(", "");
                            novoitem = [itemsplit, item[1]];
                            $scope.triggers.push(novoitem);
                        });
                    } else $scope.triggers.push(item);
                });

                if (data.uservars) Object.keys(data.uservars).forEach(function(item) {
                    if (!item.startsWith("_")) {
                        $scope.opcoes[item] = data.uservars[item];
                    }
                });

                if ($scope.opcoes.end) {
                    $scope.end=$scope.opcoes.end;
                    $scope.showAdvanced();
                }

                $scope.$apply();
                var myDiv = document.getElementById("messageslist");
                myDiv.scrollTop = myDiv.scrollHeight;
            } else {
                console.log("There is a problem:", data);
            }
        });

    };

    $scope.enviar = function(text) {
        var textCapitalize;
        if (!text) {
            if ($scope.mensagem) text = $scope.mensagem;
            if ($scope.select.value) text = $scope.select.value;
            textCapitalize = text;
        } else textCapitalize = $filter('capitalize')(text);
        $scope.messages.push({
            "who": "me",
            "message": textCapitalize
        });
        console.log(text, $scope.select);
        $scope.socket.emit('send', {
            message: text,
            who: $scope.email
        });
    };

    $scope.showAdvanced = function(ev) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
        $mdDialog.show({
                controller: DialogController,
                templateUrl: socketurl + "/rivescriptviz/interviewresultshtml/" + $scope.end + '.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: useFullScreen
            })
            .then(function(answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function() {
                $scope.status = 'You cancelled the dialog.';
            });
        $scope.$watch(function() {
            return $mdMedia('xs') || $mdMedia('sm');
        }, function(wantsFullScreen) {
            $scope.customFullscreen = (wantsFullScreen === true);
        });
    };
});

function DialogController($scope, $mdDialog) {
    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };
}
