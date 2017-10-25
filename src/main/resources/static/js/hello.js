angular.module('hello', [])
    .controller('home', function($scope, $http) {
        $http({method: 'GET', url: '/resource/'}).then(function(response) {
            $scope.greeting = response.data;
        })
});