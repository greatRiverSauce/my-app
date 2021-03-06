/**
 * Created by Christine on 2018/1/24.
 */
var app = angular.module('myapp', ['ngRoute']);

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
        templateUrl:'view/home.html',
        controller: 'homeController'
    }).when('/profile', {
        templateUrl:'view/profileEdit.html',
        controller: 'profileEditController'
    }).when('/viewProfile/:uid', {
        templateUrl: 'view/profile.html',
        controller: 'profileController'
    }).when('/viewProfileByName/:name', {
        templateUrl: 'view/profileByName.html',
        controller: 'profileNameController'
    }).when('/myBlog', {
        templateUrl: 'view/myBlog.html',
        controller: 'myBlogController'
    }).when('/newPost', {
        templateUrl: 'view/newPost.html',
        controller: 'newPostController'
    }).when('/viewPost/:id',{
        templateUrl: 'view/singlePost.html',
        controller: 'singlePostController'
    }).when('/setting', {
        templateUrl: 'view/setting.html',
        controller: 'settingController'
    }).when('/setting/editPassword', {
        templateUrl: 'view/userPsd.html',
        controller: 'userPsdController'
    }).when('/setting/editName', {
        templateUrl: 'view/userName.html',
        controller: 'userNameController'
    }).when('/test', {
        templateUrl: 'view/test.html'
    });
});

app.factory('authService', ['$http', '$location', '$rootScope', '$q', function ($http, $location, $rootScope, $q) {
    var service = {};
    service.IsLoggedIn = IsLoggedIn;
    service.Logout = Logout;
    service.Logged = Logged;
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
    function Logged(uid) {
        var deferred = $q.defer();
        $http.post('http://localhost:3000/logged', {uid: uid})
            .then(function (data) {
                deferred.resolve(data.data);
            });
        return deferred.promise;
    }


}]);
app.factory('userService', ['$rootScope', '$q', '$http', function ($rootScope, $q, $http) {
    var service = {};
    service.Update = Update;
    service.GetByUsername = GetByUsername;
    service.GetByUserId = GetByUserId;
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

    function GetByUserId(id) {
        var deferred = $q.defer();
        $http.get('http://localhost:3000/getUserById/' + id)
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
                //console.log(duplicateUser);
                if (duplicateUser.length != 0) {
                    deferred.resolve({success: false, message: 'username "' + user.username + '" is already taken'});
                } else {
                    $http.post('http://localhost:3000/createUser', user)
                        .then(function (data) {
                            deferred.resolve(data.data);
                        });
                }
            })
        return deferred.promise;
    }
}]);
app.factory('profileService',['$http', '$q', function ($http, $q) {
    var service = {};
    service.CreateProfile = CreateProfile;
    service.UpdateProfile = UpdateProfile;
    service.FindProfileByUserId = FindProfileByUserId;
    return service;

    function CreateProfile(profile) {
        var deferred = $q.defer();
        $http.post('http://localhost:3000/createProfile', profile)
            .then(function (data) {
                deferred.resolve(data.data);
            });
        return deferred.promise;
    }
    function FindProfileByUserId(id) {
        var deferred = $q.defer();
        $http.get('http://localhost:3000/findProfile/'+ id)
            .then(function (data) {
                deferred.resolve(data.data);
            });
        return deferred.promise;
    }
    function UpdateProfile(profile) {
        var deferred = $q.defer();
        $http.post('http://localhost:3000/updateProfile', profile)
            .then(function (data) {
                deferred.resolve(data.data);
            });
        return deferred.promise;
    }
}])
app.factory('postService', ['$rootScope', '$q', '$http', 'userService', function ($rootScope, $q, $http, userService) {
    var service = {};
    service.GetAllPostsSortByTime = GetAllPostsSortByTime;
    service.GetPostDetails = GetPostDetails;
    service.GetPostByUserId = GetPostByUserId;
    service.UpdatePost = UpdatePost;
    return service;

    function GetAllPostsSortByTime() {
        var deferred = $q.defer();
        $http.get('http://localhost:3000/getPostSortByTime')
            .then(function (data) {
                deferred.resolve(data.data);
            })
        return deferred.promise;
    }

    function GetPostDetails(id) {
        var deferred = $q.defer();
        $http.get('http://localhost:3000/getPostById/' + id)
            .then(function (data) {
                deferred.resolve(data.data);
            })
        return deferred.promise;
    }
    function GetPostByUserId(id) {
        var deferred = $q.defer();
        userService.GetByUserId(id)
            .then(function (data) {
                if (data != null) {
                    $http.get('http://localhost:3000/getPostByUserId/' + id)
                        .then(function (data) {
                            deferred.resolve(data.data);
                        })
                }
            });
        return deferred.promise;
    }
    function UpdatePost(post) {
        var deferred = $q.defer();
        $http.post('http://localhost:3000/updatePost',post)
            .then(function(data) {
                deferred.resolve(data.data.success);
            });
        return deferred.promise;
    }


}]);
app.factory('commentService', ['$http', '$q', function ($http, $q) {
    var service = {};
    service.CreateComment = CreateComment;
    service.GetCommentById = GetCommentById;
    return service;

    function CreateComment(comment) {
        var deferred = $q.defer();
        $http.post('http://localhost:3000/createComment', comment)
            .then(function (data) {
                deferred.resolve(data.data);
            })
        return deferred.promise;
    }

    function GetCommentById(id) {
        var deferred = $q.defer();
        $http.get('http://localhost:3000/getComment/' + id)
            .then(function (data) {
                deferred.resolve(data.data);
            });
        return deferred.promise;
    }
    
}]);
app.factory('likeService', ['$http', '$q', function ($http, $q) {
    var service = {};
    service.CreateLike = CreateLike;
    service.IsLiked = IsLiked;
    service.RemoveLike = RemoveLike;
    return service;
    function CreateLike(like) {
        var deferred = $q.defer();
        $http.post('http://localhost:3000/createLike', like)
            .then(function (data) {
                deferred.resolve(data.data);
            });
        return deferred.promise;
    }
    function IsLiked(uid) {
        var deferred = $q.defer();
        $http.get('http://localhost:3000/isLiked/'+ uid)
            .then(function (data) {
                deferred.resolve(data.data);
            })
        return deferred.promise;
    }
    function RemoveLike(postId, userId){
        var deferred = $q.defer();
        $http.post('http://localhost:3000/deleteLike', {pid: postId, uid: userId})
            .then(function (data) {
                deferred.resolve(data.data);
            })
        return deferred.promise;
    }
}])
app.factory('timeService', [function () {
    var service = {};
    service.GetTime = GetTime;
    return service;
    function GetTime(time) {
            var date = new Date(time);
            var year = date.getFullYear();
            var month = date.getDay();
            var day = date.getDate();
            var hours = date.getHours();
            var minutes = date.getMinutes();
            if (month < 10) {
                month = '0' + month;
            }
            if (day < 10) {
                day = '0' + hours;
            }
            if (hours < 10) {
                hours = '0' + hours;
            }
            if (minutes < 10) {
                minutes = '0' + minutes;
            }
            return year + '/' + month + '/' + day + '  ' + hours + ':' + minutes;
    }
}]);
app.controller('headerController', ['$scope', '$rootScope', function ($scope, $rootScope) {
    if (localStorgae.getItem('logged') != null) {
        $scope.user = true;
    } else {
        $scope.user = false;
    }
}]);
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
                        authService.Logged(data[0]._id)
                            .then(function (data) {
                                alert(data.msg);
                                $window.location.reload();
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
app.controller('registerController', ['$location', '$scope', '$http', 'userService', 'profileService', function ($location, $scope, $http, userService, profileService) {
    $scope.register = function () {
        userService.Create($scope.user)
            .then(function (data) {
                if (data !== null) {
                    var profile = {};
                    profile.userId = data._id;
                    profile.photo = "";
                    profile.birth = "";
                    profile.bio = "";
                    profile.gender = "";
                    profile.email = "";
                    profile.phone = "";
                    profileService.CreateProfile(profile)
                        .then(function (data) {
                            if (data !== null) {
                                alert('You have successfully registered!');
                                $location.path('/login');
                            } else {
                                alert('err');
                            }
                        })

                } else {
                    alert('err');
                }

            });
    }
}]);
app.controller('homeController', ['$scope', 'postService', '$location', 'likeService', 'authService', 'timeService', function ($scope, postService, $location, likeService, authService, timeService) {
    authService.IsLoggedIn()
        .then(function (data) {
            if (data.length != 0) {
                $scope.uid = data[0].uid;
            }
        });
    postService.GetAllPostsSortByTime()
        .then(function (data) {
            $scope.post0 = [];
            $scope.post1 = [];
            $scope.post2 = [];
            var len = data.length;
            for (var i = 0; i < len; i++) {
                if (i%3 === 0) {
                    $scope.post0.push(data[i]);
                } else if (i%3 === 1) {
                    $scope.post1.push(data[i]);
                } else if (i%3 === 2){
                    $scope.post2.push(data[i]);
                }
            }
        });
    $scope.viewDetail = function (id) {
        $location.path('/viewPost/' + id);
    }
    $scope.getTime = function (time) {
        return timeService.GetTime(time);
    }
}]);
app.controller('settingController', ['$scope', '$http', '$location', '$rootScope', 'userService', 'authService', '$routeParams', function ($scope, $http, $rootScope, $location, userService, authService, $routeParams) {
    authService.IsLoggedIn()
        .then(function (data) {
            if (data.length === 0) {
                $location.path('/login');
            } else {
                var id = data[0].uid;
                userService.GetByUserId(id)
                    .then(function (data) {
                        //console.log(data);
                        $scope.user = data;
                        //console.log($scope.user);
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
app.controller('profileController', ['authService', 'userService', '$location', '$routeParams','$scope', 'profileService', function (authService, userService, $location, $routeParams, $scope, profileService) {
    if ($routeParams.uid !== undefined) {
        //console.log($routeParams.uid);
        userService.GetByUserId($routeParams.uid)
            .then(function (data) {
                $scope.user = data;
                profileService.FindProfileByUserId(data._id)
                    .then(function (data) {
                        $scope.userProfile = data[0];
                    })
            });
    }

}]);
app.controller('profileNameController', ['authService', 'userService', '$location', '$routeParams','$scope', 'profileService', function (authService, userService, $location, $routeParams, $scope, profileService) {
        $scope.name = $routeParams.name;
        userService.GetByUsername($routeParams.name)
            .then(function (data) {
                profileService.FindProfileByUserId(data[0]._id)
                    .then(function (data) {
                        $scope.userProfile = data[0];
                    })
            });

}]);
app.controller('profileEditController', ['authService', 'userService', '$location', '$scope', 'profileService', '$http', function (authService, userService, $location, $scope, profileService, $http) {
    $scope.male = false;
    $scope.female = false;
    $scope.other = false;
    $scope.genderArr = [
        {'name' : 'male'},
        {'name' : 'female'},
        {'name' : 'other'}
    ];
    authService.IsLoggedIn()
        .then(function (data) {
            if (data.length === 0) {
                $location.path('/login');
            } else {
                // console.log(data);
                var id = data[0].uid;
                //console.log(id);
                userService.GetByUserId(id)
                    .then(function (data) {
                        //console.log(data);
                        $scope.user = data;
                        profileService.FindProfileByUserId(data._id)
                            .then(function (data) {
                                $scope.userProfile = data[0];
                                $scope.selectedGender = data[0].gender;
                            })
                    });
            }
        });

    $scope.uploadavtar = function(files) {
        var imagefile = document.querySelector('#file');
        if (imagefile.files && imagefile.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#temp_image')
                    .attr('src', e.target.result);
            };
            reader.readAsDataURL(imagefile.files[0]);
            this.imagefile = imagefile.files[0];
        }else{
            console.log("Image not selected");
        }

        var fd = new FormData();
        //Take the first selected file
        fd.append("file", files[0]);

        $http.post("/uploadPhoto", fd, {
            withCredentials: true,
            headers: {'Content-Type': undefined },
            transformRequest: angular.identity
        }).then(function successCallback(response) {
            var photoImg= response.data.fileName;
            console.log(photoImg);
            $scope.userProfile.photo = photoImg;
        }, function errorCallback(response) {
            alert(response);
        });
    }
    $scope.checkoptionsAndSave = function (choice) {
        if ($scope.selectedGender!=undefined) {
            $scope.userProfile.gender = $scope.selectedGender;
        }
        profileService.UpdateProfile($scope.userProfile)
            .then(function (data) {
                alert(data.msg);
            })
    };

}]);
app.controller('myBlogController', ['authService', '$location', '$scope', 'postService', 'timeService', 'profileService', function (authService, $location, $scope, postService, timeService, profileService) {
    $scope.posts = [];
    authService.IsLoggedIn().
        then(function (data) {
            if (data.length === 0) {
                $location.path('/login');
            } else {
                $scope.curUser = data[0];
                postService.GetPostByUserId(data[0].uid)
                    .then(function (data) {
                        $scope.post0 = [];
                        $scope.post1 = [];
                        $scope.post2 = [];
                        var len = data.length;
                        for (var i = 0; i < len; i++) {
                            if (i%3 === 0) {
                                $scope.post0.push(data[i]);
                            } else if (i%3 === 1) {
                                $scope.post1.push(data[i]);
                            } else if (i%3 === 2){
                                $scope.post2.push(data[i]);
                            }
                        }
                    })
            }
        });
    $scope.getTime = function (time) {
        return timeService.GetTime(time);
    }
    $scope.viewDetail = function (id) {
        $location.path('/viewPost/' + id);
    }
}]);
app.controller('newPostController', ['$scope','$http', 'authService', 'userService','$location', function ($scope, $http, authService, userService, $location) {
    authService.IsLoggedIn()
        .then(function (data) {
            if (data.length === 0) {
                $location.path('/login');
            } else {
                $scope.action = "/newPost/"+data[0].uid;
            }
        });
}]);
app.controller('singlePostController', ['$http', '$scope', '$routeParams', '$location','postService', 'timeService', 'authService', 'userService', 'commentService',function ($http, $scope, $routeParams, $location, postService, timeService, authService, userService, commentService) {
    var curUser;
    $scope.allComments = [];
    postService.GetPostDetails($routeParams.id)
        .then(function (data) {
            $scope.post = data;
            var commentsId = $scope.post.comments;
            angular.forEach(commentsId, function (value, index) {
                commentService.GetCommentById(value)
                    .then(function (data) {
                        $scope.allComments.push(data);
                        //$scope.allComments = comments;
                    });
            });
            userService.GetByUserId($scope.post.user)
                .then(function (data) {
                    $scope.author = data;
                });
        });

    authService.IsLoggedIn()
        .then(function (data) {
            if (data.length != 0) {
                $scope.uid = data[0].uid;
                var id = data[0].uid;
                userService.GetByUserId(id)
                    .then(function (data) {
                        curUser = data;
                    });
            }
        });
    $scope.getTime = function (time) {
        return timeService.GetTime(time);
    }

    $scope.send = function () {
        if (curUser == null) {
            alert("Please login in ");
        } else {
            $scope.comment.username =curUser.username;
            $scope.comment.postId = $scope.post._id;
            $scope.comment.time = new Date();
            commentService.CreateComment($scope.comment)
                .then(function (data) {
                    $scope.post.comments.push(data._id);
                    $scope.allComments.push(data);
                    postService.UpdatePost($scope.post)
                        .then(function (data) {
                            if (data) {
                                alert("New comment created!");
                            }
                        });
                });
        }
    }

    $scope.back = function() {
        $location.path('/home');
    }

}])
app.controller('userPsdController', ['$scope', '$rootScope', '$http', '$location', 'authService', 'userService', function ($scope, $rootScope, $http, $location, authService, userService) {
    $scope.savePsd = function() {
        authService.IsLoggedIn()
            .then(function (data) {
                if (data.length === 0) {
                    $location.path('/login');
                } else {
                    var id = data[0].uid;
                    userService.GetByUserId(id)
                        .then(function (data) {
                            //console.log(data);
                            if ($scope.curPsd == data.password) {
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
app.controller('userNameController', ['$scope', '$rootScope', '$http', '$location', 'authService', 'userService', function ($scope, $rootScope, $http, $location, authService, userService) {
    authService.IsLoggedIn()
        .then(function (data) {
            if (data.length === 0) {
                $location.path('/login');
            } else {
                var id = data[0].uid;
                userService.GetByUserId(id)
                    .then(function (data) {
                        $scope.firstname = data.firstname;
                        $scope.lastname = data.lastname;
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
app.directive('head', function() {
    return {
        restrict: 'EAC',
        transclude: true,
        scope: {},
        templateUrl: '/view/header.html'
    };
});
app.directive("likeIt", ['authService', 'likeService', 'postService', function(authService, likeService, postService) {
    return {
        restrict:'EAC', //element, attribute, class
        scope: {
            post: '='
        },
        link:function(scope, elem, attrs) {
            scope.like = true;
            var address = angular.element(elem);
            address.on('click', function() {
                event.stopImmediatePropagation();
                authService.IsLoggedIn()
                    .then(function (data) {
                        if (data.length === 0) {
                            alert('Please login!');
                        } else {
                            var uid = data[0].uid;
                            likeService.IsLiked(uid)
                                .then(function (data) {
                                    //console.log(data);
                                    if (data == "") {
                                        var like = {};
                                        like.userId = uid;
                                        like.postId = scope.post._id;
                                        like.time = new Date();
                                        likeService.CreateLike(like)
                                            .then(function(data) {
                                                scope.post.likes.push(uid);
                                                postService.UpdatePost(scope.post)
                                                    .then(function (data) {

                                                    })
                                                alert(data.msg);
                                            });
                                        address.removeClass("ion-ios-heart-outline");
                                        address.addClass("ion-ios-heart");

                                        
                                    } else {
                                        likeService.RemoveLike(scope.post._id, uid)
                                            .then(function (data) {
                                                var pos = scope.post.likes.indexOf(uid);
                                                scope.post.likes.splice(pos, 1);
                                                postService.UpdatePost(scope.post)
                                                    .then(function (data) {

                                                    });
                                                alert(data.msg);
                                            });
                                        address.removeClass("ion-ios-heart");
                                        address.addClass("ion-ios-heart-outline");

                                    }
                                });
                            
                        }
                    });
            });
        }
    };
}]);