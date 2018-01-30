/**
 * Created by Christine on 2018/1/24.
 */
var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');

var multer = require('multer');
var upload = multer({dest:__dirname+'/uploads'});// image directory in the server

mongoose.connect('mongodb://gao:gaoxinhe@ds113358.mlab.com:13358/gao');




var port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(bodyParser.json());
app.listen(port, function() {
    console.log('Server running @localhost:3000');
})

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
    'user': mongoose.Schema.ObjectId,
    'title': {
        type: String,
        required: true
    },
    'content': {
        type: String,
        required: true
    },
    'comments': [mongoose.Schema.ObjectId],
    'imgs':[],
    'time': {
        type: Date,
        required: true
    }

});

var LoggedSchema = mongoose.Schema({
    'username':{
        type: String,
        required: true
    }
});
//create a model
var User = mongoose.model('users', UserSchema);
var Post = mongoose.model('posts',PostSchema);
var Img = mongoose.model('images',ImgSchema);
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
            var title = req.body.title;
            var content = req.body.content;
            var comments = [];
            var imgs = [];
            imgs.push(fileName);
            var time = new Date();
            var post = new Post({
                user: user,
                title: title,
                content: content,
                comments: comments,
                imgs: imgs,
                time: time
            });
            post.save(function (err) {
                res.redirect('/myBlog');
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
    //console.log(username);
    User.find({"username": username}, function(err, doc){
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
    console.log(query);
    User.update(query, newVal, {multi:true}, function (err, doc) {
        res.send({'flg':'success'});
    })
});

app.post('/createUser', function (req, res) {
    var newUser = new User(req.body);
    newUser.save(function (err) {
        if (err) {
            res.send({'msg': 'This username has been used, please change another one'});
        } else {
            res.send({'msg': 'Congratualations! Your account have been successfully created'});
        }
    })

})

app.post('/logged', function (req, res) {
    var newLogged = new Logged(req.body);
    //console.log(req.body);
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



