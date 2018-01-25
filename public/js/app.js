/**
 * Created by Christine on 2018/1/24.
 */
var app = angular.module('myapp', ['ngRoute']);

app.config(function($routeProvider) {
    $routeProvider.when('/', {
        template: '<h1>welcome to my website!!</h1>'
    }).when('/users', {
        templateUrl: 'view/user.html',
        controller: 'userController'
    });
});
app.controller('userController', ['$scope', '$http', function ($scope, $http) {
    $http.get('http://localhost:3000/getUsers').then(function (data) {
        //console.log(data.data);
        $scope.user = data.data;
    }).catch(function (err) {
        console.log(err);
    })

}]);