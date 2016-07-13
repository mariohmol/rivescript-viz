var env = "PROD";
var socketurl = 'http://localhost:3000';

var app = angular.module('riveviz', ['ngMaterial', 'ngMessages','ngTouch', 'ui.grid','ui.grid.edit', 'angular-d3plus']);
app.config(function($mdThemingProvider) {
    // Configure a dark theme with primary foreground yellow
    $mdThemingProvider.theme('docs-dark', 'default')
        .primaryPalette('yellow')
        .dark();
});
