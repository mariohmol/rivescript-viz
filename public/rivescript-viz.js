var rivescriptjs = angular.module('rivescriptjs', ['ngMaterial', 'ngMessages']);
rivescriptjs.config(function($mdThemingProvider) {


    // Configure a dark theme with primary foreground yellow
    $mdThemingProvider.theme('docs-dark', 'default')
        .primaryPalette('yellow')
        .dark();
});

rivescriptjs.controller('MainCtrl', function($scope, $filter, $mdDialog, $mdMedia, $location) {



});


rivescriptjs.filter('capitalize', function() {
    return function(input) {
        if (input !== null) {
            return input.replace(/\w\S*/g, function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        }
    };
});
