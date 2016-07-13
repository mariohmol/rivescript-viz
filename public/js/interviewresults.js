

app.controller('InterviewResultsCtrl', function($scope, $filter, $mdDialog, $mdMedia, $location) {

    $scope.opcoes = {};
    $scope.triggers = null;
    $scope.messages = [];
    $scope.socket = io.connect(socketurl);
    $scope.iniciado = false;
    $scope.nome = "";
    $scope.email = "";

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

                if ($scope.opcoes.end == "true") {
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
            text = $scope.mensagem;
            textCapitalize = text;
        } else textCapitalize = $filter('capitalize')(text);
        $scope.messages.push({
            "who": "me",
            "message": textCapitalize
        });
        $scope.socket.emit('send', {
            message: text,
            who: $scope.email
        });
    };

});
