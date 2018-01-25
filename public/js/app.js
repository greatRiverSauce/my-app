/**
 * Created by Christine on 2018/1/24.
 */
var app = angular.module('myapp', ['ngRoute']);

app.config(function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'view/home.html'
    }).when('/login', {
        templateUrl:'view/login.html'
    }).when('/register', {
        templateUrl: 'view/register.html'
    }).when('/home', {
        templateUrl:'view/home.html'
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