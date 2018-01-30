/**
 * Created by Christine on 2018/1/24.
 */
var app = angular.module('myapp', ["ngRoute"]);

app.config(function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'view/home.html'
    }).when('/login', {
        templateUrl:'view/login.html',
        controller: 'loginController'
    }).when('/register', {
        templateUrl: 'view/register.html',
        controller: 'registerController'
    }).when('/home', {
        templateUrl:'view/home.html'
    }).when('/profile', {
        templateUrl:'view/profile.html',
        controller: 'profileController'
    }).when('/myBlog', {
        templateUrl: 'view/myBlog.html',
        controller: 'myBlogController'
    }).when('/newPost', {
        templateUrl: 'view/newPost.html',
        controller: 'newPostController'
    }).when('/setting', {
        templateUrl: 'view/setting.html',
        controller: 'settingController'
    }).when('/setting/editPassword', {
        templateUrl: 'view/userPsd.html',
        controller: 'userPsdController'
    }).when('/setting/editName', {
        templateUrl: 'view/userName.html',
        controller: 'userNameController'
    });
});

app.factory('authService', ['$http', '$location', '$rootScope', '$q', function ($http, $location, $rootScope, $q) {
    var service = {};
    service.IsLoggedIn = IsLoggedIn;
    service.Logout = Logout;
    return service;

    function IsLoggedIn() {
        var deferred = $q.defer();
        $http.get('http://localhost:3000/isLogged')
            .then(function (data) {
                deferred.resolve(data.data);
            });
        return deferred.promise;
    }
    function Logout() {
        var deferred = $q.defer();
        $http.get('http://localhost:3000/logout')
            .then(function (data) {
                deferred.resolve(data.data);
                //$location.path('/login');
            });
        return deferred.promise;
    }


}]);

app.factory('userService', ['$rootScope', '$q', '$http', function ($rootScope, $q, $http) {
    var service = {};
    service.Update = Update;
    service.GetByUsername = GetByUsername;
    service.Create = Create;
    return service;

    function GetByUsername(name) {
        var deferred = $q.defer();
        $http.get('http://localhost:3000/getUserByUsername/' + name)
            .then(function(data) {
                deferred.resolve(data.data);
            });
        return deferred.promise;
    }

    function Update(user) {
        var deferred = $q.defer();
        $http.post('http://localhost:3000/updateUser',user)
            .then(function(data) {
                deferred.resolve(data.data.flg);
            });
        return deferred.promise;
    }
    function Create(user) {
        var deferred = $q.defer();
        GetByUsername(user.username)
            .then(function (duplicateUser) {
                console.log(duplicateUser);
                if (duplicateUser.length != 0) {
                    deferred.resolve({success: false, message: 'username "' + user.username + '" is already taken'});
                } else {
                    $http.post('http://localhost:3000/createUser', user)
                        .then(function (data) {
                            deferred.resolve({success: true, message: data.data.msg});
                        });
                }
            })
        return deferred.promise;
    }
}])
app.controller('headerController', ['$scope', '$rootScope', function ($scope, $rootScope) {
    if (localStorgae.getItem('logged') != null) {
        $scope.user = true;
    } else {
        $scope.user = false;
    }
}])
app.controller('loginController', ['$location', '$scope', '$http', '$rootScope', 'userService', '$window', 'authService', function ($location, $scope, $http, $rootScope, userService, $window, authService) {
    authService.IsLoggedIn()
        .then(function (data) {
            if (data.length !== 0) {
                $location.path('/home');
            }
        });
    $scope.login = function () {
        userService.GetByUsername($scope.username)
            .then(function (data) {
                if (data.length != 0) {
                    if ($scope.password == data[0].password) {
                        //console.log($scope.username);
                        $http.post('http://localhost:3000/logged', {username: $scope.username})
                            .then(function (data) {
                                alert(data.data.msg);
                                $window.location.reload();
                                //$location.path('/');
                            })
                    } else {
                        alert("The username/password you entered don't match our record");
                    }
                } else {
                    alert("The username/password you entered don't match our record");
                }
            });
    }
}]);
app.controller('registerController', ['$location', '$scope', '$http', 'userService', function ($location, $scope, $http, userService) {
    $scope.register = function () {
        userService.Create($scope.user)
            .then(function (data) {
                alert(data.message);
                if (data.success) {
                    $location.path('/login');
                }
            });
    }
}]);
app.controller('settingController', ['$scope', '$http', '$location', '$rootScope', 'userService', 'authService', '$routeParams', function ($scope, $http, $rootScope, $location, userService, authService, $routeParams) {
    authService.IsLoggedIn()
        .then(function (data) {
            if (data.length === 0) {
                $location.path('/login');
            } else {
                var username = data[0].username;
                $http.get('http://localhost:3000/getUserByUsername/' + username)
                    .then(function(data) {
                        console.log(data);
                        $scope.user = data.data[0];
                        var newPsd = localStorage.getItem('newPsd');
                        var newFirstname = localStorage.getItem('newFirstname');
                        var newLastname = localStorage.getItem('newLastname')
                        //console.log(localStorage.getItem('newPsd'));
                        if (newPsd != null) {
                            $scope.user.password = newPsd;
                        }
                        if (newFirstname != null) {
                            $scope.user.firstname = newFirstname;
                        }
                        if (newLastname) {
                            $scope.user.lastname = newLastname;
                        }

                    });
            }
        });

    $scope.done = function () {
        localStorage.clear();
        userService.Update($scope.user)
            .then(function (data) {
                alert(data);
            });
    }
}])
app.controller('profileController', ['authService', '$location', function (authService, $location) {
    authService.IsLoggedIn().
        then(function (data) {
            if (data.length === 0) {
                $location.path('/login');
            }
        });
}])
app.controller('myBlogController', ['authService', '$location', function (authService, $location) {
    authService.IsLoggedIn().
    then(function (data) {
        if (data.length === 0) {
            $location.path('/login');
        }
    });
}]);
app.controller('newPostController', ['$scope','$http', 'authService', '$location', function ($scope, $http, authService, $location) {
    authService.IsLoggedIn()
        .then(function (data) {
            if (data.length === 0) {
                $location.path('/login');
            } else {
                var username = data[0].username;
                $http.get('http://localhost:3000/getUserByUsername/' + username)
                    .then(function(data) {
                        //uid = data.data[0]._id;
                        $scope.action = "/newPost/"+data.data[0]._id;
                    });
            }
        });
}]);
app.controller('userPsdController', ['$scope', '$rootScope', '$http', '$location', 'authService', function ($scope, $rootScope, $http, $location, authService) {
    $scope.savePsd = function() {
        authService.IsLoggedIn()
            .then(function (data) {
                if (data.length === 0) {
                    $location.path('/login');
                } else {
                    var username = data[0].username;
                    $http.get('http://localhost:3000/getUserByUsername/' + username)
                        .then(function (data) {
                            if ($scope.curPsd == data.data[0].password) {
                                localStorage.setItem('newPsd', $scope.newPsd);
                                $location.path('/setting');
                            } else {
                                alert("The password you entered don't match our record");
                            }
                        });
                }
            });
    }
}]);
app.controller('userNameController', ['$scope', '$rootScope', '$http', '$location', 'authService', function ($scope, $rootScope, $http, $location, authService) {
    authService.IsLoggedIn()
        .then(function (data) {
            if (data.length === 0) {
                $location.path('/login');
            } else {
                var username = data[0].username;
                $http.get('http://localhost:3000/getUserByUsername/' + username)
                    .then(function (data) {
                        $scope.firstname = data.data[0].firstname;
                        $scope.lastname = data.data[0].lastname;
                    });
            }
        });
    $scope.saveName = function () {
        localStorage.setItem('newFirstname', $scope.firstname);
        localStorage.setItem('newLastname', $scope.lastname);

        $location.path('/setting');
    }
}])
app.controller('headController', ['$scope', '$http', '$window', 'authService', function($scope, $http, $window, authService) {
    $scope.logout = function () {
        authService.Logout()
            .then(function (data) {
                $window.location.reload();
            });
    }
    authService.IsLoggedIn()
        .then(function (data) {
            if (data.length === 0) {
                $scope.logged = false;
            } else {
                $scope.logged = true;

            }
        });
}])
