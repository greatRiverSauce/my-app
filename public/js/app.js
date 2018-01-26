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
    }).when('/profile', {
        tempplateUrl: 'view/profile.html'
    }).when('/setting', {
        templateUrl: 'view/setting.html',
        controller: 'settingController'
    }).when('/setting/editPassword', {
        templateUrl: 'view/userPsd.html',
        controller: 'userPsdController'
    }).when('/setting/editName', {
        templateUrl: 'view/userName.html',
        controller: 'userNameController'
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

app.factory('userSettingService', ['$rootScope', '$q', '$http', function ($rootScope, $q, $http) {
    var service = {};
    service.Update = Update;
    return service;
    function Update(user) {
        //console.log(user);
        var deferred = $q.defer();
        $http.post('http://localhost:3000/updateUser',user)
            .then(function(data) {
                alert(data.data.flg);
                //console.log(data.data);
            });
        deferred.resolve();

        return deferred.promise;
    }
}])

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

app.controller('settingController', ['$scope', '$http', '$rootScope', 'userSettingService', function ($scope, $http, $rootScope, userSettingService) {
    $http.get('http://localhost:3000/getUserByUsername/' + localStorage.getItem('logged'))
        .then(function(data) {
            $scope.user = data.data[0];
            if ($rootScope.newPsd != null) {
                $scope.user.password = $rootScope.newPsd
            }
            if ($rootScope.newFirstname != null) {
                $scope.user.firstname = $rootScope.newFirstname;
            }
            if ($rootScope.newLastname) {
                $scope.user.lastname = $rootScope.newLastname;
            }

        });
    $scope.done = function () {
        userSettingService.Update($scope.user);
    }
}])

app.controller('userPsdController', ['$scope', '$rootScope', '$http', '$location', function ($scope, $rootScope, $http, $location) {
    $scope.savePsd = function() {
        $http.get('http://localhost:3000/getUserByUsername/' + localStorage.getItem('logged'))
            .then(function(data) {
                if ($scope.curPsd == data.data[0].password) {
                    $rootScope.newPsd = $scope.newPsd;
                    $location.path('/setting');
                } else {
                    alert("The password you entered don't match our record");
                }
            });
    }
}]);
app.controller('userNameController', ['$scope', '$rootScope', '$http', '$location', function ($scope, $rootScope, $http, $location) {
    $http.get('http://localhost:3000/getUserByUsername/' + localStorage.getItem('logged'))
        .then(function(data) {
            $scope.firstname = data.data[0].firstname;
            $scope.lastname = data.data[0].lastname;
        });
    $scope.saveName = function () {
        $rootScope.newFirstname = $scope.firstname;
        $rootScope.newLastname = $scope.lastname;
        $location.path('/setting');
    }
}])
app.controller('userController', ['$scope', '$http', function ($scope, $http) {
    $http.get('http://localhost:3000/getUsers').then(function (data) {
        //console.log(data.data);
        $scope.user = data.data;
    }).catch(function (err) {
        console.log(err);
    })
}]);
