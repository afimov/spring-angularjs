angular.module('hello', ['ngRoute'])
    .config(function($routeProvider, $httpProvider){

        $routeProvider.when('/', {
            templateUrl: 'home.html',
            controller: 'home',
        }).when('/login', {
            templateUrl: 'login.html',
            controller: 'navigation',
        }).otherwise('/');

        $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';

    })
    .controller('home', function($scope, $http) {
        $http({method: 'GET', url: '/resource'}).then(function(response) {
            $scope.greeting = response.data;
        })
    })
    .controller('navigation', function($rootScope, $scope, $http, $location, $route) {

        $scope.tab = function(route) {
            return $route.current && route === $route.current.controller;
        }

        var authenticate = function(credentials, callback) {

            var currentHeaders = credentials ? {authorization: "Basic "
                + btoa(credentials.username + ":" + credentials.password)
            } : {};

            $http({method: 'GET', url: '/user', headers: currentHeaders}).then(function(response){
                var data = response.data;
                if (data.name) {
                    $rootScope.authenticated = true;
                } else {
                    $rootScope.authenticated = false;
                }
                callback && callback();
            }, function(error) {
                $rootScope.authenticated = false;
                callback && callback();
            });


        }

        authenticate();
        $scope.credentials = {};

        //LOGIN FUNCTION
        $scope.login = function() {
            authenticate($scope.credentials, function() {
                if ($rootScope.authenticated) {
                    $location.path("/");
                    $scope.error = false;
                } else {
                    $location.path("/login");
                    $scope.error = true;
                }
            });
        };

        //LOGOUT FUNCTION
        $scope.logout = function() {
            $http.post("/logout", {}).finally(function(){
                $rootScope.authenticated = false;
                $location.path("/");
            });
        };
    });