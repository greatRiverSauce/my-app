/**
 * Created by Christine on 2018/1/24.
 */
var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');

var multer = require('multer');
var upload = multer({dest:__dirname+'/public/img/uploads'});// image directory in the server
var ObjectId = require('mongoose').Types.ObjectId;
mongoose.connect('mongodb://gao:gaoxinhe@ds113358.mlab.com:13358/gao');




var port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(bodyParser.json());
app.listen(port, function() {
    console.log('Server running @localhost:3000');
});

//define a schema
var UserSchema = mongoose.Schema({
    'username' :{
        type: String,
        required: true
    },
    'password': {
        type: String,
        required: true
    },
    'firstname': {
        type: String,
        required: true
    },
    'lastname' : {
        type: String,
        required: true
    }
});

var ProfileSchema = mongoose.Schema({
    'userId': {
        type: String,
        required: true
    },
    'photo': String,
    'birth': Date,
    'gender': String,
    'bio':String,
    'email': String,
    'phone': String,
    'location':String
});

var ImgSchema = mongoose.Schema({
    'fileName': {
        type: String,
        required: true
    },
    'originalName': {
        type: String,
        required: true
    }
});

var PostSchema = mongoose.Schema({
    'user': String,
    'content': String,
    'comments': [String],
    'imgs': {
        type: String,
        required: true
    },
    'likes': [String],
    'time': {
        type: Date,
        required: true
    }

});

var CommentSchema = mongoose.Schema({
    'username': String,
    'postId': String,
    'content': String,
    'time':Date
});

var LikeSchema = mongoose.Schema({
    'userId': String,
    'postId': String,
    'time':Date
});

var LoggedSchema = mongoose.Schema({
    'uid':{
        type: String,
        required: true
    }
});
//create a model
var User = mongoose.model('users', UserSchema);
var Profile = mongoose.model('profiles', ProfileSchema);
var Post = mongoose.model('posts',PostSchema);
var Comment = mongoose.model('comments', CommentSchema);
var Img = mongoose.model('images',ImgSchema);
var Like = mongoose.model('likes', LikeSchema);
var Logged = mongoose.model('loggeds', LoggedSchema);

app.post('/newPost/:uid', upload.single('file'), function (req, res) {
    var myFile = req.file;
    var fileName = myFile.filename;
    var originalName = myFile.originalname;

    var img = new Img({
        fileName: fileName,
        originalName: originalName
    });
    img.save(function (err) {
        if (!err) {
            var user = req.params.uid;
            var content = req.body.content;
            var comments = [];
            var imgs = fileName;
            var likes = [];
            var time = new Date();
            
            var post = new Post({
                user: user,
                content: content,
                comments: comments,
                imgs: imgs,
                likes: likes,
                time: time
            });
            
            post.save(function (err) {
                if (err) {
                    console.log(err);
                } else {
                    res.redirect('/myBlog');
                }

            });
        }
    });

});

app.get('/myBlog', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/getUserByUsername/:username', function (req, res) {
    var username = req.params.username;
    User.find({"username": username}, function(err, doc){
        if (!err) {
            res.send(doc);
        }
    });
});

app.get('/getUserById/:id', function (req, res) {
    //var id = req.params.id;
    var id = new ObjectId(req.params.id);
    User.findById(id, function(err, doc){
        if (!err) {
            res.send(doc);
        }
    });
});

app.post('/updateUser', function(req, res) {
    var query = {username: req.body.username};
    var newVal = {
        password: req.body.password,
        firstname: req.body.firstname,
        lastname: req.body.lastname
    }
    User.update(query, newVal, {multi:true}, function (err, doc) {
        res.send({'flg':'success'});
    })
});

app.post('/createUser', function (req, res) {
    var newUser = new User(req.body);
    newUser.save(function (err, doc) {
        if (!err) {
            res.send(doc);
        }
    })

});

app.post('/createProfile', function (req, res) {
    var newProfile = new Profile(req.body);
    newProfile.save(function (err, doc) {
        if (!err) {
            res.send(doc);
        }
    })
});

app.get('/findProfile/:uid', function (req, res) {
    var uid = req.params.uid;
    Profile.find({"userId": uid}, function (err, doc) {
        if (!err) {
            res.send(doc);
        }
    })
})

app.get('/getPostSortByTime', function (req, res) {
    Post.find({}).sort('-time').exec(function(err, docs) {
        if (!err) {
            res.send(docs);
        }
    })
})

app.get('/getPostById/:pid', function (req, res) {
    var id = new ObjectId(req.params.pid);
    Post.findById(id, function (err, doc) {
        if (!err) {
            res.send(doc);
        }
    })
});

app.get('/getPostByUserId/:id', function (req, res) {
    var id = req.params.id;
    Post.find({user: id}, function (err, doc) {
        if (!err) {
            res.send(doc);
        }
    })
});

app.post('/updatePost', function(req, res) {
    var query = {_id: req.body._id};
    var newVal = req.body;
    Post.update(query, newVal, {multi:true}, function (err, doc) {
        res.send({'success':true});
    })
});

app.post('/createComment', function (req, res) {
    var newComment = new Comment(req.body);
    newComment.save(function(err, doc) {
        if (!err) {
            res.send(doc);
        }
    });
})

app.post('/createLike', function (req, res) {
    var newLike = new Like(req.body);
    newLike.save(function (err, doc) {
        if (!err) {
            res.send({'msg': 'You liked it! '});
        }
    })
})

app.get('/isLiked/:uid', function (req, res) {
    var uid = req.params.uid;
    Like.find({"userId": uid}, function(err, doc){
        if (!err) {
            res.send(doc);
        }
    });
});

app.post('/deleteLike', function (req, res) {
    var pid = req.body.pid;
    var uid = req.body.uid;
    Like.find({ "userId":uid, "postId": pid}).remove().exec(function(err, docs) {
        res.send({"msg": "You unliked it!"});
    });
})

app.get('/getComment/:cid', function (req, res) {
    var id = new ObjectId(req.params.cid);
    Comment.findById(id, function (err, doc) {
        if (!err) {
            res.send(doc);
        }
    })
})

app.post('/logged', function (req, res) {
    var newLogged = new Logged(req.body);
    newLogged.save(function (err) {
        if (!err) {
            res.send({'msg':'successfully logged in'});
        }
    });
})

app.get('/isLogged', function (req, res) {
    Logged.find({}, function (err, doc) {
        if (!err) {
            res.send(doc);
        }
    });
});

app.get('/logout', function (req, res) {
    mongoose.connection.collections['loggeds'].drop( function(err, doc) {
        res.send(doc);
    });
})



