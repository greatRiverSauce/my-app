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
    }).when('/logout', {
        templateUrl: 'view/home.html',
        resolve:['authService',function(authService) {
            return authService.logOut();
        }]
    }).when('/home', {
        templateUrl:'view/home.html'
    }).when('/profile', {
        templateUrl:'view/profile.html',
        controller: 'profileController',
        resolve:['authService', function (authService) {
            return authService.isLoggedIn('/profile');
        }]
    }).when('/myBlog', {
        templateUrl: 'view/myBlog.html',
        controller: 'myBlogController',
        resolve:['authService',function(authService) {
            return authService.isLoggedIn('/myBlog');
        }]
    }).when('/newPost', {
        templateUrl: 'view/newPost.html',
        controller: 'newPostController',
        resolve:['authService',function(authService) {
            return authService.isLoggedIn('/newPost');
        }]
    }).when('/setting', {
        templateUrl: 'view/setting.html',
        controller: 'settingController',
        resolve:['authService', function (authService) {
            return authService.isLoggedIn('/setting');
        }]
    }).when('/setting/editPassword', {
        templateUrl: 'view/userPsd.html',
        controller: 'userPsdController',
        resolve:['authService', function (authService) {
            return authService.isLoggedIn('/setting/editPassword');
        }]
    }).when('/setting/editName', {
        templateUrl: 'view/userName.html',
        controller: 'userNameController',
        resolve:['authService', function (authService) {
            return authService.isLoggedIn('/setting/editName');
        }]
    });
});

app.factory('authService', ['$http', '$location', '$rootScope', function ($http, $location, $rootScope) {
        return {
            isLoggedIn: function (path) {
                $http.get('http://localhost:3000/isLogged')
                    .then(function (data) {
                        if (data.data.length === 0) {
                            $location.path('/login');
                        } else {
                            $location.path(path);
                        }
                    });
            },
            logOut: function() {
                $http.get('http://localhost:3000/logout')
                    .then(function (data) {
                        $location.path('/login');
                    });
            }
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

app.controller('loginController', ['$location', '$scope', '$http', '$rootScope', 'userService', function ($location, $scope, $http, $rootScope, userService) {
    $scope.login = function () {
        userService.GetByUsername($scope.username)
            .then(function (data) {
                if (data.length != 0) {
                    if ($scope.password == data[0].password) {
                        //console.log($scope.username);
                        $http.post('http://localhost:3000/logged', {username: $scope.username})
                            .then(function (data) {
                                alert(data.data.msg);
                                $location.path('/');
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


app.controller('settingController', ['$scope', '$http', '$rootScope', 'userService', function ($scope, $http, $rootScope, userService) {
    $http.get('http://localhost:3000/isLogged')
        .then(function (data) {
            var username = data.data[0].username;
            $http.get('http://localhost:3000/getUserByUsername/' + username)
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
        });

    $scope.done = function () {
        userService.Update($scope.user)
            .then(function (data) {
                alert(data);
            });
    }
}])

app.controller('profileController', [function () {

}])

app.controller('myBlogController', [function () {

}]);
app.controller('newPostController', ['$scope','$http', function ($scope, $http) {
    //var uid;
    $http.get('http://localhost:3000/isLogged')
        .then(function (data) {
            var username = data.data[0].username;
            $http.get('http://localhost:3000/getUserByUsername/' + username)
                .then(function(data) {
                    //uid = data.data[0]._id;
                    $scope.action = "/newPost/"+data.data[0]._id;
                });
        });

}])
app.controller('userPsdController', ['$scope', '$rootScope', '$http', '$location', function ($scope, $rootScope, $http, $location) {
    $scope.savePsd = function() {
        $http.get('http://localhost:3000/isLogged')
            .then(function (data) {
                var username = data.data[0].username;
                $http.get('http://localhost:3000/getUserByUsername/' + username)
                    .then(function(data) {
                        if ($scope.curPsd == data.data[0].password) {
                            $rootScope.newPsd = $scope.newPsd;
                            $location.path('/setting');
                        } else {
                            alert("The password you entered don't match our record");
                        }
                    });
            });

    }
}]);
app.controller('userNameController', ['$scope', '$rootScope', '$http', '$location', function ($scope, $rootScope, $http, $location) {
    $http.get('http://localhost:3000/isLogged')
        .then(function (data) {
            var username = data.data[0].username;
            $http.get('http://localhost:3000/getUserByUsername/' + username)
                .then(function(data) {
                    $scope.firstname = data.data[0].firstname;
                    $scope.lastname = data.data[0].lastname;
                });
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
