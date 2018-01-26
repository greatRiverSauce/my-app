/**
 * Created by Christine on 2018/1/24.
 */
var app = angular.module('myapp', ["ngRoute"]);

app.config(function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'view/home.html',
    }).when('/login', {
        templateUrl:'view/login.html',
        controller: 'loginController'
    }).when('/register', {
        templateUrl: 'view/register.html',
        controller: 'registerController'
    }).when('/home', {
        templateUrl:'view/home.html',
    }).when('/users', {
        templateUrl: 'view/user.html',
        controller: 'userController',
        resolve:['authService', function (authService) {
            return authService.isLoggedIn('/users');
        }]
    });
});

app.factory('authService', ['$http', '$location', '$rootScope', function ($http, $location, $rootScope) {
        return {
            isLoggedIn: function (path) {
                if (localStorage.getItem('logged') === null) {
                    $location.path('/login');
                } else {
                    $location.path(path);
                }
            }
        }

}]);
app.controller('loginController', ['$location', '$scope', '$http', '$rootScope', function ($location, $scope, $http, $rootScope) {
    $scope.login = function () {
        $http.get('http://localhost:3000/getUserByUsername/' + $scope.username)
            .then(function(data) {
                if (data.data.length != 0) {
                    if ($scope.password == data.data[0].password) {
                        localStorage.setItem('logged', data.data[0].username);
                        $location.path('/home');
                    } else {
                        alert("The username/password you entered don't match our record");
                    }
                } else {
                    alert("The username/password you entered don't match our record");
                }
            });
    }
}]);
app.controller('registerController', ['$scope', '$http', function ($scope, $http) {
    $scope.register = function () {
        $http.post('http://localhost:3000/createUser', $scope.user)
            .then(function(data) {
                alert(data.data.msg);
            });
    }
}]);
app.controller('userController', ['$scope', '$http', function ($scope, $http) {
    $http.get('http://localhost:3000/getUsers').then(function (data) {
        //console.log(data.data);
        $scope.user = data.data;
    }).catch(function (err) {
        console.log(err);
    })
}]);